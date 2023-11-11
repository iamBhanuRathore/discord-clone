import { Member, Profile, Server } from "@prisma/client";

export type createServerFormType = {
  name: string;
  imageUrl: string;
};

export type ServerWithMemberWithProfile = Server & {
  members: (Member & { profile: Profile })[];
};
