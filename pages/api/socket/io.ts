// import { Server as NetServer } from "http";
// import { NextApiRequest } from "next";
// import { Server as ServerIO } from "socket.io";

// import { NextApiResponseServerIo } from "@/typings";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
//   if (!res.socket.server.io) {
//     const path = "/api/socket/io";
//     const httpServer: NetServer = res.socket.server as any;
//     const io = new ServerIO(httpServer, {
//       path: path,
//       addTrailingSlash: false,
//     });
//     res.socket.server.io = io;
//   }
//   res.end();
// };

// export default ioHandler;
import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO, ServerOptions } from "socket.io";
import { NextApiResponseServerIo } from "@/typings";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    try {
      const ioOptions = {
        path: path,
        addTrailingSlash: false,
        // Add any additional options if needed
      };
      const io = new ServerIO(httpServer, ioOptions);
      res.socket.server.io = io;
    } catch (error: any) {
      console.error("[WebSocket Setup Error]", error.message);
      res.status(500).end("Internal Server Error");
      return;
    }
  }
  res.end();
};

export default ioHandler;
