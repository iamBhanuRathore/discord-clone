"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-full justify-center items-center flex-col gap-y-5">
      <h2 className="text-3xl">
        Not Found : <span>Could not find requested resource !</span>
      </h2>
      <Link className="hover:underline" href="/">
        Return Home
      </Link>
    </div>
  );
}
