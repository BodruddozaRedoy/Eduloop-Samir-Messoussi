import axios from 'axios'

export const AxiosPublic = axios.create({
    baseURL: "http://10.10.13.60:8090/api",
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