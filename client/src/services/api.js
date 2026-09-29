import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("accessToken");

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  // ✅ REMOVED Content-Type header
  // Axios will automatically set:
  // - "application/json" for JSON objects
  // - "multipart/form-data" for FormData
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  // ✅ When sending FormData, let browser set the content type
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

export default api;