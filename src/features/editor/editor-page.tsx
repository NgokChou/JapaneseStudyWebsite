"use client";

import * as React from "react";
import { Document } from "@/types/explorer";
import { Block, BlockType } from "@/types/block";
import { BlockWrapper } from "./block-wrapper";
import { BlockRenderer } from "./block-renderer";
import { AddBlockMenu } from "./add-block-menu";
import { Button } from "@/components/ui/button";
import { SaveAsTemplateModal } from "@/features/templates/save-as-template-modal";
import { DocumentTemplate } from "@/types/template";
import { useAutoSave } from "@/lib/storage/use-auto-save";
import {
  ArrowLeft,
  Save,
  Check,
  BookmarkPlus,
  Calendar,
  RefreshCw,
  AlertCircle,
  Eye,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface EditorPageProps {
  document: Document;
  folderName: string;
  onBack: () => void;
  onSave: (updatedDoc: Document) => void;
  onSaveAsTemplate: (template: DocumentTemplate) => void;
}

export function EditorPage({
  document: initialDoc,
  folderName,
  onBack,
  onSave,
  onSaveAsTemplate,
}: EditorPageProps) {
  const [doc, setDoc] = React.useState<Document>(initialDoc);
  const [isDirty, setIsDirty] = React.useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = React.useState(false);

  // Hook tự động lưu vào IndexedDB với debounce 800ms
  const { status: saveStatus, lastSavedAt, saveNow } = useAutoSave(doc, isDirty, {
    debounceMs: 800,
    onSaveSuccess: (saved) => {
      setIsDirty(false);
      onSave(saved);
    },
  });

  // Cập nhật tiêu đề tài liệu
  const handleTitleChange = (newTitle: string) => {
    setDoc((prev) => ({ ...prev, title: newTitle, updatedAt: Date.now() }));
    setIsDirty(true);
  };

  // Cập nhật nội dung một khối
  const handleBlockChange = (blockId: string, newContent: any) => {
    setDoc((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === blockId ? { ...b, content: newContent } : b)),
      updatedAt: Date.now(),
    }));
    setIsDirty(true);
  };

  // Thêm khối mới tại vị trí (cuối hoặc ngay dưới khối chỉ định)
  const handleAddBlock = (type: BlockType, afterIndex?: number) => {
    const defaultContents: Record<BlockType, any> = {
      heading: { level: 2, text: "" },
      paragraph: { text: "" },
      vocab_table: {
        title: "",
        rows: [
          { id: "vr_1", kanji: "", reading: "", meaning: "", example: "" },
        ],
      },
      table: {
        headers: ["Cột 1", "Cột 2"],
        rows: [["", ""]],
      },
      bullet_list: { items: [""] },
      numbered_list: { items: [""] },
      callout: { variant: "japanese", title: "Lưu ý", text: "" },
      dialogue: {
        title: "Đoạn thoại",
        lines: [
          { id: "dl_1", speaker: "A", japanese: "", reading: "", vietnamese: "" },
          { id: "dl_2", speaker: "B", japanese: "", reading: "", vietnamese: "" },
        ],
      },
      grammar: {
        pattern: "～でしょう",
        meaning: "Có lẽ..., chắc là...",
        structureType: "table_grouped",
        targetPattern: "でしょう",
        structureRows: [
          { id: "sr_1", wordType: "Động từ", form: "Thể thông thường", note: "" },
          { id: "sr_2", wordType: "Tính từ đuôi い", form: "Thể thông thường", note: "" },
          { id: "sr_3", wordType: "Tính từ đuôi な", form: "Thể thông thường", note: "Bỏ だ" },
          { id: "sr_4", wordType: "Danh từ", form: "～だ", note: "Bỏ だ" },
        ],
        formula: "V / A-い / A-な / N + でしょう",
        explanation: "Dùng để diễn tả sự suy đoán không chắc chắn của người nói dựa trên một căn cứ nào đó, hoặc hỏi ý kiến người nghe với ngữ điệu lên giọng.",
        notes: "Khi nói với ngữ điệu lên giọng (でしょう↗), câu mang ý nghĩa xác nhận lại thông tin từ người nghe.",
        examples: [
          { id: "ex_1", japanese: "明日は雨が[降|ふ]るでしょう。", reading: "あしたはあめがふるでしょう。", vietnamese: "Ngày mai có lẽ trời sẽ mưa." },
          { id: "ex_2", japanese: "ミラーさんはもう[帰|かえ]ったでしょう。", reading: "ミラーさんはもうかえったでしょう。", vietnamese: "Anh Miller chắc là đã về rồi nhỉ." },
        ],
        showStructure: true,
        showExplanation: true,
        showNotes: true,
        showExamples: true,
      },
    };

    const newBlock: Block = {
      id: "b_" + Math.random().toString(36).substring(2, 9),
      type,
      content: defaultContents[type],
    };

    setDoc((prev) => {
      const updated = [...prev.blocks];
      const insertAt = afterIndex !== undefined ? afterIndex + 1 : updated.length;
      updated.splice(insertAt, 0, newBlock);
      return { ...prev, blocks: updated, updatedAt: Date.now() };
    });

    setIsDirty(true);
  };

  // Di chuyển khối lên
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setDoc((prev) => {
      const updated = [...prev.blocks];
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
      return { ...prev, blocks: updated, updatedAt: Date.now() };
    });
    setIsDirty(true);
  };

  // Di chuyển khối xuống
  const handleMoveDown = (index: number) => {
    if (index === doc.blocks.length - 1) return;
    setDoc((prev) => {
      const updated = [...prev.blocks];
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
      return { ...prev, blocks: updated, updatedAt: Date.now() };
    });
    setIsDirty(true);
  };

  // Nhân bản khối
  const handleDuplicate = (index: number) => {
    setDoc((prev) => {
      const updated = [...prev.blocks];
      const target = updated[index];
      const clone: Block = {
        ...JSON.parse(JSON.stringify(target)),
        id: "b_" + Math.random().toString(36).substring(2, 9),
      };
      updated.splice(index + 1, 0, clone);
      return { ...prev, blocks: updated, updatedAt: Date.now() };
    });
    setIsDirty(true);
  };

  // Xóa khối
  const handleDeleteBlock = (index: number) => {
    setDoc((prev) => {
      const updated = prev.blocks.filter((_, idx) => idx !== index);
      return { ...prev, blocks: updated, updatedAt: Date.now() };
    });
    setIsDirty(true);
  };

  // Chuyển đổi giữa danh sách chấm tròn và danh sách số
  const handleToggleListType = (index: number) => {
    setDoc((prev) => {
      const updated = [...prev.blocks];
      const target = updated[index];
      if (target.type === "bullet_list") {
        updated[index] = { id: target.id, type: "numbered_list", content: target.content };
      } else if (target.type === "numbered_list") {
        updated[index] = { id: target.id, type: "bullet_list", content: target.content };
      }
      return { ...prev, blocks: updated, updatedAt: Date.now() };
    });
    setIsDirty(true);
  };

  // Nút quay lại: nếu có thay đổi chưa lưu, lưu trước khi thoát
  const handleSafeBack = async () => {
    if (isDirty) {
      await saveNow();
    }
    onBack();
  };

  // Nút Lưu thủ công: ép lưu ngay lập tức
  const handleManualSave = async () => {
    await saveNow();
  };

  return (
    <div className="min-h-screen bg-stone-100/70 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          {/* Nút thoát editor / Xem bài học */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSafeBack}
              title="Lưu và quay lại chế độ xem bài học"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 bg-stone-150 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 rounded-lg transition-colors shadow-2xs"
            >
              <Eye className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span>Xem bài học</span>
            </button>

            <span className="text-xs text-stone-400 dark:text-stone-600 hidden md:inline">|</span>

            <span className="text-xs text-stone-500 dark:text-stone-400 truncate max-w-[150px] hidden md:inline">
              Thư mục: <strong className="text-stone-700 dark:text-stone-300">{folderName}</strong>
            </span>
          </div>

          {/* Trạng thái lưu & Các hành động */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Auto-save status badge */}
            <div
              className="text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-medium border border-stone-200 dark:border-stone-750"
              title={`Lần lưu gần nhất: ${formatDate(lastSavedAt)}`}
            >
              {saveStatus === "saved" && (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium hidden sm:inline">Đã lưu vào máy</span>
                </>
              )}
              {saveStatus === "unsaved" && (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-amber-700 dark:text-amber-400 font-medium">Đang sửa...</span>
                </>
              )}
              {saveStatus === "saving" && (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary-600 dark:text-primary-400" />
                  <span className="text-primary-700 dark:text-primary-400 font-medium">Đang lưu...</span>
                </>
              )}
              {saveStatus === "error" && (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  <span className="text-rose-700 dark:text-rose-400 font-medium">Lỗi lưu</span>
                </>
              )}
            </div>

            {/* Lưu thành mẫu */}
            <button
              onClick={() => setIsTemplateModalOpen(true)}
              className="inline-flex items-center gap-1 rounded-lg border border-stone-200 dark:border-stone-750 bg-white dark:bg-stone-850 px-2.5 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition hidden sm:inline-flex"
              title="Lưu cấu trúc tài liệu này thành mẫu tái sử dụng"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
              <span>Lưu mẫu</span>
            </button>

            {/* Nút lưu thủ công */}
            <button
              onClick={handleManualSave}
              disabled={saveStatus === "saving"}
              className="inline-flex items-center gap-1.5 rounded-lg bg-stone-850 hover:bg-stone-900 dark:bg-stone-750 dark:hover:bg-stone-700 text-white px-3 py-1.5 text-xs font-semibold transition shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{saveStatus === "saving" ? "Đang lưu..." : "Lưu"}</span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Editor Main Canvas */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-10">
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm p-6 sm:p-12 min-h-[75vh] transition-colors duration-200">
          {/* Tiêu đề tài liệu có thể chỉnh sửa trực tiếp (Inline Title) */}
          <div className="mb-8 pb-4 border-b border-stone-150 dark:border-stone-800">
            <input
              type="text"
              value={doc.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Nhập tên tài liệu ở đây..."
              className="w-full text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 bg-transparent border-0 focus:outline-none placeholder:text-stone-350 dark:placeholder:text-stone-600 font-japanese tracking-tight"
            />
            <div className="flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400 mt-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Cập nhật: {formatDate(lastSavedAt)}
              </span>
              <span>•</span>
              <span>{doc.blocks.length} khối nội dung</span>
            </div>
          </div>

          {/* Danh sách các khối nội dung (Block Editor) */}
          <div className="space-y-3">
            {doc.blocks.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-slate-200 rounded-xl">
                <p className="text-sm text-slate-500 mb-3">
                  Tài liệu đang trống. Hãy thêm khối nội dung đầu tiên!
                </p>
                <AddBlockMenu onAddBlock={(type) => handleAddBlock(type)} />
              </div>
            ) : (
              doc.blocks.map((block, idx) => (
                <BlockWrapper
                  key={block.id}
                  block={block}
                  index={idx}
                  totalBlocks={doc.blocks.length}
                  onMoveUp={() => handleMoveUp(idx)}
                  onMoveDown={() => handleMoveDown(idx)}
                  onDuplicate={() => handleDuplicate(idx)}
                  onDelete={() => handleDeleteBlock(idx)}
                  onAddBlockBelow={(type) => handleAddBlock(type, idx)}
                >
                  <BlockRenderer
                    block={block}
                    onChange={(newContent) => handleBlockChange(block.id, newContent)}
                    onToggleListType={() => handleToggleListType(idx)}
                  />
                </BlockWrapper>
              ))
            )}
          </div>

          {/* Nút thêm khối ở cuối trang */}
          {doc.blocks.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center">
              <AddBlockMenu onAddBlock={(type) => handleAddBlock(type)} />
            </div>
          )}
        </div>
      </main>

      {/* Modal Lưu thành mẫu */}
      <SaveAsTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        documentTitle={doc.title}
        blocks={doc.blocks}
        onSaveTemplate={onSaveAsTemplate}
      />
    </div>
  );
}
