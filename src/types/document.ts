export type JLPTLevel = "N5" | "N4" | "N3" | "N2" | "N1" | "All";

export type DocumentCategory = 
  | "vocabulary" // Sổ từ vựng
  | "grammar"    // Ngữ pháp
  | "kanji"      // Hán tự
  | "exercise"   // Bài tập & Đề thi
  | "mixed";     // Tài liệu tổng hợp theo chương

export interface DocumentMeta {
  id: string;
  title: string;
  description?: string;
  category: DocumentCategory;
  level: JLPTLevel;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  itemCount: number; // Số lượng mục nội dung trong tài liệu
  isFavorite?: boolean;
}

export interface DocumentFilter {
  searchQuery: string;
  category: DocumentCategory | "all";
  level: JLPTLevel | "all";
  sortBy: "updatedAt" | "createdAt" | "title";
  sortOrder: "asc" | "desc";
}
