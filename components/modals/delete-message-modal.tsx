"use client";
import axios from "axios";
import qs from "query-string";
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
type Props = {};

const DeleteMessage = (props: Props) => {
  const {
    isOpen,
    onClose,
    type,
    data: { apiUrl, query },
  } = useModalStore();
  const [loading, setLoading] = useState(false);
  const isModalOpen = isOpen && type === "deleteMessage";
  const onDelete = async () => {
    try {
      setLoading(true);
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });
      await axios.delete(url);
      onClose();
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
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure, you want to do this ? <br />
            The message will be permanently deleted
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4 ">
          <div className="flex items-center justify-center gap-x-5 w-full">
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

export default DeleteMessage;
