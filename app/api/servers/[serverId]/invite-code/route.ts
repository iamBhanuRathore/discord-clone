import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
export async function PATCH(
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
    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
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
    console.log("[Invite_Code_Patch", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
