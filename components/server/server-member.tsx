"use client";
import React from "react";
import { ShieldCheck } from "lucide-react";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import UserAvatar from "../user-avatar";
import { ActionTooltip } from "../action-tooltip";

type Props = {
  member: Member & { profile: Profile };
  server: Server;
};
const roleIconmap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldCheck className="w-4 h-4 ml-2 text-rose-500" />,
};

const ServerMember = ({ member, server }: Props) => {
  const router = useRouter();
  const params = useParams();
  const icon = roleIconmap[member.role];
  return (
    <ActionTooltip label={member.profile.name}>
      <button
        className={cn(
          "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
          params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
        )}>
        <UserAvatar classname="h-8 w-8" src={member.profile.imageUrl} />
        <p
          className={cn(
            "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
            params.memberId === member.id &&
              "text-primary dark:text-zinc-200 dark:group-hover:text-white"
          )}>
          {member.profile.name}
        </p>
        {icon}
      </button>
    </ActionTooltip>
  );
};

export default ServerMember;
