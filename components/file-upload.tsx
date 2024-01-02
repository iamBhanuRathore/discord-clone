"use client";
import React from "react";
import "@uploadthing/react/styles.css";

import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { FileIcon, X } from "lucide-react";

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
  console.log(fileType);
  if (
    value &&
    ["jpeg", "png", "jpg", "img"].some((item) => item === fileType)
  ) {
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
  } else if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">
          {value}
        </a>
        <button
          type="button"
          onClick={() => onChange("")}
          className="bg-rose-500 p-1 rounded-full absolute -top-2 -right-2 shadow-sm">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  } else if ((value && fileType === "zip") || fileType === "rar") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">
          {value}
        </a>
        <button
          type="button"
          onClick={() => onChange("")}
          className="bg-rose-500 p-1 rounded-full absolute -top-2 -right-2 shadow-sm">
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
