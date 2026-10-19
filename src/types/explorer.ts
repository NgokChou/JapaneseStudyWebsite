import { Block } from "./block";

export interface Folder {
  id: string;
  name: string;
  parentId: string | null; // null biểu thị thư mục gốc (Root)
  createdAt: number;
  updatedAt: number;
  color?: string;
}

export interface Document {
  id: string;
  title: string;
  folderId: string | null; // null biểu thị nằm ở thư mục gốc
  blocks: Block[];
  tags: string[];
  createdAt: number;
  updatedAt: number;
  isFavorite?: boolean;
}

export type ViewMode = "grid" | "list";

export interface BreadcrumbItem {
  id: string | null; // null là Root
  name: string;
}

export interface MoveTarget {
  type: "document" | "folder";
  id: string;
  name: string;
  currentFolderId: string | null;
}
