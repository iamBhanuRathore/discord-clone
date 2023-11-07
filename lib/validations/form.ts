import * as z from "zod";

export const createServerFormSchema = z.object({
  name: z.string().min(1, { message: "Server Name is Required" }),
  imageUrl: z.string().min(1, { message: "Image URL is Required" }),
});
