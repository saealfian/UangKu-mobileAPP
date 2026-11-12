# PRD --- UangKu

## Aplikasi Manajemen Keuangan Pribadi

**Versi:** 1.0\
**Status:** Draft implementasi backend\
**Platform:** Mobile\
**Mata uang:** IDR (Rupiah)\
**Zona waktu default:** Asia/Jakarta

------------------------------------------------------------------------

## 1. Ringkasan Produk

UangKu adalah aplikasi untuk mengelola keuangan pribadi. Pengguna dapat
menetapkan anggaran bulanan, membagi anggaran ke dalam amplop kategori,
mencatat pengeluaran, melihat riwayat transaksi, serta memantau sisa
anggaran.

PRD ini dibuat berdasarkan tiga layar UI/UX: - **Beranda:** ringkasan
bulanan dan empat kartu amplop. - **Catatan:** daftar pengeluaran
bulanan, total transaksi, dan tombol tambah. - **Detail Amplop:**
anggaran kategori, sisa uang, persentase pemakaian, dan transaksi
terbaru.

Dokumen ini berfokus pada kebutuhan backend agar implementasi database,
API, validasi, dan aturan perhitungan dapat dilakukan tanpa menebak
perilaku aplikasi.

### Tujuan

1.  Memberi gambaran kondisi keuangan per bulan.
2.  Memisahkan anggaran berdasarkan kategori.
3.  Mempermudah pencatatan dan peninjauan pengeluaran.
4.  Menjaga konsistensi angka di Beranda, Catatan, dan Detail Amplop.
5.  Menyediakan backend MVP yang mudah dikembangkan.

## 2. Ruang Lingkup

### 2.1 Fitur MVP

  Modul           Fitur                                        Prioritas
  --------------- -------------------------------------------- -----------
  Auth            Register, login, logout, session/token       P0
  Beranda         Ringkasan anggaran, pengeluaran, sisa uang   P0
  Amplop          Daftar, tambah, ubah, arsip amplop           P0
  Anggaran        Anggaran amplop per bulan                    P0
  Detail Amplop   Ringkasan kategori dan transaksi terkait     P0
  Catatan         Daftar transaksi per bulan                   P0
  Pengeluaran     Tambah, lihat, ubah, hapus transaksi         P0
  Periode         Memilih bulan dan tahun                      P0
  Profil          Lihat dan ubah profil dasar                  P1

### 2.2 Tidak termasuk MVP

Integrasi bank/e-wallet, transaksi otomatis, transfer/pembayaran,
multi-currency, investasi, hutang/piutang, ekspor laporan, notifikasi
otomatis, kolaborasi keluarga, dan AI financial advisor.

## 3. Pengguna dan Hak Akses

Aplikasi ditujukan untuk penggunaan keuangan pribadi. Setiap pengguna
hanya boleh mengakses data miliknya sendiri.

Semua data keuangan harus terhubung ke `user_id`, baik secara langsung
maupun melalui relasi. Backend wajib memeriksa kepemilikan data pada
setiap endpoint. Jangan hanya mengandalkan ID yang dikirim frontend.

Jika pengguna A meminta transaksi atau amplop milik pengguna B, backend
tidak boleh mengembalikan data tersebut. Gunakan respons aman seperti
`404 Not Found`.

## 4. Navigasi dan Alur

``` text
Login
  |
  v
Beranda ----------------------> Pilih Amplop
  |                                  |
  |                                  v
  |                             Detail Amplop
  |
  +----> Tab Catatan ----> Daftar Pengeluaran
                                |
                                v
                         Tambah/Edit/Hapus
                                |
                                v
                         Data tersimpan
                                |
                                v
                    Ringkasan diperbarui
  |
  +----> Tab Profil ----> Pengaturan akun
```

Tab utama: - **Beranda:** ringkasan bulan terpilih dan daftar amplop. -
**Catatan:** semua pengeluaran pada bulan terpilih. - **Profil:**
informasi akun dan preferensi.

## 5. Aturan Perhitungan Keuangan

Nominal uang wajib disimpan sebagai integer Rupiah. Contoh Rp65.000
disimpan sebagai `65000`. Jangan gunakan floating point untuk menyimpan
nilai uang.

### 5.1 Total anggaran bulanan

