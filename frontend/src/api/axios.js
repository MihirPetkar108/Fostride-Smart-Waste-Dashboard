import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL;
if (!baseURL) {
    console.error("VITE_API_URL is not defined in environment variables.");
}
const api = axios.create({
    baseURL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    const cleanToken = token?.replace(/^"|"$/g, "");
    if (cleanToken) {
        config.headers.token = cleanToken;
    }
    return config;
});

export default api;
