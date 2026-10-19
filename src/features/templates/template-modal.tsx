"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { DocumentTemplate } from "@/types/template";
import { Sparkles, FileText, BookOpen, Layers, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: DocumentTemplate[];
  onSelectTemplate: (template: DocumentTemplate) => void;
  onDeleteCustomTemplate?: (templateId: string) => void;
}

export function TemplateModal({
  isOpen,
  onClose,
  templates,
  onSelectTemplate,
  onDeleteCustomTemplate,
}: TemplateModalProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<"all" | "japanese" | "general" | "custom">("all");

  const filteredTemplates = templates.filter((tpl) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "custom") return tpl.isCustom;
    return tpl.category === selectedCategory && !tpl.isCustom;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chọn mẫu tài liệu khởi đầu"
      description="Tạo nhanh tài liệu mới từ các khuôn mẫu có sẵn hoặc mẫu do bạn tự lưu."
      maxWidth="lg"
      footer={
        <Button variant="outline" size="sm" onClick={onClose}>
          Đóng
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Bộ lọc phân loại mẫu */}
        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
          {[
            { id: "all", label: "Tất cả mẫu" },
            { id: "japanese", label: "Mẫu tiếng Nhật" },
            { id: "general", label: "Mẫu tổng quát" },
            { id: "custom", label: "Mẫu của tôi" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id as any)}
              className={cn(
                "px-3 py-1 text-xs rounded-lg font-medium transition-colors",
                selectedCategory === cat.id
                  ? "bg-indigo-600 text-white font-semibold shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Danh sách thẻ mẫu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/20 shadow-2xs transition-all flex flex-col justify-between group cursor-pointer"
              onClick={() => {
                onSelectTemplate(tpl);
                onClose();
              }}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {tpl.isCustom ? (
                      <Layers className="w-4 h-4 text-purple-600" />
                    ) : tpl.category === "japanese" ? (
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <FileText className="w-4 h-4 text-slate-500" />
                    )}
                    <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {tpl.name}
                    </span>
                  </div>

                  {tpl.isCustom && onDeleteCustomTemplate && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCustomTemplate(tpl.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                      title="Xóa mẫu này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {tpl.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-400">
                <span>{tpl.blocks.length} khối nội dung</span>
                <span className="text-indigo-600 font-semibold group-hover:underline">
                  Sử dụng mẫu này →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
