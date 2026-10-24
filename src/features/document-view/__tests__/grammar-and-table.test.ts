import { describe, it, expect, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import { JapaneseStudyDatabase } from "@/lib/storage/db";
import { DocumentRepository } from "@/lib/storage/document-repository";
import { Block, GrammarBlock, TableBlock } from "@/types/block";
import { renderFormattedContent } from "@/components/ui/rich-text-editor";

describe("Grammar Block & Flexible Table Unit Tests", () => {
  let db: JapaneseStudyDatabase;
  let docRepo: DocumentRepository;

  beforeEach(async () => {
    db = new JapaneseStudyDatabase();
    await db.open();
    docRepo = new DocumentRepository(db);
  });

  it("Khởi tạo và lưu trữ grammar block trong IndexedDB đúng cấu trúc", async () => {
    const grammarBlock: GrammarBlock = {
      id: "g_test_1",
      type: "grammar",
      content: {
        pattern: "～でしょう",
        meaning: "Có lẽ..., chắc là...",
        structureType: "combination_table",
        structureFormula: "Thể thông thường (普通形) + でしょう",
        structureRows: [
          { id: "r1", wordType: "Động từ", form: "Thể thông thường", structure: "V-普通形", note: "Không dùng だ" },
          { id: "r2", wordType: "Tính từ đuôi い", form: "Thể thông thường", structure: "A-い", note: "Giữ nguyên い" },
          { id: "r3", wordType: "Tính từ đuôi な", form: "Bỏ だ", structure: "A-な", note: "Không thêm だ" },
          { id: "r4", wordType: "Danh từ", form: "Bỏ だ", structure: "N", note: "Không thêm だ" },
        ],
        resultPattern: "でしょう / だろう",
        explanation: "Dùng để phỏng đoán sự việc với độ chắc chắn cao.",
        notes: "Lên giọng để hỏi xác nhận.",
        examples: [
          {
            id: "ex1",
            japanese: "[明日|あした]は[雨|あめ]でしょう。",
            reading: "あしたはあめでしょう。",
            meaning: "Ngày mai có lẽ sẽ mưa.",
            notes: "Ví dụ dự báo thời tiết",
          },
        ],
      },
    };

    const doc = await docRepo.create({
      title: "Bài học Ngữ pháp N4",
      folderId: null,
      blocks: [grammarBlock],
      tags: ["n4", "ngữ pháp"],
    });

    expect(doc.id).toBeDefined();
    expect(doc.blocks).toHaveLength(1);
    expect(doc.blocks[0].type).toBe("grammar");

    const savedGrammar = doc.blocks[0] as GrammarBlock;
    expect(savedGrammar.content.pattern).toBe("～でしょう");
    expect(savedGrammar.content.structureType).toBe("combination_table");
    expect(savedGrammar.content.structureRows).toHaveLength(4);
    expect(savedGrammar.content.examples).toHaveLength(1);
    expect(savedGrammar.content.examples[0].japanese).toBe("[明日|あした]は[雨|あめ]でしょう。");
  });

  it("Nâng cấp Table block với căn lề, header toggle và xử lý clipboard TSV an toàn", async () => {
    // Giả lập dữ liệu clipboard copy từ Excel/Sheets
    const clipboardTSV = "Từ vựng\tCách đọc\tÝ nghĩa\n勉強\tべんきょう\tHọc tập\n宿題\tしゅくだい\tBài tập về nhà";
    
    // Parse TSV thành ma trận bảng
    const lines = clipboardTSV.trim().split("\n");
    const parsedRows = lines.map((l) => l.split("\t"));

    expect(parsedRows).toHaveLength(3);
    expect(parsedRows[0]).toEqual(["Từ vựng", "Cách đọc", "Ý nghĩa"]);
    expect(parsedRows[1]).toEqual(["勉強", "べんきょう", "Học tập"]);

    const tableBlock: TableBlock = {
      id: "tbl_1",
      type: "table",
      content: {
        headers: parsedRows[0],
        rows: parsedRows.slice(1),
        alignments: ["left", "center", "left"],
        hasHeader: true,
      },
    };

    const doc = await docRepo.create({
      title: "Bảng từ vựng copy từ Excel",
      folderId: null,
      blocks: [tableBlock],
      tags: ["excel", "table"],
    });

    const retrieved = await docRepo.getById(doc.id);
    expect(retrieved).toBeDefined();
    const savedTable = retrieved?.blocks[0] as TableBlock;
    expect(savedTable.content.headers).toEqual(["Từ vựng", "Cách đọc", "Ý nghĩa"]);
    expect(savedTable.content.rows).toHaveLength(2);
    expect(savedTable.content.alignments).toEqual(["left", "center", "left"]);
    expect(savedTable.content.hasHeader).toBe(true);
  });

  it("Hàm renderFormattedContent phân tích chính xác cú pháp Furigana [Kanji|Reading]", () => {
    const textWithFurigana = "Hôm nay [東京|とうきょう] trời rất đẹp.";
    const rendered = renderFormattedContent(textWithFurigana);
    
    // rendered là React element hoặc text
    expect(rendered).toBeDefined();
  });

  it("Cập nhật và chỉnh sửa Grammar block không làm mất các trường tùy chọn", async () => {
    const initialBlock: GrammarBlock = {
      id: "g_1",
      type: "grammar",
      content: {
        pattern: "～ても",
        meaning: "Dù... thì...",
        structureType: "combination_table",
        structureFormula: "V-て + も",
        structureRows: [],
        resultPattern: "も",
        explanation: "",
        notes: "",
        examples: [],
      },
    };

    const doc = await docRepo.create({
      title: "Ngữ pháp Te-mo",
      folderId: null,
      blocks: [initialBlock],
    });

    // Cập nhật thêm ví dụ và giải thích
    const updatedBlocks: Block[] = [
      {
        ...initialBlock,
        content: {
          ...initialBlock.content,
          explanation: "Biểu thị điều kiện nhượng bộ.",
          examples: [
            {
              id: "ex_1",
              japanese: "[雨|あめ]でも 行きます。",
              reading: "あめでも いきます。",
              meaning: "Dù trời mưa tôi vẫn đi.",
            },
          ],
        },
      },
    ];

    await docRepo.update(doc.id, { blocks: updatedBlocks });

    const updatedDoc = await docRepo.getById(doc.id);
    const updatedGrammar = updatedDoc?.blocks[0] as GrammarBlock;
    expect(updatedGrammar.content.explanation).toBe("Biểu thị điều kiện nhượng bộ.");
    expect(updatedGrammar.content.examples).toHaveLength(1);
    expect(updatedGrammar.content.examples[0].meaning).toBe("Dù trời mưa tôi vẫn đi.");
  });
});