Untuk MVP, total anggaran bulanan dihitung dari seluruh anggaran amplop
pada periode yang dipilih.

``` text
monthly_budget = SUM(envelope_budgets.budget_amount)
```

### 5.2 Total pengeluaran bulanan

``` text
monthly_expense = SUM(expenses.amount)
```

Hanya transaksi aktif yang masuk perhitungan. Transaksi yang
dihapus/void tidak dihitung.

### 5.3 Sisa uang bulanan

``` text
monthly_remaining = monthly_budget - monthly_expense
```

Pada UI, kartu Beranda menampilkan Rp2.600.000 sebagai sisa uang dari
anggaran Rp3.000.000 setelah terpakai Rp400.000. Backend sebaiknya
mengirim field `remaining_amount` secara eksplisit agar tidak ambigu
dengan label visual "Total Bulan Ini".

### 5.4 Perhitungan per amplop

``` text
envelope_spent = SUM(expenses.amount)
envelope_remaining = envelope_budget - envelope_spent
usage_percentage = (envelope_spent / envelope_budget) * 100
```

Ketentuan: - Jika anggaran nol, kembalikan `usage_percentage: 0` dan
`has_budget: false`. - Persentase boleh lebih dari 100% jika pengguna
melewati anggaran. - Sisa uang boleh negatif. - Pembulatan persentase
dilakukan untuk tampilan, bukan pada nilai uang. - Amplop tanpa
transaksi tetap ditampilkan dengan terpakai Rp0.

### 5.5 Dataset contoh sesuai UI

Periode Oktober 2026:

  ------------------------------------------------------------------------------
  Amplop               Anggaran        Terpakai              Sisa      Pemakaian
  ----------- ----------------- --------------- ----------------- --------------
  Makan &           Rp1.200.000       Rp180.000       Rp1.020.000            15%
  Minum                                                           

  Transport           Rp600.000        Rp75.000         Rp525.000          12,5%

  Jajan &             Rp400.000       Rp100.000         Rp300.000            25%
  Hiburan                                                         

  Darurat             Rp800.000        Rp45.000         Rp755.000          5,63%

  **Total**     **Rp3.000.000**   **Rp400.000**   **Rp2.600.000**     **13,33%**
  ------------------------------------------------------------------------------

Contoh enam transaksi: - 13 Okt 2026 --- Makan & Minum --- Rp65.000. -
12 Okt 2026 --- Transport --- Rp75.000. - 11 Okt 2026 --- Makan & Minum
--- Rp55.000. - 10 Okt 2026 --- Jajan & Hiburan --- Rp100.000. - 09 Okt
2026 --- Darurat --- Rp45.000. - 08 Okt 2026 --- Makan & Minum ---
Rp60.000.

Jumlahnya Rp400.000. Data ini hanya untuk development/testing, bukan
data default pengguna.

## 6. Spesifikasi Fitur

### 6.1 Autentikasi

-   Register, login, logout, dan endpoint untuk mendapatkan pengguna
    aktif.
-   Email wajib valid dan unik.
-   Password disimpan sebagai hash yang aman.
-   Endpoint privat wajib menggunakan token/session valid.
-   Password dan password hash tidak boleh dikembalikan oleh API.

### 6.2 Beranda

Menampilkan: - Periode aktif (bulan dan tahun). - Total anggaran
bulanan. - Total pengeluaran bulanan. - Sisa uang bulanan. - Daftar
amplop beserta anggaran, terpakai, sisa, dan persentase.

Perilaku: - Default periode adalah bulan berjalan berdasarkan zona waktu
pengguna. - Saat bulan/tahun diganti, seluruh ringkasan dihitung
ulang. - Ringkasan harus berubah setelah transaksi dibuat, diubah, atau
dihapus. - Amplop tanpa transaksi tetap muncul.

### 6.3 Amplop Kategori

Kategori awal sesuai UI: 1. Makan & Minum. 2. Transport. 3. Jajan &
Hiburan. 4. Darurat.

Setiap amplop memiliki ID, pemilik, nama, icon key, color key, status
aktif, dan timestamp.

Kebutuhan: - Melihat daftar amplop. - Membuat amplop. - Mengubah nama,
ikon, dan warna. - Mengarsipkan amplop. - Mengatur nominal anggaran per
amplop untuk setiap bulan.

