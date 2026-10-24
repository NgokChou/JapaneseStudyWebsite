"use client";

import * as React from "react";
import { TableContent } from "@/types/block";
import { renderFormattedContent } from "@/components/ui/rich-text-editor";
import { cn } from "@/lib/utils";

interface TableViewProps {
  content: TableContent;
}

export function TableView({ content }: TableViewProps) {
  const headers = content.headers || [];
  const rows = content.rows || [];
  const alignments = content.alignments || [];
  const hasHeader = content.hasHeader !== false;

  return (
    <div className="my-5 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
      <table className="w-full text-left text-xs border-collapse">
        {hasHeader && headers.length > 0 && (
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold">
              <th className="py-2.5 px-3 w-8 text-center text-slate-400">#</th>
              {headers.map((header, colIdx) => (
                <th
                  key={colIdx}
                  className={cn(
                    "py-2.5 px-3.5",
                    alignments[colIdx] === "center" && "text-center",
                    alignments[colIdx] === "right" && "text-right"
                  )}
                >
                  {renderFormattedContent(header)}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
            >
              <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-[11px]">
                {rowIdx + 1}
              </td>
              {row.map((cell, colIdx) => (
                <td
                  key={colIdx}
                  className={cn(
                    "py-2.5 px-3.5 text-slate-800 dark:text-slate-200 font-japanese leading-relaxed",
                    alignments[colIdx] === "center" && "text-center",
                    alignments[colIdx] === "right" && "text-right"
                  )}
                >
                  {renderFormattedContent(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
