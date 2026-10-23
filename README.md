# Sistem Peminjaman Buku Berbasis CLI

## Gambaran Umum

Aplikasi backend sederhana berbasis terminal (CLI) untuk mengelola perpustakaan. Pengguna dapat menambah, melihat, mengubah, dan menghapus data buku, serta mencatat peminjaman dan pengembalian buku. Data disimpan sebagai **Array of Objects** di memori dan otomatis disimpan ke file `books.json` agar tidak hilang saat program ditutup.

Fitur utama:

- CRUD data buku
- Peminjaman buku (batas 7 hari) dan pengembalian dengan perhitungan denda (Rp1.000/hari terlambat)
- Pencarian berdasarkan judul, filter berdasarkan status, dan pengurutan berdasarkan judul
- Daftar buku yang sedang dipinjam dan ringkasan perpustakaan
- Validasi input (field kosong, tahun tidak valid, ID tidak ditemukan, buku dobel, buku sedang dipinjam)

## Cara Menjalankan Program

1. Pastikan Node.js sudah terinstal (cek dengan `node -v`).
2. Buka terminal dan masuk ke folder proyek.
3. Pastikan `package.json` berisi `"type": "module"` (sudah disertakan).
4. Jalankan:

```
node main.js
```

atau

```
npm start
```

5. Pilih menu dengan mengetik angka 0-12, lalu ikuti instruksi di layar.

## Format Data

Setiap buku disimpan sebagai object di dalam array `books`:

```js
{
  id: "B001",
  title: "Laskar Pelangi",
  author: "Andrea Hirata",
  year: 2005,
  status: "tersedia",
  borrower: null,
  borrowDate: null,
  dueDate: null
}
```

| Key | Tipe | Keterangan |
|---|---|---|
| `id` | string | ID unik, dibuat otomatis (B001, B002, ...) |
| `title` | string | Judul buku |
| `author` | string | Nama penulis |
| `year` | number | Tahun terbit |
| `status` | string | `"tersedia"` atau `"dipinjam"` |
| `borrower` | string / null | Nama peminjam (null jika tersedia) |
| `borrowDate` | string / null | Tanggal pinjam (YYYY-MM-DD) |
| `dueDate` | string / null | Batas pengembalian (YYYY-MM-DD) |

## Penjelasan Function CRUD

| Operasi | Function | Peran |
|---|---|---|
| **Create** | `addBook()` | Memvalidasi input, membuat ID otomatis, lalu menambahkan buku baru ke array dengan `push()` |
| **Read** | `getAllBooks()` | Menampilkan semua buku dalam bentuk tabel |
| **Read** | `getBookById()` | Mencari satu buku berdasarkan ID dengan `find()` |
| **Update** | `updateBook()` | Mengubah judul/penulis/tahun buku memakai spread operator |
| **Update** | `borrowBook()` | Mengubah status buku menjadi `dipinjam` dan mencatat peminjam serta batas kembali |
| **Update** | `returnBook()` | Mengubah status kembali menjadi `tersedia` dan menghitung denda jika terlambat |
| **Delete** | `deleteBook()` | Menghapus buku dengan `splice()` (ditolak jika buku sedang dipinjam) |

Fungsi tambahan: `searchByTitle()`, `filterByStatus()`, `sortByTitle()`, `showBorrowedBooks()`, `showSummary()`, `saveBooksToFile()`, `loadBooksFromFile()`.

## Struktur Project

- `data.js` : data awal buku (Array of Objects)
- `functions.js` : seluruh function CRUD dan fitur tambahan
- `main.js` : program utama interaktif (menu CLI)
- `package.json` : konfigurasi Node.js (`"type": "module"`)
- `books.json` : file penyimpanan data (dibuat otomatis)
- `README.md` : dokumentasi proyek

## Penerapan Kriteria

- Arrow function di seluruh program
- `const` / `let` (tanpa `var`), `switch`, `if/else`, dan perulangan `for...of`
- Array methods: `find`, `findIndex`, `filter`, `map`, `reduce`, `some`, `sort`
- Spread operator pada update data dan penyalinan array
- Destructuring pada parameter function, object, dan array
- Template Literals untuk seluruh output teks
- Validasi dengan `===`, `!==`, `&&`, `||`, `!`

## Author

- Nama: Tiara
- Kelas: Trial Study Club Backend Basic Ka Nadia 
