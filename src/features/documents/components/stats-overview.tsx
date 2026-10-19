import * as React from "react";
import { FileText, BookOpen, Layers, Award } from "lucide-react";
import { DocumentMeta } from "@/types/document";

interface StatsOverviewProps {
  documents: DocumentMeta[];
}

export function StatsOverview({ documents }: StatsOverviewProps) {
  const totalDocs = documents.length;
  const totalItems = documents.reduce((sum, doc) => sum + doc.itemCount, 0);
  const vocabDocs = documents.filter((d) => d.category === "vocabulary").length;
  const grammarDocs = documents.filter((d) => d.category === "grammar").length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Thẻ 1: Tổng tài liệu */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4.5 shadow-xs flex items-center gap-4">
        <div className="h-11 w-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Tài liệu trong máy</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-bold text-slate-900">{totalDocs}</span>
            <span className="text-xs text-slate-400">tập tài liệu</span>
          </div>
        </div>
      </div>

      {/* Thẻ 2: Tổng số mục nội dung */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4.5 shadow-xs flex items-center gap-4">
        <div className="h-11 w-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Nội dung đã soạn</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-bold text-slate-900">{totalItems}</span>
            <span className="text-xs text-slate-400">mục học tập</span>
          </div>
        </div>
      </div>

      {/* Thẻ 3: Sổ từ vựng */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4.5 shadow-xs flex items-center gap-4">
        <div className="h-11 w-11 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Sổ từ vựng</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-bold text-slate-900">{vocabDocs}</span>
            <span className="text-xs text-slate-400">bộ từ</span>
          </div>
        </div>
      </div>

      {/* Thẻ 4: Ngữ pháp & Kanji */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4.5 shadow-xs flex items-center gap-4">
        <div className="h-11 w-11 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Ngữ pháp & Khác</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-bold text-slate-900">{grammarDocs}</span>
            <span className="text-xs text-slate-400">chuyên đề</span>
          </div>
        </div>
      </div>
    </div>
  );
}
