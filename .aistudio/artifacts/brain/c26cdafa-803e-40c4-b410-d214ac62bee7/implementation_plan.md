# Sistem Manajemen Peminjaman Ruangan Gedung Learning Center

Aplikasi web interaktif modern untuk pengelolaan dan peminjaman ruangan di Gedung Learning Center (Lantai 2 dan Lantai 3) yang dilengkapi validasi anti-bentrok waktu (overlapping detection), visual timeline ketersediaan harian, ekspor data ke CSV, kartu bukti booking digital, serta ekspor file mandiri `app.py` (Streamlit + SQLite) untuk eksekusi langsung di lingkungan lokal via terminal.

### User Review & Critical Decisions

> [!IMPORTANT]
> Berdasarkan konfirmasi kebutuhan pada sesi klarifikasi:
> - **Mode Implementasi**: Disediakan aplikasi web interaktif langsung berbasis browser di AI Studio yang mensimulasikan alur kerja Streamlit lengkap dengan persistent storage lokal, sekaligus menyediakan tab viewer & tombol unduh file satu berkas `app.py` (Streamlit + SQLite) siap pakai.
> - **Visual Timeline Ketersediaan**: Menampilkan matriks grid jam operasional (08:00–18:00) per ruangan untuk tanggal terpilih, sehingga pengguna dapat melihat slot kosong dan terisi secara seketika.
> - **Fitur Ekspor & Bukti Booking**: Disediakan fitur download CSV untuk arsip/laporan dan pop-up / kartu ringkasan bukti peminjaman digital (Booking Pass) yang dapat disalin atau dicetak.

---

### 1. Overview & Core Concept

- **Apa yang Dibangun**: Sistem peminjaman ruangan terintegrasi khusus Gedung Learning Center dengan master data ruangan lantai 2 (Think Room, Big Room) dan lantai 3 (Competent Room, People Room, Great Room, Character Room) berkapasitas maksimal 20 orang.
- **Target Pengguna**: Pegawai, instruktur pelatihan, panitia acara, dan sekretariat Learning Center yang mengakses via laptop maupun smartphone.
- **Nilai Utama**: 
  - Mencegah jadwal bentrok (double-booking) secara otomatis dengan validasi interval waktu matematis (`start_time < existing_end` dan `end_time > existing_start`).
  - Menghindari kelebihan kapasitas dengan batasan ketat maksimal 20 orang.
  - Memudahkan pemantauan ketersediaan ruangan lewat visual timeline dan tabel interaktif yang dapat difilter berdasarkan tanggal dan lantai.

---

### 2. User Experience & Visual Design

#### A. Alur Pengguna (User Flows)
1. **Navigasi Sidebar Modern**:
   - **Dashboard & Timeline Jadwal**: Pemantauan jadwal harian, filter tanggal & lantai/ruangan, visual timeline grid per jam, pencarian agenda, dan tombol pembatalan peminjaman.
   - **Formulir Booking Ruangan**: Pemilihan ruangan terkelompok per lantai, input tanggal & waktu mulai/selesai, input nama peminjam, nama kegiatan, dan jumlah peserta dengan validasi interaktif.
   - **Kode Sumber Python (app.py)**: Penampil kode Python Streamlit + SQLite utuh dengan tombol salin (copy) satu klik dan tombol unduh `app.py` langsung ke komputer pengguna, lengkap dengan instruksi eksekusi terminal.
2. **Umpan Balik Validasi & Konfirmasi**:
   - Jika jam mulai $\ge$ jam selesai: Muncul notifikasi error instan.
   - Jika peserta $> 20$ orang: Muncul pesan validasi kapasitas ruang terlampaui.
   - Jika terdapat jadwal yang beririsan pada ruangan dan tanggal yang sama: Muncul detail bentrok (siapa peminjam dan jam berapa ruang terpakai).
   - Jika sukses: Ditampilkan kartu bukti peminjaman digital (Booking Pass) dengan opsi ekspor dan cetak.

#### B. Identitas Visual & Desain UI (Anti-Slop & SaaS Guidelines)
- **Arah Estetika**: Clean Enterprise SaaS bergaya modern profesional institusi pendidikan/pelatihan (Learning Center).
- **Palet Warna (60-30-10)**:
  - *60% Kanvas Netral*: Slate-50 / crisp white background dengan kontras halus.
  - *30% Struktur & Permukaan*: Slate-100/200 borders, card background putih solid dengan border hairline 1px (`border-slate-200`), tipografi slate-900 / slate-600.
  - *10% Aksen*: Indigo/Navy profesional (`#1E3A8A` dan `#2563EB`) untuk tombol aksi primer dan highlight navigasi aktif; Emerald (`#059669`) untuk status berhasil/tersedia, dan Crimson/Rose (`#DC2626`) untuk slot terisi/bentrok.
