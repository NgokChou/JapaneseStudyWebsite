import React, { useEffect, useState } from "react";
import { ArrowLeft, Edit3, Printer, BookOpen, Clock, Tag, Folder } from "lucide-react";
import { Document, Folder as FolderType } from "@/types/explorer";
import { DocumentRepository } from "@/lib/storage/document-repository";
import { FolderRepository } from "@/lib/storage/folder-repository";
import { DocumentBlockView } from "./document-block-view";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface DocumentViewPageProps {
  documentId: string;
  onEdit: () => void;
  onBack: () => void;
}

export function DocumentViewPage({ documentId, onEdit, onBack }: DocumentViewPageProps) {
  const [doc, setDoc] = useState<Document | null>(null);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [loading, setLoading] = useState(true);

  const docRepo = new DocumentRepository();
  const folderRepo = new FolderRepository();

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [loadedDoc, loadedFolders] = await Promise.all([
          docRepo.getById(documentId),
          folderRepo.getAll(),
        ]);
        if (isMounted) {
          setDoc(loadedDoc || null);
          setFolders(loadedFolders);
          setLoading(false);
        }
      } catch (err) {
        console.error("Lỗi khi tải tài liệu:", err);
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [documentId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="flex items-center gap-2.5 text-stone-500 dark:text-stone-400 font-medium">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
          <span>Đang tải bài học...</span>
        </div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-stone-50 dark:bg-stone-950 p-4">
        <p className="text-base text-stone-600 dark:text-stone-400">Không tìm thấy tài liệu</p>
        <button
          onClick={onBack}
          className="rounded-lg bg-stone-200 dark:bg-stone-800 px-4 py-2 text-sm font-medium text-stone-800 dark:text-stone-200 hover:bg-stone-300 dark:hover:bg-stone-700 transition"
        >
          Quay lại thư mục
        </button>
      </div>
    );
  }

  // Lấy breadcrumb thư mục
  const folderPath: FolderType[] = [];
  let currId = doc.folderId;
  while (currId) {
    const parent = folders.find((f) => f.id === currId);
    if (parent) {
      folderPath.unshift(parent);
      currId = parent.parentId;
    } else {
      break;
    }
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-100/70 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      {/* Sticky Header chỉ cho chế độ View - ẩn khi In (print:hidden) */}
      <header className="sticky top-0 z-30 border-b border-stone-200 dark:border-stone-800 bg-stone-50/90 dark:bg-stone-900/90 backdrop-blur-md px-4 py-2.5 sm:px-6 print:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          {/* Nút Quay lại & Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBack}
              title="Quay lại danh sách tài liệu"
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 dark:border-stone-750 px-2.5 py-1.5 text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-150 dark:hover:bg-stone-800 transition shadow-xs"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Quay lại</span>
            </button>

            {/* Breadcrumb path */}
            <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 truncate">
              <span className="hidden md:inline">Thư mục:</span>
              <span className="inline-flex items-center gap-1">
                <Folder className="h-3.5 w-3.5 text-stone-400" />
                Gốc
              </span>
              {folderPath.map((f) => (
                <React.Fragment key={f.id}>
                  <span className="text-stone-400 dark:text-stone-600">/</span>
                  <span className="truncate max-w-[100px] sm:max-w-[140px] font-medium text-stone-700 dark:text-stone-300">
                    {f.name}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Action buttons: Print, Theme, Edit */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              title="In hoặc lưu dạng PDF"
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 dark:border-stone-750 px-3 py-1.5 text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-150 dark:hover:bg-stone-800 transition shadow-xs"
            >
              <Printer className="h-4 w-4 text-stone-500 dark:text-stone-400" />
              <span className="hidden sm:inline">In bài học</span>
            </button>

            <ThemeToggle />

            <button
              onClick={onEdit}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition shadow-sm"
            >
              <Edit3 className="h-4 w-4" />
              <span>Chỉnh sửa</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Document Content Canvas */}
      <main className="flex-1 py-6 sm:py-10 px-3 sm:px-6">
        <article className="mx-auto max-w-4xl rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm p-6 sm:p-12 transition-colors duration-200 print:border-none print:shadow-none print:p-0 print:max-w-none">
          {/* Document Header */}
          <header className="mb-8 pb-6 border-b border-stone-200 dark:border-stone-800">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100 mb-4 leading-tight font-japanese">
              {doc.title || "Tài liệu chưa đặt tên"}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>Cập nhật: {new Date(doc.updatedAt).toLocaleDateString("vi-VN")}</span>
              </span>

              <span className="text-stone-300 dark:text-stone-700">•</span>

              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                <span>{doc.blocks.length} phần nội dung</span>
              </span>

              {doc.tags && doc.tags.length > 0 && (
                <>
                  <span className="text-stone-300 dark:text-stone-700">•</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-stone-400" />
                    {doc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 text-xs font-medium text-stone-600 dark:text-stone-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </header>

          {/* Block Contents */}
          <div className="space-y-4">
            {doc.blocks.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-stone-500 dark:text-stone-400 mb-4">Bài học này chưa có nội dung.</p>
                <button
                  onClick={onEdit}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition"
                >
                  <Edit3 className="h-4 w-4" />
                  Bắt đầu soạn bài học
                </button>
              </div>
            ) : (
              doc.blocks.map((block) => (
                <div key={block.id} className="py-1">
                  <DocumentBlockView block={block} />
                </div>
              ))
            )}
          </div>
        </article>
      </main>
    </div>
  );
}
