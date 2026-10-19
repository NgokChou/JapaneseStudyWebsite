"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Folder, MoveTarget } from "@/types/explorer";
import { Folder as FolderIcon, Home, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MoveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  target: MoveTarget | null;
  folders: Folder[];
  onConfirmMove: (target: MoveTarget, destinationFolderId: string | null) => void;
}

export function MoveDialog({
  isOpen,
  onClose,
  target,
  folders,
  onConfirmMove,
}: MoveDialogProps) {
  const [selectedFolderId, setSelectedFolderId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen && target) {
      setSelectedFolderId(target.currentFolderId);
    }
  }, [isOpen, target]);

  if (!target) return null;

  // Lấy danh sách ID con cháu của thư mục đang chọn di chuyển (để tránh di chuyển thư mục cha vào con của chính nó)
  const getDescendantFolderIds = (folderId: string): string[] => {
    const directChildren = folders.filter((f) => f.parentId === folderId);
    let descendants = directChildren.map((f) => f.id);
    for (const child of directChildren) {
      descendants = descendants.concat(getDescendantFolderIds(child.id));
    }
    return descendants;
  };

  const invalidFolderIds = target.type === "folder" ? [target.id, ...getDescendantFolderIds(target.id)] : [];

  // Tạo danh sách phẳng có thụt đầu dòng
  const buildFolderList = (parentId: string | null = null, depth: number = 0): { folder: Folder; depth: number }[] => {
    const list: { folder: Folder; depth: number }[] = [];
    const children = folders.filter((f) => f.parentId === parentId);
    for (const child of children) {
      list.push({ folder: child, depth });
      list.push(...buildFolderList(child.id, depth + 1));
    }
    return list;
  };

  const flattenedFolders = buildFolderList(null, 1);

  const handleConfirm = () => {
    onConfirmMove(target, selectedFolderId);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Di chuyển ${target.type === "folder" ? "thư mục" : "tài liệu"}`}
      description={`Chọn thư mục đích bạn muốn chuyển "${target.name}" đến.`}
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleConfirm}
            disabled={selectedFolderId === target.currentFolderId}
          >
            Di chuyển đến đây
          </Button>
        </>
      }
    >
      <div className="space-y-1 max-h-64 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-slate-50/50">
        {/* Thư mục gốc */}
        <div
          onClick={() => setSelectedFolderId(null)}
          className={cn(
            "flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs font-medium transition-colors",
            selectedFolderId === null
              ? "bg-indigo-100 text-indigo-900 font-bold"
              : "hover:bg-slate-100 text-slate-700"
          )}
        >
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-indigo-600" />
            <span>Thư mục gốc (Root)</span>
          </div>
          {selectedFolderId === null && <Check className="w-4 h-4 text-indigo-600" />}
        </div>

        {/* Các thư mục con */}
        {flattenedFolders.map(({ folder, depth }) => {
          const isInvalid = invalidFolderIds.includes(folder.id);
          const isSelected = selectedFolderId === folder.id;

          return (
            <div
              key={folder.id}
              onClick={() => {
                if (!isInvalid) setSelectedFolderId(folder.id);
              }}
              style={{ paddingLeft: `${depth * 18}px` }}
              className={cn(
                "flex items-center justify-between p-2 rounded-lg text-xs font-medium transition-colors",
                isInvalid
                  ? "opacity-35 cursor-not-allowed text-slate-400"
                  : isSelected
                  ? "bg-indigo-100 text-indigo-900 font-bold cursor-pointer"
                  : "hover:bg-slate-100 text-slate-700 cursor-pointer"
              )}
            >
              <div className="flex items-center gap-2 truncate">
                <FolderIcon className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="truncate">{folder.name}</span>
                {isInvalid && <span className="text-[10px] text-slate-400 italic">(Không hợp lệ)</span>}
              </div>
              {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
