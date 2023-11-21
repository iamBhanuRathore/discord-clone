import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export async function DELETE(
  req: NextRequest,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!params.serverId) {
      return new NextResponse("Server ID is required", { status: 400 });
    }
    const server = await db.server.delete({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
    });
    if (!server) {
      return new NextResponse(
        "No Server found with Server id: " + params.serverId,
        { status: 401 }
      );
    }
    return new NextResponse(JSON.stringify(server), { status: 200 });
  } catch (error) {
    console.log("[ServerId_Delete", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
export async function PATCH(
  req: NextRequest,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    const { name, imageUrl } = await req.json();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!params.serverId) {
      return new NextResponse("Server ID is required", { status: 400 });
    }
    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });
    if (!server) {
      return new NextResponse(
        "No Server found with Server id: " + params.serverId,
        { status: 401 }
      );
    }
    return new NextResponse(JSON.stringify(server), { status: 200 });
  } catch (error) {
    console.log("[ServerId_Patch", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
