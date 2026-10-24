export type BlockType =
  | "heading"
  | "paragraph"
  | "vocab_table"
  | "table"
  | "bullet_list"
  | "numbered_list"
  | "callout"
  | "dialogue"
  | "grammar";

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
  alignments?: ("left" | "center" | "right")[];
  hasHeader?: boolean;
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

/**
 * Cấu trúc ngữ pháp tiếng Nhật chuyên biệt
 */
export type GrammarStructureType =
  | "table_grouped"     // Kiểu A: Bảng cấu trúc kết hợp (các loại từ gom nhóm -> mẫu ngữ pháp với dấu ngoặc)
  | "combination_table" // Alias Kiểu A
  | "pattern_meaning"   // Kiểu B: Mẫu ngữ pháp & ý nghĩa ngắn gọn
  | "formula"           // Kiểu C: Cấu trúc theo công thức
  | "case_by_case"      // Kiểu D: Giải thích theo từng trường hợp
  | "combined";         // Kiểu E: Nội dung kết hợp toàn diện

export interface GrammarStructureRow {
  id: string;
  wordType: string;  // e.g. "Động từ", "Tính từ đuôi い", "Tính từ đuôi な", "Danh từ"
  form: string;      // e.g. "Thể thông thường", "Thể て", "～だ"
  structure?: string;// e.g. "V-普通形", "V-て + も"
  note?: string;     // e.g. "Bỏ だ", "Chú ý"
}

export interface GrammarExample {
  id: string;
  japanese: string;
  reading?: string;
  vietnamese?: string;
  meaning?: string;  // Bản dịch tiếng Việt (alias tương thích)
  notes?: string;
}

export interface GrammarContent {
  pattern: string;          // Tên mẫu ngữ pháp, e.g. "～でしょう"
  meaning: string;          // Ý nghĩa tiếng Việt, e.g. "Có lẽ..., chắc là..."
  structureType: GrammarStructureType;
  structureRows: GrammarStructureRow[];
  targetPattern?: string;   // Kết quả gom nhóm bên phải dấu ngoặc, e.g. "でしょう"
  resultPattern?: string;   // Alias kết quả gom nhóm bên phải dấu ngoặc
  formula?: string;         // Công thức tóm tắt, e.g. "V/A/N + でしょう"
  structureFormula?: string;// Alias công thức tóm tắt
  explanation?: string;     // Giải thích cách dùng chi tiết
  notes?: string;           // Lưu ý, ngoại lệ, các trường hợp dễ nhầm lẫn
  examples: GrammarExample[];
  showStructure?: boolean;
  showExplanation?: boolean;
  showNotes?: boolean;
  showExamples?: boolean;
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
  | { id: string; type: "dialogue"; content: DialogueContent }
  | { id: string; type: "grammar"; content: GrammarContent };

// Helper Aliases cho discriminated union
export type HeadingBlock = Extract<Block, { type: "heading" }>;
export type ParagraphBlock = Extract<Block, { type: "paragraph" }>;
export type VocabTableBlock = Extract<Block, { type: "vocab_table" }>;
export type TableBlock = Extract<Block, { type: "table" }>;
export type BulletListBlock = Extract<Block, { type: "bullet_list" }>;
export type NumberedListBlock = Extract<Block, { type: "numbered_list" }>;
export type CalloutBlock = Extract<Block, { type: "callout" }>;
export type DialogueBlock = Extract<Block, { type: "dialogue" }>;
export type GrammarBlock = Extract<Block, { type: "grammar" }>;
