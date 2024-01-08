"use client";

import React, { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import axios from "axios";

type Props = {
  chatId: string;
  video: boolean;
  audio: boolean;
};

const MediaRoom = ({ audio, chatId, video }: Props) => {
  const { user } = useUser();
  const [token, setToken] = useState("");
  useEffect(() => {
    if (!user?.firstName || !user.lastName) return;
    const name = `${user.firstName} ${user.lastName}`;
    (async () => {
      try {
        const { data } = await axios.get(
          `/api/livekit?room=${chatId}&username=${name}`
        );
        setToken(data.token);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [user?.firstName, user?.lastName, chatId]);
  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-9 text-zinc-700 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400 ">Loading ...</p>
      </div>
    );
  }
  return (
    <LiveKitRoom
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      connect={true}
      audio={audio}
      video={video}
      token={token}>
      <VideoConference />
    </LiveKitRoom>
  );
};

export default MediaRoom;
