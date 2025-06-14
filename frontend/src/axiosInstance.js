import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // ✅ 明確指定後端伺服器
  timeout: 10000,
});

export default instance;
