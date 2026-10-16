// Peta id amplop (kategori) ke gambar ikon asli di assets.
// Backend menyimpan ikon sebagai teks (id/nama), frontend menyesuaikannya ke require gambar.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const r = (path: string) => require(path);

export const amplopIcons: Record<string, any> = {
  makan: r("../../assets/images/amplop/makan.png"),
  transport: r("../../assets/images/amplop/transport.png"),
  jajan: r("../../assets/images/amplop/jajan.png"),
  darurat: r("../../assets/images/amplop/darurat.png"),
};

export function getIcon(iconId?: string | null) {
  if (!iconId) return undefined;
  return amplopIcons[iconId] ?? undefined;
}
