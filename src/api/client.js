import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, API_TIMEOUT } from "./config";

const TOKEN_KEY = "uangku_token";

// Ambil token dari AsyncStorage (fallback ke memori jika tidak tersedia)
let memoryToken = null;

export async function getToken() {
  try {
    const stored = await AsyncStorage.getItem(TOKEN_KEY);
    if (stored) return stored;
  } catch (_) {
    // AsyncStorage mungkin belum siap / tidak tersedia di beberapa platform
  }
  return memoryToken;
}

export async function setToken(token) {
  memoryToken = token;
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (_) {
    // abaikan jika AsyncStorage tidak tersedia
  }
}

export async function clearToken() {
  memoryToken = null;
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (_) {
    // abaikan
  }
}

/**
 * Wrapper fetch yang otomatis menyertakan token auth dan mengembalikan JSON.
 * Melempar Error dengan message dari server jika response tidak OK.
 */
export async function apiRequest(path, options = {}) {
  const token = await getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Coba baca body sebagai JSON (boleh kosong)
    let data = null;
    const text = await res.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    if (!res.ok) {
      const err = new Error(data && data.message ? data.message : `Request gagal (${res.status})`);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      const timeoutErr = new Error("Request melebihi batas waktu. Coba lagi.");
      timeoutErr.status = 408;
      throw timeoutErr;
    }
    throw err;
  }
}
