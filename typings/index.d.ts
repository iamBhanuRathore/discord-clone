import { ChannelType, Member, Profile, Server } from "@prisma/client";

export type createServerFormType = {
  name: string;
  imageUrl: string;
};
export type createChannelFormType = {
  name: string;
  type: ChannelType;
};

export type ServerWithMemberWithProfile = Server & {
  members: (Member & { profile: Profile })[];
};
