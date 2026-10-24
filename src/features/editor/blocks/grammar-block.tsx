"use client";

import * as React from "react";
import {
  GrammarContent,
  GrammarStructureType,
  GrammarStructureRow,
  GrammarExample,
} from "@/types/block";
import { Plus, Trash2, Sparkles, BookOpen, ChevronRight, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface GrammarBlockProps {
  content: GrammarContent;
  onChange: (updated: GrammarContent) => void;
}

export function GrammarBlock({ content, onChange }: GrammarBlockProps) {
  // Đảm bảo các mảng và trường cơ bản luôn tồn tại an toàn
  const structureRows = content.structureRows || [
    { id: "sr_1", wordType: "Động từ", form: "Thể thông thường", note: "" },
    { id: "sr_2", wordType: "Tính từ đuôi い", form: "Thể thông thường", note: "" },
    { id: "sr_3", wordType: "Tính từ đuôi な", form: "Thể thông thường", note: "Bỏ だ" },
    { id: "sr_4", wordType: "Danh từ", form: "～だ", note: "Bỏ だ" },
  ];

  const examples = content.examples || [];
  const structureType = content.structureType || "table_grouped";
  const showStructure = content.showStructure !== false;
  const showExplanation = content.showExplanation !== false;
  const showNotes = content.showNotes !== false;
  const showExamples = content.showExamples !== false;

  // Thao tác trên hàng cấu trúc
  const handleAddStructureRow = () => {
    const newRow: GrammarStructureRow = {
      id: "sr_" + Math.random().toString(36).substring(2, 8),
      wordType: "Động từ",
      form: "Thể thông thường",
      note: "",
    };
    onChange({
      ...content,
      structureRows: [...structureRows, newRow],
    });
  };

  const handleUpdateStructureRow = (
    id: string,
    field: keyof GrammarStructureRow,
    value: string
  ) => {
    const updated = structureRows.map((r) => (r.id === id ? { ...r, [field]: value } : r));
    onChange({ ...content, structureRows: updated });
  };

  const handleDeleteStructureRow = (id: string) => {
    if (structureRows.length <= 1) return;
    onChange({
      ...content,
      structureRows: structureRows.filter((r) => r.id !== id),
    });
  };

  // Thao tác trên câu ví dụ
  const handleAddExample = () => {
    const newEx: GrammarExample = {
      id: "ex_" + Math.random().toString(36).substring(2, 8),
      japanese: "",
      reading: "",
      vietnamese: "",
    };
    onChange({
      ...content,
      examples: [...examples, newEx],
    });
  };

  const handleUpdateExample = (id: string, field: keyof GrammarExample, value: string) => {
    const updated = examples.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex));
    onChange({ ...content, examples: updated });
  };

  const handleDeleteExample = (id: string) => {
    onChange({
      ...content,
      examples: examples.filter((ex) => ex.id !== id),
    });
  };

  return (
    <div className="space-y-4 p-4 sm:p-5 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/40 to-white dark:from-slate-900 dark:to-slate-900/90 shadow-2xs">
      {/* 1. Phần Tiêu đề mẫu ngữ pháp & Ý nghĩa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3 border-b border-indigo-100/80 dark:border-indigo-950/80">
        <div>
          <label className="block text-[11px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-1">
            Mẫu ngữ pháp (Pattern) *
          </label>
          <input
            type="text"
            value={content.pattern || ""}
            onChange={(e) => onChange({ ...content, pattern: e.target.value })}
            placeholder="Ví dụ: ～でしょう, ～ても, ～ば..."
            className="w-full text-lg sm:text-xl font-extrabold text-indigo-950 dark:text-indigo-100 bg-white dark:bg-slate-800/80 border border-indigo-200 dark:border-indigo-800/70 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-japanese"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Ý nghĩa tiếng Việt *
          </label>
          <input
            type="text"
            value={content.meaning || ""}
            onChange={(e) => onChange({ ...content, meaning: e.target.value })}
            placeholder="Ví dụ: Có lẽ..., chắc là..."
            className="w-full text-sm font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
      </div>

      {/* 2. Tùy chọn kiểu trình bày & Bật/tắt các trường */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-white/70 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-600 dark:text-slate-400">Kiểu trình bày cấu trúc:</span>
          <select
            value={structureType}
            onChange={(e) =>
              onChange({ ...content, structureType: e.target.value as GrammarStructureType })
            }
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            <option value="table_grouped">Kiểu A: Bảng cấu trúc kết hợp (Có ngoặc gom nhóm)</option>
            <option value="pattern_meaning">Kiểu B: Mẫu & Ý nghĩa</option>
            <option value="formula">Kiểu C: Cấu trúc theo công thức</option>
            <option value="case_by_case">Kiểu D: Giải thích theo từng trường hợp</option>
            <option value="combined">Kiểu E: Nội dung kết hợp toàn diện</option>
          </select>
        </div>

        {/* Bật / tắt các trường hiển thị */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showStructure}
              onChange={(e) => onChange({ ...content, showStructure: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-0"
            />
            <span>Cấu trúc</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showExplanation}
              onChange={(e) => onChange({ ...content, showExplanation: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-0"
            />
            <span>Giải thích</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showNotes}
              onChange={(e) => onChange({ ...content, showNotes: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-0"
            />
            <span>Lưu ý</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showExamples}
              onChange={(e) => onChange({ ...content, showExamples: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-0"
            />
            <span>Ví dụ</span>
          </label>
        </div>
      </div>

      {/* 3. Phần Cấu trúc ngữ pháp */}
      {showStructure && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Cấu trúc ngữ pháp</span>
            </h5>
            {structureType === "table_grouped" && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Kết quả gom nhóm:</span>
                <input
                  type="text"
                  value={content.targetPattern || ""}
                  onChange={(e) => onChange({ ...content, targetPattern: e.target.value })}
                  placeholder="Ví dụ: でしょう"
                  className="text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 rounded px-2 py-0.5 w-32 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* KIỂU A: BẢNG CẤU TRÚC KẾT HỢP (CÓ NGOẶC GOM NHÓM) */}
          {structureType === "table_grouped" && (
            <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              {/* Bảng các hàng loại từ */}
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-left">
                      <th className="py-1 px-2 w-[35%]">Loại từ</th>
                      <th className="py-1 px-2 w-[45%]">Cách kết hợp / Biến thể</th>
                      <th className="py-1 px-2">Ghi chú</th>
                      <th className="w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {structureRows.map((row) => (
                      <tr key={row.id} className="group/row">
                        <td className="py-1.5 px-2">
                          <input
                            type="text"
                            value={row.wordType}
                            onChange={(e) =>
                              handleUpdateStructureRow(row.id, "wordType", e.target.value)
                            }
                            placeholder="Động từ, Tính từ..."
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-slate-800 dark:text-slate-200 font-medium"
                          />
                        </td>
                        <td className="py-1.5 px-2">
                          <input
                            type="text"
                            value={row.form}
                            onChange={(e) =>
                              handleUpdateStructureRow(row.id, "form", e.target.value)
                            }
                            placeholder="Thể thông thường..."
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-slate-800 dark:text-slate-200 font-japanese"
                          />
                        </td>
                        <td className="py-1.5 px-2">
                          <input
                            type="text"
                            value={row.note || ""}
                            onChange={(e) =>
                              handleUpdateStructureRow(row.id, "note", e.target.value)
                            }
                            placeholder="Lưu ý..."
                            className="w-full bg-transparent border-0 text-slate-500 text-[11px] px-1 py-1"
                          />
                        </td>
                        <td className="py-1.5 px-1 text-center">
                          {structureRows.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteStructureRow(row.id)}
                              className="text-slate-300 hover:text-rose-600 p-1 opacity-0 group-hover/row:opacity-100 transition-opacity"
                              title="Xóa hàng"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button
                  type="button"
                  onClick={handleAddStructureRow}
                  className="mt-2 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold inline-flex items-center gap-1 hover:underline pl-2"
                >
                  <Plus className="w-3 h-3" />
                  <span>Thêm hàng loại từ</span>
                </button>
              </div>

              {/* Dấu ngoặc ôm gom nhóm bên phải */}
              <div className="flex items-center justify-center px-4 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-3xl text-indigo-400 dark:text-indigo-500 font-light select-none">
                    &#125;
                  </span>
                  <div className="text-center font-japanese">
                    <span className="text-xs font-bold text-slate-400 block">+</span>
                    <span className="text-base font-extrabold text-indigo-700 dark:text-indigo-400">
                      {content.targetPattern || content.pattern || "..."}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CÁC KIỂU CÒN LẠI: CÔNG THỨC HOẶC MÔ TẢ */}
          {structureType !== "table_grouped" && (
            <div>
              <input
                type="text"
                value={content.formula || ""}
                onChange={(e) => onChange({ ...content, formula: e.target.value })}
                placeholder="Ví dụ: V (thể て) + もいいです / A-い + くても..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs font-bold text-indigo-700 dark:text-indigo-400 font-japanese focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>
      )}

      {/* 4. Giải thích cách dùng */}
      {showExplanation && (
        <div>
          <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Giải thích cách dùng & Ngữ cảnh
          </label>
          <textarea
            value={content.explanation || ""}
            onChange={(e) => onChange({ ...content, explanation: e.target.value })}
            rows={2}
            placeholder="Giải thích sắc thái, ý nghĩa và trường hợp sử dụng mẫu ngữ pháp này..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-japanese leading-relaxed"
          />
        </div>
      )}

      {/* 5. Lưu ý / Ngoại lệ */}
      {showNotes && (
        <div>
          <label className="block text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            Lưu ý, ngoại lệ hoặc trường hợp dễ nhầm lẫn
          </label>
          <textarea
            value={content.notes || ""}
            onChange={(e) => onChange({ ...content, notes: e.target.value })}
            rows={2}
            placeholder="Ví dụ: Không dùng với cấp trên, phân biệt với mẫu ～かもしれない..."
            className="w-full bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/60 rounded-lg p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-japanese leading-relaxed"
          />
        </div>
      )}

      {/* 6. Danh sách ví dụ minh họa */}
      {showExamples && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Ví dụ minh họa ({examples.length})</span>
            </h5>
            <button
              type="button"
              onClick={handleAddExample}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline inline-flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Thêm câu ví dụ</span>
            </button>
          </div>

          <div className="space-y-2">
            {examples.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Chưa có câu ví dụ nào. Nhấn "+ Thêm câu ví dụ" ở trên.</p>
            ) : (
              examples.map((ex, idx) => (
                <div
                  key={ex.id}
                  className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5 relative group/ex"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Ví dụ {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteExample(ex.id)}
                      className="text-slate-300 hover:text-rose-600 p-1 opacity-0 group-hover/ex:opacity-100 transition-opacity"
                      title="Xóa ví dụ này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={ex.japanese}
                    onChange={(e) => handleUpdateExample(ex.id, "japanese", e.target.value)}
                    placeholder="Câu tiếng Nhật... (Dùng [漢字|かんじ] nếu muốn chèn Furigana)"
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-xs font-medium text-slate-900 dark:text-slate-100 font-japanese"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={ex.reading || ""}
                      onChange={(e) => handleUpdateExample(ex.id, "reading", e.target.value)}
                      placeholder="Cách đọc kana toàn câu (nếu cần)..."
                      className="w-full bg-transparent border-0 border-b border-slate-100 dark:border-slate-800 text-[11px] text-indigo-700 dark:text-indigo-400 font-japanese px-1"
                    />
                    <input
                      type="text"
                      value={ex.vietnamese}
                      onChange={(e) => handleUpdateExample(ex.id, "vietnamese", e.target.value)}
                      placeholder="Bản dịch tiếng Việt..."
                      className="w-full bg-transparent border-0 border-b border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 italic px-1"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
