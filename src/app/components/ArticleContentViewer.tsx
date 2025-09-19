'use client'; // Komponen ini harus berjalan di sisi klien

import DOMPurify from 'dompurify';

// Terima konten HTML sebagai prop
export default function ArticleContentViewer({ content }: { content: string }) {
  // Bersihkan HTML dari tag berbahaya seperti <script>
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    // Gunakan dangerouslySetInnerHTML untuk merender HTML yang sudah bersih
    <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
  );
}