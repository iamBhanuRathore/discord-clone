"use client";

import { useEffect, useState } from "react";
import CreateServerModalAfter from "../modals/create-server-modal-after";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  return (
    <>
      <CreateServerModalAfter />;
    </>
  );
};
