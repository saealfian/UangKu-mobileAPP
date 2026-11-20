# Dokumentasi Frontend & Workflow — UangKu

Dokumen ini menjelaskan sisi frontend aplikasi mobile **UangKu**: teknologi yang
dipakai, struktur folder, peta halaman, alur kerja (workflow), alur data offline,
aturan perhitungan, serta batasan yang masih ada.

> Status aplikasi: **offline-first, tanpa login**. Semua data keuangan disimpan
> di perangkat pengguna (AsyncStorage). Tidak ada request ke server dan tidak ada
> halaman masuk/daftar.

---

## 1. Ringkasan

UangKu adalah aplikasi pencatatan keuangan pribadi berbasis "amplop" (envelope
budgeting):

- Pengguna punya beberapa **amplop** (kategori) dengan **anggaran** bulanan.
- Setiap **pengeluaran** dicatat ke salah satu amplop.
- Beranda merangkum anggaran, pemakaian, dan sisa uang bulan berjalan.
- Catatan menampilkan daftar pengeluaran bulan ini.
- Detail amplop menampilkan sisa anggaran kategori dan riwayat transaksinya.

Karena aplikasi akan dipasang langsung di HP (aplikasi offline bawaan), alur
login dihapus total dan data dipindahkan dari API ke penyimpanan lokal.

---

## 2. Teknologi

| Bagian | Teknologi / versi |
| --- | --- |
| Framework | Expo SDK 57 (`expo` ~57.0.26) |
| React Native | 0.86.3, React 19.2.3 |
| Routing | Expo Router ~57.0.24 (file-based routing) |
| Bahasa | TypeScript (strict) |
| Ikon | `@expo/vector-icons` (MaterialIcons) |
| Gambar | `expo-image` / `Image` bawaan RN |
| Penyimpanan lokal | `@react-native-async-storage/async-storage` 2.2.0 |
| Animasi/gesture | `react-native-reanimated`, `react-native-gesture-handler` |
| Build rilis | EAS (`eas.json`: profile development, preview, production) |

Tidak ada library HTTP, auth, atau database yang dipakai lagi.

### Menjalankan proyek

```bash
npm install
npx expo start          # dev server
npm run lint            # eslint (expo lint)
npx tsc --noEmit        # typecheck
npx expo-doctor         # cek dependency & konfigurasi
```

Build rilis memakai EAS, misalnya `npx eas-cli@latest build --profile preview`
(APK internal) atau `--profile production` (AAB untuk Play Store).

---

## 3. Struktur folder

```text
src/
├── app/                        # Rute Expo Router (setiap file = satu layar)
│   ├── _layout.tsx             # Root layout: provider data + Stack
│   ├── index.tsx               # Entry "/" → langsung redirect ke /beranda
│   ├── tambah-pengeluaran.tsx  # Modal tambah pengeluaran
│   └── (tabs)/
│       ├── _layout.tsx         # Tab bar: Beranda, Catatan, Profil
│       ├── beranda/
│       │   ├── _layout.tsx     # Stack di dalam tab Beranda
│       │   ├── index.tsx       # Ringkasan bulanan + grid amplop
│       │   └── detail-amplop.tsx
│       ├── catatan.tsx         # Tabel pengeluaran bulanan
│       └── profil/
│           ├── _layout.tsx     # Stack di dalam tab Profil
│           ├── index.tsx       # Kartu identitas + menu pengaturan
│           ├── edit-profil.tsx
│           ├── informasi-akun.tsx
│           ├── keamanan-akun.tsx
│           ├── target-anggaran.tsx
│           ├── pengingat-pengeluaran.tsx
│           ├── bantuan.tsx
│           ├── tentang.tsx
│           ├── kebijakan-privasi.tsx
│           └── syarat-ketentuan.tsx
├── components/
│   ├── uangku.tsx              # Palet warna, IconCircle, ProgressBar
│   ├── akun.tsx                # Komponen bersama layar pengaturan
│   └── akun-legal.tsx          # Kerangka halaman legal (privasi, syarat)
├── data/
│   ├── amplop.ts               # Tipe data, data awal, helper format & tanggal
│   ├── amplop-context.tsx      # Store keuangan lokal (persisten)
│   ├── akun-context.tsx        # Store profil & preferensi lokal
│   └── icons.ts                # Pemetaan id ikon → aset gambar
└── ...
assets/images/                  # Ikon aplikasi, splash, ikon amplop
```

Aturan yang dipakai:

- Semua file di `src/app/` adalah rute. Logika non-rute diletakkan di
  `components/` dan `data/`.