Aturan: - Nama wajib diisi (1--100 karakter). - Anggaran tidak boleh
negatif. - Untuk MVP, nama amplop aktif tidak boleh duplikat pada
pengguna yang sama (case-insensitive). - Amplop yang telah memiliki
transaksi tidak boleh dihapus permanen; gunakan arsip. - Amplop arsip
tidak tersedia untuk transaksi baru, tetapi histori tetap bisa dibaca.

### 6.4 Detail Amplop

Menampilkan: - Nama kategori dan deskripsi. - Bulan/tahun terpilih. -
Anggaran kategori. - Total terpakai. - Sisa uang. - Persentase
pemakaian. - Jumlah transaksi. - Tiga transaksi terbaru (sesuai UI).

API harus mendukung pagination/limit untuk riwayat yang lebih panjang.
Daftar diurutkan dari tanggal terbaru. Jika belum ada transaksi, daftar
berupa array kosong dan total terpakai Rp0.

### 6.5 Catatan Pengeluaran Bulanan

Menampilkan semua transaksi pada bulan terpilih dengan: - Tanggal. -
Nama kategori/amplop. - Nominal. - Deskripsi/catatan opsional.

Perilaku: - Default bulan berjalan. - Bisa memilih bulan dan tahun
lain. - Urutkan transaksi dari tanggal terbaru. - `transaction_count`
adalah jumlah transaksi, bukan total nominal. - `total_expense` adalah
jumlah seluruh nominal transaksi. - Daftar harus mendukung pagination.

### 6.6 Tambah Pengeluaran

Field: - `envelope_id` --- wajib. - `amount` --- wajib, integer
positif. - `transaction_date` --- wajib, format `YYYY-MM-DD`. -
`description` --- opsional, maksimal 255 karakter. - `note` ---
opsional.

Alur: 1. Frontend mengambil amplop aktif. 2. Pengguna memilih amplop dan
mengisi nominal, tanggal, serta deskripsi. 3. Backend memvalidasi input
dan kepemilikan amplop. 4. Backend menyimpan transaksi. 5. Backend
mengembalikan data transaksi. 6. Frontend memperbarui Catatan, Detail
Amplop, dan Beranda.

Pengeluaran yang melebihi anggaran tetap boleh disimpan. Backend tidak
boleh menolak transaksi hanya karena anggaran terlampaui.

### 6.7 Ubah dan Hapus Pengeluaran

-   Pengguna hanya dapat mengubah/menghapus transaksi miliknya.
-   Perubahan nominal harus memperbarui seluruh agregat terkait.
-   Perubahan kategori harus mengurangi pemakaian amplop lama dan
    menambah pemakaian amplop baru.
-   Perubahan tanggal dapat memindahkan transaksi ke periode lain.
-   Rekomendasi: soft delete menggunakan `deleted_at`, lalu kecualikan
    transaksi tersebut dari semua perhitungan.

### 6.8 Profil

Field profil: - Nama tampilan. - Email. - Foto profil (opsional). - Zona
waktu. - Mata uang.

Pengguna dapat melihat dan mengubah nama serta preferensi. Perubahan
email sebaiknya membutuhkan verifikasi. Untuk MVP, mata uang dikunci ke
IDR dan zona waktu default `Asia/Jakarta`.

## 7. Rancangan Database

Skema relasional berikut dapat diterapkan di PostgreSQL atau MySQL.

### 7.1 Tabel `users`

  Kolom           Tipe            Keterangan
  --------------- --------------- ----------------------
  id              UUID/BIGINT     Primary key
  name            VARCHAR(100)    Nama pengguna
  email           VARCHAR(255)    Unik
  password_hash   VARCHAR(255)    Hash password
  avatar_url      TEXT nullable   Foto profil
  timezone        VARCHAR(64)     Default Asia/Jakarta
  currency        CHAR(3)         Default IDR
  created_at      TIMESTAMP       Waktu dibuat
  updated_at      TIMESTAMP       Waktu diperbarui

