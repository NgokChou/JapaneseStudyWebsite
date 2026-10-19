"use client";

import * as React from "react";
import { ListContent } from "@/types/block";
import { Plus, Trash2, List, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListBlockProps {
  content: ListContent;
  isNumbered?: boolean;
  onChange: (content: ListContent) => void;
  onToggleType?: () => void;
}

export function ListBlock({ content, isNumbered = false, onChange, onToggleType }: ListBlockProps) {
  const items = content.items?.length ? content.items : [""];

  const handleUpdateItem = (index: number, val: string) => {
    const updated = [...items];
    updated[index] = val;
    onChange({ items: updated });
  };

  const handleAddItem = (afterIndex?: number) => {
    const updated = [...items];
    const insertAt = afterIndex !== undefined ? afterIndex + 1 : updated.length;
    updated.splice(insertAt, 0, "");
    onChange({ items: updated });
  };

  const handleDeleteItem = (index: number) => {
    if (items.length <= 1) {
      onChange({ items: [""] });
      return;
    }
    const updated = items.filter((_, idx) => idx !== index);
    onChange({ items: updated });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddItem(index);
    } else if (e.key === "Backspace" && items[index] === "" && items.length > 1) {
      e.preventDefault();
      handleDeleteItem(index);
    }
  };

  return (
    <div className="space-y-1.5 group/list">
      {onToggleType && (
        <div className="flex items-center gap-2 opacity-60 group-hover/list:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={onToggleType}
            className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded transition-colors"
          >
            {isNumbered ? (
              <>
                <List className="w-3 h-3" />
                <span>Chuyển sang danh sách chấm tròn</span>
              </>
            ) : (
              <>
                <ListOrdered className="w-3 h-3" />
                <span>Chuyển sang danh sách đánh số</span>
              </>
            )}
          </button>
        </div>
      )}

      <div className="space-y-1 pl-1">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 group/item">
            <span className={cn(
              "shrink-0 text-xs font-semibold select-none",
              isNumbered ? "w-5 text-indigo-600 font-mono text-right" : "text-slate-400 pl-1"
            )}>
              {isNumbered ? `${idx + 1}.` : "•"}
            </span>

            <input
              type="text"
              value={item}
              onChange={(e) => handleUpdateItem(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              placeholder="Nhập nội dung mục (Nhấn Enter để xuống dòng mới)..."
              className="flex-1 bg-transparent border-0 border-b border-transparent hover:border-slate-200 focus:border-indigo-500 focus:outline-none py-1 text-sm text-slate-800 font-japanese transition-colors"
            />

            <button
              type="button"
              onClick={() => handleDeleteItem(idx)}
              className="text-slate-300 hover:text-rose-600 p-1 opacity-0 group-hover/item:opacity-100 transition-opacity"
              title="Xóa mục này"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => handleAddItem()}
        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 pl-6 pt-1 transition-colors"
      >
        <Plus className="w-3 h-3" />
        <span>Thêm mục mới</span>
      </button>
    </div>
  );
}
