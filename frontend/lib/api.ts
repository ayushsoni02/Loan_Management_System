import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for sending/receiving httpOnly cookies
});

export default api;