### 7.2 Tabel `envelopes`

  Kolom        Tipe                 Keterangan
  ------------ -------------------- ----------------------
  id           UUID/BIGINT          Primary key
  user_id      UUID/BIGINT          FK users
  name         VARCHAR(100)         Nama amplop
  icon_key     VARCHAR(50)          Key ikon frontend
  color_key    VARCHAR(50)          Key warna frontend
  is_active    BOOLEAN              Status aktif
  created_at   TIMESTAMP            Waktu dibuat
  updated_at   TIMESTAMP            Waktu diperbarui
  deleted_at   TIMESTAMP nullable   Soft delete opsional

### 7.3 Tabel `envelope_budgets`

**Wajib direkomendasikan untuk MVP:** anggaran disimpan per bulan agar
perubahan anggaran bulan depan tidak mengubah laporan bulan sebelumnya.

  Kolom           Tipe          Keterangan
  --------------- ------------- ------------------
  id              UUID/BIGINT   Primary key
  user_id         UUID/BIGINT   Pemilik anggaran
  envelope_id     UUID/BIGINT   FK envelopes
  period_month    SMALLINT      1--12
  period_year     SMALLINT      Tahun
  budget_amount   BIGINT        Nominal Rupiah
  created_at      TIMESTAMP     Waktu dibuat
  updated_at      TIMESTAMP     Waktu diperbarui

Constraint: - Unique (`envelope_id`, `period_month`, `period_year`). -
`budget_amount >= 0`. - Pastikan `user_id` sesuai dengan pemilik amplop.

### 7.4 Tabel `expenses`

  Kolom              Tipe                    Keterangan
  ------------------ ----------------------- -------------------
  id                 UUID/BIGINT             Primary key
  user_id            UUID/BIGINT             Pemilik transaksi
  envelope_id        UUID/BIGINT             FK envelopes
  amount             BIGINT                  Nominal Rupiah
  transaction_date   DATE                    Tanggal transaksi
  description        VARCHAR(255) nullable   Deskripsi
  note               TEXT nullable           Catatan tambahan
  created_at         TIMESTAMP               Waktu dibuat
  updated_at         TIMESTAMP               Waktu diperbarui
  deleted_at         TIMESTAMP nullable      Soft delete

Constraint/index: - `amount > 0`. - Index (`user_id`,
`transaction_date`). - Index (`envelope_id`, `transaction_date`). -
Index (`user_id`, `envelope_id`, `transaction_date`). - Foreign key ke
users dan envelopes.

### 7.5 Relasi

``` text
users 1 ---- N envelopes
users 1 ---- N expenses
envelopes 1 ---- N expenses
envelopes 1 ---- N envelope_budgets
users 1 ---- N envelope_budgets
```

## 8. REST API Contract

Gunakan prefix versi, misalnya `/api/v1`. Semua endpoint privat
membutuhkan autentikasi.

### 8.1 Format response standar

Sukses:

``` json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": {}
}
```

Gagal:

``` json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": {
    "amount": ["Nominal harus lebih besar dari 0"]
  }
}
```

### 8.2 Auth

  Method   Endpoint           Fungsi
  -------- ------------------ ----------------
  POST     `/auth/register`   Membuat akun
  POST     `/auth/login`      Login
  POST     `/auth/logout`     Logout
  GET      `/auth/me`         Pengguna aktif

### 8.3 Profil

  Method   Endpoint              Fungsi
  -------- --------------------- --------------------
  GET      `/profile`            Mendapatkan profil
  PATCH    `/profile`            Mengubah profil
  PATCH    `/profile/password`   Mengubah password

### 8.4 Dashboard

`GET /dashboard?month=10&year=2026`

Contoh response:

``` json
{
  "success": true,
  "data": {
    "period": {"month": 10, "year": 2026, "label": "Oktober 2026"},
    "summary": {
      "currency": "IDR",
      "budget_amount": 3000000,
      "spent_amount": 400000,
      "remaining_amount": 2600000,
      "usage_percentage": 13.33
    },
    "envelopes": [
      {
        "id": "envelope-1",
        "name": "Makan & Minum",
        "icon_key": "food",
        "color_key": "peach",
        "budget_amount": 1200000,
        "spent_amount": 180000,
        "remaining_amount": 1020000,
        "usage_percentage": 15
      },
      {
        "id": "envelope-2",
        "name": "Transport",
        "icon_key": "transport",
        "color_key": "blue",
        "budget_amount": 600000,
        "spent_amount": 75000,
        "remaining_amount": 525000,
        "usage_percentage": 12.5
      },
      {
        "id": "envelope-3",
        "name": "Jajan & Hiburan",
        "icon_key": "entertainment",
        "color_key": "lavender",
        "budget_amount": 400000,
        "spent_amount": 100000,
        "remaining_amount": 300000,
        "usage_percentage": 25
      },
      {
        "id": "envelope-4",
        "name": "Darurat",
        "icon_key": "emergency",
        "color_key": "sage",
        "budget_amount": 800000,
        "spent_amount": 45000,
        "remaining_amount": 755000,
        "usage_percentage": 5.63
      }
    ]
  }
}
```

