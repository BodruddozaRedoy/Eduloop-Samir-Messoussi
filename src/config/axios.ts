import axios from "axios";

const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "https://api.extrahanden.ai/api"
    : "https://api.extrahanden.ai/api";

export const AxiosPublic = axios.create({
  baseURL: API_BASE_URL,
  // withCredentials: true,
});

AxiosPublic.defaults.xsrfCookieName = "csrftoken";
AxiosPublic.defaults.xsrfHeaderName = "X-CSRFToken";

// optional: make sure all requests have JSON header
AxiosPublic.defaults.headers.common["Content-Type"] = "application/json";

AxiosPublic.interceptors.request.use((config) => {
  const accessKey = localStorage.getItem("access-key");
  if (accessKey) {
    config.headers.Authorization = accessKey;
  }
  return config;
});

export const AxiosAdmin = axios.create({
  baseURL: API_BASE_URL,
});

AxiosAdmin.defaults.xsrfCookieName = "csrftoken";
AxiosAdmin.defaults.xsrfHeaderName = "X-CSRFToken";
AxiosAdmin.defaults.headers.common["Content-Type"] = "application/json";

AxiosAdmin.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("admin-token");
  if (adminToken) {
    config.headers.Authorization = adminToken.startsWith("Token ")
      ? adminToken
      : `Token ${adminToken}`;
  }
  return config;
});
