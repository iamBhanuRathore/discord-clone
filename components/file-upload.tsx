"use client";
import React from "react";
import "@uploadthing/react/styles.css";

import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { X } from "lucide-react";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: "messageFile" | "serverImage";
  value: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  endpoint,
  onChange,
  value,
}) => {
  const fileType = value?.split(".").pop();
  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="Uploaded image" className="rounded-full" />
        <button
          type="button"
          onClick={() => onChange("")}
          className="bg-rose-500 p-1 rounded-full absolute top-0 right-0 shadow-sm">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(err: Error) => {
        console.error(err);
      }}
    />
  );
};

export default FileUpload;
