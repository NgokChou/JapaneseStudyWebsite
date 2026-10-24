"use client";

import * as React from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  Palette,
  Sparkles,
  RemoveFormatting,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Phân tích cú pháp Furigana [漢字|かんじ] và các thẻ định dạng inline an toàn (b, i, u, s, span style, mark)
 */
export function renderFormattedContent(text: string) {
  if (!text) return null;

  // Xử lý regex Furigana [Hán tự|kana] trước
  const furiganaRegex = /\[([^\|\]]+)\|([^\]]+)\]/g;

  // Nếu chứa thẻ HTML định dạng
  const hasHtml = /<[a-z][\s\S]*>/i.test(text);

  if (hasHtml) {
    // Thay thế cú pháp furigana trong html string thành <ruby>
    const processedHtml = text.replace(furiganaRegex, (_match, kanji, reading) => {
      return `<ruby class="font-japanese mx-0.5 font-medium">${kanji}<rt class="text-indigo-600 dark:text-indigo-400 font-semibold">${reading}</rt></ruby>`;
    });

    return (
      <span
        dangerouslySetInnerHTML={{ __html: processedHtml }}
        className="font-japanese leading-relaxed"
      />
    );
  }

  // Trường hợp plain text có Furigana
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = furiganaRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const kanji = match[1];
    const reading = match[2];
    parts.push(
      <ruby key={`${match.index}-${kanji}`} className="font-japanese mx-0.5 font-medium">
        {kanji}
        <rt className="text-indigo-600 dark:text-indigo-400 font-semibold">{reading}</rt>
      </ruby>
    );
    lastIndex = furiganaRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

interface RichTextToolbarProps {
  onCommand: (command: string, value?: string) => void;
  onInsertFurigana: () => void;
  className?: string;
}

