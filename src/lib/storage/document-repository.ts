import { db, JapaneseStudyDatabase } from "./db";
import { Document } from "@/types/explorer";
import { Block } from "@/types/block";
import { cloneBlocks } from "@/lib/initial-data";

export class DocumentRepository {
  constructor(private database: JapaneseStudyDatabase = db) {}

  async getAll(): Promise<Document[]> {
    return await this.database.documents.orderBy("updatedAt").reverse().toArray();
  }

  async getById(id: string): Promise<Document | undefined> {
    return await this.database.documents.get(id);
  }

  async getByFolder(folderId: string | null): Promise<Document[]> {
    return await this.database.documents
      .filter((doc) => doc.folderId === folderId)
      .reverse()
      .sortBy("updatedAt");
  }

  async create(data: {
    title: string;
    folderId: string | null;
    blocks?: Block[];
    tags?: string[];
  }): Promise<Document> {
    const newDoc: Document = {
      id: "doc_" + Math.random().toString(36).substring(2, 9),
      title: data.title.trim() || "Tài liệu chưa đặt tên",
      folderId: data.folderId,
      blocks: data.blocks ? cloneBlocks(data.blocks) : [],
      tags: data.tags || [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await this.database.documents.add(newDoc);
    return newDoc;
  }

  async update(id: string, updates: Partial<Omit<Document, "id" | "createdAt">>): Promise<void> {
    await this.database.documents.update(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  }

  async move(id: string, newFolderId: string | null): Promise<void> {
    await this.database.documents.update(id, {
      folderId: newFolderId,
      updatedAt: Date.now(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.database.documents.delete(id);
  }

  async search(query: string): Promise<Document[]> {
    const q = query.toLowerCase().trim();
    if (!q) return await this.getAll();

    return await this.database.documents
      .filter((doc) => {
        return (
          doc.title.toLowerCase().includes(q) ||
          doc.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .toArray();
  }
}

export const documentRepo = new DocumentRepository();
