import { getAuth } from "@clerk/nextjs/server";

import { db } from "./db";
import { NextApiRequest } from "next";

// It is to see that the User is Logged in or not
export const currentProfilePages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);
  if (!userId) return null;
  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  });
  return profile;
};
