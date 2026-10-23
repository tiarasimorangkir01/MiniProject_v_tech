import readline from "readline";
import {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
  searchByTitle,
  filterByStatus,
  sortByTitle,
  showBorrowedBooks,
  showSummary,
  loadBooksFromFile,
} from "./function.js";

// Muat data saat program dimulai
loadBooksFromFile();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const showMenu = () => {
  console.log(`
==================================
📚  SISTEM PEMINJAMAN BUKU
==================================
1.  Lihat semua buku
2.  Tambah buku baru
3.  Cari buku berdasarkan ID
4.  Ubah data buku
5.  Hapus buku
6.  Pinjam buku
7.  Kembalikan buku
8.  Cari buku berdasarkan judul
9.  Filter buku berdasarkan status
10. Urutkan buku berdasarkan judul
11. Lihat buku yang sedang dipinjam
12. Ringkasan perpustakaan
0.  Keluar
==================================`);
};

const askMenu = () => {
  showMenu();
  rl.question("Pilih menu (0-12): ", (choice) => {
    switch (choice.trim()) {
      case "1":
        getAllBooks();
        return askMenu();

      case "2":
        rl.question("Judul buku: ", (title) => {
          rl.question("Penulis: ", (author) => {
            rl.question("Tahun terbit: ", (year) => {
              addBook({ title: title.trim(), author: author.trim(), year: year.trim() });
              askMenu();
            });
          });
        });
        break;

      case "3":
        rl.question("Masukkan ID buku (contoh: B001): ", (id) => {
          getBookById(id.trim());
          askMenu();
        });
        break;

      case "4":
        rl.question("Masukkan ID buku yang ingin diubah: ", (id) => {
          console.log("(Kosongkan jika tidak ingin mengubah bagian tersebut)");
          rl.question("Judul baru: ", (title) => {
            rl.question("Penulis baru: ", (author) => {
              rl.question("Tahun terbit baru: ", (year) => {
                // Hanya masukkan field yang diisi (spread + short-circuit)
                const updatedData = {
                  ...(title.trim() && { title: title.trim() }),
                  ...(author.trim() && { author: author.trim() }),
                  ...(year.trim() && { year: Number(year.trim()) }),
                };
                updateBook(id.trim(), updatedData);
                askMenu();
              });
            });
          });
        });
        break;

      case "5":
        rl.question("Masukkan ID buku yang ingin dihapus: ", (id) => {
          deleteBook(id.trim());
          askMenu();
        });
        break;

      case "6":
        rl.question("Masukkan ID buku yang ingin dipinjam: ", (id) => {
          rl.question("Nama peminjam: ", (borrower) => {
            borrowBook(id.trim(), borrower.trim());
            askMenu();
          });
        });
        break;

      case "7":
        rl.question("Masukkan ID buku yang dikembalikan: ", (id) => {
          returnBook(id.trim());
          askMenu();
        });
        break;

      case "8":
        rl.question("Masukkan kata kunci judul: ", (keyword) => {
          searchByTitle(keyword.trim());
          askMenu();
        });
        break;

      case "9":
        rl.question("Status (tersedia/dipinjam): ", (status) => {
          const cleanStatus = status.trim().toLowerCase();
          if (cleanStatus !== "tersedia" && cleanStatus !== "dipinjam") {
            console.log("Status harus 'tersedia' atau 'dipinjam'!");
          } else {
            filterByStatus(cleanStatus);
          }
          askMenu();
        });
        break;

      case "10":
        sortByTitle();
        return askMenu();

      case "11":
        showBorrowedBooks();
        return askMenu();

      case "12":
        showSummary();
        return askMenu();

      case "0":
        console.log("Keluar dari sistem. Terima kasih!");
        rl.close();
        break;

      default:
        console.log("Pilihan tidak valid, coba lagi!");
        askMenu();
        break;
    }
  });
};

// Jalankan program
askMenu();