import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import CreateServerModal from "@/components/modals/create-server-modal";

type Props = {};

const SetupPage = async (props: Props) => {
  // In this component, we're searching for a server associated with the current user's profile.
  // We first obtain the user's profile by calling the 'initialProfile' function.
  // Then, we use Prisma to find a server where the current user's profile ID matches a member's profile ID.
  // If a server is found, it means the user is a member of that server.
  // This code is essential for setting up the initial state of the application and determining user-server associations.

  const profile = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (server) {
    redirect(`/servers/${server.id}`);
  }

  return <CreateServerModal />;
};

export default SetupPage;
