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
    const { messageId, serverId, channelId } = req.query;
    const { content } = req.body;
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!serverId) {
      return res.status(400).json({ error: "Server ID missing" });
    }
    if (!channelId) {
      return res.status(400).json({ error: "Channel ID missing" });
    }
    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        channels: {
          some: {
            id: channelId as string,
          },
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

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
    if (!server) {
      return res.status(404).json({ error: "Server not found" });
    }
    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: server.id,
      },
    });
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }
    // current Member - in all the members
    const currentMember = server.members.find(
      (member) => member.profileId === profile.id
    );
    if (!currentMember) {
      return res.status(404).json({ error: "Member not found" });
    }
    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }
    const isMessageOwner = message.memberId === currentMember.id;
    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isModerator = currentMember.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;
    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (req.method === "DELETE") {
      message = await db.message.update({
        where: {
          id: messageId as string,
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
      message = await db.message.update({
        where: {
          id: messageId as string,
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

    const updateKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);
    return res.status(200).json(message);
  } catch (error: any) {
    console.log("[Message_Id_Error]", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
