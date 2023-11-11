import React from "react";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { ChannelType } from "@prisma/client";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import ServerHeader from "./server-header";

interface ServerSidebarProps {
  serverId: string;
}

const ServerSidebar: React.FC<ServerSidebarProps> = async ({ serverId }) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();
  // In this we are loading single server all the channel associated with the server and all the member of a server also also loading the profile of a member
  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });
  if (!server) return redirect("/");
  let textChannels = [];
  let audioChannels = [];
  let videoChannels = [];
  server.channels.forEach((channel) => {
    if (channel.type === ChannelType.TEXT) {
      textChannels.push(channel);
    }
    if (channel.type === ChannelType.AUDIO) {
      audioChannels.push(channel);
    }
    if (channel.type === ChannelType.VIDEO) {
      videoChannels.push(channel);
    }
  });
  // Getting all the member except the member who is logged in
  const members = server.members.filter(
    (member) => member.profileId !== profile.id
  );
  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;
  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#e9e9eb]">
      <ServerHeader server={server} role={role} members={members} />
    </div>
  );
};

export default ServerSidebar;
