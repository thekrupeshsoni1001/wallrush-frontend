import axios from "axios";

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

/* ================================
   REQUEST INTERCEPTOR
================================ */
API.interceptors.request.use(
    (req) => {
        const stored = localStorage.getItem("user");
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed?.token) {
                req.headers.Authorization = `Bearer ${parsed.token}`;
            }
        }
        return req;
    },
    (error) => Promise.reject(error)
);



/* ================================
   RESPONSE INTERCEPTOR
================================ */
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response &&
            error.response.status === 401 &&
            error.response.data?.message === "Invalid token"
        ) {
            localStorage.removeItem("user");
            alert("Session expired. Please login again.");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);


export default API;
