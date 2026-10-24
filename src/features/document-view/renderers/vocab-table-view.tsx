"use client";

import * as React from "react";
import { VocabTableContent } from "@/types/block";
import { renderFormattedContent } from "@/components/ui/rich-text-editor";
import { BookOpen } from "lucide-react";

interface VocabTableViewProps {
  content: VocabTableContent;
}

export function VocabTableView({ content }: VocabTableViewProps) {
  const rows = content.rows || [];

  return (
    <div className="my-6 space-y-2">
      {content.title && (
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span>{content.title}</span>
          <span className="text-xs font-normal text-slate-400">({rows.length} từ)</span>
        </h4>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold">
              <th className="py-2.5 px-3 w-10 text-center text-slate-400">#</th>
              <th className="py-2.5 px-3.5 w-[22%]">Từ vựng / Kanji</th>
              <th className="py-2.5 px-3.5 w-[22%]">Cách đọc (Kana)</th>
              <th className="py-2.5 px-3.5 w-[26%]">Ý nghĩa</th>
              <th className="py-2.5 px-3.5">Câu ví dụ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((row, idx) => (
              <tr
                key={row.id}
                className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-[11px]">
                  {idx + 1}
                </td>
                <td className="py-2.5 px-3.5 font-japanese font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {renderFormattedContent(row.kanji)}
                </td>
                <td className="py-2.5 px-3.5 font-japanese text-indigo-700 dark:text-indigo-400 font-medium">
                  {row.reading}
                </td>
                <td className="py-2.5 px-3.5 text-slate-700 dark:text-slate-300">
                  {row.meaning}
                </td>
                <td className="py-2.5 px-3.5 font-japanese text-slate-600 dark:text-slate-400">
                  {renderFormattedContent(row.example || "")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
