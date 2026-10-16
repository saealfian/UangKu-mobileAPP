import { apiRequest, setToken, clearToken } from "./client";

export const authService = {
  async register({ nama, email, password }) {
    const data = await apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ nama, email, password }),
    });
    if (data.token) await setToken(data.token);
    return data;
  },

  async login({ email, password }) {
    const data = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (data.token) await setToken(data.token);
    return data;
  },

  async logout() {
    await clearToken();
  },

  async me() {
    return apiRequest("/api/auth/me");
  },
};
