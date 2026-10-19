"use client";

import * as React from "react";
import { BlockType } from "@/types/block";
import {
  Heading,
  AlignLeft,
  BookOpen,
  Table,
  List,
  ListOrdered,
  Lightbulb,
  MessageSquare,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AddBlockMenuProps {
  onAddBlock: (type: BlockType) => void;
  className?: string;
  isInline?: boolean;
}

export function AddBlockMenu({ onAddBlock, className, isInline = false }: AddBlockMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const blockOptions: { type: BlockType; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
    {
      type: "heading",
      label: "Tiêu đề (Heading)",
      desc: "Phân cấp đề mục lớn nhỏ H1, H2, H3",
      icon: <Heading className="w-4 h-4 text-indigo-600" />,
      color: "hover:bg-indigo-50/70",
    },
    {
      type: "paragraph",
      label: "Đoạn văn (Paragraph)",
      desc: "Văn bản thường, hỗ trợ Furigana [Hán tự|kana]",
      icon: <AlignLeft className="w-4 h-4 text-slate-600" />,
      color: "hover:bg-slate-50",
    },
    {
      type: "vocab_table",
      label: "Bảng từ vựng (Vocab Table)",
      desc: "Cột Kanji, Cách đọc Kana, Nghĩa, Ví dụ",
      icon: <BookOpen className="w-4 h-4 text-sky-600" />,
      color: "hover:bg-sky-50/70",
    },
    {
      type: "table",
      label: "Bảng linh hoạt (Custom Table)",
      desc: "Bảng dữ liệu tùy ý thêm xóa hàng và cột",
      icon: <Table className="w-4 h-4 text-emerald-600" />,
      color: "hover:bg-emerald-50/70",
    },
    {
      type: "callout",
      label: "Hộp lưu ý (Callout / Tip)",
      desc: "Hộp điểm nhấn ngữ pháp, mẹo học hoặc chú ý",
      icon: <Lightbulb className="w-4 h-4 text-amber-600" />,
      color: "hover:bg-amber-50/70",
    },
    {
      type: "bullet_list",
      label: "Danh sách chấm tròn (Bullet List)",
      desc: "Liệt kê các mục không đánh số",
      icon: <List className="w-4 h-4 text-violet-600" />,
      color: "hover:bg-violet-50/70",
    },
    {
      type: "numbered_list",
      label: "Danh sách đánh số (Numbered List)",
      desc: "Liệt kê bài tập, thứ tự các bước",
      icon: <ListOrdered className="w-4 h-4 text-purple-600" />,
      color: "hover:bg-purple-50/70",
    },
    {
      type: "dialogue",
      label: "Đoạn hội thoại (Dialogue)",
      desc: "Lời thoại nhân vật A/B và bản dịch",
      icon: <MessageSquare className="w-4 h-4 text-rose-600" />,
      color: "hover:bg-rose-50/70",
    },
  ];

  return (
    <div ref={menuRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center gap-1.5 transition-all text-xs font-semibold rounded-lg",
          isInline
            ? "p-1 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
            : "px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 shadow-2xs hover:shadow-xs"
        )}
      >
        <Plus className={cn("transition-transform duration-200", isInline ? "w-4 h-4" : "w-3.5 h-3.5", isOpen && "rotate-45")} />
        {!isInline && <span>Thêm khối nội dung</span>}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 sm:w-80 bg-white rounded-xl border border-slate-200 shadow-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
          <p className="px-2.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
            Chọn loại khối nội dung
          </p>
          <div className="max-h-72 overflow-y-auto space-y-0.5">
            {blockOptions.map((opt) => (
              <button
                key={opt.type}
                type="button"
                onClick={() => {
                  onAddBlock(opt.type);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left p-2 rounded-lg flex items-start gap-2.5 transition-colors",
                  opt.color
                )}
              >
                <div className="p-1.5 rounded-md bg-white border border-slate-100 shadow-2xs mt-0.5">
                  {opt.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">{opt.label}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