- `_layout.tsx` mendefinisikan navigator (Stack/Tabs) untuk folder di bawahnya.
- Folder `ios/` dan `android/` tidak ada karena memakai Continuous Native
  Generation; konfigurasi native ada di `app.json`.

---

## 4. Peta halaman & navigasi

```text
/  (index)
└─ redirect → /beranda

(tabs)  ── tab bar bawah
├─ Beranda (grid-view)
│   ├─ /beranda                 ringkasan + amplop
│   └─ /beranda/detail-amplop?id=<amplopId>
├─ Catatan (description)
│   └─ /catatan                 tabel pengeluaran
└─ Profil (person-outline)
    ├─ /profil                  identitas + menu
    ├─ /profil/edit-profil
    ├─ /profil/informasi-akun
    ├─ /profil/target-anggaran
    ├─ /profil/pengingat-pengeluaran
    ├─ /profil/keamanan-akun
    ├─ /profil/bantuan
    ├─ /profil/tentang
    ├─ /profil/kebijakan-privasi
    └─ /profil/syarat-ketentuan

/tambah-pengeluaran  → modal (presentation: "modal")
```

Tab bar: tinggi 64, warna aktif `#2E6B4F`, tidak aktif `#7B8780`, label 10px.
Tab Beranda dan Profil memakai Stack internal agar tab tetap menyala saat masuk
ke halaman detail.

---

## 5. Design system

Palet utama ada di `src/components/uangku.tsx`:

| Token | Nilai | Pemakaian |
| --- | --- | --- |
| `primary` | `#2E6B4F` | tombol utama, angka penting, ikon aktif |
| `text` | `#1B2B22` | judul & isi |
| `muted` | `#7B8780` | teks sekunder |
| `white` | `#FFFFFF` | latar utama |
| `mint` | `#E7F0E9` | kartu ringkasan |
| `peach` | `#FBEADC` | amplop Makan & Minum |
| `blue` | `#E7EDF6` | amplop Transport |
| `lilac` | `#EDE9F6` | amplop Jajan & Hiburan |
| `border` | `#E3E8E5` | garis & outline input |
| `danger` | `#D64545` | pesan error |

Komponen bersama:

- `IconCircle` — lingkaran putih berisi ikon kategori.
- `ProgressBar` — bar pemakaian anggaran, dibatasi maksimum 100% secara visual.
- `AkunHeader`, `AkunLabel`, `AkunHint`, `AkunNote`, `AkunButton`,
  `AkunRow`, `AkunSwitchRow`, `AkunHighlightCard`, `OptionModal` — dipakai
  seluruh layar pengaturan agar tampilan konsisten.
- `LegalScreen` — kerangka halaman kebijakan privasi & syarat ketentuan.

Ikon kategori dipetakan di `src/data/icons.ts` (`makan`, `transport`, `jajan`,
`darurat`) dan berasal dari `assets/images/amplop/`.

---

## 6. Workflow aplikasi

### 6.1 Membuka aplikasi (cold start)

```text
Splash screen tampil
   ↓
AkunProvider & AmplopProvider membaca AsyncStorage
   ↓ (data siap)
Splash screen disembunyikan
   ↓
/ redirect ke /beranda
   ↓
Beranda menampilkan angka & amplop
```

Tidak ada pemeriksaan sesi/token, tidak ada layar login, dan tidak ada request
jaringan. Splash screen ditahan (`SplashScreen.preventAutoHideAsync`) sampai
data lokal selesai dibaca sehingga tidak ada layar kosong/berkedip.

### 6.2 Mencatat pengeluaran

```text
Catatan / Detail Amplop
   ↓ tekan tombol tambah (FAB atau CTA)
Modal /tambah-pengeluaran
   ↓ pilih kategori (chip), isi nominal, isi catatan
Validasi lokal (kategori wajib, nominal > 0)
   ↓
tambahPengeluaran() → data masuk store + AsyncStorage
   ↓ router.back()
Beranda / Catatan / Detail Amplop otomatis ter-update
```

Tanggal otomatis memakai tanggal hari ini (`tanggalHariIni()`), format
`YYYY-MM-DD` waktu lokal perangkat.

### 6.3 Melihat detail amplop

```text
Beranda → tekan kartu amplop
   ↓ kirim param id (string)
/beranda/detail-amplop?id=<id>
   ↓
Amplop dicari di store; pengeluaran bulan ini difilter & diurutkan terbaru
   ↓
Tampil: sisa uang, persentase pemakaian, daftar transaksi, CTA tambah
```

