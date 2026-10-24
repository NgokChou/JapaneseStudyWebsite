import React from "react";
import { Block } from "@/types/block";
import { HeadingView } from "./renderers/heading-view";
import { ParagraphView } from "./renderers/paragraph-view";
import { ListView } from "./renderers/list-view";
import { CalloutView } from "./renderers/callout-view";
import { VocabTableView } from "./renderers/vocab-table-view";
import { TableView } from "./renderers/table-view";
import { DialogueView } from "./renderers/dialogue-view";
import { GrammarView } from "./renderers/grammar-view";

interface DocumentBlockViewProps {
  block: Block;
}

export function DocumentBlockView({ block }: DocumentBlockViewProps) {
  switch (block.type) {
    case "heading":
      return <HeadingView block={block} />;
    case "paragraph":
      return <ParagraphView block={block} />;
    case "bullet_list":
    case "numbered_list":
      return <ListView block={block} />;
    case "callout":
      return <CalloutView content={block.content} />;
    case "vocab_table":
      return <VocabTableView content={block.content} />;
    case "table":
      return <TableView content={block.content} />;
    case "dialogue":
      return <DialogueView content={block.content} />;
    case "grammar":
      return <GrammarView content={block.content} />;
    default:
      return null;
  }
}
