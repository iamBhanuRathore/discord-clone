import { auth } from "@clerk/nextjs";

import { db } from "./db";

// It is to see that the User is Logged in or not
export const currentProfile = async () => {
  const { userId } = auth();
  if (!userId) return null;
  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  });
  return profile;
};
