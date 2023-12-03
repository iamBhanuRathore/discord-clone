"use client";
import React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { chatInputFormSchema } from "@/lib/validations/form";

type Props = {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
};

const ChatInput = ({ apiUrl, name, query, type }: Props) => {
  const form = useForm<z.infer<typeof chatInputFormSchema>>({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(chatInputFormSchema),
  });
  const isLoading = form.formState.isSubmitting;
  const onSubmit = () => {};
  return <div>ChatInput</div>;
};

export default ChatInput;
