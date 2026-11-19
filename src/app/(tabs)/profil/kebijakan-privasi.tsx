import { LegalScreen } from "@/components/akun-legal";

export default function KebijakanPrivasiScreen() {
  return (
    <LegalScreen
      title="Kebijakan Privasi"
      intro="Kami menghargai privasimu. Halaman ini menjelaskan data apa yang dipakai UangKu dan bagaimana data itu dijaga."
      updated="November 2026"
      sections={[
        {
          judul: "Data yang kami simpan",
          isi: "Nama, alamat email, dan catatan keuanganmu (pengeluaran serta anggaran) disimpan untuk menjalankan fitur aplikasi. Nomor telepon dan tanggal lahir bersifat opsional.",
        },
        {
          judul: "Penggunaan data",
          isi: "Data hanya digunakan untuk menampilkan ringkasan keuangan, mengirim pengingat yang kamu aktifkan, dan memulihkan akun. Kami tidak menjual datamu kepada pihak lain.",
        },
        {
          judul: "Keamanan",
          isi: "Akses akun dilindungi kata sandi, serta dapat ditambah PIN dan biometrik. Jangan bagikan kata sandi atau kode verifikasi kepada siapa pun, termasuk yang mengaku dari UangKu.",
        },
        {
          judul: "Hakmu",
          isi: "Kamu dapat memperbarui data profil kapan saja melalui menu Profil, dan menghubungi dukungan bila ingin menghapus akun beserta datanya.",
        },
      ]}
    />
  );
}
