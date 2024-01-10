"use client";
import React from "react";
import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { VideoOff, Video } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";
type Props = {};

const ChatVideoButton = (props: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const isVideo = searchParams?.get("video");

  const Icon = isVideo ? VideoOff : Video;
  const toolTipLabel = isVideo ? "End Video" : "Start Video Call";
  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true }
    );
    router.push(url);
  };

  return (
    <ActionTooltip side="bottom" label={"hello"}>
      <button onClick={onClick} className="hover:opacity-75 transition mr-4">
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionTooltip>
  );
};

export default ChatVideoButton;
