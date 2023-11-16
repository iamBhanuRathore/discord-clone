import { NextRequest, NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
export async function POST(req: NextRequest) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // to get the query parameters from the request
    if (!serverId) {
      return new NextResponse("ServerId is missing", { status: 400 });
    }
    if (!name) {
      return new NextResponse("Name is missing", { status: 400 });
    }
    if (!type) {
      return new NextResponse("Image URL is missing", { status: 400 });
    }
  } catch (error: any) {
    console.log("[Channel_Post]", error);
    return new NextResponse("Internal server error: " + error.message, {
      status: 500,
    });
  }
}
