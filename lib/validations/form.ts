import { ChannelType } from "@prisma/client";
import * as z from "zod";

export const createServerFormSchema = z.object({
  name: z.string().min(1, { message: "Server Name is Required" }),
  imageUrl: z.string().min(1, { message: "Image URL is Required" }),
});

export const createChannelFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Channel Name is Required" })
    .refine((name) => name.toLowerCase().trim() !== "general", {
      message: "Channel name cannot be 'general'",
    }),
  // It is to verify that the [type] should be the type of Channel Type
  type: z.nativeEnum(ChannelType),
});

export const chatInputFormSchema = z.object({
  content: z.string().min(1),
});