- **Tipografi**:
  - Display & Headings: Clean Geometric Sans (`Plus Jakarta Sans` / modern system font sans).
  - Data Numerik & Jam: Tabular figures monospace (`font-mono tabular-nums`) untuk jam peminjaman (misal `09:00 - 11:30`) dan jumlah peserta.
- **Tanpa Elemen Slop**:
  - Metadata disajikan bersih tanpa tumpukan pill badge warna-warni yang berlebihan.
  - Tidak ada floating status dots palsu atau jargon mock-up.
  - Responsif penuh untuk mobile portrait (stacked layout) dan desktop (sidebar + multi-column view).

---

### 3. Key Product Decisions & Trade-Offs

- **Dual-Delivery (Interaktif Web App + File Python app.py Asli)**:
  - *Keputusan*: Membangun aplikasi web lengkap yang langsung aktif dan responsif di browser pengguna (menggunakan state SQLite/IndexedDB terpadu) serta menyertakan file `app.py` murni (menggunakan `streamlit` dan `sqlite3` standar Python).
  - *Alasan*: Pengguna dapat langsung mencoba dan mendemokan sistem di web AI Studio tanpa perlu menginstal Python terlebih dahulu, sekaligus mendapatkan kode `app.py` 100% siap dijalankan di laptop mereka melalui `streamlit run app.py`.
- **Validasi Interval Waktu (Overlapping Algorithm)**:
  - *Keputusan*: Dua rentang waktu $[S_1, E_1)$ dan $[S_2, E_2)$ beririsan jika dan hanya jika $S_1 < E_2 \land S_2 < E_1$.
  - *Alasan*: Menjamin tidak ada celah tumpang tindih waktu, sekaligus mengizinkan sesi baru dimulai tepat di menit yang sama saat sesi sebelumnya berakhir (misal sesi 1 selesai 10:00, sesi 2 mulai 10:00 diizinkan tanpa bentrok).
- **Master Data Ruangan Terkunci**:
  - Lantai 2: *Think Room* (Maks 20), *Big Room* (Maks 20).
  - Lantai 3: *Competent Room* (Maks 20), *People Room* (Maks 20), *Great Room* (Maks 20), *Character Room* (Maks 20).

---

### 4. Technical Architecture & Data Strategy

#### A. Diagram Arsitektur Komponen

```
┌────────────────────────────────────────────────────────────────────────┐
│             Sistem Peminjaman Ruangan Gedung Learning Center           │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌──────────────────────┐                           ┌─────────────────────┐
│  Sidebar Navigation  │                           │   Main Viewport     │
│  - Dashboard Jadwal  │                           ├─────────────────────┤
│  - Form Booking Baru │                           │ Mode:               │
│  - Visual Timeline   │                           │ 1. Dashboard & Table│
│  - Python app.py     │                           │ 2. Form Peminjaman  │
└──────────┬───────────┘                           │ 3. Timeline Jam     │
           │                                       │ 4. Code Exporter    │
           │                                       └──────────┬──────────┘
           ▼                                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│               Data Store & Collision Validation Engine                 │
│  - Tabel `bookings` (id, room_name, floor, booking_date,               │
│                     start_time, end_time, booker_name,                 │
│                     event_name, participant_count)                     │
│  - Validasi Kapasitas (<= 20) & Jam Mulai < Jam Selesai                │
│  - Validasi Overlap SQL: WHERE room_name = ? AND booking_date = ?      │
│                         AND start_time < ? AND end_time > ?            │
│  - LocalStorage / IndexedDB Sync + CSV Exporter + app.py Bundler       │
└────────────────────────────────────────────────────────────────────────┘
```

#### B. Skema Database SQLite (Diaplikasikan pada Python app.py dan Web Store)
```sql
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_name TEXT NOT NULL,
    floor INTEGER NOT NULL,
    booking_date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    booker_name TEXT NOT NULL,
    event_name TEXT NOT NULL,
    participant_count INTEGER NOT NULL
);
```

#### C. Struktur File `app.py` Python Streamlit
1. Inisialisasi koneksi SQLite (`learning_center.db`) dan pembuatan tabel `bookings`.
2. Fungsi helper query:
   - `get_all_bookings(filter_date, filter_room, filter_floor)`
   - `check_collision(room_name, booking_date, start_time, end_time, exclude_id)`
   - `add_booking(...)`
   - `delete_booking(booking_id)`
3. Halaman Streamlit dengan `st.sidebar`:
   - Navigasi menu: "📅 Jadwal & Dashboard", "📝 Booking Ruangan", "📊 Timeline Ketersediaan".
   - Form booking dengan pengelompokan lantai, validasi kapasitas $> 20$, dan validasi overlap.
   - Tampilan tabel `st.dataframe` dengan filter tanggal & lantai, serta tombol aksi hapus/batal.
   - Unduh CSV jadwal langsung dari Streamlit.

---
