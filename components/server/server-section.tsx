"use client";
import React from "react";
import { Plus, Settings } from "lucide-react";
import { ServerWithMemberWithProfile } from "@/typings";
import { ChannelType, MemberRole } from "@prisma/client";

import { ActionTooltip } from "../action-tooltip";
import { useModalStore } from "@/hooks/use-modal-store";

type Props = {
  label: string;
  role?: MemberRole;
  sectiontype: "channel" | "member";
  channelType?: ChannelType;
  server?: ServerWithMemberWithProfile;
};

const ServerSection = ({
  label,
  sectiontype,
  channelType,
  role,
  server,
}: Props) => {
  const { onOpen } = useModalStore();
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectiontype === "channel" && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            onClick={() => onOpen("createChannel")}
            className="text-zinc-500 hover:text-zinc-400 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
            <Plus className="w-4 h-4" />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectiontype === "member" && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            onClick={() => onOpen("members", { server })}
            className="text-zinc-500 hover:text-zinc-400 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
            <Settings className="w-4 h-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerSection;
