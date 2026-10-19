"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DocumentTemplate } from "@/types/template";
import { Block } from "@/types/block";
import { cloneBlocks } from "@/lib/initial-data";

interface SaveAsTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  blocks: Block[];
  onSaveTemplate: (template: DocumentTemplate) => void;
}

export function SaveAsTemplateModal({
  isOpen,
  onClose,
  documentTitle,
  blocks,
  onSaveTemplate,
}: SaveAsTemplateModalProps) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState<"japanese" | "general" | "custom">("custom");
  const [tagsInput, setTagsInput] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (isOpen) {
      setName(`Mẫu: ${documentTitle}`);
      setDescription(`Mẫu được tạo từ tài liệu "${documentTitle}" với ${blocks.length} khối nội dung.`);
      setTagsInput("mẫu cá nhân");
      setError("");
    }
  }, [isOpen, documentTitle, blocks.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Vui lòng nhập tên mẫu tài liệu.");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newTemplate: DocumentTemplate = {
      id: "tpl_custom_" + Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      category,
      tags,
      blocks: cloneBlocks(blocks),
      isCustom: true,
      createdAt: Date.now(),
    };

    onSaveTemplate(newTemplate);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lưu cấu trúc thành Mẫu tài liệu"
      description="Lưu toàn bộ khối nội dung hiện tại làm khuôn mẫu để tái sử dụng khi tạo tài liệu mới."
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Lưu thành mẫu
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Tên mẫu tài liệu *"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError("");
          }}
          error={error}
          autoFocus
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Mô tả mẫu
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Phân loại mẫu"
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
          >
            <option value="custom">Mẫu cá nhân của bạn</option>
            <option value="japanese">Mẫu tiếng Nhật</option>
            <option value="general">Mẫu tổng quát</option>
          </Select>

          <Input
            label="Thẻ tag"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            hint="Phân cách bởi dấu phẩy (,)"
          />
        </div>
      </form>
    </Modal>
  );
}
