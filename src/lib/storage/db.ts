import Dexie, { type EntityTable } from "dexie";
import { Folder, Document } from "@/types/explorer";
import { DocumentTemplate } from "@/types/template";
import { INITIAL_FOLDERS, INITIAL_DOCUMENTS } from "@/lib/initial-data";
import { BUILTIN_TEMPLATES } from "@/features/templates/builtin-templates";

export class JapaneseStudyDatabase extends Dexie {
  folders!: EntityTable<Folder, "id">;
  documents!: EntityTable<Document, "id">;
  templates!: EntityTable<DocumentTemplate, "id">;

  constructor(databaseName = "JapaneseStudyStudioDB") {
    super(databaseName);

    this.version(1).stores({
      folders: "id, name, parentId, createdAt, updatedAt",
      documents: "id, title, folderId, createdAt, updatedAt, *tags",
      templates: "id, name, category, isCustom, createdAt",
    });
  }

  /**
   * Khởi tạo dữ liệu mẫu lần đầu nếu cơ sở dữ liệu IndexedDB đang trống
   */
  async initDefaultData(): Promise<void> {
    const folderCount = await this.folders.count();
    const docCount = await this.documents.count();

    // Nếu chưa có dữ liệu nào, nạp cấu trúc mẫu
    if (folderCount === 0 && docCount === 0) {
      await this.transaction("rw", this.folders, this.documents, this.templates, async () => {
        await this.folders.bulkAdd(INITIAL_FOLDERS);
        await this.documents.bulkAdd(INITIAL_DOCUMENTS);
        // Lưu các mẫu có sẵn vào DB
        await this.templates.bulkAdd(BUILTIN_TEMPLATES);
      });
    }
  }

  /**
   * Xóa toàn bộ dữ liệu (phục vụ reset hoặc kiểm thử)
   */
  async clearAll(): Promise<void> {
    await this.transaction("rw", this.folders, this.documents, this.templates, async () => {
      await this.folders.clear();
      await this.documents.clear();
      await this.templates.clear();
    });
  }
}

// Singleton database instance dùng cho toàn ứng dụng
export const db = new JapaneseStudyDatabase();
