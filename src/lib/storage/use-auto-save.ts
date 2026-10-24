"use client";

import * as React from "react";
import { Document } from "@/types/explorer";
import { documentRepo } from "./document-repository";

export type SaveStatus = "saved" | "unsaved" | "saving" | "error";

interface UseAutoSaveOptions {
  debounceMs?: number;
  onSaveSuccess?: (savedDoc: Document) => void;
  onSaveError?: (error: Error) => void;
}

export function useAutoSave(
  document: Document,
  isDirty: boolean,
  options: UseAutoSaveOptions = {}
) {
  const { debounceMs = 800, onSaveSuccess, onSaveError } = options;

  const [status, setStatus] = React.useState<SaveStatus>("saved");
  const [lastSavedAt, setLastSavedAt] = React.useState<number>(document.updatedAt || Date.now());
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const documentRef = React.useRef<Document>(document);
  documentRef.current = document;

  const isDirtyRef = React.useRef<boolean>(isDirty);
  isDirtyRef.current = isDirty;

  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Hàm thực hiện lưu ngay lập tức
  const saveNow = React.useCallback(async (): Promise<boolean> => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const currentDoc = documentRef.current;
    setStatus("saving");
    setErrorMessage(null);

    try {
      const now = Date.now();
      await documentRepo.update(currentDoc.id, {
        title: currentDoc.title,
        folderId: currentDoc.folderId,
        blocks: currentDoc.blocks,
        tags: currentDoc.tags,
        isFavorite: currentDoc.isFavorite,
      });

      const updated = { ...currentDoc, updatedAt: now };
      setStatus("saved");
      setLastSavedAt(now);
      onSaveSuccess?.(updated);
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Lỗi không xác định khi lưu tài liệu");
      setStatus("error");
      setErrorMessage(error.message);
      onSaveError?.(error);
      return false;
    }
  }, [onSaveSuccess, onSaveError]);

  // Hiệu ứng tự động lưu khi có thay đổi (isDirty = true)
  React.useEffect(() => {
    if (!isDirty) {
      return;
    }

    setStatus("unsaved");

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      saveNow();
    }, debounceMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [document.title, document.blocks, document.folderId, document.tags, isDirty, debounceMs, saveNow]);

  return {
    status,
    lastSavedAt,
    errorMessage,
    saveNow,
  };
}
