import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
});

function GoogleLoginButton({ onLogin }) {
    const handleSuccess = async (response) => {
        try {
            const decoded = jwtDecode(response.credential);

            const res = await API.post("/auth/google-login", {
                name: decoded.name,
                email: decoded.email,
                picture: decoded.picture,
            });

            const authData = {
                token: res.data.token,
                user: res.data.user,
            };

            localStorage.setItem("user", JSON.stringify(authData));

            if (onLogin) onLogin(authData);
        } catch (err) {
            console.error("Google Login Failed", err);
            alert("Google login failed");
        }
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.log("Google Login Failed")}
        />
    );
}

export default GoogleLoginButton;
