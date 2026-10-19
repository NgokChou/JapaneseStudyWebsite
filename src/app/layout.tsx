import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Japanese Study Document Studio - Soạn & Xuất Tài Liệu Học Tiếng Nhật",
  description: "Website cá nhân phục vụ soạn thảo, định dạng chuẩn A4 và xuất PDF/DOCX cho tài liệu học tiếng Nhật (từ vựng, kanji, ngữ pháp, bài tập).",
  keywords: ["tiếng Nhật", "JLPT", "từ vựng", "kanji", "ngữ pháp", "xuất PDF A4", "DOCX"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-indigo-500/15 selection:text-indigo-700 min-h-screen flex flex-col bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
