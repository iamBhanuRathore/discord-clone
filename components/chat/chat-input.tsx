"use client";
import React, { ElementRef, useEffect, useRef } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { chatInputFormSchema } from "@/lib/validations/form";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Plus, Smile } from "lucide-react";
import { Input } from "../ui/input";
import qs from "query-string";
import axios from "axios";
import { useModalStore } from "@/hooks/use-modal-store";
import { ActionTooltip } from "../action-tooltip";
import EmojiPicker from "../emoji-picker";
import { useRouter } from "next/navigation";

type Props = {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
};

const ChatInput = ({ apiUrl, name, query, type }: Props) => {
  const { onOpen } = useModalStore();
  const router = useRouter();
  const inputRef = useRef<ElementRef<"input">>(null);
  const form = useForm<z.infer<typeof chatInputFormSchema>>({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(chatInputFormSchema),
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof chatInputFormSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });
      await axios.post(url, values);
      form.reset();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="content"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-2">
                  <ActionTooltip
                    side="top"
                    label="Send File"
                    className="dark:bg-[#28292b] dark:text-white">
                    <button
                      type="button"
                      onClick={() => onOpen("messageFile", { apiUrl, query })}
                      className="absolute top-1/2 left-4 -translate-y-1/2 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400over:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center">
                      <Plus className="text-white dark:text-[#313338]" />
                    </button>
                  </ActionTooltip>
                  <Input
                    {...field}
                    ref={inputRef}
                    disabled={isLoading}
                    placeholder={`Message ${
                      type === "conversation" ? name : "#" + name
                    }`}
                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                  />
                  <div className="absolute top-1/2 flex items-center right-4 -translate-y-1/2">
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value + emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
