import axios from 'axios'

export const AxiosPublic = axios.create({
    baseURL: "http://api.extrahanden.ai:8000/api",
    withCredentials: true
})

// 🔑 Attach access-key automatically
AxiosPublic.interceptors.request.use((config) => {
  const accessKey = localStorage.getItem("access-key");
  if (accessKey) {
    config.headers.Authorization = accessKey; // 👈 attach here
  }
  
  return config;
});