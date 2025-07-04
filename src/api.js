/** @format */

// src/api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://tender-backend-8k7t.onrender.com",
});

// Add JWT token in headers if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
