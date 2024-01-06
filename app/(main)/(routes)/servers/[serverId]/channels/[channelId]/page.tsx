import React from "react";
import { redirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { ChannelType } from "@prisma/client";
import MediaRoom from "@/components/media-room";

type Props = {
  params: {
    serverId: string;
    channelId: string;
  };
};

const ChannelIdPage = async ({ params }: Props) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();
  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
      serverId: params.serverId,
    },
  });
  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });
  // It means they are trying to access a channel which they don't have access to
  if (!channel || !member) {
    redirect("/");
  }
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member} // curret User
            name={channel.name}
            type="channel"
            chatId={channel.id}
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{ channelId: channel.id, serverId: channel.serverId }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
          />
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <MediaRoom chatId={channel.id} video={false} audio={true} />
      )}
    </div>
  );
};

export default ChannelIdPage;

// function fetchDataFromAPI(apiUrl) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(`Data from ${apiUrl}`);
//     }, Math.random() * 1000);
//   });
// }

// const apiUrls = ['https://api1.example.com', 'https://api2.example.com', 'https://api3.example.com'];

// const promises = apiUrls.map(apiUrl => fetchDataFromAPI(apiUrl));

// Promise.all(promises)
//   .then(results => {
//     console.log('Results:', results);
//   })
//   .catch(error => {
//     console.error('Error:', error.message);
//   });
