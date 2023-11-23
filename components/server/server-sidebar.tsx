import React from "react";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { Channel, ChannelType, MemberRole } from "@prisma/client";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import ServerHeader from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";
import ServerMember from "./server-member";

interface ServerSidebarProps {
  serverId: string;
}
const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 w-4 h-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 w-4 h-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 w-4 h-4" />,
};
const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mr-2 w-4 h-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 w-4 h-4 text-rose-500" />,
};
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
  let textChannels: Channel[] = [];
  let audioChannels: Channel[] = [];
  let videoChannels: Channel[] = [];
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
  // Getting all the member except the member who is logged in --
  const members = server.members.filter(
    (member) => member.profileId !== profile.id
  );
  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;
  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#e9e9eb]">
      <ServerHeader server={server} role={role} members={members} />
      <ScrollArea className="flex-1 px-3 ">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {/* For the text-channels  */}
        {!!textChannels.length && (
          <div className="mb-2">
            <ServerSection
              sectiontype="channel"
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channels"
            />
            {textChannels.map((ch) => (
              <ServerChannel
                key={ch.id}
                channel={ch}
                role={role}
                server={server}
              />
            ))}
          </div>
        )}
        {/* <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" /> */}
        {/* For the audio-channels  */}
        {!!audioChannels.length && (
          <div className="mb-2">
            <ServerSection
              sectiontype="channel"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Voice Channels"
            />
            {audioChannels.map((ch) => (
              <ServerChannel
                key={ch.id}
                channel={ch}
                role={role}
                server={server}
              />
            ))}
          </div>
        )}
        {/* <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" /> */}
        {/* For the video-channels  */}
        {!!videoChannels.length && (
          <div className="mb-2">
            <ServerSection
              sectiontype="channel"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video Channels"
            />
            {videoChannels.map((ch) => (
              <ServerChannel
                key={ch.id}
                channel={ch}
                role={role}
                server={server}
              />
            ))}
          </div>
        )}
        {!!members.length && (
          <div className="mb-2">
            <ServerSection
              server={server}
              sectiontype="member"
              role={role}
              label="Members"
            />
            {members.map((member) => (
              <ServerMember server={server} member={member} key={member.id} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
