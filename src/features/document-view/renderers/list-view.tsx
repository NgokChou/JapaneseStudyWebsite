import React from "react";
import { BulletListBlock, NumberedListBlock } from "@/types/block";
import { renderFormattedContent } from "@/components/ui/rich-text-editor";

interface ListViewProps {
  block: BulletListBlock | NumberedListBlock;
}

export function ListView({ block }: ListViewProps) {
  const isNumbered = block.type === "numbered_list";
  const items = block.content.items || [];

  if (items.length === 0) {
    return null;
  }

  if (isNumbered) {
    return (
      <ol className="list-decimal list-outside pl-6 space-y-1 my-2.5 text-stone-800 dark:text-stone-200 text-[15px] sm:text-base leading-relaxed">
        {items.map((item: string, idx: number) => (
          <li key={idx} className="pl-1">
            {renderFormattedContent(item)}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ul className="list-disc list-outside pl-6 space-y-1 my-2.5 text-stone-800 dark:text-stone-200 text-[15px] sm:text-base leading-relaxed">
      {items.map((item: string, idx: number) => (
        <li key={idx} className="pl-1">
          {renderFormattedContent(item)}
        </li>
      ))}
    </ul>
  );
}
