"use client";

import * as React from "react";
import { Block } from "@/types/block";
import { HeadingBlock } from "./blocks/heading-block";
import { ParagraphBlock } from "./blocks/paragraph-block";
import { VocabTableBlock } from "./blocks/vocab-table-block";
import { TableBlock } from "./blocks/table-block";
import { ListBlock } from "./blocks/list-block";
import { CalloutBlock } from "./blocks/callout-block";
import { DialogueBlock } from "./blocks/dialogue-block";
import { GrammarBlock } from "./blocks/grammar-block";

interface BlockRendererProps {
  block: Block;
  onChange: (updatedContent: any) => void;
  onToggleListType?: () => void;
}

export function BlockRenderer({ block, onChange, onToggleListType }: BlockRendererProps) {
  switch (block.type) {
    case "heading":
      return <HeadingBlock content={block.content} onChange={onChange} />;
    case "paragraph":
      return <ParagraphBlock content={block.content} onChange={onChange} />;
    case "vocab_table":
      return <VocabTableBlock content={block.content} onChange={onChange} />;
    case "table":
      return <TableBlock content={block.content} onChange={onChange} />;
    case "bullet_list":
      return <ListBlock content={block.content} isNumbered={false} onChange={onChange} onToggleType={onToggleListType} />;
    case "numbered_list":
      return <ListBlock content={block.content} isNumbered={true} onChange={onChange} onToggleType={onToggleListType} />;
    case "callout":
      return <CalloutBlock content={block.content} onChange={onChange} />;
    case "dialogue":
      return <DialogueBlock content={block.content} onChange={onChange} />;
    case "grammar":
      return <GrammarBlock content={block.content} onChange={onChange} />;
    default:
      return (
        <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg">
          Không hỗ trợ loại khối
        </div>
      );
  }
}
