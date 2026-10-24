import React from "react";
import { HeadingBlock } from "@/types/block";

interface HeadingViewProps {
  block: HeadingBlock;
}

export function HeadingView({ block }: HeadingViewProps) {
  const level = block.content.level || 2;
  const text = block.content.text;

  if (level === 1) {
    return (
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-6 mb-3 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        {text}
      </h1>
    );
  }

  if (level === 2) {
    return (
      <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-850 dark:text-neutral-150 mt-5 mb-2.5">
        {text}
      </h2>
    );
  }

  return (
    <h3 className="text-lg sm:text-xl font-medium tracking-tight text-neutral-800 dark:text-neutral-200 mt-4 mb-2">
      {text}
    </h3>
  );
}
