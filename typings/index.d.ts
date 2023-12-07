import { ChannelType, Member, Profile, Server } from "@prisma/client";

export type createServerFormType = {
  name: string;
  imageUrl: string;
};
export type fileSharingFormType = {
  fileUrl: string;
};
export type createChannelFormType = {
  name: string;
  type: ChannelType;
};

export type ServerWithMemberWithProfile = Server & {
  members: (Member & { profile: Profile })[];
};

// creating custom types fo the socket io library
import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
