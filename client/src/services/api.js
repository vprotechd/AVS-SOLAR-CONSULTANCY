import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getToken = () =>
  localStorage.getItem("token") || localStorage.getItem("accessToken");

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

export default api;
