import { LegalScreen } from "@/components/akun-legal";

export default function SyaratKetentuanScreen() {
  return (
    <LegalScreen
      title="Syarat & Ketentuan"
      intro="Dengan menggunakan UangKu, kamu menyetujui ketentuan berikut agar aplikasi tetap aman dan bermanfaat."
      updated="November 2026"
      sections={[
        {
          judul: "Penggunaan aplikasi",
          isi: "UangKu adalah alat pencatatan keuangan pribadi. Kamu bertanggung jawab atas kebenaran data yang dimasukkan dan kerahasiaan akses akunmu.",
        },
        {
          judul: "Bukan layanan keuangan",
          isi: "UangKu tidak menyimpan uang, tidak memproses transfer, dan tidak memberikan nasihat investasi. Seluruh angka adalah catatan pribadimu.",
        },
        {
          judul: "Ketersediaan layanan",
          isi: "Kami berupaya menjaga layanan tetap berjalan, namun pemeliharaan atau kendala jaringan dapat menyebabkan akses sementara terhenti.",
        },
        {
          judul: "Perubahan ketentuan",
          isi: "Ketentuan dapat diperbarui seiring pengembangan fitur. Versi terbaru selalu tersedia di halaman ini.",
        },
      ]}
    />
  );
}
