"use client";
import React from "react";

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
  return <div>FileUpload</div>;
};

export default FileUpload;
