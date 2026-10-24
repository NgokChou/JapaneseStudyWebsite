import { db, JapaneseStudyDatabase } from "./db";
import { Folder } from "@/types/explorer";

export class FolderRepository {
  constructor(private database: JapaneseStudyDatabase = db) {}

  async getAll(): Promise<Folder[]> {
    return await this.database.folders.orderBy("createdAt").toArray();
  }

  async getById(id: string): Promise<Folder | undefined> {
    return await this.database.folders.get(id);
  }

  async create(name: string, parentId: string | null = null): Promise<Folder> {
    const newFolder: Folder = {
      id: "f_" + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      parentId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await this.database.folders.add(newFolder);
    return newFolder;
  }

  async rename(id: string, newName: string): Promise<void> {
    await this.database.folders.update(id, {
      name: newName.trim(),
      updatedAt: Date.now(),
    });
  }

  async move(id: string, newParentId: string | null): Promise<void> {
    // Ngăn chặn di chuyển vào chính nó
    if (id === newParentId) {
      throw new Error("Không thể di chuyển thư mục vào chính nó.");
    }

    // Ngăn chặn di chuyển vào thư mục con cháu của chính nó
    if (newParentId) {
      const descendants = await this.getDescendantIds(id);
      if (descendants.includes(newParentId)) {
        throw new Error("Không thể di chuyển thư mục vào một thư mục con của nó.");
      }
    }

    await this.database.folders.update(id, {
      parentId: newParentId,
      updatedAt: Date.now(),
    });
  }

  /**
   * Lấy danh sách ID của tất cả các thư mục con cháu
   */
  async getDescendantIds(folderId: string): Promise<string[]> {
    const allFolders = await this.getAll();
    const result: string[] = [];

    const collectKids = (parentId: string) => {
      const children = allFolders.filter((f) => f.parentId === parentId);
      for (const child of children) {
        result.push(child.id);
        collectKids(child.id);
      }
    };

    collectKids(folderId);
    return result;
  }

  /**
   * Xóa thư mục và đệ quy xóa toàn bộ thư mục con cùng tài liệu bên trong
   */
  async deleteRecursive(folderId: string): Promise<{ deletedFolderIds: string[]; deletedDocCount: number }> {
    const descendantIds = await this.getDescendantIds(folderId);
    const toDeleteFolderIds = [folderId, ...descendantIds];

    let deletedDocCount = 0;

    await this.database.transaction("rw", this.database.folders, this.database.documents, async () => {
      // Tìm các tài liệu nằm trong các thư mục sẽ bị xóa
      const docsToDelete = await this.database.documents
        .filter((doc) => doc.folderId !== null && toDeleteFolderIds.includes(doc.folderId))
        .toArray();

      deletedDocCount = docsToDelete.length;

      // Xóa tài liệu
      await this.database.documents.bulkDelete(docsToDelete.map((d) => d.id));

      // Xóa các thư mục
      await this.database.folders.bulkDelete(toDeleteFolderIds);
    });

    return { deletedFolderIds: toDeleteFolderIds, deletedDocCount };
  }
}

export const folderRepo = new FolderRepository();
