"use client";
import { Member, Message, Profile } from "@prisma/client";
import React, { Fragment, useRef, ElementRef } from "react";
import { useChatQuery } from "@/hooks/use-chat-query";
import { ArrowDown, Loader2, ServerCrash } from "lucide-react";
import { format } from "date-fns";

import ChatItem from "./chat-item";
import ChatWelcome from "./chat-welcome";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

type Props = {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
};
type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

const DATE_FORMAT = "d MMM yyyy, HH:mm";
const ChatMessages = ({
  apiUrl,
  chatId,
  member,
  name,
  paramKey,
  paramValue,
  socketQuery,
  socketUrl,
  type,
}: Props) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;
  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);
  // console.log({ addKey, queryKey, updateKey });
  const { data, status, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useChatQuery({
      apiUrl,
      queryKey,
      paramKey,
      paramValue,
    });

  useChatSocket({ addKey, queryKey, updateKey });
  // const { backToBottom, canBackToBottom } =
  const { backToBottom, canGoToBottom } = useChatScroll({
    bottomRef,
    chatRef,
    count: data?.pages[0]?.items?.length ?? 0,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
  });
  // console.log({ backToBottom });
  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="w-7 h-7  text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messsages...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="w-7 h-7  text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something Went Wrong...
        </p>
      </div>
    );
  }

  return (
    <div
      ref={chatRef}
      className="flex-1 relative flex flex-col py-4 overflow-y-auto">
      {!hasNextPage && (
        <>
          <div className="flex-1" />
          <ChatWelcome type={type} name={name} />
        </>
      )}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6  text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition">
              Load Previous Messages
            </button>
          )}
        </div>
      )}
      {canGoToBottom && (
        <ArrowDown
          onClick={backToBottom}
          className="fixed bottom-20 text-gray-400 hover:text-gray-900 hover:dark:text-gray-300 right-10 z-10 h-10 w-10 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400/70 hover:dark:bg-zinc-800 rounded-full p-2 transition durstion-300"
        />
      )}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group?.items?.map((message: MessageWithMemberWithProfile) => (
              // <div key={message.id}>{message.content}</div>
              <ChatItem
                key={message.id}
                id={message.id}
                currentMember={member} // current member in the server
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timeStamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketQuery={socketQuery}
                socketUrl={socketUrl}
                member={message.member} // creater of message
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