### 8.5 Amplop

  ----------------------------------------------------------------------------------------------
  Method                  Endpoint                                       Fungsi
  ----------------------- ---------------------------------------------- -----------------------
  GET                     `/envelopes?month=10&year=2026`                Daftar amplop +
                                                                         ringkasan

  POST                    `/envelopes`                                   Membuat amplop

  GET                     `/envelopes/{id}`                              Detail dasar amplop

  PATCH                   `/envelopes/{id}`                              Mengubah amplop

  DELETE                  `/envelopes/{id}`                              Mengarsipkan amplop

  GET                     `/envelopes/{id}/budgets?month=10&year=2026`   Anggaran periode

  PUT                     `/envelopes/{id}/budgets/{year}/{month}`       Membuat/mengubah
                                                                         anggaran
  ----------------------------------------------------------------------------------------------

Request membuat amplop:

``` json
{
  "name": "Kesehatan",
  "icon_key": "health",
  "color_key": "mint"
}
```

Request menetapkan anggaran periode:

``` json
{
  "budget_amount": 500000
}
```

### 8.6 Detail Amplop

`GET /envelopes/{id}/summary?month=10&year=2026`

Response:

``` json
{
  "success": true,
  "data": {
    "envelope": {
      "id": "envelope-1",
      "name": "Makan & Minum",
      "description": "Untuk makan enak setiap hari.",
      "icon_key": "food",
      "color_key": "peach"
    },
    "period": {"month": 10, "year": 2026, "label": "Oktober 2026"},
    "summary": {
      "budget_amount": 1200000,
      "spent_amount": 180000,
      "remaining_amount": 1020000,
      "usage_percentage": 15,
      "transaction_count": 3
    },
    "recent_expenses": [
      {
        "id": "expense-1",
        "transaction_date": "2026-10-13",
        "description": "Makan siang & kopi",
        "amount": 65000
      },
      {
        "id": "expense-2",
        "transaction_date": "2026-10-11",
        "description": "Sarapan & makan malam",
        "amount": 55000
      },
      {
        "id": "expense-3",
        "transaction_date": "2026-10-08",
        "description": "Makan siang & malam",
        "amount": 60000
      }
    ]
  }
}
```

Riwayat diurutkan terbaru. Endpoint harus mendukung `limit` dan
pagination.

### 8.7 Pengeluaran/Catatan

  Method   Endpoint                         Fungsi
  -------- -------------------------------- ----------------------------
  GET      `/expenses?month=10&year=2026`   Daftar pengeluaran bulanan
  POST     `/expenses`                      Membuat pengeluaran
  GET      `/expenses/{id}`                 Detail transaksi
  PATCH    `/expenses/{id}`                 Mengubah transaksi
  DELETE   `/expenses/{id}`                 Soft delete transaksi

Parameter GET: - `month`, `year`: periode yang diminta. - `envelope_id`:
filter kategori opsional. - `page`, `limit`: pagination. - `sort`:
default tanggal terbaru.

Contoh response daftar:

``` json
{
  "success": true,
  "data": {
    "period": {"month": 10, "year": 2026, "label": "Oktober 2026"},
    "transaction_count": 6,
    "total_expense": 400000,
    "expenses": [
      {
        "id": "expense-1",
        "transaction_date": "2026-10-13",
        "envelope": {
          "id": "envelope-1",
          "name": "Makan & Minum",
          "icon_key": "food",
          "color_key": "peach"
        },
        "description": "Makan siang & kopi",
        "amount": 65000
      }
    ],
    "pagination": {"page": 1, "limit": 20, "total": 6, "total_pages": 1}
  }
}
```

