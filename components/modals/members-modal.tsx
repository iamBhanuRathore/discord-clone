"use client";
import React, { useState } from "react";
import axios from "axios";
import { MemberRole } from "@prisma/client";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import qs from "query-string";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalStore } from "@/hooks/use-modal-store";
import { ServerWithMemberWithProfile } from "@/typings";

import { ScrollArea } from "../ui/scroll-area";
import UserAvatar from "../user-avatar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";

const MembersModal = () => {
  const {
    isOpen,
    onClose,
    type,
    onOpen,
    data: { server },
  } = useModalStore();
  const typedServer = server as ServerWithMemberWithProfile | null;
  const router = useRouter();
  const [loadingId, setLoadingId] = useState("");
  const isModalOpen = isOpen && type === "members";
  const roleIconMap = {
    [MemberRole.GUEST]: "",
    [MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 text-rose-500" />,
  };
  // console.log(typedServer?.members);
  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });
      // console.log(url);
      const { data } = await axios.patch(url, { role });
      router.refresh();
      onOpen("members", { server: data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };
  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });
      // console.log(url);
      const { data } = await axios.delete(url);
      router.refresh();
      onOpen("members", { server: data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="p-8 px-6">
          <DialogTitle className=" text-center font-bold">
            Members Modal
          </DialogTitle>
          <DialogDescription>
            {typedServer?.members?.length} members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {typedServer?.members.map((member) => (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar src={member.profile.imageUrl} />
              <div className="flex flex-col gap-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {server?.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="mr-[2px]">
                        <MoreVertical className="h-4 w-4 text-zinc-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="w-4 h-4 mr-2" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(member.id, "GUEST")
                                }>
                                <Shield className="h-4 w-4 mr-2" />
                                Guest
                                {member.role === MemberRole.GUEST && (
                                  <Check className="w-4 h-4 text-indigo-500 ml-auto" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(member.id, "MODERATOR")
                                }>
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                Moderator
                                {member.role === MemberRole.MODERATOR && (
                                  <Check className="w-4 h-4 text-indigo-500 ml-auto" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onKick(member.id)}>
                          <Gavel className="h-4 w-4 mr-2" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader2 className="w-4 h-4 animate-spin text-zinc-500 ml-auto" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MembersModal;

// Server Json
const data = {
  id: "a8a1edbd-84d3-4e6b-b388-c194675c7678",
  name: "Yeeet!",
  imageUrl:
    "https://utfs.io/f/5c400780-2c12-4cbf-a1f9-b14416a29d06-jlo1ag.jpeg",
  inviteCode: "a4d44be5-9223-46fe-8dd1-469136036ded",
  profileId: "55573a9f-ab8b-4cd3-91be-c84f037b6d26",
  createdAt: "2023-11-11T05:33:05.143Z",
  updatedAt: "2023-11-11T07:16:40.817Z",
  members: [
    {
      id: "528c91ae-7db3-4020-9298-8d896e40b33d",
      role: "ADMIN",
      profileId: "55573a9f-ab8b-4cd3-91be-c84f037b6d26",
      serverId: "a8a1edbd-84d3-4e6b-b388-c194675c7678",
      createdAt: "2023-11-11T05:33:05.143Z",
      updatedAt: "2023-11-11T05:33:05.143Z",
      profile: {
        id: "55573a9f-ab8b-4cd3-91be-c84f037b6d26",
        userId: "user_2XqB3PzauTSouSIgaqEhdjeqMPG",
        name: "Bhanu rathore",
        imageUrl:
          "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yWHFCM1J5ZEFGWFZyM3dUcDE0QWZQRW0wUHIifQ",
        email: "bhanuofficepes@gmail.com",
        createdAt: "2023-11-11T05:31:04.503Z",
        updatedAt: "2023-11-11T05:31:04.503Z",
      },
    },
    {
      id: "555af0e3-9dc7-41ca-ac98-5a193220888f",
      role: "MODERATOR",
      profileId: "52232f55-f28c-43c1-860a-c49c66c8552c",
      serverId: "a8a1edbd-84d3-4e6b-b388-c194675c7678",
      createdAt: "2023-11-11T05:58:42.702Z",
      updatedAt: "2023-11-16T10:05:37.240Z",
      profile: {
        id: "52232f55-f28c-43c1-860a-c49c66c8552c",
        userId: "user_2Y0zcHNDmL7OJMZ4O7uvafzDD0z",
        name: "ArunDeveloper08 null",
        imageUrl:
          "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ2l0aHViL2ltZ18yWTB6Y0hJcGZ3Wno3MmxMaERicjVlQmduMTQifQ",
        email: "arunkanojiya781@gmail.com",
        createdAt: "2023-11-11T05:56:01.907Z",
        updatedAt: "2023-11-11T05:56:01.907Z",
      },
    },
  ],
};
