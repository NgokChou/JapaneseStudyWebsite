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
  Folder,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-2xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Nhóm nút hành động chính */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Nút Tạo tài liệu mới */}
          <Button
            size="sm"
            variant="primary"
            onClick={onNewDocument}
            className="text-xs font-bold gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo tài liệu mới</span>
          </Button>

          {/* Nút Tạo thư mục mới */}
          <Button
            size="sm"
            variant="outline"
            onClick={onNewFolder}
            className="text-xs font-medium gap-1.5 bg-slate-50"
          >
            <FolderPlus className="w-4 h-4 text-indigo-600" />
            <span>Thư mục mới</span>
          </Button>

          {/* Thao tác trên thư mục hiện tại (khi không ở Root) */}
          {!isRoot && (
            <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
              {onRenameCurrentFolder && (
                <button
                  type="button"
                  onClick={onRenameCurrentFolder}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                  title="Đổi tên thư mục này"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              {onMoveCurrentFolder && (
                <button
                  type="button"
                  onClick={onMoveCurrentFolder}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
                  title="Di chuyển thư mục này sang vị trí khác"
                >
                  <FolderInput className="w-3.5 h-3.5" />
                </button>
              )}
              {onDeleteCurrentFolder && (
                <button
                  type="button"
                  onClick={onDeleteCurrentFolder}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
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
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm tài liệu hoặc thư mục..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Toggle View Mode */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-indigo-600 shadow-2xs"
                  : "text-slate-400 hover:text-slate-700"
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
                  ? "bg-white text-indigo-600 shadow-2xs"
                  : "text-slate-400 hover:text-slate-700"
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
