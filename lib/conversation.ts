import { db } from "./db";

export const getOrCreateConversations = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let conversation =
    (await findConverstion(memberOneId, memberTwoId)) ||
    (await findConverstion(memberTwoId, memberOneId));
  if (!conversation) {
    conversation = await createNewConversation(memberOneId, memberTwoId);
  }
  return conversation;
};

// finding conversation between two Users
const findConverstion = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.findFirst({
      where: {
        // memberOneId: memberOneId,
        // memberTwoId: memberTwoId,
        AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (error) {
    return null;
  }
};

// To create a new conversation between two member of a single server
const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (error) {
    return null;
  }
};