export function RichTextToolbar({ onCommand, onInsertFurigana, className }: RichTextToolbarProps) {
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = React.useState(false);

  const colors = [
    { label: "Mặc định", value: "inherit", bg: "bg-slate-700" },
    { label: "Tím xanh", value: "#6366f1", bg: "bg-indigo-500" },
    { label: "Xanh lá", value: "#10b981", bg: "bg-emerald-500" },
    { label: "Đỏ hồng", value: "#f43f5e", bg: "bg-rose-500" },
    { label: "Vàng hổ phách", value: "#f59e0b", bg: "bg-amber-500" },
    { label: "Xanh biển", value: "#0284c7", bg: "bg-sky-500" },
  ];

  const highlights = [
    { label: "Không màu", value: "transparent", bg: "border border-slate-300" },
    { label: "Vàng", value: "rgba(254, 240, 138, 0.7)", bg: "bg-yellow-200" },
    { label: "Xanh lá", value: "rgba(187, 247, 208, 0.7)", bg: "bg-emerald-200" },
    { label: "Xanh dương", value: "rgba(191, 219, 254, 0.7)", bg: "bg-blue-200" },
    { label: "Hồng", value: "rgba(254, 205, 211, 0.7)", bg: "bg-rose-200" },
    { label: "Tím", value: "rgba(233, 213, 255, 0.7)", bg: "bg-purple-200" },
  ];

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-0.5 p-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs shadow-2xs",
        className
      )}
    >
      {/* Định dạng cơ bản */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          onCommand("bold");
        }}
        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
        title="In đậm (Ctrl+B)"
      >
        <Bold className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          onCommand("italic");
        }}
        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
        title="In nghiêng (Ctrl+I)"
      >
        <Italic className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          onCommand("underline");
        }}
        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
        title="Gạch chân (Ctrl+U)"
      >
        <Underline className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          onCommand("strikeThrough");
        }}
        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
        title="Gạch ngang chữ"
      >
        <Strikethrough className="w-3.5 h-3.5" />
      </button>

      <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800 mx-1" />

      {/* Căn lề */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          onCommand("justifyLeft");
        }}
        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
        title="Căn trái"
      >
        <AlignLeft className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          onCommand("justifyCenter");
        }}
        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
        title="Căn giữa"
      >
        <AlignCenter className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          onCommand("justifyRight");
        }}
        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
        title="Căn phải"
      >
        <AlignRight className="w-3.5 h-3.5" />
      </button>

      <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800 mx-1" />

      {/* Màu chữ */}
      <div className="relative">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            setShowColorPicker(!showColorPicker);
            setShowHighlightPicker(false);
          }}
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          title="Màu chữ"
        >
          <Palette className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
        </button>

        {showColorPicker && (
          <div className="absolute left-0 mt-1 z-30 p-1.5 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 flex items-center gap-1">
            {colors.map((c) => (
              <button
                key={c.value}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onCommand("foreColor", c.value);
                  setShowColorPicker(false);
                }}
                className={cn("w-5 h-5 rounded-full transition-transform hover:scale-110", c.bg)}
                title={c.label}
              />
            ))}
          </div>
        )}
      </div>

      {/* Highlight chữ */}
      <div className="relative">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            setShowHighlightPicker(!showHighlightPicker);
            setShowColorPicker(false);
          }}
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          title="Highlight / Màu nền chữ"
        >
          <Highlighter className="w-3.5 h-3.5 text-amber-500" />
        </button>

        {showHighlightPicker && (
          <div className="absolute left-0 mt-1 z-30 p-1.5 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 flex items-center gap-1">
            {highlights.map((h) => (
              <button
                key={h.value}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onCommand("hiliteColor", h.value);
                  setShowHighlightPicker(false);
                }}
                className={cn("w-5 h-5 rounded-full transition-transform hover:scale-110", h.bg)}
                title={h.label}
              />
            ))}
          </div>
        )}
      </div>

      {/* Xóa định dạng */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          onCommand("removeFormat");
        }}
        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-600 transition-colors"
        title="Xóa định dạng"
      >
        <RemoveFormatting className="w-3.5 h-3.5" />
      </button>

      <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800 mx-1" />

      {/* Chèn Furigana nhanh */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          onInsertFurigana();
        }}
        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-semibold text-[11px] transition-colors"
        title="Chèn cú pháp Furigana: [Hán tự|cách đọc]"
      >
        <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
        <span>Furigana [漢|かん]</span>
      </button>
    </div>
  );
}

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  className,
  minHeight = "70px",
}: RichTextEditorProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [showToolbar, setShowToolbar] = React.useState(false);

  // Đồng bộ nội dung ban đầu
  React.useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== value) {
      contentRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    if (contentRef.current) {
      onChange(contentRef.current.innerHTML);
    }
  };

  const executeCommand = (command: string, val?: string) => {
    document.execCommand(command, false, val);
    handleInput();
  };

  const handleInsertFurigana = () => {
    const selection = window.getSelection();
    let textToWrap = "漢字";
    if (selection && selection.toString().trim()) {
      textToWrap = selection.toString().trim();
    }
    const snippet = `[${textToWrap}|かんじ]`;
    document.execCommand("insertText", false, snippet);
    handleInput();
  };

  return (
    <div className={cn("space-y-1.5 w-full", className)}>
      <RichTextToolbar
        onCommand={executeCommand}
        onInsertFurigana={handleInsertFurigana}
        className={cn("transition-opacity duration-150", showToolbar ? "opacity-100" : "opacity-70 hover:opacity-100")}
      />

      <div
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={() => setShowToolbar(true)}
        onBlur={() => {
          handleInput();
        }}
        data-placeholder={placeholder}
        style={{ minHeight }}
        className="w-full p-2.5 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 focus:outline-none transition-all text-sm leading-relaxed text-slate-800 dark:text-slate-100 font-japanese empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 dark:empty:before:text-slate-600 empty:before:pointer-events-none"
      />
    </div>
  );
}
