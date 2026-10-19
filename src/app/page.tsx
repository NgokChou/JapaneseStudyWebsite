"use client";

import * as React from "react";
import { Header } from "@/components/layout/header";
import { StatsOverview } from "@/features/documents/components/stats-overview";
import { EmptyState } from "@/features/documents/components/empty-state";
import { DocumentCard } from "@/features/documents/components/document-card";
import { CreateDocumentModal } from "@/features/documents/components/create-document-modal";
import { DeleteConfirmModal } from "@/features/documents/components/delete-confirm-modal";
import { DocumentMeta, JLPTLevel, DocumentCategory } from "@/types/document";
import { Search, Filter, Plus, ArrowUpDown, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DocumentLibraryPage() {
  // Danh sách tài liệu (lưu tạm trong state ở Giai đoạn 1; Giai đoạn 2 sẽ liên kết IndexedDB Dexie)
  const [documents, setDocuments] = React.useState<DocumentMeta[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<DocumentCategory | "all">("all");
  const [selectedLevel, setSelectedLevel] = React.useState<JLPTLevel | "all">("all");
  const [sortBy, setSortBy] = React.useState<"updatedAt" | "createdAt" | "title">("updatedAt");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [deletingDocument, setDeletingDocument] = React.useState<DocumentMeta | null>(null);

  // Notification state
  const [toastMessage, setToastMessage] = React.useState<{ text: string; type: "success" | "info" } | null>(null);

  const showToast = (text: string, type: "success" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Thêm tài liệu mới
  const handleCreateDocument = (data: Omit<DocumentMeta, "id" | "createdAt" | "updatedAt" | "itemCount">) => {
    const newDoc: DocumentMeta = {
      id: "doc_" + Date.now().toString(),
      ...data,
      itemCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setDocuments((prev) => [newDoc, ...prev]);
    showToast(`Đã tạo tài liệu "${newDoc.title}" thành công!`);
  };

  // Xóa tài liệu
  const handleDeleteDocument = (id: string) => {
    const docToDelete = documents.find((d) => d.id === id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    showToast(`Đã xóa tài liệu "${docToDelete?.title || ""}"`, "info");
  };

  // Nạp dữ liệu mẫu thử nghiệm
  const handleLoadSampleDocuments = () => {
    const sampleDocs: DocumentMeta[] = [
      {
        id: "sample_1",
        title: "50 Từ vựng N3 chủ đề Công sở & Giao tiếp IT",
        description: "Từ vựng thường gặp trong văn phòng Nhật Bản, kanji có furigana và câu ví dụ hội thoại.",
        category: "vocabulary",
        level: "N3",
        tags: ["công sở", "it", "n3"],
        createdAt: Date.now() - 3600000 * 24 * 2,
        updatedAt: Date.now() - 3600000 * 4,
        itemCount: 50,
      },
      {
        id: "sample_2",
        title: "10 Mẫu ngữ pháp N2 hay xuất hiện trong bài thi đọc hiểu",
        description: "Phân tích cấu trúc, cách kết hợp, sắc thái biểu đạt và câu ví dụ đối chiếu.",
        category: "grammar",
        level: "N2",
        tags: ["ngữ pháp", "n2", "đọc hiểu"],
        createdAt: Date.now() - 3600000 * 24 * 5,
        updatedAt: Date.now() - 3600000 * 12,
        itemCount: 10,
      },
      {
        id: "sample_3",
        title: "Bảng 80 chữ Hán N4 thiết yếu kèm bộ thủ & ví dụ",
        description: "Âm On, âm Kun, nghĩa Hán Việt và các từ ghép thường dùng nhất.",
        category: "kanji",
        level: "N4",
        tags: ["kanji", "n4", "bộ thủ"],
        createdAt: Date.now() - 3600000 * 24 * 10,
        updatedAt: Date.now() - 3600000 * 48,
        itemCount: 80,
      },
    ];
    setDocuments(sampleDocs);
    showToast("Đã tải 3 tài liệu mẫu tiếng Nhật để kiểm tra giao diện!");
  };

  // Xóa toàn bộ dữ liệu để kiểm tra trạng thái rỗng
  const handleResetToEmpty = () => {
    setDocuments([]);
    showToast("Đã đưa thư viện về trạng thái rỗng ban đầu.", "info");
  };

  // Lọc và tìm kiếm
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || doc.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Sắp xếp
  filteredDocuments.sort((a, b) => {
    if (sortBy === "updatedAt") return b.updatedAt - a.updatedAt;
    if (sortBy === "createdAt") return b.createdAt - a.createdAt;
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header onNewDocument={() => setIsCreateModalOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner tiêu đề & Thống kê */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Thư viện tài liệu học tập</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Quản lý các bộ từ vựng, phiếu ngữ pháp, hán tự và bài tập được lưu trên máy của bạn.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {documents.length === 0 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadSampleDocuments}
                className="text-xs bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50"
              >
                Tải 3 tài liệu mẫu
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetToEmpty}
                className="text-xs text-slate-500"
              >
                Thử trạng thái rỗng
              </Button>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo tài liệu mới</span>
            </Button>
          </div>
        </div>

        {/* Thẻ thống kê */}
        <StatsOverview documents={documents} />

        {/* Thanh tìm kiếm & bộ lọc */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 mb-6 shadow-2xs space-y-3">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm theo tên tài liệu, mô tả, nhãn tag (#kanji, #n3)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Filter by Category */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as DocumentCategory | "all")}
                className="h-9.5 px-3 text-xs font-medium rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="all">Tất cả loại tài liệu</option>
                <option value="vocabulary">Sổ từ vựng (単語)</option>
                <option value="grammar">Ngữ pháp (文法)</option>
                <option value="kanji">Hán tự (漢字)</option>
                <option value="exercise">Bài tập (練習)</option>
                <option value="mixed">Tổng hợp (総合)</option>
              </select>

              {/* Filter by JLPT Level */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as JLPTLevel | "all")}
                className="h-9.5 px-3 text-xs font-medium rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="all">Tất cả JLPT</option>
                <option value="N5">N5 (Sơ cấp 1)</option>
                <option value="N4">N4 (Sơ cấp 2)</option>
                <option value="N3">N3 (Trung cấp 1)</option>
                <option value="N2">N2 (Trung cấp 2)</option>
                <option value="N1">N1 (Cao cấp)</option>
              </select>

              {/* Sort selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "updatedAt" | "createdAt" | "title")}
                className="h-9.5 px-3 text-xs font-medium rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="updatedAt">Mới sửa gần nhất</option>
                <option value="createdAt">Mới tạo gần nhất</option>
                <option value="title">Theo tên A - Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Nội dung danh sách tài liệu hoặc Trạng thái rỗng */}
        {documents.length === 0 ? (
          <EmptyState
            onCreateNew={() => setIsCreateModalOpen(true)}
            onUseTemplate={(preset) => {
              handleCreateDocument({
                title: preset.title,
                category: preset.category as DocumentCategory,
                level: preset.level as JLPTLevel,
                tags: [preset.category, preset.level.toLowerCase()],
              });
            }}
          />
        ) : filteredDocuments.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Filter className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-700">
              Không tìm thấy tài liệu nào phù hợp với bộ lọc
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Thử xóa từ khóa tìm kiếm hoặc chọn lại cấp độ JLPT / loại tài liệu.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedLevel("all");
              }}
            >
              Đặt lại bộ lọc
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onEdit={(d) => {
                  showToast(
                    `Trình soạn thảo cho "${d.title}" sẽ được kết nối ở Giai đoạn 2 & 3 theo lộ trình.`,
                    "info"
                  );
                }}
                onPreview={(d) => {
                  showToast(
                    `Bản xem trước A4 cho "${d.title}" sẽ được kết nối ở Giai đoạn 5 theo lộ trình.`,
                    "info"
                  );
                }}
                onDelete={(d) => setDeletingDocument(d)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Japanese Study Document Studio — Phiên bản cá nhân (Offline First)</span>
          <span className="text-[11px] text-slate-400">Giai đoạn 1: Nền tảng giao diện & thư viện tài liệu</span>
        </div>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-xl text-xs font-medium animate-in slide-in-from-bottom-3 duration-200">
          {toastMessage.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Modal tạo tài liệu mới */}
      <CreateDocumentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateDocument}
      />

      {/* Modal xác nhận xóa tài liệu */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingDocument)}
        onClose={() => setDeletingDocument(null)}
        document={deletingDocument}
        onConfirm={handleDeleteDocument}
      />
    </div>
  );
}
