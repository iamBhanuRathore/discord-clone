"use client";

import { useEffect, useState } from "react";

import CreateServerModalAfter from "../modals/create-server-modal-after";
import InviteModal from "../modals/invite-modal";
import EditServerModal from "../modals/edit-server-modal";
import MembersModal from "../modals/members-modal";
import CreateChannelModal from "../modals/create-channel-modal";
import LeaveServer from "../modals/leave-server-modal";
import DeleteServer from "../modals/delete-server-modal";
import DeleteChannel from "../modals/delete-channel-modal";
import EditChannelModal from "../modals/edit-channel-modal";
import MessageFileModal from "../modals/message-file-modal";
import DeleteMessage from "../modals/delete-message-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  return (
    <>
      <CreateServerModalAfter />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveServer />
      <DeleteServer />
      <DeleteChannel />
      <EditChannelModal />
      <MessageFileModal />
      <DeleteMessage />
    </>
  );
};
