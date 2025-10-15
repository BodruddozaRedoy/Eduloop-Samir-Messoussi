import axios from "axios";

export const AxiosPublic = axios.create({
  baseURL: "https://api.extrahanden.ai/api",
  withCredentials: true, // 👈 important — includes cookies (like csrftoken)
});

// ✅ Tell Axios which cookie/header Django uses for CSRF
AxiosPublic.defaults.xsrfCookieName = "csrftoken";
AxiosPublic.defaults.xsrfHeaderName = "X-CSRFToken";

// 🔑 Attach access-key automatically
AxiosPublic.interceptors.request.use((config) => {
  const accessKey = localStorage.getItem("access-key");
  if (accessKey) {
    config.headers.Authorization = accessKey;
  }

  return config;
});
