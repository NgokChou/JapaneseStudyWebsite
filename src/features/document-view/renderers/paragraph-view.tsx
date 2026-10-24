import React from "react";
import { ParagraphBlock } from "@/types/block";
import { renderFormattedContent } from "@/components/ui/rich-text-editor";

interface ParagraphViewProps {
  block: ParagraphBlock;
}

export function ParagraphView({ block }: ParagraphViewProps) {
  const text = block.content.text || "";
  
  if (!text.trim()) {
    return <div className="h-4" />;
  }

  return (
    <div className="text-[15px] sm:text-base leading-relaxed text-neutral-800 dark:text-neutral-200 my-2">
      {renderFormattedContent(text)}
    </div>
  );
}
