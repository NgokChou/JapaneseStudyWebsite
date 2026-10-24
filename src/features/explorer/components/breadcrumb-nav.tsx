"use client";

import * as React from "react";
import { Folder, ChevronRight, Home } from "lucide-react";
import { BreadcrumbItem } from "@/types/explorer";

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  onNavigate: (folderId: string | null) => void;
}

export function BreadcrumbNav({ items, onNavigate }: BreadcrumbNavProps) {
  return (
    <nav className="flex items-center flex-wrap gap-1 text-xs text-stone-500 dark:text-stone-400 py-1" aria-label="Đường dẫn thư mục">
      <button
        type="button"
        onClick={() => onNavigate(null)}
        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-stone-600 dark:text-stone-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors font-medium"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Thư mục gốc</span>
      </button>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={item.id || "root"}>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300 dark:text-stone-650 shrink-0" />
            <button
              type="button"
              disabled={isLast}
              onClick={() => onNavigate(item.id)}
              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
                isLast
                  ? "font-bold text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 cursor-default"
                  : "text-stone-600 dark:text-stone-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium"
              }`}
            >
              <Folder className="w-3.5 h-3.5 text-primary-500 dark:text-primary-400" />
              <span className="truncate max-w-[150px]">{item.name}</span>
            </button>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
