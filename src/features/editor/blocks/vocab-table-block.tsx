"use client";

import * as React from "react";
import { VocabTableContent, VocabRow } from "@/types/block";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VocabTableBlockProps {
  content: VocabTableContent;
  onChange: (content: VocabTableContent) => void;
}

export function VocabTableBlock({ content, onChange }: VocabTableBlockProps) {
  const handleAddRow = () => {
    const newRow: VocabRow = {
      id: "vr_" + Math.random().toString(36).substring(2, 8),
      kanji: "",
      reading: "",
      meaning: "",
      example: "",
    };
    onChange({
      ...content,
      rows: [...content.rows, newRow],
    });
  };

  const handleUpdateRow = (id: string, field: keyof VocabRow, value: string) => {
    const updated = content.rows.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    onChange({ ...content, rows: updated });
  };

  const handleDeleteRow = (id: string) => {
    onChange({
      ...content,
      rows: content.rows.filter((row) => row.id !== id),
    });
  };

  return (
    <div className="space-y-3">
      {/* Tiêu đề bảng */}
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={content.title || ""}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          placeholder="Tiêu đề bảng từ vựng (ví dụ: Từ vựng Bài 1)..."
          className="text-sm font-bold text-slate-800 bg-transparent border-0 border-b border-transparent hover:border-slate-200 focus:border-indigo-500 focus:outline-none py-1 w-full max-w-sm"
        />
        <span className="text-xs text-slate-400 font-medium">
          {content.rows.length} từ
        </span>
      </div>

      {/* Bảng dữ liệu */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <th className="py-2.5 px-3 w-10 text-center text-slate-400">#</th>
              <th className="py-2.5 px-3 w-[22%]">Từ vựng / Kanji</th>
              <th className="py-2.5 px-3 w-[22%]">Cách đọc (Kana)</th>
              <th className="py-2.5 px-3 w-[26%]">Ý nghĩa tiếng Việt</th>
              <th className="py-2.5 px-3">Câu ví dụ</th>
              <th className="py-2.5 px-2 w-10 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {content.rows.map((row, idx) => (
              <tr key={row.id} className="hover:bg-slate-50/70 group/row transition-colors">
                <td className="py-2 px-3 text-center text-slate-400 font-mono text-[11px]">
                  {idx + 1}
                </td>
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={row.kanji}
                    onChange={(e) => handleUpdateRow(row.id, "kanji", e.target.value)}
                    placeholder="Ví dụ: 私, 先生..."
                    className="w-full bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1.5 py-1 font-japanese font-medium text-slate-900"
                  />
                </td>
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={row.reading}
                    onChange={(e) => handleUpdateRow(row.id, "reading", e.target.value)}
                    placeholder="わたし, せんせい..."
                    className="w-full bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1.5 py-1 font-japanese text-indigo-700"
                  />
                </td>
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={row.meaning}
                    onChange={(e) => handleUpdateRow(row.id, "meaning", e.target.value)}
                    placeholder="Tôi, giáo viên..."
                    className="w-full bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1.5 py-1 text-slate-700"
                  />
                </td>
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={row.example || ""}
                    onChange={(e) => handleUpdateRow(row.id, "example", e.target.value)}
                    placeholder="わたしは学生です..."
                    className="w-full bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1.5 py-1 font-japanese text-slate-600"
                  />
                </td>
                <td className="py-2 px-2 text-center">
                  <button
                    type="button"
                    onClick={() => handleDeleteRow(row.id)}
                    className="p-1 text-slate-300 hover:text-rose-600 rounded opacity-0 group-hover/row:opacity-100 transition-opacity"
                    title="Xóa dòng"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Nút thêm dòng */}
      <button
        type="button"
        onClick={handleAddRow}
        className="w-full py-2 border border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 rounded-lg text-xs font-medium text-slate-600 hover:text-indigo-600 flex items-center justify-center gap-1.5 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Thêm từ mới vào bảng</span>
      </button>
    </div>
  );
}
