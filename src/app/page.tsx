"use client";

import * as React from "react";
import { Folder, Document, ViewMode, MoveTarget, BreadcrumbItem } from "@/types/explorer";
import { DocumentTemplate } from "@/types/template";
import { db } from "@/lib/storage/db";
import { folderRepo } from "@/lib/storage/folder-repository";
import { documentRepo } from "@/lib/storage/document-repository";
import { templateRepo } from "@/lib/storage/template-repository";
import { FolderTree } from "@/features/explorer/components/folder-tree";
import { BreadcrumbNav } from "@/features/explorer/components/breadcrumb-nav";
import { ExplorerToolbar } from "@/features/explorer/components/explorer-toolbar";
import { FolderView } from "@/features/explorer/components/folder-view";
import { CreateFolderModal } from "@/features/explorer/components/create-folder-modal";
import { MoveDialog } from "@/features/explorer/components/move-dialog";
import { DeleteDialog } from "@/features/explorer/components/delete-dialog";
import { TemplateModal } from "@/features/templates/template-modal";
import { EditorPage } from "@/features/editor/editor-page";
import { DocumentViewPage } from "@/features/document-view/document-view-page";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BookOpen, CheckCircle, Info, Menu, X, HardDrive } from "lucide-react";

export default function HomePage() {
  // --- STATE DỮ LIỆU ---
  const [folders, setFolders] = React.useState<Folder[]>([]);
  const [documents, setDocuments] = React.useState<Document[]>([]);
  const [templates, setTemplates] = React.useState<DocumentTemplate[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // --- NAVIGATION STATE ---
  const [currentFolderId, setCurrentFolderId] = React.useState<string | null>(null);
  const [activeDocumentId, setActiveDocumentId] = React.useState<string | null>(null);
  const [isEditingDocument, setIsEditingDocument] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  // --- MODAL STATES ---
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = React.useState(false);
  const [renamingFolder, setRenamingFolder] = React.useState<Folder | null>(null);
  const [createFolderParentId, setCreateFolderParentId] = React.useState<string | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = React.useState(false);
  const [moveTarget, setMoveTarget] = React.useState<MoveTarget | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<{ type: "folder" | "document"; id: string; name: string } | null>(null);

  // --- TOAST NOTIFICATION ---
  const [toastMessage, setToastMessage] = React.useState<{ text: string; type: "success" | "info" } | null>(null);

  const showToast = (text: string, type: "success" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Nạp dữ liệu ban đầu từ IndexedDB khi mở ứng dụng
  React.useEffect(() => {
    async function loadData() {
      try {
        await db.initDefaultData();
        const [loadedFolders, loadedDocs, loadedTemplates] = await Promise.all([
          folderRepo.getAll(),
          documentRepo.getAll(),
          templateRepo.getAll(),
        ]);
        setFolders(loadedFolders);
        setDocuments(loadedDocs);
        setTemplates(loadedTemplates);
      } catch (err) {
        console.error("Lỗi khởi tạo IndexedDB:", err);
        showToast("Không thể kết nối cơ sở dữ liệu IndexedDB trên máy", "info");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Thư mục hiện tại
  const currentFolder = React.useMemo(() => {
    return currentFolderId ? folders.find((f) => f.id === currentFolderId) || null : null;
  }, [currentFolderId, folders]);

  // Tạo Breadcrumb từ Thư mục gốc -> con
  const breadcrumbs = React.useMemo<BreadcrumbItem[]>(() => {
    if (!currentFolderId) return [];
    const items: BreadcrumbItem[] = [];
    let curr = folders.find((f) => f.id === currentFolderId);
    while (curr) {
      items.unshift({ id: curr.id, name: curr.name });
      const parentId: string | null = curr.parentId;
      curr = parentId ? folders.find((f) => f.id === parentId) : undefined;
    }
    return items;
  }, [currentFolderId, folders]);

  // Lọc thư mục con và tài liệu trong thư mục đang chọn (có hỗ trợ tìm kiếm)
  const currentSubFolders = React.useMemo(() => {
    if (searchQuery.trim()) {
      return folders.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return folders.filter((f) => f.parentId === currentFolderId);
  }, [folders, currentFolderId, searchQuery]);

  const currentDocuments = React.useMemo(() => {
    if (searchQuery.trim()) {
      return documents.filter((d) =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return documents.filter((d) => d.folderId === currentFolderId);
  }, [documents, currentFolderId, searchQuery]);

  // Tài liệu đang được mở biên tập hoặc xem
  const activeDocument = React.useMemo(() => {
    return documents.find((d) => d.id === activeDocumentId) || null;
  }, [activeDocumentId, documents]);

  // --- HÀNH ĐỘNG THƯ MỤC LƯU VÀO INDEXEDDB ---
  const handleOpenCreateFolder = (parentId: string | null) => {
    setCreateFolderParentId(parentId);
    setRenamingFolder(null);
    setIsCreateFolderModalOpen(true);
  };

  const handleOpenRenameFolder = (folder: Folder) => {
    setRenamingFolder(folder);
    setIsCreateFolderModalOpen(true);
  };

  const handleCreateOrRenameFolder = async (name: string) => {
    try {
      if (renamingFolder) {
        await folderRepo.rename(renamingFolder.id, name);
        showToast(`Đã đổi tên thư mục thành "${name}"`);
      } else {
        await folderRepo.create(name, createFolderParentId);
        showToast(`Đã tạo thư mục "${name}"`);
      }
      const updatedFolders = await folderRepo.getAll();
      setFolders(updatedFolders);
    } catch (err) {
      showToast("Lỗi khi cập nhật thư mục: " + (err instanceof Error ? err.message : ""), "info");
    }
  };

  const handleDeleteFolderConfirm = async () => {
    if (!deleteTarget || deleteTarget.type !== "folder") return;
    try {
      const folderId = deleteTarget.id;
      const { deletedFolderIds, deletedDocCount } = await folderRepo.deleteRecursive(folderId);

      const [updatedFolders, updatedDocs] = await Promise.all([
        folderRepo.getAll(),
        documentRepo.getAll(),
      ]);
      setFolders(updatedFolders);
      setDocuments(updatedDocs);

      if (currentFolderId && deletedFolderIds.includes(currentFolderId)) {
        setCurrentFolderId(null);
      }

      showToast(
        `Đã xóa thư mục "${deleteTarget.name}" (${deletedFolderIds.length} thư mục, ${deletedDocCount} tài liệu)`,
        "info"
      );
    } catch (err) {
      showToast("Lỗi khi xóa thư mục: " + (err instanceof Error ? err.message : ""), "info");
    }
  };

  // --- HÀNH ĐỘNG TÀI LIỆU LƯU VÀO INDEXEDDB ---
  const handleSelectTemplateAndCreate = async (template: DocumentTemplate) => {
    try {
      const newTitle = template.id === "template-blank" ? "Tài liệu mới chưa đặt tên" : template.name;
      const created = await documentRepo.create({
        title: newTitle,
        folderId: currentFolderId,
        blocks: template.blocks,
        tags: [...template.tags],
      });

      const updatedDocs = await documentRepo.getAll();
      setDocuments(updatedDocs);
      setActiveDocumentId(created.id);
      setIsEditingDocument(true); // Mở editor ngay khi vừa tạo từ template
      showToast(`Đã tạo bài học "${created.title}" thành công!`);
    } catch (err) {
      showToast("Lỗi khi tạo tài liệu: " + (err instanceof Error ? err.message : ""), "info");
    }
  };

  const handleSaveDocument = async (updatedDoc: Document) => {
    try {
      await documentRepo.update(updatedDoc.id, {
        title: updatedDoc.title,
        folderId: updatedDoc.folderId,
        blocks: updatedDoc.blocks,
        tags: updatedDoc.tags,
        isFavorite: updatedDoc.isFavorite,
      });
      const updatedDocs = await documentRepo.getAll();
      setDocuments(updatedDocs);
      showToast(`Đã lưu "${updatedDoc.title}" vào máy tính thành công!`);
    } catch (err) {
      showToast("Lỗi khi lưu tài liệu: " + (err instanceof Error ? err.message : ""), "info");
    }
  };

  const handleDeleteDocumentConfirm = async () => {
    if (!deleteTarget || deleteTarget.type !== "document") return;
    try {
      await documentRepo.delete(deleteTarget.id);
      const updatedDocs = await documentRepo.getAll();
      setDocuments(updatedDocs);
      if (activeDocumentId === deleteTarget.id) {
        setActiveDocumentId(null);
      }
      showToast(`Đã xóa tài liệu "${deleteTarget.name}" khỏi IndexedDB`, "info");
    } catch (err) {
      showToast("Lỗi khi xóa tài liệu: " + (err instanceof Error ? err.message : ""), "info");
    }
  };

  // --- HÀNH ĐỘNG DI CHUYỂN TRONG INDEXEDDB ---
  const handleConfirmMove = async (target: MoveTarget, destinationFolderId: string | null) => {
    try {
      if (target.type === "document") {
        await documentRepo.move(target.id, destinationFolderId);
        const updatedDocs = await documentRepo.getAll();
        setDocuments(updatedDocs);
        showToast(`Đã di chuyển tài liệu "${target.name}"`);
      } else {
        await folderRepo.move(target.id, destinationFolderId);
        const updatedFolders = await folderRepo.getAll();
        setFolders(updatedFolders);
        showToast(`Đã di chuyển thư mục "${target.name}"`);
      }
    } catch (err) {
      showToast("Không thể di chuyển: " + (err instanceof Error ? err.message : ""), "info");
    }
  };

  // --- HÀNH ĐỘNG MẪU TÀI LIỆU LƯU VÀO INDEXEDDB ---
  const handleSaveCustomTemplate = async (newTemplate: DocumentTemplate) => {
    try {
      await templateRepo.createCustom({
        name: newTemplate.name,
        description: newTemplate.description,
        category: newTemplate.category,
        tags: newTemplate.tags,
        blocks: newTemplate.blocks,
      });
      const updatedTemplates = await templateRepo.getAll();
      setTemplates(updatedTemplates);
      showToast(`Đã lưu mẫu "${newTemplate.name}" vào danh sách Mẫu của bạn!`);
    } catch (err) {
      showToast("Lỗi khi lưu mẫu tài liệu: " + (err instanceof Error ? err.message : ""), "info");
    }
  };

  const handleDeleteCustomTemplate = async (templateId: string) => {
    try {
      await templateRepo.deleteCustom(templateId);
      const updatedTemplates = await templateRepo.getAll();
      setTemplates(updatedTemplates);
      showToast("Đã xóa mẫu tài liệu tùy chỉnh.", "info");
    } catch (err) {
      showToast("Lỗi khi xóa mẫu: " + (err instanceof Error ? err.message : ""), "info");
    }
  };

  // =========================================================================
  // XỬ LÝ CHẾ ĐỘ XEM (VIEW) VÀ BIÊN TẬP (EDIT) TÀI LIỆU
  // =========================================================================
  if (activeDocument) {
    const parentFolder = activeDocument.folderId
      ? folders.find((f) => f.id === activeDocument.folderId)?.name || "Thư mục"
      : "Thư mục gốc";

    // Khi người dùng bấm "Chỉnh sửa" -> Hiển thị EditorPage
    if (isEditingDocument) {
      return (
        <EditorPage
          document={activeDocument}
          folderName={parentFolder}
          onBack={async () => {
            // Khi thoát Editor -> quay lại DocumentViewPage
            const refreshed = await documentRepo.getAll();
            setDocuments(refreshed);
            setIsEditingDocument(false);
          }}
          onSave={handleSaveDocument}
          onSaveAsTemplate={handleSaveCustomTemplate}
        />
      );
    }

    // MẶC ĐỊNH: Hiển thị DocumentViewPage chỉ đọc
    return (
      <DocumentViewPage
        documentId={activeDocument.id}
        onEdit={() => setIsEditingDocument(true)}
        onBack={() => {
          setActiveDocumentId(null);
          setIsEditingDocument(false);
        }}
      />
    );
  }

  // =========================================================================
  // GIAO DIỆN QUẢN LÝ THƯ MỤC & TÀI LIỆU (FILE EXPLORER STYLE)
  // =========================================================================
  return (
    <div className="min-h-screen bg-stone-100/70 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      {/* Header chính */}
      <header className="sticky top-0 z-30 w-full bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shadow-2xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 lg:hidden"
            >
              {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-rose-500 flex items-center justify-center text-white shadow-xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-stone-900 dark:text-stone-100 text-sm tracking-tight">
                  Japanese Study Studio
                </span>
                <span className="ml-2 hidden sm:inline-flex px-1.5 py-0.2 rounded text-[10px] font-semibold bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border border-primary-200/60 dark:border-primary-800/50">
                  Document Studio
                </span>
              </div>
            </div>
          </div>

          {/* Trạng thái lưu trữ IndexedDB cục bộ & Theme Toggle */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 text-[11px] font-medium">
              <HardDrive className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Lưu trữ:</span>
              <span className="font-bold">IndexedDB</span>
            </div>

            {/* Nút chuyển đổi Theme Sáng / Tối */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Thân giao diện chia 2 cột: Sidebar Cây thư mục + Main View */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex gap-6">
        {/* Sidebar: Cây thư mục (Desktop & Drawer Mobile) */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 p-4 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 lg:w-64 lg:rounded-2xl lg:border lg:border-stone-200 dark:lg:border-stone-800 lg:p-4 lg:shadow-2xs shrink-0 ${
            isMobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          }`}
        >
          {isLoading ? (
            <div className="p-4 text-center text-xs text-stone-400 dark:text-stone-500">
              Đang tải dữ liệu thư mục...
            </div>
          ) : (
            <FolderTree
              folders={folders}
              documents={documents}
              currentFolderId={currentFolderId}
              onSelectFolder={(fId) => {
                setCurrentFolderId(fId);
                setSearchQuery("");
                setIsMobileSidebarOpen(false);
              }}
              onCreateFolder={(parentId) => handleOpenCreateFolder(parentId)}
            />
          )}
        </aside>

        {/* Backdrop for mobile sidebar */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-stone-950/40 z-30 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Vùng chính (Explorer Workspace) */}
        <main className="flex-1 min-w-0 space-y-4">
          {/* Breadcrumb Navigation */}
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 px-3 py-2 shadow-2xs transition-colors">
            <BreadcrumbNav
              items={breadcrumbs}
              onNavigate={(fId) => {
                setCurrentFolderId(fId);
                setSearchQuery("");
              }}
            />
          </div>

          {/* Toolbar Explorer */}
          <ExplorerToolbar
            currentFolderName={currentFolder ? currentFolder.name : "Thư mục gốc"}
            isRoot={currentFolderId === null}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onNewDocument={() => setIsTemplateModalOpen(true)}
            onNewFolder={() => handleOpenCreateFolder(currentFolderId)}
            onRenameCurrentFolder={currentFolder ? () => handleOpenRenameFolder(currentFolder) : undefined}
            onDeleteCurrentFolder={
              currentFolder
                ? () =>
                    setDeleteTarget({
                      type: "folder",
                      id: currentFolder.id,
                      name: currentFolder.name,
                    })
                : undefined
            }
            onMoveCurrentFolder={
              currentFolder
                ? () =>
                    setMoveTarget({
                      type: "folder",
                      id: currentFolder.id,
                      name: currentFolder.name,
                      currentFolderId: currentFolder.parentId,
                    })
                : undefined
            }
          />

          {/* Danh sách Thư mục con & Tài liệu */}
          {isLoading ? (
            <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-12 text-center text-xs text-stone-400 dark:text-stone-500">
              Đang tải danh sách tài liệu từ bộ nhớ máy tính...
            </div>
          ) : (
            <FolderView
              currentFolder={currentFolder}
              folders={currentSubFolders}
              documents={currentDocuments}
              allFolders={folders}
              viewMode={viewMode}
              onOpenFolder={(fId) => {
                setCurrentFolderId(fId);
                setSearchQuery("");
              }}
              onOpenDocument={(doc) => {
                setActiveDocumentId(doc.id);
                setIsEditingDocument(false); // MẶC ĐỊNH MỞ Ở CHẾ ĐỘ VIEW BÀI HỌC
              }}
              onRenameFolder={(folder) => handleOpenRenameFolder(folder)}
              onDeleteFolder={(folder) =>
                setDeleteTarget({
                  type: "folder",
                  id: folder.id,
                  name: folder.name,
                })
              }
              onMoveItem={(target) => setMoveTarget(target)}
              onDeleteDocument={(doc) =>
                setDeleteTarget({
                  type: "document",
                  id: doc.id,
                  name: doc.title,
                })
              }
              onNewDocument={() => setIsTemplateModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 py-3.5 text-center text-xs text-stone-400 dark:text-stone-500 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Japanese Study Document Studio — Quản lý & Biên tập tài liệu tiếng Nhật chuyên nghiệp</span>
          <span className="text-[11px] text-stone-400 dark:text-stone-600">Dữ liệu lưu trữ bền vững trên máy tính (IndexedDB)</span>
        </div>
      </footer>

      {/* --- MODALS --- */}

      {/* Modal Chọn mẫu khi tạo tài liệu mới */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        templates={templates}
        onSelectTemplate={handleSelectTemplateAndCreate}
        onDeleteCustomTemplate={handleDeleteCustomTemplate}
      />

      {/* Modal Tạo mới / Đổi tên thư mục */}
      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        onSubmit={handleCreateOrRenameFolder}
        initialName={renamingFolder ? renamingFolder.name : ""}
        isRenaming={Boolean(renamingFolder)}
        parentFolderName={
          createFolderParentId
            ? folders.find((f) => f.id === createFolderParentId)?.name
            : undefined
        }
      />

      {/* Modal Di chuyển tài liệu hoặc thư mục */}
      <MoveDialog
        isOpen={Boolean(moveTarget)}
        onClose={() => setMoveTarget(null)}
        target={moveTarget}
        folders={folders}
        onConfirmMove={handleConfirmMove}
      />

      {/* Modal Xác nhận xóa an toàn */}
      <DeleteDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        target={deleteTarget}
        onConfirm={() => {
          if (deleteTarget?.type === "folder") {
            handleDeleteFolderConfirm();
          } else {
            handleDeleteDocumentConfirm();
          }
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xl text-xs font-medium animate-in slide-in-from-bottom-3 duration-200">
          {toastMessage.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-primary-400 dark:text-primary-600 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}
