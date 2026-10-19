"use client";

import * as React from "react";
import { ParagraphContent } from "@/types/block";
import { cn } from "@/lib/utils";
import { Eye, Edit3, Sparkles } from "lucide-react";

interface ParagraphBlockProps {
  content: ParagraphContent;
  onChange: (content: ParagraphContent) => void;
}

/**
 * Phân tích cú pháp Furigana dạng [漢字|かんじ] thành các phần tử React <ruby>
 */
export function renderFuriganaText(text: string) {
  if (!text) return null;
  const regex = /\[([^\|\]]+)\|([^\]]+)\]/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const kanji = match[1];
    const reading = match[2];
    parts.push(
      <ruby key={`${match.index}-${kanji}`} className="font-japanese mx-0.5 font-medium text-slate-900">
        {kanji}
        <rt className="text-indigo-600 font-semibold">{reading}</rt>
      </ruby>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

export function ParagraphBlock({ content, onChange }: ParagraphBlockProps) {
  const [isPreview, setIsPreview] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Tự động co giãn chiều cao theo nội dung
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 60)}px`;
    }
  }, [content.text, isPreview]);

  const handleInsertFuriganaSample = () => {
    const insert = "[漢字|かんじ]";
    const current = content.text || "";
    onChange({ text: current + (current ? " " : "") + insert });
    setIsPreview(false);
  };

  return (
    <div className="space-y-1.5 group/para">
      <div className="flex items-center justify-between text-xs text-slate-400 opacity-60 group-hover/para:opacity-100 transition-opacity">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleInsertFuriganaSample}
            className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded transition-colors"
            title="Thêm cú pháp Furigana: [Hán tự|cách đọc]"
          >
            <Sparkles className="w-3 h-3" />
            <span>Chèn [Hán tự|kana]</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 px-2 py-0.5 rounded hover:bg-slate-100 transition-colors"
        >
          {isPreview ? (
            <>
              <Edit3 className="w-3 h-3" />
              <span>Chỉnh sửa văn bản</span>
            </>
          ) : (
            <>
              <Eye className="w-3 h-3" />
              <span>Xem trước Furigana</span>
            </>
          )}
        </button>
      </div>

      {isPreview ? (
        <div
          onClick={() => setIsPreview(false)}
          className="w-full min-h-[60px] p-2.5 rounded-lg bg-slate-50/60 border border-transparent hover:border-slate-200 transition-colors cursor-text text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-japanese"
        >
          {content.text ? (
            renderFuriganaText(content.text)
          ) : (
            <span className="text-slate-400 italic">Đoạn văn trống. Nhấn để nhập nội dung...</span>
          )}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={content.text}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Nhập nội dung đoạn văn, ghi chú hoặc câu ví dụ... (Dùng [漢字|かんじ] để hiện Furigana)"
          className="w-full p-2 text-sm leading-relaxed bg-transparent border-0 border-b border-transparent hover:border-slate-200 focus:border-indigo-500 focus:outline-none resize-none transition-colors text-slate-800 placeholder:text-slate-400 font-japanese"
        />
      )}
    </div>
  );
}
