"use client";

import * as React from "react";
import { CalloutContent } from "@/types/block";
import { renderFormattedContent } from "@/components/ui/rich-text-editor";
import { Lightbulb, Info, AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalloutViewProps {
  content: CalloutContent;
}

export function CalloutView({ content }: CalloutViewProps) {
  const styles = {
    info: {
      bg: "bg-sky-50/80 dark:bg-sky-950/20 border-sky-200 dark:border-sky-900/60 text-sky-950 dark:text-sky-200",
      icon: <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />,
    },
    tip: {
      bg: "bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-200",
      icon: <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />,
    },
    warning: {
      bg: "bg-amber-50/80 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60 text-amber-950 dark:text-amber-200",
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />,
    },
    japanese: {
      bg: "bg-indigo-50/80 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/60 text-indigo-950 dark:text-indigo-200",
      icon: <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />,
    },
  };

  const current = styles[content.variant] || styles.info;

  return (
    <div className={cn("my-4 p-4 rounded-xl border space-y-1.5 leading-relaxed", current.bg)}>
      {content.title && (
        <div className="flex items-center gap-2 font-bold text-sm">
          {current.icon}
          <span>{content.title}</span>
        </div>
      )}
      <div className={cn("text-xs sm:text-sm font-japanese whitespace-pre-wrap", !content.title && "flex items-start gap-2")}>
        {!content.title && current.icon}
        <div className="flex-1">{renderFormattedContent(content.text)}</div>
      </div>
    </div>
  );
}
