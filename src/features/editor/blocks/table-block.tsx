"use client";

import * as React from "react";
import { TableContent } from "@/types/block";
import {
  Plus,
  Trash2,
  Columns,
  Rows,
  ClipboardPaste,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TableBlockProps {
  content: TableContent;
  onChange: (content: TableContent) => void;
}

export function TableBlock({ content, onChange }: TableBlockProps) {
  const headers = content.headers?.length ? content.headers : ["Cột 1", "Cột 2"];
  const rows = content.rows?.length ? content.rows : [["", ""]];
  const alignments = content.alignments?.length
    ? content.alignments
    : new Array(headers.length).fill("left" as const);
  const hasHeader = content.hasHeader !== false;

  // Thêm cột mới
  const handleAddColumn = () => {
    const newHeaders = [...headers, `Cột ${headers.length + 1}`];
    const newRows = rows.map((r) => [...r, ""]);
    const newAlignments = [...alignments, "left" as const];
    onChange({ ...content, headers: newHeaders, rows: newRows, alignments: newAlignments });
  };

  // Xóa cột
  const handleDeleteColumn = (colIdx: number) => {
    if (headers.length <= 1) return;
    const newHeaders = headers.filter((_, idx) => idx !== colIdx);
    const newRows = rows.map((r) => r.filter((_, idx) => idx !== colIdx));
    const newAlignments = alignments.filter((_, idx) => idx !== colIdx);
    onChange({ ...content, headers: newHeaders, rows: newRows, alignments: newAlignments });
  };

  // Đổi căn lề cột
  const handleToggleAlignment = (colIdx: number) => {
    const current = alignments[colIdx] || "left";
    const next = current === "left" ? "center" : current === "center" ? "right" : "left";
    const updated = [...alignments];
    updated[colIdx] = next;
    onChange({ ...content, alignments: updated });
  };

  // Cập nhật tiêu đề cột
  const handleUpdateHeader = (colIdx: number, val: string) => {
    const newHeaders = [...headers];
    newHeaders[colIdx] = val;
    onChange({ ...content, headers: newHeaders });
  };

  // Thêm hàng mới
  const handleAddRow = () => {
    const newRow = new Array(headers.length).fill("");
    onChange({ ...content, rows: [...rows, newRow] });
  };

  // Xóa hàng
  const handleDeleteRow = (rowIdx: number) => {
    if (rows.length <= 1) return;
    const newRows = rows.filter((_, idx) => idx !== rowIdx);
    onChange({ ...content, rows: newRows });
  };

  // Cập nhật ô dữ liệu
  const handleUpdateCell = (rowIdx: number, colIdx: number, val: string) => {
    const newRows = rows.map((r, rIdx) => {
      if (rIdx !== rowIdx) return r;
      const newCols = [...r];
      newCols[colIdx] = val;
      return newCols;
    });
    onChange({ ...content, rows: newRows });
  };

  // Dán dữ liệu từ Clipboard (Excel / Google Sheets TSV)
  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) return;

      const lines = text
        .trim()
        .split(/\r?\n/)
        .map((l) => l.split("\t"));

      if (lines.length === 0) return;

      const maxCols = Math.max(...lines.map((l) => l.length));
      if (maxCols === 0) return;

      let newHeaders = headers;
      let newRows: string[][];

      if (hasHeader && lines.length > 1) {
        newHeaders = lines[0];
        while (newHeaders.length < maxCols) {
          newHeaders.push(`Cột ${newHeaders.length + 1}`);
        }
        newRows = lines.slice(1).map((row) => {
          const filled = [...row];
          while (filled.length < maxCols) filled.push("");
          return filled;
        });
      } else {
        newRows = lines.map((row) => {
          const filled = [...row];
          while (filled.length < maxCols) filled.push("");
          return filled;
        });
        if (newHeaders.length < maxCols) {
          newHeaders = [...newHeaders];
          while (newHeaders.length < maxCols) {
            newHeaders.push(`Cột ${newHeaders.length + 1}`);
          }
        }
      }

      const newAlign = new Array(maxCols).fill("left" as const);
      onChange({
        headers: newHeaders,
        rows: newRows,
        alignments: newAlign,
        hasHeader,
      });
    } catch {
      // Trình duyệt có thể yêu cầu quyền đọc clipboard
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Thanh điều khiển bảng */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          Bảng tùy chỉnh ({rows.length} hàng × {headers.length} cột)
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePasteFromClipboard}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            title="Dán dữ liệu sao chép từ Excel hoặc Google Sheets (TSV)"
          >
            <ClipboardPaste className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Dán từ Sheets/Excel</span>
          </button>

          <button
            type="button"
            onClick={handleAddColumn}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <Columns className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Thêm cột</span>
          </button>

          <button
            type="button"
            onClick={handleAddRow}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <Rows className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Thêm hàng</span>
          </button>
        </div>
      </div>

      {/* Khung bảng có thanh cuộn ngang khi nhiều cột */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          {hasHeader && (
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
                <th className="py-2 px-2.5 w-8 text-center text-slate-400">#</th>
                {headers.map((header, colIdx) => (
                  <th key={colIdx} className="py-2 px-3 group/colHeader relative">
                    <div className="flex items-center justify-between gap-1">
                      <input
                        type="text"
                        value={header}
                        onChange={(e) => handleUpdateHeader(colIdx, e.target.value)}
                        className={cn(
                          "w-full font-bold text-slate-800 dark:text-slate-100 bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1 py-0.5",
                          alignments[colIdx] === "center" && "text-center",
                          alignments[colIdx] === "right" && "text-right"
                        )}
                      />

                      <div className="flex items-center gap-0.5 opacity-0 group-hover/colHeader:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleToggleAlignment(colIdx)}
                          className="text-slate-400 hover:text-indigo-600 p-0.5"
                          title="Đổi căn lề cột (Trái/Giữa/Phải)"
                        >
                          {alignments[colIdx] === "center" ? (
                            <AlignCenter className="w-3 h-3" />
                          ) : alignments[colIdx] === "right" ? (
                            <AlignRight className="w-3 h-3" />
                          ) : (
                            <AlignLeft className="w-3 h-3" />
                          )}
                        </button>

                        {headers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteColumn(colIdx)}
                            className="text-slate-300 hover:text-rose-600 p-0.5"
                            title="Xóa cột này"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </th>
                ))}
                <th className="py-2 px-2 w-8 text-center"></th>
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 group/tableRow transition-colors"
              >
                <td className="py-2 px-2.5 text-center text-slate-400 font-mono text-[11px]">
                  {rowIdx + 1}
                </td>
                {headers.map((_, colIdx) => (
                  <td key={colIdx} className="py-1.5 px-3">
                    <input
                      type="text"
                      value={row[colIdx] || ""}
                      onChange={(e) => handleUpdateCell(rowIdx, colIdx, e.target.value)}
                      placeholder="..."
                      className={cn(
                        "w-full bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1.5 py-1 text-slate-800 dark:text-slate-200 font-japanese",
                        alignments[colIdx] === "center" && "text-center",
                        alignments[colIdx] === "right" && "text-right"
                      )}
                    />
                  </td>
                ))}
                <td className="py-1.5 px-2 text-center">
                  {rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(rowIdx)}
                      className="p-1 text-slate-300 hover:text-rose-600 rounded opacity-0 group-hover/tableRow:opacity-100 transition-opacity"
                      title="Xóa hàng này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
