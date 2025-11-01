
// api/axiosInstance.js
import axios from "axios";

// Create an axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api", 
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

//  Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//  Handle response errors globally (optional but useful)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: auto logout on 401 (unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
