"use client";

import * as React from "react";
import { Folder, Document, ViewMode, MoveTarget } from "@/types/explorer";
import {
  Folder as FolderIcon,
  FileText,
  FolderOpen,
  Calendar,
  MoreVertical,
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
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center my-4 shadow-2xs">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-4">
          <FolderOpen className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-800">
          Thư mục này đang trống
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Chưa có tài liệu hoặc thư mục con nào tại đây. Hãy bắt đầu bằng cách tạo tài liệu mới hoặc tạo thư mục con.
        </p>
        <button
          type="button"
          onClick={onNewDocument}
          className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
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
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Thư mục ({folders.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {folders.map((folder) => {
                const subCount = allFolders.filter((f) => f.parentId === folder.id).length;
                return (
                  <div
                    key={folder.id}
                    onClick={() => onOpenFolder(folder.id)}
                    className="group bg-white p-3.5 rounded-xl border border-slate-200/90 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-105 transition-transform">
                        <FolderIcon className="w-5 h-5 fill-indigo-100 text-indigo-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                          {folder.name}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
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
                        className="p-1 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100"
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
                        className="p-1 text-slate-400 hover:text-indigo-600 rounded hover:bg-indigo-50"
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
                        className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
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
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Tài liệu học tập ({documents.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => onOpenDocument(doc)}
                  className="group bg-white p-4 rounded-xl border border-slate-200/90 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
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
                          className="p-1 text-slate-400 hover:text-indigo-600 rounded hover:bg-indigo-50"
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
                          className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                          title="Xóa tài liệu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h5 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mt-3 leading-snug font-japanese">
                      {doc.title}
                    </h5>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3 text-slate-400" />
                      {doc.blocks.length} khối
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
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
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
            <th className="py-2.5 px-4">Tên mục</th>
            <th className="py-2.5 px-4 w-32">Loại</th>
            <th className="py-2.5 px-4 w-40">Ngày cập nhật</th>
            <th className="py-2.5 px-4 w-28 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {/* Thư mục con */}
          {folders.map((folder) => (
            <tr
              key={folder.id}
              onClick={() => onOpenFolder(folder.id)}
              className="hover:bg-indigo-50/40 cursor-pointer group transition-colors"
            >
              <td className="py-2 px-4 flex items-center gap-2.5 font-bold text-slate-800 group-hover:text-indigo-600">
                <FolderIcon className="w-4 h-4 text-indigo-500 fill-indigo-100 shrink-0" />
                <span className="truncate">{folder.name}</span>
              </td>
              <td className="py-2 px-4 text-slate-400 text-[11px]">Thư mục</td>
              <td className="py-2 px-4 text-slate-400 text-[11px]">
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
                    className="p-1 text-slate-400 hover:text-slate-800 rounded"
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
                    className="p-1 text-slate-400 hover:text-indigo-600 rounded"
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
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
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
              className="hover:bg-slate-50 cursor-pointer group transition-colors"
            >
              <td className="py-2 px-4 flex items-center gap-2.5 font-semibold text-slate-900 group-hover:text-indigo-600 font-japanese">
                <FileText className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 shrink-0" />
                <span className="truncate">{doc.title}</span>
              </td>
              <td className="py-2 px-4 text-slate-400 text-[11px]">
                {doc.blocks.length} khối nội dung
              </td>
              <td className="py-2 px-4 text-slate-400 text-[11px]">
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
                    className="p-1 text-slate-400 hover:text-indigo-600 rounded"
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
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
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
