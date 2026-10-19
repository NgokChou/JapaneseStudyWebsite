import * as React from "react";
import { Plus, BookOpen, Sparkles, FileSpreadsheet, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreateNew: () => void;
  onUseTemplate?: (preset: { title: string; category: string; level: string }) => void;
}

export function EmptyState({ onCreateNew, onUseTemplate }: EmptyStateProps) {
  const quickTemplates = [
    { title: "Sổ từ vựng Minna no Nihongo - Bài 1-5", category: "vocabulary", level: "N5", desc: "Bảng từ vựng, âm đọc furigana, nghĩa tiếng Việt và ví dụ mẫu" },
    { title: "Tổng hợp mẫu ngữ pháp N3 trọng điểm", category: "grammar", level: "N3", desc: "Phiếu tổng hợp cấu trúc, giải thích cách dùng và câu ví dụ" },
    { title: "100 chữ Kanji thông dụng N4", category: "kanji", level: "N4", desc: "Bảng âm On/Kun, số nét, từ ghép ví dụ và nghĩa Hán-Việt" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-xs">
      {/* Icon trung tâm */}
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-5 shadow-inner">
        <BookOpen className="w-8 h-8" />
      </div>

      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
        Chưa có tài liệu nào trong thư viện
      </h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
        Bắt đầu tạo tài liệu học tiếng Nhật đầu tiên của bạn. Bạn có thể soạn từ vựng, ngữ pháp, kanji và xuất ra bản in A4 hoặc tệp Word.
      </p>

      {/* Nút hành động chính */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={onCreateNew} size="md" className="gap-2 shadow-md">
          <Plus className="w-4 h-4" />
          <span>Tạo tài liệu mới</span>
        </Button>
      </div>

      {/* Các tính năng nổi bật được tóm tắt */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 pt-8 border-t border-slate-100 text-left">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Furigana chuẩn Ruby</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Hỗ trợ hiển thị cách đọc kana trên đầu kanji tự nhiên, không lỗi vỡ dòng.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs mb-1">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Dán dữ liệu hàng loạt</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Nhập nhanh bảng từ vựng từ Excel, Google Sheets qua định dạng TSV/CSV.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2 text-amber-600 font-semibold text-xs mb-1">
            <Printer className="w-3.5 h-3.5" />
            <span>Chuẩn in ấn A4 & Word</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Dàn trang tối ưu không cắt ngang bảng và xuất DOCX để chỉnh sửa tiếp.
          </p>
        </div>
      </div>
    </div>
  );
}
