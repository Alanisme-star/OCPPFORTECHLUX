// src/axiosInstance.js
import axios from "axios";

const instance = axios.create({
  baseURL: "https://ocppfortechlux.onrender.com/api", // 這裡一定要改！
  timeout: 10000,
});

export default instance;
