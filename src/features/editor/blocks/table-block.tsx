"use client";

import * as React from "react";
import { TableContent } from "@/types/block";
import { Plus, Trash2, Columns, Rows } from "lucide-react";

interface TableBlockProps {
  content: TableContent;
  onChange: (content: TableContent) => void;
}

export function TableBlock({ content, onChange }: TableBlockProps) {
  // Đảm bảo có ít nhất 1 hàng, 1 cột
  const headers = content.headers?.length ? content.headers : ["Cột 1", "Cột 2"];
  const rows = content.rows?.length ? content.rows : [["", ""]];

  // Thêm cột mới
  const handleAddColumn = () => {
    const newHeaders = [...headers, `Cột ${headers.length + 1}`];
    const newRows = rows.map((r) => [...r, ""]);
    onChange({ headers: newHeaders, rows: newRows });
  };

  // Xóa cột
  const handleDeleteColumn = (colIdx: number) => {
    if (headers.length <= 1) return; // Giữ ít nhất 1 cột
    const newHeaders = headers.filter((_, idx) => idx !== colIdx);
    const newRows = rows.map((r) => r.filter((_, idx) => idx !== colIdx));
    onChange({ headers: newHeaders, rows: newRows });
  };

  // Cập nhật tên tiêu đề cột
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
    if (rows.length <= 1) return; // Giữ ít nhất 1 hàng
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

  return (
    <div className="space-y-2.5">
      {/* Thanh điều khiển bảng */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="font-semibold text-slate-700">Bảng dữ liệu tùy chỉnh</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddColumn}
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <Columns className="w-3 h-3 text-indigo-600" />
            <span>Thêm cột</span>
          </button>
          <button
            type="button"
            onClick={handleAddRow}
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <Rows className="w-3 h-3 text-emerald-600" />
            <span>Thêm hàng</span>
          </button>
        </div>
      </div>

      {/* Khung bảng */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-2 px-2.5 w-8 text-center text-slate-400">#</th>
              {headers.map((header, colIdx) => (
                <th key={colIdx} className="py-2 px-3 group/colHeader relative">
                  <div className="flex items-center justify-between gap-1">
                    <input
                      type="text"
                      value={header}
                      onChange={(e) => handleUpdateHeader(colIdx, e.target.value)}
                      className="w-full font-semibold text-slate-700 bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1 py-0.5"
                    />
                    {headers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteColumn(colIdx)}
                        className="text-slate-300 hover:text-rose-600 p-0.5 opacity-0 group-hover/colHeader:opacity-100 transition-opacity"
                        title="Xóa cột này"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th className="py-2 px-2 w-8 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-slate-50/70 group/tableRow transition-colors">
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
                      className="w-full bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1.5 py-1 text-slate-800"
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
