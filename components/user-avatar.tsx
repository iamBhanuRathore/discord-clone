import React from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  src?: string;
  classname?: string;
};

const UserAvatar = ({ classname, src }: UserAvatarProps) => {
  return (
    <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", classname)}>
      <AvatarImage src={src} />
    </Avatar>
  );
};

export default UserAvatar;
