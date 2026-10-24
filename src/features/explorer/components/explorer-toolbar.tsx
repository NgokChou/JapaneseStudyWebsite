"use client";

import * as React from "react";
import {
  Plus,
  FolderPlus,
  Search,
  LayoutGrid,
  List as ListIcon,
  Edit2,
  Trash2,
  FolderInput,
} from "lucide-react";
import { ViewMode } from "@/types/explorer";

interface ExplorerToolbarProps {
  currentFolderName: string;
  isRoot: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onNewDocument: () => void;
  onNewFolder: () => void;
  onRenameCurrentFolder?: () => void;
  onDeleteCurrentFolder?: () => void;
  onMoveCurrentFolder?: () => void;
}

export function ExplorerToolbar({
  currentFolderName,
  isRoot,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onNewDocument,
  onNewFolder,
  onRenameCurrentFolder,
  onDeleteCurrentFolder,
  onMoveCurrentFolder,
}: ExplorerToolbarProps) {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-3 shadow-2xs space-y-3 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Nhóm nút hành động chính */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Nút Tạo tài liệu mới */}
          <button
            onClick={onNewDocument}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo tài liệu mới</span>
          </button>

          {/* Nút Tạo thư mục mới */}
          <button
            onClick={onNewFolder}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-100 hover:bg-stone-150 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-750 transition-colors"
          >
            <FolderPlus className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span>Thư mục mới</span>
          </button>

          {/* Thao tác trên thư mục hiện tại (khi không ở Root) */}
          {!isRoot && (
            <div className="flex items-center gap-1 border-l border-stone-200 dark:border-stone-750 pl-2">
              {onRenameCurrentFolder && (
                <button
                  type="button"
                  onClick={onRenameCurrentFolder}
                  className="p-1.5 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition-colors"
                  title="Đổi tên thư mục này"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              {onMoveCurrentFolder && (
                <button
                  type="button"
                  onClick={onMoveCurrentFolder}
                  className="p-1.5 text-stone-500 hover:text-primary-600 dark:text-stone-400 dark:hover:text-primary-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition-colors"
                  title="Di chuyển thư mục này sang vị trí khác"
                >
                  <FolderInput className="w-3.5 h-3.5" />
                </button>
              )}
              {onDeleteCurrentFolder && (
                <button
                  type="button"
                  onClick={onDeleteCurrentFolder}
                  className="p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition-colors"
                  title="Xóa thư mục này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tìm kiếm & chuyển đổi View Grid/List */}
        <div className="flex items-center gap-2">
          {/* Ô tìm kiếm */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm tài liệu hoặc thư mục..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-lg border border-stone-200 dark:border-stone-750 focus:bg-white dark:focus:bg-stone-850 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors placeholder:text-stone-400 dark:placeholder:text-stone-500"
            />
          </div>

          {/* Toggle View Mode */}
          <div className="inline-flex rounded-lg border border-stone-200 dark:border-stone-750 bg-stone-100 dark:bg-stone-800 p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-white dark:bg-stone-700 text-primary-600 dark:text-primary-300 shadow-2xs font-semibold"
                  : "text-stone-400 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              }`}
              title="Xem dạng lưới"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-white dark:bg-stone-700 text-primary-600 dark:text-primary-300 shadow-2xs font-semibold"
                  : "text-stone-400 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              }`}
              title="Xem dạng danh sách"
            >
              <ListIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
