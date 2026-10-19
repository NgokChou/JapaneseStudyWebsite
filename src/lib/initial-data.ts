import { Folder, Document } from "@/types/explorer";
import { BUILTIN_TEMPLATES } from "@/features/templates/builtin-templates";
import { Block } from "@/types/block";

/**
 * Hàm nhân bản sâu (deep clone) danh sách khối để đảm bảo không dính tham chiếu
 */
export function cloneBlocks(blocks: Block[]): Block[] {
  return JSON.parse(JSON.stringify(blocks)).map((b: Block) => ({
    ...b,
    id: "b_" + Math.random().toString(36).substring(2, 9),
  }));
}

export const INITIAL_FOLDERS: Folder[] = [
  // Cây Tiếng Nhật
  {
    id: "f-jp",
    name: "Tiếng Nhật",
    parentId: null,
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now() - 86400000 * 2,
    color: "#6366f1", // indigo
  },
  {
    id: "f-jp-n5",
    name: "N5",
    parentId: "f-jp",
    createdAt: Date.now() - 86400000 * 9,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: "f-jp-n4",
    name: "N4",
    parentId: "f-jp",
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now() - 86400000 * 5,
  },

  // Cây Bài tập
  {
    id: "f-exercises",
    name: "Bài tập tiếng Nhật",
    parentId: null,
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 86400000 * 1,
    color: "#10b981", // emerald
  },
  {
    id: "f-ex-grammar",
    name: "Ngữ pháp",
    parentId: "f-exercises",
    createdAt: Date.now() - 86400000 * 6,
    updatedAt: Date.now() - 86400000 * 1,
  },
  {
    id: "f-ex-vocab",
    name: "Từ vựng",
    parentId: "f-exercises",
    createdAt: Date.now() - 86400000 * 6,
    updatedAt: Date.now() - 86400000 * 3,
  },

  // Cây Tiếng Anh
  {
    id: "f-en",
    name: "Tiếng Anh",
    parentId: null,
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 4,
    color: "#f59e0b", // amber
  },
  {
    id: "f-en-vocab",
    name: "Vocabulary",
    parentId: "f-en",
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 4,
  },
  {
    id: "f-en-grammar",
    name: "Grammar",
    parentId: "f-en",
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 4,
  },
];

export const INITIAL_DOCUMENTS: Document[] = [
  {
    id: "doc-minna-1",
    title: "Minna no Nihongo — Bài 1 (Giới thiệu bản thân)",
    folderId: "f-jp-n5",
    tags: ["minna", "n5", "bài 1"],
    blocks: cloneBlocks(BUILTIN_TEMPLATES[0].blocks),
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 3600000 * 2,
    isFavorite: true,
  },
  {
    id: "doc-minna-2",
    title: "Minna no Nihongo — Bài 2 (Đồ vật & Vị trí)",
    folderId: "f-jp-n5",
    tags: ["minna", "n5", "bài 2"],
    blocks: [
      {
        id: "b-m2-h1",
        type: "heading",
        content: {
          level: 1,
          text: "Bài 2: これ・それ・あれ (Cái này, cái đó, cái kia)",
        },
      },
      {
        id: "b-m2-vocab",
        type: "vocab_table",
        content: {
          title: "Từ vựng đồ vật hàng ngày",
          rows: [
            { id: "vr1", kanji: "本", reading: "ほん", meaning: "Sách", example: "これは日本語の本です。" },
            { id: "vr2", kanji: "辞書", reading: "じしょ", meaning: "Từ điển", example: "それは英語の辞書ですか。" },
            { id: "vr3", kanji: "雑誌", reading: "ざっし", meaning: "Tạp chí", example: "あれは自動車の雑誌です。" },
            { id: "vr4", kanji: "新聞", reading: "しんぶん", meaning: "Báo", example: "毎朝新聞を読みます。" },
          ],
        },
      },
    ],
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 3600000 * 8,
  },
  {
    id: "doc-n4-kanji",
    title: "Tuyển tập 50 chữ Hán N4 hay gặp trong đề thi",
    folderId: "f-jp-n4",
    tags: ["kanji", "n4"],
    blocks: cloneBlocks(BUILTIN_TEMPLATES[1].blocks),
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 1,
  },
];
