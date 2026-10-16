import { apiRequest } from "./client";

export const pengeluaranService = {
  async list({ bulan, tahun } = {}) {
    const params = new URLSearchParams();
    if (bulan) params.append("bulan", String(bulan));
    if (tahun) params.append("tahun", String(tahun));
    const qs = params.toString() ? `?${params.toString()}` : "";
    return apiRequest(`/api/pengeluaran${qs}`);
  },

  async create({ amplop_id, catatan, nominal, tanggal }) {
    return apiRequest("/api/pengeluaran", {
      method: "POST",
      body: JSON.stringify({ amplop_id, catatan, nominal, tanggal }),
    });
  },

  async update(id, { amplop_id, catatan, nominal, tanggal }) {
    return apiRequest(`/api/pengeluaran/${id}`, {
      method: "PUT",
      body: JSON.stringify({ amplop_id, catatan, nominal, tanggal }),
    });
  },

  async remove(id) {
    return apiRequest(`/api/pengeluaran/${id}`, { method: "DELETE" });
  },
};
