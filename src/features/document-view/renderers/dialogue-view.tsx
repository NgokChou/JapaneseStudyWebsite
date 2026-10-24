"use client";

import * as React from "react";
import { DialogueContent } from "@/types/block";
import { renderFormattedContent } from "@/components/ui/rich-text-editor";
import { MessageSquare } from "lucide-react";

interface DialogueViewProps {
  content: DialogueContent;
}

export function DialogueView({ content }: DialogueViewProps) {
  const lines = content.lines || [];

  return (
    <div className="my-6 p-4 sm:p-5 rounded-2xl border border-rose-200/80 dark:border-rose-950/70 bg-gradient-to-b from-rose-50/30 to-white dark:from-slate-900 dark:to-slate-900/90 shadow-2xs space-y-4">
      {content.title && (
        <div className="flex items-center gap-2 border-b border-rose-100 dark:border-rose-950 pb-2.5">
          <MessageSquare className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {content.title}
          </h4>
        </div>
      )}

      <div className="space-y-3">
        {lines.map((line) => (
          <div
            key={line.id}
            className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
          >
            <span className="w-24 shrink-0 px-2.5 py-1 rounded-md text-xs font-bold text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-700 dark:text-indigo-300">
              {line.speaker}
            </span>

            <div className="flex-1 space-y-0.5">
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 font-japanese leading-relaxed">
                {renderFormattedContent(line.japanese)}
              </div>
              {line.reading && (
                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-japanese">
                  {line.reading}
                </div>
              )}
              {line.vietnamese && (
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 italic">
                  {line.vietnamese}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
