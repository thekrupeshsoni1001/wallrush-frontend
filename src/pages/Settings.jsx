import { useState, useEffect } from "react";
import "../styles/settings.css";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Settings() {
    const { user, login } = useAuth();

    const [name, setName] = useState(user?.name || "");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) setName(user.name);
    }, [user]);

    const handleSave = async () => {
        try {
            setLoading(true);

            const res = await axios.put(
                "http://localhost:5000/api/auth/update-profile",
                { name, password },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            login({
                token: localStorage.getItem("token"),
                user: res.data.user,
            });

            alert("✅ Profile Updated");
        } catch (err) {
            alert("❌ Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-page">
            <div className="settings-card">
                <div className="settings-profile">
                    <div className="settings-avatar">
                        {name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                    </div>
                </div>

                <div className="settings-form">
                    <label>Full Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} />

                    <label>Email</label>
                    <input value={user?.email || ""} disabled />

                    <label>New Password</label>
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        className="save-btn"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
