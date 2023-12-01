import React from "react";
import { redirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getOrCreateConversations } from "@/lib/conversation";
import ChatHeader from "@/components/chat/chat-header";

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
  const { memberOne, memberTwo } = conversation;
  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={params.serverId}
        type="conversation"
      />
    </div>
  );
};

export default MemberIdPage;
