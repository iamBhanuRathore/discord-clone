import React from "react";
import { redirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getOrCreateConversations } from "@/lib/conversation";
import ChatHeader from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";
import MediaRoom from "@/components/media-room";

type Props = {
  params: {
    serverId: string;
    memberId: string; // it is the memberId of the user whom we are going to talk
  };
  searchParams: {
    video?: boolean;
  };
};

const MemberIdPage = async ({ params, searchParams }: Props) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }
  // Its the Logged in member in the server
  const currentMember = await db.member.findFirst({
    where: {
      profileId: profile.id,
      serverId: params.serverId,
    },
    include: {
      profile: true,
    },
  });
  if (!currentMember) {
    redirect("/");
  }
  const conversation = await getOrCreateConversations(
    currentMember.id,
    params.memberId
  );
  if (!conversation) {
    redirect(`/servers/${params.serverId}`);
  }
  const { memberOne, memberTwo } = conversation;
  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={params.serverId}
        type="conversation"
      />
      {!searchParams.video ? (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      ) : (
        <MediaRoom chatId={conversation.id} video={true} audio={true} />
      )}
    </div>
  );
};

export default MemberIdPage;
