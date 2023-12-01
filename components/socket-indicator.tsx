import React from "react";
import { useSocket } from "./providers/socket-provider";

type Props = {};

const SocketIndicator = (props: Props) => {
  const { isConnected, socket } = useSocket();
  return <div>SocketIndicator</div>;
};

export default SocketIndicator;
