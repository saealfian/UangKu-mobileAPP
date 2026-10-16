// Konfigurasi base URL API backend.
// Untuk development:
// - Emulator Android: http://10.0.2.2:5000
// - Simulator iOS   : http://localhost:5000
// - Perangkat fisik : http://<IP-komputer>:5000
// - Web             : http://localhost:5000
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";

export const API_TIMEOUT = 15000;
