import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "fake-indexeddb/auto";
import { JapaneseStudyDatabase } from "../db";
import { FolderRepository } from "../folder-repository";
import { DocumentRepository } from "../document-repository";
import { TemplateRepository } from "../template-repository";
import { Block } from "@/types/block";

describe("IndexedDB Storage Layer (Dexie)", () => {
  let testDb: JapaneseStudyDatabase;
  let folderRepo: FolderRepository;
  let docRepo: DocumentRepository;
  let tplRepo: TemplateRepository;

  beforeEach(async () => {
    // Sử dụng tên DB ngẫu nhiên cho mỗi test case để cô lập
    const dbName = "TestDB_" + Math.random().toString(36).substring(2, 9);
    testDb = new JapaneseStudyDatabase(dbName);
    folderRepo = new FolderRepository(testDb);
    docRepo = new DocumentRepository(testDb);
    tplRepo = new TemplateRepository(testDb);
  });

  afterEach(async () => {
    await testDb.delete();
  });

  describe("Database Initialization", () => {
    it("should initialize default folders, documents, and templates when DB is empty", async () => {
      await testDb.initDefaultData();

      const folders = await folderRepo.getAll();
      const docs = await docRepo.getAll();
      const templates = await tplRepo.getAll();

      expect(folders.length).toBeGreaterThan(0);
      expect(docs.length).toBeGreaterThan(0);
      expect(templates.length).toBeGreaterThan(0);

      // Thư mục Tiếng Nhật có tồn tại
      const jpFolder = folders.find((f) => f.name === "Tiếng Nhật");
      expect(jpFolder).toBeDefined();

      // Tài liệu Minna Bài 1 có tồn tại
      const minnaDoc = docs.find((d) => d.title.includes("Minna no Nihongo — Bài 1"));
      expect(minnaDoc).toBeDefined();
    });

    it("should not overwrite existing data on subsequent initDefaultData calls", async () => {
      await testDb.initDefaultData();
      const initialCount = (await folderRepo.getAll()).length;

      // Tạo một thư mục người dùng tùy biến
      await folderRepo.create("Thư mục riêng của tôi");

      // Gọi lại initDefaultData
      await testDb.initDefaultData();

      const newFolders = await folderRepo.getAll();
      expect(newFolders.length).toBe(initialCount + 1);
      expect(newFolders.some((f) => f.name === "Thư mục riêng của tôi")).toBe(true);
    });
  });

  describe("FolderRepository", () => {
    it("should create a root folder and a child folder", async () => {
      const parent = await folderRepo.create("Thư mục cha", null);
      expect(parent.id).toBeDefined();
      expect(parent.parentId).toBeNull();

      const child = await folderRepo.create("Thư mục con", parent.id);
      expect(child.parentId).toBe(parent.id);

      const all = await folderRepo.getAll();
      expect(all.length).toBe(2);
    });

    it("should rename a folder", async () => {
      const folder = await folderRepo.create("Tên cũ");
      await folderRepo.rename(folder.id, "Tên mới");

      const updated = await folderRepo.getById(folder.id);
      expect(updated?.name).toBe("Tên mới");
    });

    it("should move a folder to a new parent", async () => {
      const root1 = await folderRepo.create("Root 1");
      const root2 = await folderRepo.create("Root 2");
      const child = await folderRepo.create("Child", root1.id);

      await folderRepo.move(child.id, root2.id);

      const updated = await folderRepo.getById(child.id);
      expect(updated?.parentId).toBe(root2.id);
    });

    it("should prevent moving a folder into itself", async () => {
      const folder = await folderRepo.create("Folder A");
      await expect(folderRepo.move(folder.id, folder.id)).rejects.toThrow();
    });

    it("should prevent moving a folder into its own descendant", async () => {
      const parent = await folderRepo.create("Parent");
      const child = await folderRepo.create("Child", parent.id);
      const grandChild = await folderRepo.create("GrandChild", child.id);

      // Thử di chuyển Parent vào GrandChild
      await expect(folderRepo.move(parent.id, grandChild.id)).rejects.toThrow();
    });

    it("should recursively delete a folder and all its descendant documents and folders", async () => {
      const parent = await folderRepo.create("Parent to delete");
      const child = await folderRepo.create("Child", parent.id);

      // Tạo tài liệu trong child
      await docRepo.create({ title: "Doc in child", folderId: child.id });
      // Tạo tài liệu trong parent
      await docRepo.create({ title: "Doc in parent", folderId: parent.id });
      // Tạo tài liệu ở ngoài (không bị ảnh hưởng)
      const outsideDoc = await docRepo.create({ title: "Doc outside", folderId: null });

      const result = await folderRepo.deleteRecursive(parent.id);
      expect(result.deletedFolderIds).toContain(parent.id);
      expect(result.deletedFolderIds).toContain(child.id);
      expect(result.deletedDocCount).toBe(2);

      const remainingFolders = await folderRepo.getAll();
      expect(remainingFolders.some((f) => f.id === parent.id)).toBe(false);
      expect(remainingFolders.some((f) => f.id === child.id)).toBe(false);

      const remainingDocs = await docRepo.getAll();
      expect(remainingDocs.length).toBe(1);
      expect(remainingDocs[0].id).toBe(outsideDoc.id);
    });
  });

  describe("DocumentRepository", () => {
    it("should create and retrieve a document with blocks", async () => {
      const blocks: Block[] = [
        { id: "b1", type: "heading", content: { level: 1, text: "Tiêu đề bài test" } },
        { id: "b2", type: "paragraph", content: { text: "Nội dung kiểm thử [日本語|にほんご]" } },
      ];

      const doc = await docRepo.create({
        title: "Tài liệu kiểm thử",
        folderId: null,
        blocks,
        tags: ["test", "n5"],
      });

      expect(doc.id).toBeDefined();
      expect(doc.title).toBe("Tài liệu kiểm thử");
      expect(doc.blocks.length).toBe(2);

      const retrieved = await docRepo.getById(doc.id);
      expect(retrieved?.title).toBe("Tài liệu kiểm thử");
      expect(retrieved?.blocks[0].content).toEqual({ level: 1, text: "Tiêu đề bài test" });
    });

    it("should update a document", async () => {
      const doc = await docRepo.create({ title: "Tiêu đề ban đầu", folderId: null });

      await docRepo.update(doc.id, {
        title: "Tiêu đề đã sửa",
        tags: ["updated"],
      });

      const updated = await docRepo.getById(doc.id);
      expect(updated?.title).toBe("Tiêu đề đã sửa");
      expect(updated?.tags).toEqual(["updated"]);
    });

    it("should move a document to another folder", async () => {
      const folderA = await folderRepo.create("Folder A");
      const folderB = await folderRepo.create("Folder B");

      const doc = await docRepo.create({ title: "Bài tập", folderId: folderA.id });
      await docRepo.move(doc.id, folderB.id);

      const updated = await docRepo.getById(doc.id);
      expect(updated?.folderId).toBe(folderB.id);
    });

    it("should delete a document", async () => {
      const doc = await docRepo.create({ title: "Tài liệu cần xóa", folderId: null });
      await docRepo.delete(doc.id);

      const retrieved = await docRepo.getById(doc.id);
      expect(retrieved).toBeUndefined();
    });

    it("should search documents by title or tags", async () => {
      await docRepo.create({ title: "Từ vựng N3 Công sở", folderId: null, tags: ["it", "office"] });
      await docRepo.create({ title: "Ngữ pháp N2", folderId: null, tags: ["grammar"] });

      const searchTitle = await docRepo.search("công sở");
      expect(searchTitle.length).toBe(1);
      expect(searchTitle[0].title).toContain("Công sở");

      const searchTag = await docRepo.search("grammar");
      expect(searchTag.length).toBe(1);
      expect(searchTag[0].title).toContain("Ngữ pháp N2");
    });
  });

  describe("TemplateRepository", () => {
    it("should create, list and delete custom templates", async () => {
      const customTpl = await tplRepo.createCustom({
        name: "Mẫu phiếu học tập cá nhân",
        description: "Mẫu tự tạo phục vụ ôn thi",
        category: "custom",
        tags: ["custom"],
        blocks: [{ id: "b1", type: "heading", content: { level: 2, text: "Phiếu học tập" } }],
      });

      expect(customTpl.id).toBeDefined();
      expect(customTpl.isCustom).toBe(true);

      const all = await tplRepo.getAll();
      expect(all.some((t) => t.id === customTpl.id)).toBe(true);

      await tplRepo.deleteCustom(customTpl.id);
      const afterDelete = await tplRepo.getAll();
      expect(afterDelete.some((t) => t.id === customTpl.id)).toBe(false);
    });
  });
});
