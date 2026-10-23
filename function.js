import fs from "fs";
import { books } from "./data.js";

const FILE_NAME = "books.json";
const LOAN_DAYS = 7; // lama peminjaman (hari)
const FINE_PER_DAY = 1000; // denda per hari terlambat (Rp)
const ONE_DAY = 24 * 60 * 60 * 1000;

// ================= HELPER =================
const formatRupiah = (angka) => `Rp${angka.toLocaleString("id-ID")}`;

const today = () => new Date().toISOString().slice(0, 10);

const addDays = (days) =>
  new Date(Date.now() + days * ONE_DAY).toISOString().slice(0, 10);

const isValidYear = (year) =>
  Number.isInteger(year) && year > 0 && year <= new Date().getFullYear();

// Membuat ID otomatis: B001, B002, dst. (pakai reduce)
const generateId = () => {
  const maxNumber = books.reduce(
    (max, book) => Math.max(max, parseInt(book.id.slice(1))),
    0
  );
  return `B${String(maxNumber + 1).padStart(3, "0")}`;
};

// ================= FILE (SIMPAN & MUAT) =================
export const saveBooksToFile = () => {
  fs.writeFileSync(FILE_NAME, JSON.stringify(books, null, 2));
};

export const loadBooksFromFile = () => {
  if (fs.existsSync(FILE_NAME)) {
    const loaded = JSON.parse(fs.readFileSync(FILE_NAME));
    books.splice(0, books.length, ...loaded); // ganti isi array (spread)
    console.log("Data buku berhasil dimuat dari file.");
  } else {
    console.log("Belum ada file tersimpan, memakai data awal.");
  }
};

// ================= CREATE =================
export const addBook = ({ title, author, year }) => {
  const yearNumber = Number(year);

  if (!title || !author || !year) {
    console.log("Semua field wajib diisi!");
    return;
  }

  if (!isValidYear(yearNumber)) {
    console.log("Tahun terbit tidak valid! Contoh: 2020");
    return;
  }

  // Cegah buku dobel (judul & penulis sama)
  const isDuplicate = books.some(
    (book) =>
      book.title.toLowerCase() === title.toLowerCase() &&
      book.author.toLowerCase() === author.toLowerCase()
  );
  if (isDuplicate) {
    console.log(`Buku "${title}" karya ${author} sudah terdaftar!`);
    return;
  }

  const newBook = {
    id: generateId(),
    title,
    author,
    year: yearNumber,
    status: "tersedia",
    borrower: null,
    borrowDate: null,
    dueDate: null,
  };

  books.push(newBook);
  saveBooksToFile();
  console.log(`Buku "${title}" berhasil ditambahkan dengan ID ${newBook.id}.`);
};

// ================= READ =================
export const getAllBooks = () => {
  console.log("Daftar Semua Buku:");
  if (books.length === 0) {
    console.log("(Belum ada buku)");
    return books;
  }
  console.table(books);
  return books;
};

export const getBookById = (id) => {
  const book = books.find((b) => b.id === id.toUpperCase());
  if (!book) {
    console.log(`Buku dengan ID ${id} tidak ditemukan.`);
    return null;
  }
  console.table([book]);
  return book;
};

// ================= UPDATE =================
export const updateBook = (id, updatedData) => {
  const index = books.findIndex((b) => b.id === id.toUpperCase());
  if (index === -1) {
    console.log(`Tidak ada buku dengan ID ${id}.`);
    return;
  }

  if (Object.keys(updatedData).length === 0) {
    console.log("Tidak ada data yang diubah.");
    return;
  }

  if (updatedData.year !== undefined && !isValidYear(updatedData.year)) {
    console.log("Tahun terbit tidak valid!");
    return;
  }

  // Spread: salin data lama, timpa dengan data baru
  books[index] = { ...books[index], ...updatedData };
  saveBooksToFile();
  console.log(`Data buku ${books[index].id} berhasil diperbarui.`);
};

