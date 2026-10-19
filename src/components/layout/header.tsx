"use client";

import * as React from "react";
import { BookOpen, Sparkles, Laptop, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onNewDocument?: () => void;
}

export function Header({ onNewDocument }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-base tracking-tight">
                Japanese Study Studio
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                日本語
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Xưởng soạn thảo, định dạng & xuất tài liệu học tiếng Nhật
            </p>
          </div>
        </div>

        {/* Status & Quick Action */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
            <Laptop className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Lưu trữ trên máy (Offline)</span>
          </div>

          {onNewDocument && (
            <Button
              onClick={onNewDocument}
              size="sm"
              className="gap-2 font-semibold shadow-indigo-500/25"
            >
              <FileText className="w-4 h-4" />
              <span>Tạo tài liệu mới</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
