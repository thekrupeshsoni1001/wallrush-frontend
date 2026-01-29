import "../styles/dashboard.css";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const profile = user;
    const [imgError, setImgError] = useState(false);

    // 🔁 SAFE REDIRECT
    useEffect(() => {
        if (!profile) {
            navigate("/login");
        }
    }, [profile, navigate]);

    const getInitials = (name = "U") => {
        const parts = name.trim().split(" ");
        return parts.length === 1
            ? parts[0][0]?.toUpperCase()
            : parts[0][0]?.toUpperCase() + parts[1][0]?.toUpperCase();
    };

    if (!profile) return null;

    return (
        <div className="profile-wrapper">
            {/* SIDEBAR */}
            <aside className="profile-sidebar">
                <div className="profile-header">
                    {profile.profile && !imgError ? (
                        <img
                            src={`${BASE_URL}${profile.profile}`}
                            alt="Profile"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="profile-avatar">
                            {getInitials(profile.name)}
                        </div>
                    )}

                    <h3>{profile.name || "User"}</h3>
                    <p>{profile.email}</p>
                </div>

                <ul className="profile-menu">
                    <li onClick={() => navigate("/saved")}>❤️ Saved</li>
                    <li onClick={() => navigate("/collections")}>📁 Collections</li>
                    <li
                        onClick={() => navigate("/profile/settings")}
                        className="active"
                    >
                        👤 Profile Settings
                    </li>
                    <li onClick={() => navigate("/about")}>ℹ️ About</li>

                    <li
                        className="logout"
                        onClick={() => {
                            logout();
                            navigate("/");
                        }}
                    >
                        🚪 Logout
                    </li>
                </ul>
            </aside>

            {/* MAIN CONTENT */}
            <main className="profile-content">
                <h1>Welcome, {profile.name || "User"} 👋</h1>

                <div className="profile-cards">
                    <div
                        className="profile-card"
                        onClick={() => navigate("/saved")}
                    >
                        <h3>Saved Wallpapers</h3>
                        <p>View & manage your favorites</p>
                    </div>

                    <div
                        className="profile-card"
                        onClick={() => navigate("/collections")}
                    >
                        <h3>Your Collections</h3>
                        <p>Organize wallpapers beautifully</p>
                    </div>

                    <div
                        className="profile-card"
                        onClick={() => navigate("/profile/settings")}
                    >
                        <h3>Account Settings</h3>
                        <p>Update name, photo & password</p>
                    </div>

                    <div
                        className="profile-card"
                        onClick={() => navigate("/preferences")}
                    >
                        <h3>Preferences</h3>
                        <p>Theme, layout & personalization</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Profile;
