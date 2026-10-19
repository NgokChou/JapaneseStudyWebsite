import { DocumentTemplate } from "@/types/template";
import { Block } from "@/types/block";

export const BUILTIN_TEMPLATES: DocumentTemplate[] = [
  {
    id: "template-minna-lesson",
    name: "Bài học Minna no Nihongo (Mẫu hoàn chỉnh)",
    description: "Cấu trúc chuẩn theo giáo trình: Thông tin bài, Từ vựng bảng, Ngữ pháp, Hội thoại và Bài tập luyện tập.",
    category: "japanese",
    tags: ["minna", "tiếng nhật", "toàn diện", "n5"],
    blocks: [
      {
        id: "b-header",
        type: "heading",
        content: {
          level: 1,
          text: "Bài 1: Giới thiệu bản thân & Nghề nghiệp (自己紹介)",
        },
      },
      {
        id: "b-goal",
        type: "callout",
        content: {
          variant: "japanese",
          title: "Mục tiêu bài học",
          text: "Nắm vững cách xưng hô, chào hỏi lần đầu (初めまして), giới thiệu tên, quốc tịch, nghề nghiệp với trợ từ は (wa) và động từ です (desu).",
        },
      },
      {
        id: "b-h2-vocab",
        type: "heading",
        content: {
          level: 2,
          text: "I. Từ vựng trọng tâm (単語)",
        },
      },
      {
        id: "b-vocab-table",
        type: "vocab_table",
        content: {
          title: "Bảng từ vựng cơ bản",
          rows: [
            { id: "v1", kanji: "私", reading: "わたし", meaning: "Tôi (ngôi thứ nhất)", example: "わたしはベトナム人です。" },
            { id: "v2", kanji: "あなた", reading: "あなた", meaning: "Bạn, anh, chị (ngôi thứ hai)", example: "あなたはお元気ですか。" },
            { id: "v3", kanji: "先生", reading: "せんせい", meaning: "Thầy/Cô giáo (dùng gọi người khác)", example: "田中先生は日本語を教えます。" },
            { id: "v4", kanji: "学生", reading: "がくせい", meaning: "Học sinh, sinh viên", example: "ナムさんはハノイ大学の学生です。" },
            { id: "v5", kanji: "会社員", reading: "かいしゃいん", meaning: "Nhân viên công ty", example: "サントスさんは会社員です。" },
            { id: "v6", kanji: "日本人", reading: "にほんじん", meaning: "Người Nhật Bản", example: "山田さんは日本人です。" },
          ],
        },
      },
      {
        id: "b-h2-grammar",
        type: "heading",
        content: {
          level: 2,
          text: "II. Cấu trúc ngữ pháp (文法)",
        },
      },
      {
        id: "b-grammar-rule1",
        type: "callout",
        content: {
          variant: "tip",
          title: "Ngữ pháp 1: Khẳng định — [N1] は [N2] です",
          text: "N1 là N2. Trợ từ「は」được phát âm là「wa」, đứng sau chủ ngữ hoặc chủ đề câu.「です」biểu thị thái độ lịch sự.",
        },
      },
      {
        id: "b-grammar-ex1",
        type: "paragraph",
        content: {
          text: "• わたしは マイ・アン です。(Tôi là Mai An.)\n• ミラーさんは アメリカ人 です。(Anh Miller là người Mỹ.)\n• ワンさんは 医者(いしゃ) です。(Anh Wang là bác sĩ.)",
        },
      },
      {
        id: "b-grammar-rule2",
        type: "callout",
        content: {
          variant: "tip",
          title: "Ngữ pháp 2: Phủ định — [N1] は [N2] じゃ（では）ありません",
          text: "N1 không phải là N2. Trong văn nói thân mật hay dùng「じゃありません」; trong văn viết hoặc tình huống trang trọng dùng「ではありません」.",
        },
      },
      {
        id: "b-grammar-ex2",
        type: "paragraph",
        content: {
          text: "• サントスさんは 学生 じゃありません。(Anh Santos không phải là học sinh.)\n• わたしは 先生 ではありません。(Tôi không phải là giáo viên.)",
        },
      },
      {
        id: "b-h2-dialogue",
        type: "heading",
        content: {
          level: 2,
          text: "III. Hội thoại mẫu: Lần đầu gặp mặt (初めまして)",
        },
      },
      {
        id: "b-dialogue-content",
        type: "dialogue",
        content: {
          title: "Chào hỏi tại công ty",
          lines: [
            { id: "d1", speaker: "山田 (Yamada)", japanese: "初めまして。山田です。よろしくお願いします。", reading: "はじめまして。やまだです。よろしくおねがいします。", vietnamese: "Rất hân hạnh được gặp bạn. Tôi là Yamada. Rất mong được giúp đỡ." },
            { id: "d2", speaker: "ミラー (Miller)", japanese: "初めまして。マイク・ミラーです。アメリカから来ました。どうぞよろしく。", reading: "はじめまして。マイク・ミラーです。アメリカからきました。どうぞよろしく。", vietnamese: "Chào bạn. Tôi là Mike Miller. Tôi đến từ Mỹ. Rất mong được giúp đỡ ạ." },
          ],
        },
      },
      {
        id: "b-h2-exercise",
        type: "heading",
        content: {
          level: 2,
          text: "IV. Bài tập củng cố (練習)",
        },
      },
      {
        id: "b-exercise-list",
        type: "numbered_list",
        content: {
          items: [
            "Điền trợ từ thích hợp: わたし ( ____ ) ベトナム人 です。",
            "Chuyển câu sang dạng phủ định: 田中さんは 医者 です。",
            "Tự viết 3 câu giới thiệu bản thân bằng tiếng Nhật (Tên, nghề nghiệp, quê quán).",
          ],
        },
      },
    ],
  },
  {
    id: "template-vocab-notebook",
    name: "Sổ từ vựng chuyên sâu (Vocabulary Notebook)",
    description: "Bảng từ vựng linh hoạt có Kanji, Hiragana, Nghĩa tiếng Việt và Ví dụ thực tế.",
    category: "japanese",
    tags: ["từ vựng", "kanji", "bảng"],
    blocks: [
      {
        id: "b-v-title",
        type: "heading",
        content: {
          level: 1,
          text: "Sổ từ vựng chuyên đề: [Nhập tên chủ đề vào đây]",
        },
      },
      {
        id: "b-v-callout",
        type: "callout",
        content: {
          variant: "info",
          title: "Phương pháp ghi nhớ từ vựng",
          text: "Hãy đặt ít nhất 1 câu ví dụ thực tế cho mỗi từ vựng để nắm rõ ngữ cảnh và cách kết hợp từ.",
        },
      },
      {
        id: "b-v-table",
        type: "vocab_table",
        content: {
          title: "Danh sách từ mới",
          rows: [
            { id: "r1", kanji: "約束", reading: "やくそく", meaning: "Lời hứa, cuộc hẹn", example: "友達と映画を見る約束をしました。" },
            { id: "r2", kanji: "準備", reading: "じゅんび", meaning: "Sự chuẩn bị", example: "旅行の準備はもう終わりましたか。" },
            { id: "r3", kanji: "経験", reading: "けいけん", meaning: "Kinh nghiệm, trải nghiệm", example: "日本での生活はいい経験になりました。" },
          ],
        },
      },
    ],
  },
  {
    id: "template-general-notes",
    name: "Tài liệu ghi chú tổng quát (Universal Notes)",
    description: "Mẫu ghi chép linh hoạt gồm tiêu đề, ghi chú nổi bật, danh sách và bảng biểu.",
    category: "general",
    tags: ["ghi chú", "tổng quát", "bài học"],
    blocks: [
      {
        id: "b-g-title",
        type: "heading",
        content: {
          level: 1,
          text: "Tiêu đề tài liệu ghi chú",
        },
      },
      {
        id: "b-g-note",
        type: "callout",
        content: {
          variant: "tip",
          title: "Tóm tắt nhanh",
          text: "Ghi lại những điểm cốt lõi nhất của buổi học hoặc tài liệu tại đây.",
        },
      },
      {
        id: "b-g-h2-1",
        type: "heading",
        content: {
          level: 2,
          text: "1. Các nội dung trọng tâm",
        },
      },
      {
        id: "b-g-list",
        type: "bullet_list",
        content: {
          items: [
            "Điểm quan trọng thứ nhất cần ghi nhớ",
            "Điểm quan trọng thứ hai kèm lưu ý",
            "Tài liệu và liên kết tham khảo bổ sung",
          ],
        },
      },
    ],
  },
  {
    id: "template-blank",
    name: "Tài liệu trống (Blank Document)",
    description: "Bắt đầu với một trang trắng tinh, tự do thêm các khối nội dung theo ý muốn.",
    category: "general",
    tags: ["trắng", "tự do"],
    blocks: [
      {
        id: "b-blank-1",
        type: "heading",
        content: {
          level: 1,
          text: "Tài liệu mới",
        },
      },
      {
        id: "b-blank-2",
        type: "paragraph",
        content: {
          text: "",
        },
      },
    ],
  },
];
