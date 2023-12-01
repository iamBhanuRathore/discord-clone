import { Server as NetServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as ServerIO } from "socket.io";

import { NextApiResponseServerIo } from "@/typings";

export const config = {
  api: {
    bodyParser: false,
  },
};

export const ioHandler = (
  req: NextApiRequest,
  res: NextApiResponseServerIo
) => {
  if (!res.socket.server.io) {
    const path = "api/spcket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    });
    res.socket.server.io;
  }
  res.end();
};
