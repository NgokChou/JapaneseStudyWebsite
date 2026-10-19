"use client";

import * as React from "react";
import { CalloutContent } from "@/types/block";
import { Lightbulb, Info, AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalloutBlockProps {
  content: CalloutContent;
  onChange: (content: CalloutContent) => void;
}

export function CalloutBlock({ content, onChange }: CalloutBlockProps) {
  const styles = {
    info: {
      bg: "bg-sky-50/70 border-sky-200 text-sky-900",
      icon: <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />,
      label: "Thông tin",
    },
    tip: {
      bg: "bg-emerald-50/70 border-emerald-200 text-emerald-900",
      icon: <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
      label: "Mẹo học",
    },
    warning: {
      bg: "bg-amber-50/70 border-amber-200 text-amber-900",
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
      label: "Lưu ý",
    },
    japanese: {
      bg: "bg-indigo-50/70 border-indigo-200 text-indigo-950",
      icon: <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />,
      label: "Điểm nhấn",
    },
  };

  const currentStyle = styles[content.variant] || styles.info;

  return (
    <div className={cn("p-4 rounded-xl border transition-all space-y-2 group/callout", currentStyle.bg)}>
      {/* Thanh chọn kiểu callout */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          {currentStyle.icon}
          <input
            type="text"
            value={content.title || ""}
            onChange={(e) => onChange({ ...content, title: e.target.value })}
            placeholder="Tiêu đề hộp ghi chú (tùy chọn)..."
            className="font-bold text-sm bg-transparent border-0 focus:outline-none focus:ring-0 p-0 text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-1 opacity-60 group-hover/callout:opacity-100 transition-opacity">
          {(["info", "tip", "warning", "japanese"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onChange({ ...content, variant: v })}
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-medium transition-colors",
                content.variant === v
                  ? "bg-white shadow-xs font-bold text-slate-900"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
              )}
            >
              {styles[v].label}
            </button>
          ))}
        </div>
      </div>

      {/* Nội dung ghi chú */}
      <textarea
        value={content.text}
        onChange={(e) => onChange({ ...content, text: e.target.value })}
        rows={2}
        placeholder="Nhập nội dung ghi chú, giải thích hoặc công thức ngữ pháp..."
        className="w-full bg-transparent border-0 focus:outline-none text-xs leading-relaxed text-slate-700 placeholder:text-slate-400 resize-none font-japanese"
      />
    </div>
  );
}
