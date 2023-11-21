"use client";
import axios from "axios";
import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalStore } from "@/hooks/use-modal-store";

import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
type Props = {};

const DeleteServer = (props: Props) => {
  const {
    isOpen,
    onClose,
    type,
    data: { server },
  } = useModalStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isModalOpen = isOpen && type === "deleteServer";
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/servers/${server?.id}`);
      onClose();
      router.refresh();
      router.replace("/");
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="p-8 px-6">
          <DialogTitle className=" text-center font-bold">
            Delete Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure, you want to do this ? <br />
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>{" "}
            will be permanently deleted
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">Delete Server</div>
        <DialogFooter className="bg-gray-100 px-6 py-4 ">
          <div className="flex items-center justify-center w-full">
            <Button
              disabled={loading}
              onClick={() => onClose()}
              variant="ghost">
              Cancel
            </Button>
            <Button disabled={loading} variant="primary" onClick={onDelete}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteServer;
