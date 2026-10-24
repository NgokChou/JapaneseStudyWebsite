"use client";

import * as React from "react";
import { Folder, Document, ViewMode, MoveTarget } from "@/types/explorer";
import {
  Folder as FolderIcon,
  FileText,
  FolderOpen,
  Calendar,
  Edit2,
  Trash2,
  FolderInput,
  Layers,
  Plus,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface FolderViewProps {
  currentFolder: Folder | null;
  folders: Folder[];
  documents: Document[];
  allFolders: Folder[];
  viewMode: ViewMode;
  onOpenFolder: (folderId: string) => void;
  onOpenDocument: (doc: Document) => void;
  onRenameFolder: (folder: Folder) => void;
  onDeleteFolder: (folder: Folder) => void;
  onMoveItem: (target: MoveTarget) => void;
  onDeleteDocument: (doc: Document) => void;
  onNewDocument: () => void;
}

export function FolderView({
  currentFolder,
  folders,
  documents,
  allFolders,
  viewMode,
  onOpenFolder,
  onOpenDocument,
  onRenameFolder,
  onDeleteFolder,
  onMoveItem,
  onDeleteDocument,
  onNewDocument,
}: FolderViewProps) {
  const isEmpty = folders.length === 0 && documents.length === 0;

  if (isEmpty) {
    return (
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-dashed border-stone-300 dark:border-stone-800 p-12 text-center my-4 shadow-2xs transition-colors">
        <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 mx-auto mb-4">
          <FolderOpen className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-stone-850 dark:text-stone-150">
          Thư mục này đang trống
        </h3>
        <p className="text-xs text-stone-400 dark:text-stone-500 mt-1 max-w-sm mx-auto">
          Chưa có tài liệu hoặc thư mục con nào tại đây. Hãy bắt đầu bằng cách tạo tài liệu mới hoặc tạo thư mục con.
        </p>
        <button
          type="button"
          onClick={onNewDocument}
          className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo tài liệu mới tại đây</span>
        </button>
      </div>
    );
  }

  // --- Chế độ hiển thị DẠNG LƯỚI (GRID VIEW) ---
  if (viewMode === "grid") {
    return (
      <div className="space-y-6">
        {/* Nhóm Thư mục con */}
        {folders.length > 0 && (
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
              Thư mục ({folders.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {folders.map((folder) => {
                const subCount = allFolders.filter((f) => f.parentId === folder.id).length;
                return (
                  <div
                    key={folder.id}
                    onClick={() => onOpenFolder(folder.id)}
                    className="group bg-white dark:bg-stone-900 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0 group-hover:scale-105 transition-transform">
                        <FolderIcon className="w-5 h-5 fill-primary-100 dark:fill-primary-950 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-stone-850 dark:text-stone-150 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                          {folder.name}
                        </p>
                        <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-0.5">
                          {subCount > 0 ? `${subCount} thư mục con` : "Thư mục"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRenameFolder(folder);
                        }}
                        className="p-1 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 rounded hover:bg-stone-100 dark:hover:bg-stone-800"
                        title="Đổi tên"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveItem({
                            type: "folder",
                            id: folder.id,
                            name: folder.name,
                            currentFolderId: folder.parentId,
                          });
                        }}
                        className="p-1 text-stone-400 hover:text-primary-600 dark:hover:text-primary-400 rounded hover:bg-primary-50 dark:hover:bg-primary-950"
                        title="Di chuyển"
                      >
                        <FolderInput className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteFolder(folder);
                        }}
                        className="p-1 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Xóa"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Nhóm Tài liệu */}
        {documents.length > 0 && (
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
              Tài liệu học tập ({documents.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => onOpenDocument(doc)}
                  className="group bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-400 shrink-0 group-hover:bg-primary-50 dark:group-hover:bg-primary-950 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveItem({
                              type: "document",
                              id: doc.id,
                              name: doc.title,
                              currentFolderId: doc.folderId,
                            });
                          }}
                          className="p-1 text-stone-400 hover:text-primary-600 dark:hover:text-primary-400 rounded hover:bg-primary-50 dark:hover:bg-primary-950"
                          title="Di chuyển sang thư mục khác"
                        >
                          <FolderInput className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteDocument(doc);
                          }}
                          className="p-1 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Xóa tài liệu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h5 className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 mt-3 leading-snug font-japanese">
                      {doc.title}
                    </h5>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-400 dark:text-stone-500">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3 text-stone-400" />
                      {doc.blocks.length} khối
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      {formatDate(doc.updatedAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- Chế độ hiển thị DẠNG DANH SÁCH (LIST VIEW) ---
  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-2xs transition-colors">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-stone-50 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 font-semibold">
            <th className="py-2.5 px-4">Tên mục</th>
            <th className="py-2.5 px-4 w-32">Loại</th>
            <th className="py-2.5 px-4 w-40">Ngày cập nhật</th>
            <th className="py-2.5 px-4 w-28 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
          {/* Thư mục con */}
          {folders.map((folder) => (
            <tr
              key={folder.id}
              onClick={() => onOpenFolder(folder.id)}
              className="hover:bg-primary-50/40 dark:hover:bg-primary-950/30 cursor-pointer group transition-colors"
            >
              <td className="py-2 px-4 flex items-center gap-2.5 font-bold text-stone-850 dark:text-stone-150 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                <FolderIcon className="w-4 h-4 text-primary-500 fill-primary-100 dark:fill-primary-950 shrink-0" />
                <span className="truncate">{folder.name}</span>
              </td>
              <td className="py-2 px-4 text-stone-400 dark:text-stone-500 text-[11px]">Thư mục</td>
              <td className="py-2 px-4 text-stone-400 dark:text-stone-500 text-[11px]">
                {formatDate(folder.updatedAt)}
              </td>
              <td className="py-2 px-4 text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRenameFolder(folder);
                    }}
                    className="p-1 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 rounded"
                    title="Đổi tên"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveItem({
                        type: "folder",
                        id: folder.id,
                        name: folder.name,
                        currentFolderId: folder.parentId,
                      });
                    }}
                    className="p-1 text-stone-400 hover:text-primary-600 dark:hover:text-primary-400 rounded"
                    title="Di chuyển"
                  >
                    <FolderInput className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFolder(folder);
                    }}
                    className="p-1 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 rounded"
                    title="Xóa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {/* Tài liệu */}
          {documents.map((doc) => (
            <tr
              key={doc.id}
              onClick={() => onOpenDocument(doc)}
              className="hover:bg-stone-50 dark:hover:bg-stone-800/60 cursor-pointer group transition-colors"
            >
              <td className="py-2 px-4 flex items-center gap-2.5 font-semibold text-stone-900 dark:text-stone-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 font-japanese">
                <FileText className="w-4 h-4 text-stone-400 group-hover:text-primary-500 shrink-0" />
                <span className="truncate">{doc.title}</span>
              </td>
              <td className="py-2 px-4 text-stone-400 dark:text-stone-500 text-[11px]">
                {doc.blocks.length} khối nội dung
              </td>
              <td className="py-2 px-4 text-stone-400 dark:text-stone-500 text-[11px]">
                {formatDate(doc.updatedAt)}
              </td>
              <td className="py-2 px-4 text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveItem({
                        type: "document",
                        id: doc.id,
                        name: doc.title,
                        currentFolderId: doc.folderId,
                      });
                    }}
                    className="p-1 text-stone-400 hover:text-primary-600 dark:hover:text-primary-400 rounded"
                    title="Di chuyển"
                  >
                    <FolderInput className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDocument(doc);
                    }}
                    className="p-1 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 rounded"
                    title="Xóa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
