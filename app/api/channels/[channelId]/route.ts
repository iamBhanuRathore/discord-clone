import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 400 });
    }
    if (!serverId) {
      return new NextResponse("Server Id is missing", { status: 400 });
    }
    if (!params.channelId) {
      return new NextResponse("Channel Id is Required !", { status: 400 });
    }
    if (name === "general") {
      return new NextResponse("Name cannot be 'genral' !", { status: 400 });
    }
    if (!name || !type) {
      return new NextResponse("Channel Id is Required !", { status: 400 });
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: params.channelId,
              NOT: {
                name: "general",
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });
    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.error("[Channel_Id_Patch]");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 400 });
    }
    if (!serverId) {
      return new NextResponse("Server Id is missing", { status: 400 });
    }
    if (!params.channelId) {
      return new NextResponse("Channel Id is Required !", { status: 400 });
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: params.channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });
    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.error("[Channel_Id_Delete]");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
