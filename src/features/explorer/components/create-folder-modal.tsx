"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  initialName?: string;
  isRenaming?: boolean;
  parentFolderName?: string;
}

export function CreateFolderModal({
  isOpen,
  onClose,
  onSubmit,
  initialName = "",
  isRenaming = false,
  parentFolderName,
}: CreateFolderModalProps) {
  const [name, setName] = React.useState(initialName);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setError("");
    }
  }, [isOpen, initialName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Vui lòng nhập tên thư mục.");
      return;
    }
    onSubmit(name.trim());
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isRenaming ? "Đổi tên thư mục" : "Tạo thư mục mới"}
      description={
        isRenaming
          ? "Nhập tên mới cho thư mục này."
          : parentFolderName
          ? `Tạo thư mục con bên trong thư mục "${parentFolderName}".`
          : "Tạo thư mục mới ở cấp cao nhất (Thư mục gốc)."
      }
      maxWidth="sm"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            {isRenaming ? "Lưu thay đổi" : "Tạo thư mục"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Tên thư mục *"
          placeholder="Ví dụ: Minna no Nihongo, Kanji N3, Bài tập..."
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError("");
          }}
          error={error}
          autoFocus
        />
      </form>
    </Modal>
  );
}
