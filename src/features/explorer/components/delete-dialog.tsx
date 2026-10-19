"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  target: { type: "folder" | "document"; id: string; name: string } | null;
  onConfirm: () => void;
}

export function DeleteDialog({ isOpen, onClose, target, onConfirm }: DeleteDialogProps) {
  if (!target) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Xác nhận xóa ${target.type === "folder" ? "thư mục" : "tài liệu"}`}
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
              onConfirm();
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
            Bạn có chắc chắn muốn xóa {target.type === "folder" ? "thư mục" : "tài liệu"} này?
          </p>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            "{target.name}" sẽ bị xóa khỏi danh sách quản lý.
            {target.type === "folder" && " Các thư mục con và tài liệu bên trong thư mục này cũng sẽ bị xóa theo."}
          </p>
        </div>
      </div>
    </Modal>
  );
}