Request membuat transaksi:

``` json
{
  "envelope_id": "envelope-1",
  "amount": 65000,
  "transaction_date": "2026-10-13",
  "description": "Makan siang & kopi",
  "note": null
}
```

### 8.8 Contoh validasi request

-   `amount`: integer positif.
-   `envelope_id`: wajib, harus aktif dan milik pengguna.
-   `transaction_date`: tanggal valid `YYYY-MM-DD`.
-   `description`: maksimal 255 karakter.
-   `month`: integer 1--12.
-   `year`: tahun valid.
-   `budget_amount`: integer \>= 0.

## 9. Aturan Bisnis Tambahan

1.  Pengeluaran tidak mengurangi nilai anggaran yang ditetapkan;
    pengeluaran hanya menambah nilai terpakai.
2.  Pengeluaran melebihi anggaran tetap diperbolehkan.
3.  Transaksi yang tanggalnya diubah harus berpindah periode dalam
    laporan.
4.  Transaksi yang kategorinya diubah harus memperbarui agregat amplop
    lama dan baru.
5.  Transaksi yang dihapus tidak boleh masuk perhitungan.
6.  Anggaran setiap bulan memiliki histori tersendiri.
7.  Semua query wajib dibatasi oleh identitas pengguna aktif.
8.  Jangan menghitung total hanya di frontend.
9.  Gunakan database transaction untuk operasi yang melibatkan beberapa
    perubahan.
10. Semua layar harus menggunakan definisi agregasi yang sama.

## 10. Konsistensi, Performa, dan Keamanan

-   Database menjadi sumber kebenaran.
-   Dashboard menggunakan query agregasi database, bukan mengunduh
    seluruh transaksi ke frontend.
-   Gunakan index pada kolom filter tanggal, user, dan amplop.
-   Terapkan pagination dan batas maksimum `limit`.
-   Jangan menyimpan `spent_amount` permanen tanpa strategi invalidasi
    cache yang jelas.
-   Gunakan HTTPS.
-   Hash password dengan algoritma yang sesuai.
-   Simpan secret di environment variables.
-   Terapkan rate limit untuk login.
-   Validasi semua input.
-   Jangan mencatat detail transaksi sensitif ke log publik.
-   CORS hanya mengizinkan origin frontend yang diperlukan.

## 11. Error Handling

  HTTP   Kondisi
  ------ -------------------------------------------
  200    Berhasil
  201    Berhasil membuat data
  400    Request tidak valid
  401    Belum login/token tidak valid
  403    Tidak memiliki izin
  404    Data tidak ditemukan/bukan milik pengguna
  409    Konflik, misalnya nama amplop duplikat
  422    Validasi field gagal
  429    Rate limit
  500    Kesalahan internal

Format error:

``` json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": {
    "amount": ["Nominal harus lebih besar dari 0"]
  }
}
```

Jangan mengirim stack trace atau detail database ke client.

## 12. Acceptance Criteria

### Beranda

-   [ ] Menampilkan ringkasan periode berjalan.
-   [ ] Dapat mengganti bulan/tahun.
-   [ ] Total anggaran sama dengan jumlah anggaran amplop periode itu.
-   [ ] Total pengeluaran sama dengan jumlah transaksi aktif.
-   [ ] Sisa = anggaran - pengeluaran.
-   [ ] Amplop tanpa transaksi tetap tampil.
-   [ ] Ringkasan berubah setelah transaksi berubah.

### Amplop dan Detail

-   [ ] Pengguna dapat membuat, mengubah, dan mengarsipkan amplop.
-   [ ] Anggaran dapat ditetapkan per bulan.
-   [ ] Histori transaksi tetap tersedia setelah amplop diarsipkan.
-   [ ] Detail menampilkan anggaran, terpakai, sisa, persentase, dan
    transaksi kategori.
-   [ ] Riwayat diurutkan terbaru ke terlama.
-   [ ] Kategori tanpa transaksi menampilkan Rp0 terpakai.

### Catatan dan Transaksi

