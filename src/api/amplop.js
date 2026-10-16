import { apiRequest } from "./client";

export const amplopService = {
  async list() {
    return apiRequest("/api/amplop");
  },

  async get(id) {
    return apiRequest(`/api/amplop/${id}`);
  },

  async create({ nama, deskripsi, anggaran, warna, icon }) {
    return apiRequest("/api/amplop", {
      method: "POST",
      body: JSON.stringify({ nama, deskripsi, anggaran, warna, icon }),
    });
  },

  async update(id, { nama, deskripsi, anggaran, warna, icon }) {
    return apiRequest(`/api/amplop/${id}`, {
      method: "PUT",
      body: JSON.stringify({ nama, deskripsi, anggaran, warna, icon }),
    });
  },

  async remove(id) {
    return apiRequest(`/api/amplop/${id}`, { method: "DELETE" });
  },
};
