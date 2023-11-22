import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Hash, Mic, Video } from "lucide-react";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";

type Props = {
  channel: Channel;
  server: Server;
  role?: MemberRole;
};

const iconMap = {
  [ChannelType.TEXT]: <Hash />,
  [ChannelType.AUDIO]: <Mic />,
  [ChannelType.VIDEO]: <Video />,
};
const ServerChannel = ({ channel, server, role }: Props) => {
  const Icon = iconMap[channel.type];
  const params = useParams();
  const router = useRouter();
  return <div>ServerChannel</div>;
};

export default ServerChannel;
