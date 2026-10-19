"use client";

import * as React from "react";
import { HeadingContent } from "@/types/block";
import { cn } from "@/lib/utils";

interface HeadingBlockProps {
  content: HeadingContent;
  onChange: (content: HeadingContent) => void;
}

export function HeadingBlock({ content, onChange }: HeadingBlockProps) {
  const fontSizes = {
    1: "text-2xl sm:text-3xl font-extrabold text-slate-900",
    2: "text-xl sm:text-2xl font-bold text-slate-800",
    3: "text-lg sm:text-xl font-semibold text-slate-800",
  };

  return (
    <div className="space-y-2 group/heading">
      <div className="flex items-center gap-1.5 opacity-60 group-hover/heading:opacity-100 transition-opacity">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Cấp tiêu đề:</span>
        <div className="inline-flex rounded-md bg-slate-100 p-0.5 text-xs font-medium">
          {([1, 2, 3] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => onChange({ ...content, level: lvl })}
              className={cn(
                "px-2 py-0.5 rounded transition-all",
                content.level === lvl
                  ? "bg-white text-indigo-600 shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              H{lvl}
            </button>
          ))}
        </div>
      </div>

      <input
        type="text"
        value={content.text}
        onChange={(e) => onChange({ ...content, text: e.target.value })}
        placeholder={`Nhập tiêu đề H${content.level}...`}
        className={cn(
          "w-full bg-transparent border-0 border-b border-transparent hover:border-slate-200 focus:border-indigo-500 focus:outline-none py-1 transition-colors font-japanese",
          fontSizes[content.level]
        )}
      />
    </div>
  );
}
