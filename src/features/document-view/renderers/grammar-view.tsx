"use client";

import * as React from "react";
import { GrammarContent } from "@/types/block";
import { renderFormattedContent } from "@/components/ui/rich-text-editor";
import { ChevronRight, ChevronDown, Sparkles, BookOpen, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface GrammarViewProps {
  content: GrammarContent;
}

export function GrammarView({ content }: GrammarViewProps) {
  // Trạng thái thu gọn/mở rộng ví dụ (mặc định đóng, chỉ là UI state)
  const [isExamplesOpen, setIsExamplesOpen] = React.useState(false);

  const examples = content.examples || [];
  const structureRows = content.structureRows || [];
  const showStructure = content.showStructure !== false;
  const showExplanation = content.showExplanation !== false && Boolean(content.explanation);
  const showNotes = content.showNotes !== false && Boolean(content.notes);
  const showExamples = content.showExamples !== false && examples.length > 0;

  return (
    <div className="my-6 rounded-2xl border border-indigo-200/90 dark:border-indigo-900/60 bg-white dark:bg-slate-900/90 shadow-sm overflow-hidden transition-all">
      {/* 1. Header mẫu ngữ pháp & Ý nghĩa */}
      <div className="bg-gradient-to-r from-indigo-50/80 via-white to-indigo-50/30 dark:from-indigo-950/40 dark:via-slate-900 dark:to-indigo-950/20 p-4 sm:p-5 border-b border-indigo-100 dark:border-indigo-950/80">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-100/70 dark:bg-indigo-950 px-2 py-0.5 rounded">
              Ngữ pháp
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-indigo-950 dark:text-indigo-100 font-japanese tracking-tight">
              {content.pattern}
            </h3>
          </div>

          {content.meaning && (
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              <span className="text-slate-400 font-normal mr-1">Ý nghĩa:</span>
              {content.meaning}
            </p>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        {/* 2. Cấu trúc ngữ pháp */}
        {showStructure && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Cấu trúc kết hợp</span>
            </h4>

            {/* Kiểu A: Bảng cấu trúc kết hợp có ngoặc gom nhóm */}
            {content.structureType === "table_grouped" && structureRows.length > 0 && (
              <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3 sm:p-4">
                {/* Bảng loại từ */}
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-200/70 dark:border-slate-700 text-slate-400 text-left">
                        <th className="py-1 px-3 w-[35%] font-semibold">Loại từ</th>
                        <th className="py-1 px-3 w-[45%] font-semibold">Cách kết hợp</th>
                        <th className="py-1 px-3 font-semibold">Lưu ý</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {structureRows.map((row) => (
                        <tr key={row.id}>
                          <td className="py-2 px-3 font-bold text-slate-700 dark:text-slate-300">
                            {row.wordType}
                          </td>
                          <td className="py-2 px-3 font-japanese font-semibold text-indigo-900 dark:text-indigo-200">
                            {row.form}
                          </td>
                          <td className="py-2 px-3 text-slate-500 text-[11px] italic">
                            {row.note}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Dấu ngoặc nhọn gom nhóm bên phải */}
                <div className="flex items-center justify-center px-4 py-2 border-t sm:border-t-0 sm:border-l border-slate-200/60 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-4xl sm:text-5xl text-indigo-500 dark:text-indigo-400 font-light select-none">
                      &#125;
                    </span>
                    <div className="text-center font-japanese">
                      <span className="text-xs font-bold text-slate-400 block">+</span>
                      <span className="text-lg sm:text-xl font-black text-indigo-700 dark:text-indigo-300">
                        {content.targetPattern || content.pattern}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Các kiểu cấu trúc khác (Công thức) */}
            {content.structureType !== "table_grouped" && content.formula && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-indigo-800 dark:text-indigo-300 font-japanese">
                {content.formula}
              </div>
            )}
          </div>
        )}

        {/* 3. Giải thích cách dùng */}
        {showExplanation && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Giải thích & Ngữ cảnh</span>
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-50/60 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-japanese whitespace-pre-wrap">
              {renderFormattedContent(content.explanation || "")}
            </div>
          </div>
        )}

        {/* 4. Lưu ý / Ngoại lệ */}
        {showNotes && (
          <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/60 text-xs sm:text-sm space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Lưu ý & Điểm dễ nhầm lẫn</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-5 font-japanese whitespace-pre-wrap">
              {renderFormattedContent(content.notes || "")}
            </p>
          </div>
        )}

        {/* 5. PHẦN VÍ DỤ TƯƠNG TÁC (Interactive Expandable Examples) */}
        {showExamples && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            {/* Nút bấm thu gọn / mở rộng ví dụ */}
            <button
              type="button"
              onClick={() => setIsExamplesOpen(!isExamplesOpen)}
              className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 py-1.5 px-3 rounded-lg hover:bg-indigo-50/70 dark:hover:bg-slate-800/60 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              aria-expanded={isExamplesOpen}
            >
              {isExamplesOpen ? (
                <ChevronDown className="w-4 h-4 transition-transform text-indigo-600 dark:text-indigo-400" />
              ) : (
                <ChevronRight className="w-4 h-4 transition-transform text-indigo-600 dark:text-indigo-400" />
              )}
              <span>
                {isExamplesOpen ? "▾ Thu gọn ví dụ" : "▸ Xem ví dụ"} ({examples.length})
              </span>
            </button>

            {/* Danh sách câu ví dụ khi mở rộng */}
            {isExamplesOpen && (
              <div className="mt-3 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200 pl-1">
                {examples.map((ex, idx) => (
                  <div
                    key={ex.id}
                    className="p-3 sm:p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/70 space-y-1 transition-all"
                  >
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="flex-1 space-y-0.5">
                        {/* Câu tiếng Nhật có Furigana */}
                        <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 font-japanese leading-relaxed">
                          {renderFormattedContent(ex.japanese)}
                        </div>

                        {/* Cách đọc Kana nếu có */}
                        {ex.reading && (
                          <div className="text-xs text-indigo-600 dark:text-indigo-400 font-japanese">
                            {ex.reading}
                          </div>
                        )}

                        {/* Nghĩa tiếng Việt */}
                        {ex.vietnamese && (
                          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic pt-0.5">
                            {ex.vietnamese}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
