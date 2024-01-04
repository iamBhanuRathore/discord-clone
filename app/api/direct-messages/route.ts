import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { DirectMessage } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const MESSAGES_BATCH = 10;
export async function GET(req: NextRequest, res: Response) {
  console.log("CALLED_GET_MESSAGE");
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");
    // console.log({ channelId, cursor });
    if (!profile) {
      return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
    }
    if (!conversationId) {
      return NextResponse.json(
        { message: "ConversationId is misssing" },
        { status: 401 }
      );
    }
    let messages: DirectMessage[];
    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        skip: 1, // for skipping the cursor data where the cursor is currently at
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    } else {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        where: {
          conversationId,
        },
        orderBy: {
          createdAt: "desc",
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
    let nextCursor = null; // important to send for the
    if (messages.length === MESSAGES_BATCH) {
      // we are setting the value of cursor with the last messages id
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }
    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error: any) {
    console.log("[Direct_Message_Error]", error.message);
    return new NextResponse("Internal Error ", { status: 500 });
  }
}