-   [ ] Daftar hanya menampilkan transaksi bulan terpilih.
-   [ ] Jumlah catatan adalah jumlah transaksi.
-   [ ] Total bulan adalah penjumlahan nominal.
-   [ ] Pengguna dapat menambah, melihat, mengubah, dan menghapus
    transaksi.
-   [ ] Nominal nol/negatif ditolak.
-   [ ] Pengeluaran di atas anggaran tetap dapat disimpan.
-   [ ] Perubahan kategori/tanggal memperbarui ringkasan yang benar.

### Profil dan Keamanan

-   [ ] Profil dapat dibaca dan diperbarui.
-   [ ] Endpoint privat menolak request tanpa autentikasi.
-   [ ] Pengguna tidak dapat membaca/mengubah data pengguna lain.
-   [ ] Password/hash tidak pernah dikirim ke frontend.

## 13. Skenario Pengujian Backend

### A. Membuat pengeluaran

**Given:** anggaran amplop Rp1.200.000.\
**When:** pengguna mencatat Rp65.000.\
**Then:** transaksi tersimpan, terpakai menjadi Rp65.000, sisa menjadi
Rp1.135.000, dan total pengeluaran bulanan bertambah Rp65.000.

### B. Melebihi anggaran

**Given:** anggaran Rp100.000 dan pemakaian Rp90.000.\
**When:** pengguna menambah Rp20.000.\
**Then:** transaksi tetap tersimpan, pemakaian menjadi Rp110.000, sisa
-Rp10.000, persentase 110%.

### C. Mengubah kategori

**Given:** transaksi Rp50.000 berada di Transport.\
**When:** transaksi dipindahkan ke Makan & Minum.\
**Then:** pemakaian Transport turun Rp50.000, pemakaian Makan & Minum
naik Rp50.000, total bulanan tidak berubah.

### D. Mengubah bulan transaksi

**Given:** transaksi Rp75.000 tercatat pada Oktober.\
**When:** tanggal diubah ke November.\
**Then:** total Oktober turun Rp75.000 dan total November naik Rp75.000.

### E. Akses data pengguna lain

**Given:** pengguna A mengetahui ID transaksi pengguna B.\
**When:** pengguna A meminta transaksi tersebut.\
**Then:** backend tidak memberikan data pengguna B.

### F. Bulan tanpa transaksi

**Given:** pengguna memilih bulan tanpa transaksi.\
**Then:** total pengeluaran 0, daftar kosong, amplop tetap tampil, dan
sisa sama dengan total anggaran.

## 14. Rekomendasi Struktur Modul Backend

Contoh struktur framework-agnostic:

``` text
src/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── dashboard/
│   ├── envelopes/
│   ├── envelope-budgets/
│   └── expenses/
├── middleware/
│   ├── auth
│   └── error-handler
├── database/
│   ├── migrations/
│   └── seeders/
└── shared/
    ├── errors/
    ├── validators/
    └── utils/
```

Pisahkan tanggung jawab: - **Controller:** menerima request dan mengirim
response. - **Service:** menjalankan aturan bisnis dan kalkulasi. -
**Repository/ORM:** akses database. - **Validation:** memvalidasi
parameter, query, dan body.

## 15. Seed Data

Saat onboarding, sistem dapat membuat empat amplop awal:

  Nama              `icon_key`        `color_key`
  ----------------- ----------------- -------------
  Makan & Minum     `food`            `peach`
  Transport         `transport`       `blue`
  Jajan & Hiburan   `entertainment`   `lavender`
  Darurat           `emergency`       `sage`

Anggaran awal dapat bernilai nol sampai pengguna mengaturnya. Jangan
mengasumsikan nominal anggaran pengguna.

## 16. Definition of Done

Backend MVP dianggap selesai jika: - Semua endpoint P0 tersedia dan
terdokumentasi. - Migration dapat dijalankan dari database kosong. -
Seeder kategori awal tersedia. - CRUD amplop dan transaksi berjalan. -
Anggaran tersimpan per periode. - Autentikasi dan otorisasi kepemilikan
data berjalan. - Kalkulasi dashboard dan detail amplop telah diuji. -
Validasi dan error response konsisten. - Acceptance criteria P0 lulus. -
Ketiga layar UI dapat menggunakan API tanpa data keuangan hardcode.

------------------------------------------------------------------------

**Akhir dokumen --- PRD UangKu v1.0**
