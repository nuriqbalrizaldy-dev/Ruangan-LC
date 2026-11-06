import JSZip from 'jszip';

// Mengambil seluruh file proyek secara raw menggunakan fitur Vite import.meta.glob
const rawProjectFiles = import.meta.glob(
  [
    '/src/**/*',
    '/package.json',
    '/requirements.txt',
    '/README.md',
    '/app.py',
    '/index.html',
    '/vite.config.ts',
    '/tsconfig.json',
    '/.gitignore'
  ],
  {
    query: '?raw',
    import: 'default',
    eager: true
  }
) as Record<string, string>;

export async function downloadProjectZip(filename = 'learning-center-room-booking.zip'): Promise<void> {
  const zip = new JSZip();

  for (const [path, content] of Object.entries(rawProjectFiles)) {
    // Normalisasi path: hapus awalan '/'
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    zip.file(cleanPath, content);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
