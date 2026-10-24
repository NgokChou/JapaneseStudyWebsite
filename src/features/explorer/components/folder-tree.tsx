"use client";

import * as React from "react";
import { Folder, Document } from "@/types/explorer";
import {
  ChevronRight,
  ChevronDown,
  Folder as FolderIcon,
  FolderOpen,
  Home,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FolderTreeProps {
  folders: Folder[];
  documents: Document[];
  currentFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onCreateFolder: (parentId: string | null) => void;
}

interface TreeNodeProps {
  folder: Folder;
  folders: Folder[];
  documents: Document[];
  currentFolderId: string | null;
  level: number;
  onSelectFolder: (folderId: string | null) => void;
}

function TreeNode({
  folder,
  folders,
  documents,
  currentFolderId,
  level,
  onSelectFolder,
}: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const childFolders = folders.filter((f) => f.parentId === folder.id);
  const docCount = documents.filter((d) => d.folderId === folder.id).length;
  const isSelected = currentFolderId === folder.id;

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors group",
          isSelected
            ? "bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 font-bold"
            : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100"
        )}
        style={{ paddingLeft: `${Math.max(level * 14, 8)}px` }}
        onClick={() => onSelectFolder(folder.id)}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {childFolders.length > 0 ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-0.5 text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          ) : (
            <span className="w-4" />
          )}

          {isSelected ? (
            <FolderOpen className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
          ) : (
            <FolderIcon className="w-4 h-4 text-stone-400 dark:text-stone-500 group-hover:text-primary-500 dark:group-hover:text-primary-400 shrink-0 transition-colors" />
          )}

          <span className="truncate">{folder.name}</span>
        </div>

        {docCount > 0 && (
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200/70 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-semibold shrink-0">
            {docCount}
          </span>
        )}
      </div>

      {isExpanded && childFolders.length > 0 && (
        <div className="space-y-0.5">
          {childFolders.map((child) => (
            <TreeNode
              key={child.id}
              folder={child}
              folders={folders}
              documents={documents}
              currentFolderId={currentFolderId}
              level={level + 1}
              onSelectFolder={onSelectFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FolderTree({
  folders,
  documents,
  currentFolderId,
  onSelectFolder,
  onCreateFolder,
}: FolderTreeProps) {
  const rootFolders = folders.filter((f) => f.parentId === null);
  const rootDocCount = documents.filter((d) => d.folderId === null).length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-2 text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
        <span>Cây thư mục</span>
        <button
          type="button"
          onClick={() => onCreateFolder(currentFolderId)}
          className="p-1 text-stone-500 hover:text-primary-600 dark:text-stone-400 dark:hover:text-primary-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors"
          title="Tạo thư mục con"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-0.5">
        {/* Thư mục gốc */}
        <div
          className={cn(
            "flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors",
            currentFolderId === null
              ? "bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 font-bold"
              : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100"
          )}
          onClick={() => onSelectFolder(null)}
        >
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-primary-500 dark:text-primary-400" />
            <span>Thư mục gốc (Root)</span>
          </div>
          {rootDocCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200/70 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-semibold">
              {rootDocCount}
            </span>
          )}
        </div>

        {/* Các nhánh thư mục */}
        {rootFolders.map((rootFolder) => (
          <TreeNode
            key={rootFolder.id}
            folder={rootFolder}
            folders={folders}
            documents={documents}
            currentFolderId={currentFolderId}
            level={1}
            onSelectFolder={onSelectFolder}
          />
        ))}
      </div>
    </div>
  );
}
