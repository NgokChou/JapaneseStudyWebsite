"use client";

import * as React from "react";
import { Block, BlockType } from "@/types/block";
import { ArrowUp, ArrowDown, Copy, Trash2, GripVertical } from "lucide-react";
import { AddBlockMenu } from "./add-block-menu";
import { cn } from "@/lib/utils";

interface BlockWrapperProps {
  block: Block;
  index: number;
  totalBlocks: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onAddBlockBelow: (type: BlockType) => void;
  children: React.ReactNode;
}

export function BlockWrapper({
  block,
  index,
  totalBlocks,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onAddBlockBelow,
  children,
}: BlockWrapperProps) {
  const typeLabels: Record<BlockType, string> = {
    grammar: "Ngữ pháp",
    heading: "Tiêu đề",
    paragraph: "Đoạn văn",
    vocab_table: "Bảng từ vựng",
    table: "Bảng dữ liệu",
    bullet_list: "Danh sách chấm",
    numbered_list: "Danh sách số",
    callout: "Ghi chú",
    dialogue: "Hội thoại",
  };

  return (
    <div className="relative group/block rounded-xl transition-all duration-150 p-2 sm:p-3 hover:bg-slate-50/70 dark:hover:bg-slate-900/60 border border-transparent hover:border-slate-200/80 dark:hover:border-slate-800/80 my-1">
      {/* Thanh công cụ thao tác trên khối (hiển thị khi hover) */}
      <div className="flex items-center justify-between pb-1 mb-1 border-b border-transparent group-hover/block:border-slate-100 dark:group-hover/block:border-slate-800 transition-colors">
        <div className="flex items-center gap-1.5 opacity-40 group-hover/block:opacity-100 transition-opacity">
          <GripVertical className="w-3.5 h-3.5 text-slate-400 cursor-grab" />
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-100/80 dark:bg-slate-800 px-1.5 py-0.5 rounded">
            {typeLabels[block.type] || block.type}
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover/block:opacity-100 transition-opacity">
          {/* Di chuyển lên */}
          <button
            type="button"
            disabled={index === 0}
            onClick={onMoveUp}
            className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 hover:bg-slate-200/60 rounded transition-colors"
            title="Di chuyển lên trên"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>

          {/* Di chuyển xuống */}
          <button
            type="button"
            disabled={index === totalBlocks - 1}
            onClick={onMoveDown}
            className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 hover:bg-slate-200/60 rounded transition-colors"
            title="Di chuyển xuống dưới"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>

          {/* Nhân bản */}
          <button
            type="button"
            onClick={onDuplicate}
            className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded transition-colors"
            title="Nhân bản khối này"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {/* Xóa khối */}
          <button
            type="button"
            onClick={onDelete}
            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
            title="Xóa khối này"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Nội dung khối */}
      <div className="w-full">
        {children}
      </div>

      {/* Nút thêm khối nhanh ngay bên dưới */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover/block:opacity-100 transition-opacity">
        <AddBlockMenu isInline onAddBlock={onAddBlockBelow} />
      </div>
    </div>
  );
}
