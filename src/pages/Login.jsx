import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";
import GoogleLoginButton from "../components/GoogleLoginButton";
import "../styles/login.css";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post("/auth/login", form);

            // 🔥 IMPORTANT: SAME structure everywhere
            login({
                token: res.data.token,
                user: res.data.user,
            });

            navigate("/");
        } catch (err) {
            alert(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Welcome Back</h2>

                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <button className="login-btn" type="submit">
                        Login
                    </button>
                </form>

                <div className="register-link">
                    New here?
                    <span onClick={() => navigate("/register")}>
                        Create Account
                    </span>
                </div>

                <div className="divider">
                    <span>OR</span>
                </div>

                {/* 🔥 GOOGLE LOGIN */}
                <GoogleLoginButton
                    onLogin={(data) => {
                        login({
                            token: data.token,
                            user: data.user,
                        });
                        navigate("/");
                    }}
                />
            </div>
        </div>
    );
}

export default Login;
