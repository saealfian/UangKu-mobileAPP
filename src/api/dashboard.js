import { apiRequest } from "./client";

export const dashboardService = {
  async summary({ bulan, tahun } = {}) {
    const params = new URLSearchParams();
    if (bulan) params.append("bulan", String(bulan));
    if (tahun) params.append("tahun", String(tahun));
    const qs = params.toString() ? `?${params.toString()}` : "";
    return apiRequest(`/api/dashboard${qs}`);
  },
};
