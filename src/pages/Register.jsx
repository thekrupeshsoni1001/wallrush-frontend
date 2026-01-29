import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";
import "../styles/register.css";

function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post("/auth/register", form);

            // 🔥 IMPORTANT: unified login structure
            login({
                token: res.data.token,
                user: res.data.user,
            });

            navigate("/");
        } catch (err) {
            alert(err.response?.data?.message || "Register failed");
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Create Account</h2>

                <input
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                />

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                />

                <button className="register-btn" onClick={handleRegister}>
                    Create Account
                </button>

                <div className="login-link">
                    Already have an account?
                    <span onClick={() => navigate("/login")}> Login</span>
                </div>
            </div>
        </div>
    );
}

export default Register;