// Peminjaman = Update status menjadi "dipinjam"
export const borrowBook = (id, borrower) => {
  const index = books.findIndex((b) => b.id === id.toUpperCase());
  if (index === -1) {
    console.log(`Tidak ada buku dengan ID ${id}.`);
    return;
  }

  if (!borrower) {
    console.log("Nama peminjam wajib diisi!");
    return;
  }

  if (books[index].status !== "tersedia") {
    console.log(
      `Buku "${books[index].title}" sedang dipinjam oleh ${books[index].borrower}.`
    );
    return;
  }

  books[index] = {
    ...books[index],
    status: "dipinjam",
    borrower,
    borrowDate: today(),
    dueDate: addDays(LOAN_DAYS),
  };
  saveBooksToFile();
  console.log(
    `${borrower} meminjam "${books[index].title}". Batas kembali: ${books[index].dueDate}.`
  );
};

// Pengembalian = Update status menjadi "tersedia"
export const returnBook = (id) => {
  const index = books.findIndex((b) => b.id === id.toUpperCase());
  if (index === -1) {
    console.log(`Tidak ada buku dengan ID ${id}.`);
    return;
  }

  const { title, status, borrower, dueDate } = books[index]; // destructuring object

  if (status !== "dipinjam") {
    console.log(`Buku "${title}" tidak sedang dipinjam.`);
    return;
  }

  // Hitung keterlambatan
  const diffDays = Math.floor((new Date(today()) - new Date(dueDate)) / ONE_DAY);
  const lateDays = diffDays > 0 ? diffDays : 0;
  const fine = lateDays * FINE_PER_DAY;

  books[index] = {
    ...books[index],
    status: "tersedia",
    borrower: null,
    borrowDate: null,
    dueDate: null,
  };
  saveBooksToFile();

  console.log(`"${title}" dikembalikan oleh ${borrower}.`);
  if (lateDays > 0) {
    console.log(`Terlambat ${lateDays} hari. Denda: ${formatRupiah(fine)}`);
  } else {
    console.log("Dikembalikan tepat waktu. Tidak ada denda.");
  }
};

// ================= DELETE =================
export const deleteBook = (id) => {
  const index = books.findIndex((b) => b.id === id.toUpperCase());
  if (index === -1) {
    console.log(`Tidak ada buku dengan ID ${id}.`);
    return;
  }

  if (books[index].status === "dipinjam") {
    console.log("Buku sedang dipinjam, tidak bisa dihapus!");
    return;
  }

  const [deleted] = books.splice(index, 1); // destructuring array
  saveBooksToFile();
  console.log(`Buku "${deleted.title}" berhasil dihapus.`);
};

// ================= FITUR TAMBAHAN =================
export const searchByTitle = (keyword) => {
  const result = books.filter((b) =>
    b.title.toLowerCase().includes(keyword.toLowerCase())
  );
  console.log(`Hasil pencarian "${keyword}": ${result.length} buku`);
  if (result.length > 0) console.table(result);
  return result;
};

export const filterByStatus = (status) => {
  const result = books.filter((b) => b.status === status);
  console.log(`Daftar buku berstatus "${status}":`);
  console.table(result);
  return result;
};

export const sortByTitle = () => {
  const sorted = [...books].sort((a, b) => a.title.localeCompare(b.title));
  console.log("Daftar buku diurutkan berdasarkan judul (A-Z):");
  console.table(sorted);
  return sorted;
};

// Menampilkan buku yang sedang dipinjam memakai perulangan for...of
export const showBorrowedBooks = () => {
  const borrowed = books.filter((b) => b.status === "dipinjam");

  if (borrowed.length === 0) {
    console.log("Tidak ada buku yang sedang dipinjam.");
    return;
  }

  console.log("Buku yang sedang dipinjam:");
  let no = 1;
  for (const { id, title, borrower, dueDate } of borrowed) {
    console.log(`${no}. [${id}] ${title} - ${borrower} (kembali: ${dueDate})`);
    no++;
  }
};

export const showSummary = () => {
  const total = books.length;
  const borrowed = books.filter((b) => b.status === "dipinjam").length;
  const [newest] = [...books].sort((a, b) => b.year - a.year);
  const titles = books.map((b) => b.title);

  console.log(`
===== RINGKASAN PERPUSTAKAAN =====
Total buku     : ${total}
Tersedia       : ${total - borrowed}
Sedang dipinjam: ${borrowed}
Buku terbaru   : ${newest ? `${newest.title} (${newest.year})` : "-"}
Semua judul    : ${titles.join(", ") || "-"}
==================================`);
};