"use client";
import React, { useState } from "react";
import axios from "axios";
import { Check, Copy, RefreshCw } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalStore } from "@/hooks/use-modal-store";

import { ServerWithMemberWithProfile } from "@/typings";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const MembersModal = () => {
  const {
    isOpen,
    onClose,
    type,
    onOpen,
    data: { server },
  } = useModalStore();
  const typedServer = server as ServerWithMemberWithProfile | null;

  const [loading, setLoading] = useState(false);
  const isModalOpen = isOpen && type === "members";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="p-8 px-6">
          <DialogTitle className=" text-center font-bold">
            Members Modal
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {typedServer?.members?.length} members
        </DialogDescription>
        <div className="p-6">Hello there </div>
      </DialogContent>
    </Dialog>
  );
};

export default MembersModal;
