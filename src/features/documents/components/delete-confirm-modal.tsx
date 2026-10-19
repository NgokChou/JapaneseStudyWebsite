"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { DocumentMeta } from "@/types/document";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentMeta | null;
  onConfirm: (id: string) => void;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  document,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!document) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xác nhận xóa tài liệu"
      maxWidth="sm"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onConfirm(document.id);
              onClose();
            }}
          >
            Đồng ý xóa
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Bạn có chắc chắn muốn xóa tài liệu này?
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Tài liệu <strong className="text-slate-800">"{document.title}"</strong> sẽ bị xóa khỏi bộ nhớ máy tính. Thao tác này không thể hoàn tác nếu bạn chưa sao lưu dữ liệu.
          </p>
        </div>
      </div>
    </Modal>
  );
}
