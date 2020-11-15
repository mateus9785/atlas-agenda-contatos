import axios from "axios";

const api = axios.create({
  baseURL: "https://atlas-agenda-contatos-api.herokuapp.com/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `bearer ${token}`;
  }
  return config;
});

export default api;