Jika `id` tidak ada di store, muncul state "Data amplop tidak ditemukan" dengan
tombol kembali.

### 6.4 Melihat catatan bulanan

`/catatan` mengambil semua pengeluaran bulan berjalan, menggabungkannya dengan
nama amplop, mengurutkan dari tanggal terbaru, lalu menghitung total di footer
tabel. Bulan mengikuti tanggal perangkat (tidak ada pemilih bulan aktif).

### 6.5 Mengatur profil & preferensi

Semua perubahan disimpan otomatis ke AsyncStorage lewat `simpanProfil`,
`simpanPengingat`, `simpanKeamanan`, dan `simpanTargetAnggaran`:

- **Edit profil** — nama (wajib), email (validasi format), telepon opsional,
  tanggal lahir (modal hari/bulan/tahun), warna avatar.
- **Target anggaran** — target bulanan + alokasi per kategori (diambil dari
  anggaran amplop).
- **Keamanan** — PIN 6 digit dan switch biometrik. PIN disimpan sebagai teks di
  penyimpanan lokal (lihat Batasan).
- **Pengingat** — waktu, pengulangan, peringatan anggaran, ringkasan mingguan
  (nilai preferensi; belum ada notifikasi terjadwal).

---

## 7. Alur data offline

```text
UI (layar)  ──useAmplop() / useAkun()──►  Context (state React)
                                             │  setiap perubahan
                                             ▼
                                   AsyncStorage (perangkat)
```

### 7.1 Provider

`src/app/_layout.tsx` membungkus aplikasi dengan:

```text
<AkunProvider>          → profil, pengingat, keamanan, target anggaran
  <AmplopProvider>      → amplop + seluruh pengeluaran
    <Stack />           → rute aplikasi
```

### 7.2 Kunci penyimpanan

| Key | Isi |
| --- | --- |
| `uangku_data_v1` | `{ amplop: Amplop[], pengeluaran: Pengeluaran[] }` |
| `uangku_akun_v1` | `{ profil, pengingat, keamanan, targetAnggaran }` |

### 7.3 Skema data keuangan

```ts
type Amplop = {
  id: string;        // mis. "makan"
  nama: string;      // "Makan & Minum"
  deskripsi: string;
  anggaran: number;  // integer rupiah
  warna: string;     // hex latar kartu
  icon: string;      // id ikon → getIcon()
};

type Pengeluaran = {
  id: string;        // dibuat lokal: "<timestamp36>-<random>"
  amplopId: string;
  catatan: string;
  nominal: number;   // integer rupiah, > 0
  tanggal: string;   // YYYY-MM-DD
};
```

### 7.4 Data awal

Saat pertama dibuka (belum ada `uangku_data_v1`), aplikasi memakai
`AMPLOP_AWAL` berisi empat amplop: Makan & Minum (Rp1.200.000), Transport
(Rp600.000), Jajan & Hiburan (Rp400.000), dan Darurat (Rp800.000). Daftar
pengeluaran dimulai kosong. Data awal ini tidak ditimpa ke storage sampai ada
perubahan pertama, sehingga pengguna selalu bisa mulai dari nol transaksi.

### 7.5 Siklus baca/tulis

1. Mount → baca `AsyncStorage`, isi state, tandai `ready = true`.
2. Setiap perubahan state → `setData` / `setAkun`.
3. Efek `useEffect` menulis JSON terbaru ke AsyncStorage (hanya setelah `ready`,
   agar data default tidak menimpa data lama).
4. Data rusak/tidak terbaca → jatuh ke nilai default, aplikasi tetap bisa dipakai.

---

## 8. Aturan perhitungan

Semua nominal adalah integer rupiah (tanpa desimal). Helper ada di
`src/data/amplop.ts`.

```text
total anggaran      = Σ amplop.anggaran
terpakai (periode)  = Σ pengeluaran.nominal  (bulan & tahun sama)
sisa                = total anggaran − terpakai
pemakaian amplop %  = terpakai amplop / anggaran amplop × 100
```

Ketentuan:

- Filter periode memakai `YYYY-MM-DD` lokal, sehingga transaksi otomatis
  berpindah bulan saat tanggalnya berbeda bulan.
- Anggaran 0 → persentase 0 (tidak membagi nol).
- Pengeluaran melebihi anggaran tetap boleh disimpan; sisa bisa negatif dan
  persentase lebih dari 100% (bar dibatasi 100% untuk tampilan).
- Angka diformat ke Rupiah dengan pemisah titik (`Rp1.200.000`).
- Total dihitung di memori dari data lokal; tidak ada agregat tersimpan yang
  bisa basi.

---

## 9. State tampilan

| State | Perilaku |
| --- | --- |
| Loading | Spinner `ActivityIndicator` selama `ready === false` (data belum dibaca) |
| Kosong | Catatan: baris "Belum ada catatan", jumlah 0, total Rp0. Detail amplop: "Belum ada pengeluaran di amplop ini." |
| Tidak ditemukan | Detail amplop tanpa `id` valid menampilkan pesan + tombol kembali |
| Error input | Pesan merah di bawah field (mis. nominal kosong, kategori belum dipilih) |
| Error data | Tidak ada error jaringan karena tidak ada jaringan; fallback ke data default |

---

## 10. Perubahan "hapus login"

Bagian autentikasi dihapus seluruhnya:

| File | Status |
| --- | --- |
| `src/app/login.tsx` | dihapus |
| `src/context/AuthContext.tsx` | dihapus |
| `src/api/*` (`auth`, `client`, `config`, `amplop`, `dashboard`, `pengeluaran`) | dihapus |
| `src/app/(tabs)/profil/ubah-kata-sandi.tsx` | dihapus |
| `src/app/_layout.tsx` | tanpa `AuthProvider` & pengalihan login |
| `src/app/index.tsx` | langsung `Redirect` ke `/beranda` |
| `src/app/(tabs)/profil/index.tsx` | tombol "Keluar" dihapus |
| `src/app/(tabs)/profil/keamanan-akun.tsx` | baris "Ubah kata sandi" & "Verifikasi dua langkah" dihapus |
| `src/data/akun-context.tsx` | tidak lagi bergantung pada user login; nama default "Pengguna" |

Konsekuensinya: tidak ada lagi konsep sesi, token, register, atau logout, dan
seluruh layar data (Beranda, Catatan, Detail Amplop, Target Anggaran) membaca
dari store lokal.

---

## 11. Batasan saat ini

- **Belum ada CRUD amplop di UI.** Anggaran & kategori hanya berasal dari data
  awal `AMPLOP_AWAL`; belum ada layar tambah/ubah/hapus amplop.
- **Belum ada edit/hapus pengeluaran** dari UI (hanya tambah).
- **Belum ada penggantian bulan.** Beranda, Catatan, dan Detail selalu memakai
  bulan berjalan perangkat; tombol periode masih tampilan saja.
- **PIN & data profil disimpan sebagai teks biasa** di AsyncStorage, belum
  memakai `expo-secure-store`/hash, dan PIN belum dipakai untuk mengunci layar.
- **Biometrik & pengingat** baru menyimpan preferensi; belum ada autentikasi
  biometrik ataupun notifikasi terjadwal.
- **Belum ada backup/ekspor.** Karena data hanya di perangkat, menghapus data
  aplikasi (clear data / uninstall) akan menghapus catatan pengguna.
- **Belum ada halaman pembuatan amplop, pencarian, atau filter transaksi.**

---

## 12. Ide pengembangan lanjutan

1. Layar kelola amplop (tambah/ubah/arsip) + set anggaran per bulan.
2. Pemilih periode (bulan/tahun) yang dipakai bersama Beranda, Catatan, Detail.
3. Edit & hapus pengeluaran (dengan konfirmasi).
4. Kunci aplikasi memakai PIN/biometrik (`expo-local-authentication`,
   `expo-secure-store`).
5. Notifikasi pengingat nyata (`expo-notifications`) sesuai preferensi.
6. Ekspor/impor cadangan JSON atau CSV agar data aman saat ganti perangkat.
7. Pencarian & filter berdasarkan amplop/tanggal di Catatan.

---

## 13. Checklist uji manual

- [ ] Aplikasi dibuka langsung ke Beranda tanpa layar login.
- [ ] Ringkasan menampilkan total anggaran Rp3.000.000 dan terpakai Rp0 di
      pemakaian pertama.
- [ ] Tambah pengeluaran dari Catatan → angka total dan sisa berubah.
- [ ] Tambah dari Detail Amplop → kategori otomatis terpilih sesuai amplop.
- [ ] Riwayat di Detail Amplop hanya menampilkan transaksi amplop tersebut.
- [ ] Tutup lalu buka ulang aplikasi → data tetap ada (AsyncStorage).
- [ ] Ganti nama & avatar di Edit Profil → sapaan Beranda ikut berubah.
- [ ] Simpan Target Anggaran → nilai bertahan setelah aplikasi dibuka ulang.
- [ ] Mode pesawat aktif → semua fitur tetap berjalan normal.
