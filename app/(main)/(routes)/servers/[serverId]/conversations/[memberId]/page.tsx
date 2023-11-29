import React from "react";
import { redirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getOrCreateConversations } from "@/lib/conversation";

type Props = {
  params: {
    serverId: string;
    memberId: string; // it is the memberId of the user whom we are going to talk
  };
};

const MemberIdPage = async ({ params }: Props) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }
  // Its the Logged in member in the server
  const currentMember = await db.member.findFirst({
    where: {
      profileId: profile.id,
      serverId: params.serverId,
    },
    include: {
      profile: true,
    },
  });
  if (!currentMember) {
    redirect("/");
  }
  const conversation = await getOrCreateConversations(
    currentMember.id,
    params.memberId
  );
  if (!conversation) {
    redirect(`/servers/${params.serverId}`);
  }
  const { memberOneId, memberTwoId } = conversation;
  return <div>MemberIdPage</div>;
};

export default MemberIdPage;
