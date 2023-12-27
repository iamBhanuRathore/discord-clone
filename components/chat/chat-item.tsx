import React from "react";
import { Member, MemberRole, Profile } from "@prisma/client";

import UserAvatar from "../user-avatar";
import { ActionTooltip } from "../action-tooltip";
import { ShieldAlert, ShieldCheck } from "lucide-react";

type Props = {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timeStamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
};
const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="ml-2 w-4 h-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="ml-2 w-4 h-4 text-rose-500" />,
};
const ChatItem = ({
  content,
  currentMember,
  deleted,
  fileUrl,
  id,
  isUpdated,
  member,
  socketUrl,
  timeStamp,
  socketQuery,
}: Props) => {
  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full ">
      <div className="group flex gap-x-2 items-start w-full">
        {/* <ActionTooltip label={"Hello"} side="right" align="center"> */}
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        {/* </ActionTooltip> */}
        <div className="flex flex-col w-full">
          <div className="flex itemx-center gap-x-2">
            <div className="flex items-center">
              <p className="font-semibold text-xs hover:underline cursor-pointer">
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                <p>{roleIconMap[member.role]}</p>
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timeStamp}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
