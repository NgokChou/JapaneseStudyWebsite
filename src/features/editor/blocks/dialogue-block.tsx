"use client";

import * as React from "react";
import { DialogueContent, DialogueLine } from "@/types/block";
import { Plus, Trash2, MessageSquare } from "lucide-react";

interface DialogueBlockProps {
  content: DialogueContent;
  onChange: (content: DialogueContent) => void;
}

export function DialogueBlock({ content, onChange }: DialogueBlockProps) {
  const lines = content.lines || [];

  const handleAddLine = () => {
    const newLine: DialogueLine = {
      id: "dl_" + Math.random().toString(36).substring(2, 8),
      speaker: lines.length % 2 === 0 ? "A" : "B",
      japanese: "",
      reading: "",
      vietnamese: "",
    };
    onChange({ ...content, lines: [...lines, newLine] });
  };

  const handleUpdateLine = (id: string, field: keyof DialogueLine, val: string) => {
    const updated = lines.map((l) => (l.id === id ? { ...l, [field]: val } : l));
    onChange({ ...content, lines: updated });
  };

  const handleDeleteLine = (id: string) => {
    onChange({ ...content, lines: lines.filter((l) => l.id !== id) });
  };

  return (
    <div className="space-y-3 p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-600" />
          <input
            type="text"
            value={content.title || ""}
            onChange={(e) => onChange({ ...content, title: e.target.value })}
            placeholder="Tiêu đề đoạn hội thoại (ví dụ: Hội thoại chào hỏi)..."
            className="text-sm font-bold text-slate-800 bg-transparent border-0 focus:outline-none p-0"
          />
        </div>
        <span className="text-xs text-slate-400">{lines.length} lượt lời</span>
      </div>

      <div className="space-y-3">
        {lines.map((line) => (
          <div key={line.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50/70 hover:bg-slate-50 transition-colors group/diagLine">
            {/* Tên người nói */}
            <input
              type="text"
              value={line.speaker}
              onChange={(e) => handleUpdateLine(line.id, "speaker", e.target.value)}
              placeholder="Người nói"
              className="w-24 shrink-0 text-xs font-bold text-indigo-700 bg-white border border-slate-200 rounded px-2 py-1 text-center"
            />

            {/* Nội dung đối thoại */}
            <div className="flex-1 space-y-1">
              <input
                type="text"
                value={line.japanese}
                onChange={(e) => handleUpdateLine(line.id, "japanese", e.target.value)}
                placeholder="Câu tiếng Nhật..."
                className="w-full bg-transparent border-0 focus:outline-none text-xs font-medium text-slate-900 font-japanese"
              />
              <input
                type="text"
                value={line.reading || ""}
                onChange={(e) => handleUpdateLine(line.id, "reading", e.target.value)}
                placeholder="Cách đọc kana (nếu cần)..."
                className="w-full bg-transparent border-0 focus:outline-none text-[11px] text-slate-500 font-japanese"
              />
              <input
                type="text"
                value={line.vietnamese || ""}
                onChange={(e) => handleUpdateLine(line.id, "vietnamese", e.target.value)}
                placeholder="Bản dịch tiếng Việt..."
                className="w-full bg-transparent border-0 focus:outline-none text-[11px] text-slate-600 italic"
              />
            </div>

            <button
              type="button"
              onClick={() => handleDeleteLine(line.id)}
              className="text-slate-300 hover:text-rose-600 p-1 opacity-0 group-hover/diagLine:opacity-100 transition-opacity"
              title="Xóa lượt lời này"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddLine}
        className="w-full py-1.5 border border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 rounded-lg text-xs font-medium text-slate-600 hover:text-indigo-600 flex items-center justify-center gap-1.5 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Thêm lượt lời mới</span>
      </button>
    </div>
  );
}
