import { MemberRole, Message } from "@prisma/client";
import { NextApiResponseServerIo } from "@/typings";
import { NextApiRequest } from "next";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed !" });
  }
  try {
    const profile = await currentProfilePages(req);
    const { directMessageId, conversationId } = req.query;
    const { content } = req.body;
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!conversationId) {
      return res.status(401).json({ message: "ConversationId is missing" });
    }
    if (!directMessageId) {
      return res.status(401).json({ message: "directMessageId is missing" });
    }
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
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
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    // current Member - in all the members
    const currentMember =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;
    if (!currentMember) {
      return res.status(404).json({ error: "Member not found" });
    }
    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }
    const isMessageOwner = directMessage.memberId === currentMember.id;
    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isModerator = currentMember.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;
    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (req.method === "DELETE") {
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }
    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          content: content as string,
          edited: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${conversationId}:messages:update`;
    console.log(res?.socket?.server?.io?.emit(updateKey, directMessage));
    res?.socket?.server?.io?.emit(updateKey, directMessage);
    return res.status(200).json(directMessage);
  } catch (error: any) {
    console.log("[Direct_Message_Id_Error]", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// this can work but it is more complicated so we are not using that
// const updateMessage = await db.server.update({
//   where: {
//     id: serverId as string,
//   },
//   data: {
//     channels: {
//       update: {
//         where: {
//           id: channelId as string,
//         },
//         data: {
//           messages: {
//             update: {
//               where: {
//                 id: messageId as string,
//               },
//               data: {
//                 content,
//                 fileUrl: null,
//                 edited: true,
//               },
//             },
//           },
//         },
//       },
//     },
//   },
//   include: {
//     channels: {
//       where: {
//         id: channelId as string,
//       },
//       include: {
//         messages: {
//           where: {
//             id: messageId as string,
//           },
//           include: {
//             member: {
//               include: {
//                 profile: true,
//               },
//             },
//           },
//         },
//       },
//     },
//   },
// });
