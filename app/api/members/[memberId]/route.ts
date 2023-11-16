import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    const { memberId } = params;
    // to get the query parameters from the request
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();
    const serverId = searchParams.get("serverId");
    if (!serverId) {
      return new NextResponse("ServerId is missing", { status: 400 });
    }
    if (!memberId) {
      return new NextResponse("MemberId is missing", { status: 400 });
    }
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // Update the server information identified by 'serverId' and associated with the logged-in user's profile ('profile.id').
    // Specifically, update the role of a member within the server, identified by 'params.memberId'.
    // Ensure that the member being updated has a different profileId than the logged-in user ('profile.id').
    // The query then fetches and populates the updated server data, including its members, and within each member,
    // it includes the associated profile, ordering members by their roles in ascending order.
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return new NextResponse(JSON.stringify(server), { status: 200 });
  } catch (error: any) {
    console.log("[Members_Id_Patch]", error);
    return new NextResponse("Internal server error: " + error.message, {
      status: 500,
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    const { memberId } = params;
    // to get the query parameters from the request
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    if (!serverId) {
      return new NextResponse("ServerId is missing", { status: 400 });
    }
    if (!memberId) {
      return new NextResponse("MemberId is missing", { status: 400 });
    }
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // Delete the server information identified by'serverId' and associated with the logged-in user's profile ('profile.id').
    // Specifically, delete the member within the server, identified by 'params.memberId'.
    // Ensure that the member being deleted has a different profileId than the logged-in user ('profile.id').
    // The query then fetches and populates the updated server data, including its members, and within each member,
    // it includes the associated profile, ordering members by their roles in ascending order.
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });
    return new NextResponse(JSON.stringify(server), { status: 200 });
  } catch (error: any) {
    console.log("[Members_Id_Delete]", error);
    return new NextResponse("Internal server error: " + error.message, {
      status: 500,
    });
  }
}
