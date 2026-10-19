import * as React from "react";
import { cn } from "@/lib/utils";
import { JLPTLevel, DocumentCategory } from "@/types/document";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "outline" | "jlpt";
  level?: JLPTLevel;
}

export function Badge({ className, variant = "default", level, children, ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-colors";

  const jlptColors: Record<JLPTLevel, string> = {
    N5: "bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    N4: "bg-teal-100 text-teal-800 border border-teal-300 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800",
    N3: "bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
    N2: "bg-indigo-100 text-indigo-800 border border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800",
    N1: "bg-purple-100 text-purple-800 border border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
    All: "bg-slate-100 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
  };

  const variants = {
    default: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
    primary: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300",
    success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
    danger: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300",
    outline: "border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300",
    jlpt: level ? jlptColors[level] : jlptColors.All,
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  );
}

export function CategoryBadge({ category }: { category: DocumentCategory }) {
  const categoryConfig: Record<DocumentCategory, { label: string; color: string }> = {
    vocabulary: { label: "Từ vựng (単語)", color: "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800" },
    grammar: { label: "Ngữ pháp (文法)", color: "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800" },
    kanji: { label: "Hán tự (漢字)", color: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800" },
    exercise: { label: "Bài tập (練習)", color: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800" },
    mixed: { label: "Tổng hợp (総合)", color: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800" },
  };

  const current = categoryConfig[category] || categoryConfig.mixed;

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border", current.color)}>
      {current.label}
    </span>
  );
}
