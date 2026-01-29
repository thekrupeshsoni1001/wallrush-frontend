import axios from "axios";

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

/* ================================
   REQUEST INTERCEPTOR
================================ */
API.interceptors.request.use(
    (req) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.token) {
            req.headers.Authorization = `Bearer ${user.token}`;
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
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            alert("Session expired. Please login again.");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default API;
