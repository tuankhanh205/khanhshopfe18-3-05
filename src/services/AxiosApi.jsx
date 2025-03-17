import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/tet", // Thay bằng URL của Backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor để xử lý lỗi hoặc token (nếu cần)
API.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (nếu có)
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
