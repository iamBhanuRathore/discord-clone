"use client";
import React from "react";

type Props = {
  data: {
    label: string;
    type: "channel" | "member";
    data:
      | {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
};

const ServerSearch = ({ data }: Props) => {
  return <div>ServerSearch</div>;
};

export default ServerSearch;
