import axios from 'axios'

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:8080/api/v1": "/api/v1"

const axiosInstance = axios.create({
  baseURL: BASE_URL, 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance