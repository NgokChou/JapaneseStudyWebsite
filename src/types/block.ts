export type BlockType =
  | "heading"
  | "paragraph"
  | "vocab_table"
  | "table"
  | "bullet_list"
  | "numbered_list"
  | "callout"
  | "dialogue";

export interface HeadingContent {
  level: 1 | 2 | 3;
  text: string;
}

export interface ParagraphContent {
  text: string;
}

export interface VocabRow {
  id: string;
  kanji: string;
  reading: string;
  meaning: string;
  example?: string;
}

export interface VocabTableContent {
  title?: string;
  rows: VocabRow[];
}

export interface TableContent {
  headers: string[];
  rows: string[][];
}

export interface ListContent {
  items: string[];
}

export interface CalloutContent {
  variant: "info" | "tip" | "warning" | "japanese";
  title?: string;
  text: string;
}

export interface DialogueLine {
  id: string;
  speaker: string;
  japanese: string;
  reading?: string;
  vietnamese?: string;
}

export interface DialogueContent {
  title?: string;
  lines: DialogueLine[];
}

// Discriminated union cho từng khối
export type Block =
  | { id: string; type: "heading"; content: HeadingContent }
  | { id: string; type: "paragraph"; content: ParagraphContent }
  | { id: string; type: "vocab_table"; content: VocabTableContent }
  | { id: string; type: "table"; content: TableContent }
  | { id: string; type: "bullet_list"; content: ListContent }
  | { id: string; type: "numbered_list"; content: ListContent }
  | { id: string; type: "callout"; content: CalloutContent }
  | { id: string; type: "dialogue"; content: DialogueContent };
