"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { DocumentTemplate } from "@/types/template";
import { Sparkles, FileText, Layers, Trash2 } from "lucide-react";
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
        <div className="flex items-center gap-1.5 border-b border-stone-200 dark:border-stone-800 pb-2.5">
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
                  ? "bg-primary-600 dark:bg-primary-500 text-white font-semibold shadow-xs"
                  : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
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
              className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-primary-400 dark:hover:border-primary-600 bg-white dark:bg-stone-900 hover:bg-primary-50/20 dark:hover:bg-primary-950/20 shadow-2xs transition-all flex flex-col justify-between group cursor-pointer"
              onClick={() => {
                onSelectTemplate(tpl);
                onClose();
              }}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {tpl.isCustom ? (
                      <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    ) : tpl.category === "japanese" ? (
                      <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    ) : (
                      <FileText className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                    )}
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
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
                      className="p-1 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded"
                      title="Xóa mẫu này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                  {tpl.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800 text-[10px] text-stone-400 dark:text-stone-500">
                <span>{tpl.blocks.length} khối nội dung</span>
                <span className="text-primary-600 dark:text-primary-400 font-semibold group-hover:underline">
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
