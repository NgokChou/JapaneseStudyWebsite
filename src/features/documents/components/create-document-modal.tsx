"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { JLPTLevel, DocumentCategory, DocumentMeta } from "@/types/document";

interface CreateDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (doc: Omit<DocumentMeta, "id" | "createdAt" | "updatedAt" | "itemCount">) => void;
}

export function CreateDocumentModal({ isOpen, onClose, onCreate }: CreateDocumentModalProps) {
  const [title, setTitle] = React.useState("");
  const [level, setLevel] = React.useState<JLPTLevel>("N3");
  const [category, setCategory] = React.useState<DocumentCategory>("vocabulary");
  const [description, setDescription] = React.useState("");
  const [tagsInput, setTagsInput] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Vui lòng nhập tên tài liệu.");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onCreate({
      title: title.trim(),
      level,
      category,
      description: description.trim() || undefined,
      tags,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setTagsInput("");
    setError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo tài liệu học mới"
      description="Thiết lập thông tin ban đầu cho tài liệu tiếng Nhật của bạn."
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Tạo tài liệu
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Tên tài liệu *"
          placeholder="Ví dụ: 50 từ vựng N3 chủ đề Công sở..."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError("");
          }}
          error={error}
          autoFocus
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Loại tài liệu"
            value={category}
            onChange={(e) => setCategory(e.target.value as DocumentCategory)}
          >
            <option value="vocabulary">Sổ từ vựng (単語)</option>
            <option value="grammar">Ngữ pháp (文法)</option>
            <option value="kanji">Hán tự (漢字)</option>
            <option value="exercise">Bài tập (練習)</option>
            <option value="mixed">Tổng hợp (総合)</option>
          </Select>

          <Select
            label="Trình độ JLPT"
            value={level}
            onChange={(e) => setLevel(e.target.value as JLPTLevel)}
          >
            <option value="N5">JLPT N5 (Sơ cấp 1)</option>
            <option value="N4">JLPT N4 (Sơ cấp 2)</option>
            <option value="N3">JLPT N3 (Trung cấp 1)</option>
            <option value="N2">JLPT N2 (Trung cấp 2)</option>
            <option value="N1">JLPT N1 (Cao cấp)</option>
            <option value="All">Tổng hợp / Không giới hạn</option>
          </Select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Mô tả hoặc ghi chú
          </label>
          <textarea
            rows={2}
            className="w-full px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            placeholder="Ghi chú thêm về mục tiêu, nguồn tài liệu hoặc lưu ý..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <Input
          label="Thẻ phân loại (Tags)"
          placeholder="Ví dụ: công sở, it, minna, bài 1..."
          hint="Phân cách nhiều thẻ bằng dấu phẩy (,)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />
      </form>
    </Modal>
  );
}
