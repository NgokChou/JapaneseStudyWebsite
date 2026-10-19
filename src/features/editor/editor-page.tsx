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
import {
  ArrowLeft,
  Save,
  Check,
  BookmarkPlus,
  Eye,
  Edit2,
  Calendar,
  Sparkles,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

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
  const [saveStatus, setSaveStatus] = React.useState<"saved" | "unsaved" | "saving">("saved");
  const [isTemplateModalOpen, setIsTemplateModalOpen] = React.useState(false);

  // Cập nhật tiêu đề tài liệu
  const handleTitleChange = (newTitle: string) => {
    setDoc((prev) => ({ ...prev, title: newTitle, updatedAt: Date.now() }));
    setIsDirty(true);
    setSaveStatus("unsaved");
  };

  // Cập nhật nội dung một khối
  const handleBlockChange = (blockId: string, newContent: any) => {
    setDoc((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === blockId ? { ...b, content: newContent } : b)),
      updatedAt: Date.now(),
    }));
    setIsDirty(true);
    setSaveStatus("unsaved");
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
    setSaveStatus("unsaved");
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
    setSaveStatus("unsaved");
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
    setSaveStatus("unsaved");
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
    setSaveStatus("unsaved");
  };

  // Xóa khối
  const handleDeleteBlock = (index: number) => {
    setDoc((prev) => {
      const updated = prev.blocks.filter((_, idx) => idx !== index);
      return { ...prev, blocks: updated, updatedAt: Date.now() };
    });
    setIsDirty(true);
    setSaveStatus("unsaved");
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
    setSaveStatus("unsaved");
  };

  // Lưu tài liệu
  const handleSave = () => {
    setSaveStatus("saving");
    setTimeout(() => {
      onSave(doc);
      setIsDirty(false);
      setSaveStatus("saved");
    }, 250);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          {/* Nút quay lại & Thư mục cha */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Quay lại:</span>
              <span className="text-indigo-600 font-bold truncate max-w-[120px] sm:max-w-none">
                {folderName}
              </span>
            </button>
          </div>

          {/* Trạng thái lưu & Các hành động */}
          <div className="flex items-center gap-2.5">
            {/* Save status badge */}
            <div className="text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 font-medium">
              {saveStatus === "saved" && (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Đã lưu</span>
                </>
              )}
              {saveStatus === "unsaved" && (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-amber-700">Chưa lưu thay đổi</span>
                </>
              )}
              {saveStatus === "saving" && <span>Đang lưu...</span>}
            </div>

            {/* Lưu thành mẫu */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTemplateModalOpen(true)}
              className="text-xs gap-1 hidden sm:inline-flex"
              title="Lưu cấu trúc tài liệu này thành mẫu tái sử dụng"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-indigo-600" />
              <span>Lưu thành mẫu</span>
            </Button>

            {/* Nút lưu chính */}
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              className="text-xs gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu tài liệu</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Editor Main Canvas (Rộng rãi, thoáng đãng kiểu Notion/WordPress) */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-12 min-h-[75vh]">
          {/* Tiêu đề tài liệu có thể chỉnh sửa trực tiếp (Inline Title) */}
          <div className="mb-8 pb-4 border-b border-slate-100">
            <input
              type="text"
              value={doc.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Nhập tên tài liệu ở đây..."
              className="w-full text-2xl sm:text-4xl font-extrabold text-slate-900 bg-transparent border-0 focus:outline-none placeholder:text-slate-300 font-japanese tracking-tight"
            />
            <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Cập nhật: {formatDate(doc.updatedAt)}
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
