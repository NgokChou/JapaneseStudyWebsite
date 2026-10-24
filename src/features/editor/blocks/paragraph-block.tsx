"use client";

import * as React from "react";
import { ParagraphContent } from "@/types/block";
import { RichTextEditor, renderFormattedContent } from "@/components/ui/rich-text-editor";
import { Eye, Edit3 } from "lucide-react";

// Tương thích ngược với các file import renderFuriganaText
export const renderFuriganaText = renderFormattedContent;

interface ParagraphBlockProps {
  content: ParagraphContent;
  onChange: (content: ParagraphContent) => void;
}

export function ParagraphBlock({ content, onChange }: ParagraphBlockProps) {
  const [isPreview, setIsPreview] = React.useState(false);

  return (
    <div className="space-y-1.5 group/para">
      <div className="flex items-center justify-end text-xs text-slate-400 opacity-60 group-hover/para:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 px-2 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isPreview ? (
            <>
              <Edit3 className="w-3 h-3" />
              <span>Chỉnh sửa văn bản</span>
            </>
          ) : (
            <>
              <Eye className="w-3 h-3" />
              <span>Xem trước</span>
            </>
          )}
        </button>
      </div>

      {isPreview ? (
        <div
          onClick={() => setIsPreview(false)}
          className="w-full min-h-[60px] p-3 rounded-lg bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors cursor-text text-slate-800 dark:text-slate-100 text-sm leading-relaxed whitespace-pre-wrap font-japanese"
        >
          {content.text ? (
            renderFormattedContent(content.text)
          ) : (
            <span className="text-slate-400 italic">Đoạn văn trống. Nhấn để nhập nội dung...</span>
          )}
        </div>
      ) : (
        <RichTextEditor
          value={content.text}
          onChange={(newVal) => onChange({ text: newVal })}
          placeholder="Nhập nội dung đoạn văn, ghi chú hoặc câu ví dụ... (Bôi đen chữ để định dạng hoặc dùng [漢字|かんじ] để hiện Furigana)"
        />
      )}
    </div>
  );
}
