"use client";
import React, { useState } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalStore } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useOrigin } from "@/hooks/use-origin";
import axios from "axios";
type Props = {};

const InviteModal = (props: Props) => {
  const {
    isOpen,
    onClose,
    type,
    onOpen,
    data: { server },
  } = useModalStore();
  const origin = useOrigin();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const isModalOpen = isOpen && type === "invite";
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
  const onCopy = () => {
    try {
      navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.log("Error while copying: " + error);
    }
  };
  const regenerate = async () => {
    try {
      setLoading(true);
      const { data } = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );
      onOpen("invite", { server: data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="p-8 px-6">
          <DialogTitle className=" text-center font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 darK:text-secondary/70">
            Server Invite Link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              // disabled={loading}
              readOnly
              className="bg-zinc-300/50 border-0 text-black "
              value={inviteUrl}
            />
            <Button disabled={loading} onClick={onCopy} size="icon">
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4 items-center" />
              )}
            </Button>
          </div>
          <Button
            onClick={regenerate}
            disabled={loading}
            variant="ghost"
            className="text-xs text-zinc-500 mt-4"
            size="sm">
            Generate a new link{"  "}
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
