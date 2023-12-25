"use client";
import React from "react";
import { useTheme } from "next-themes";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Smile } from "lucide-react";
import { ActionTooltip } from "./action-tooltip";

type Props = {
  onChange: (value: string) => void;
};

const EmojiPicker = ({ onChange }: Props) => {
  const { resolvedTheme } = useTheme();
  return (
    <Popover>
      <PopoverTrigger>
        <ActionTooltip
          side="top"
          align="center"
          label="Emoji"
          className="dark:bg-[#28292b] dark:text-white">
          <Smile className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
        </ActionTooltip>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={40}
        className="bg-transparent border-none shadow-none drop-shadow-none mb-16 ">
        <Picker
          theme={resolvedTheme}
          data={data}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
