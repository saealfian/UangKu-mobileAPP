// Peta id amplop (kategori) ke gambar ikon asli di assets.
// Backend menyimpan ikon sebagai teks (id/nama), frontend menyesuaikannya ke require gambar.
// Path wajib berupa string literal agar Metro bisa membundel asetnya.
export const amplopIcons: Record<string, any> = {
  makan: require("../../assets/images/amplop/makan.png"),
  transport: require("../../assets/images/amplop/transport.png"),
  jajan: require("../../assets/images/amplop/jajan.png"),
  darurat: require("../../assets/images/amplop/darurat.png"),
};

export function getIcon(iconId?: string | null) {
  if (!iconId) return undefined;
  return amplopIcons[iconId] ?? undefined;
}
