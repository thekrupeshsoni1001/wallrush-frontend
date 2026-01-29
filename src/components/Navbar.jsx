import "../styles/navbar.css";
import Logo from "../assets/logo1.png";
import { useNavigate, useLocation } from "react-router-dom";
// import { useState } from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
// import { BASE_URL } from "../config";


function Navbar() {

    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const profile = user;


    const [search, setSearch] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    const [savedCount, setSavedCount] = useState(0);
    // ✅ COMMON NAVIGATION HANDLER (FIX)
    const goTo = (path) => {
        setMenuOpen(false);
        navigate(path);
    };

    const handleHomeClick = () => {
        setMenuOpen(false);
        navigate("/");
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!search.trim()) return;
        navigate(`/search?q=${encodeURIComponent(search)}`);
        setSearch("");
        setMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate("/");
    };

    useEffect(() => {
        const fetchSavedCount = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setSavedCount(0);
                    return;
                }

                const res = await fetch(`/api/saved`, {


                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                setSavedCount(data.wallpapers?.length || 0);
            } catch (err) {
                console.error("Failed to load saved count");
            }
        };

        fetchSavedCount();

        // 🔥 auto update on save/remove
        window.addEventListener("savedUpdated", fetchSavedCount);
        return () =>
            window.removeEventListener("savedUpdated", fetchSavedCount);
    }, [user]);


    // ✅ INITIALS
    const getInitials = (name = "") => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };


    return (

        <>
            {/* if (user === undefined) return null; */}

            {/* NAVBAR */}
            <nav className="navbar">
                <div className="nav-left">
                    <div className="logo" onClick={() => navigate("/")}>
                        <img src={Logo} alt="WallRush" />
                    </div>

                    {/* SEARCH */}
                    <form
                        className="nav-search desktop-only"
                        onSubmit={handleSearchSubmit}
                    >
                        <input
                            type="text"
                            placeholder="Search wallpapers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>

                    {/* MOBILE ICON */}
                    <button
                        className="hamburger"
                        onClick={() => setMenuOpen(true)}
                    >
                        ☰
                    </button>
                </div>

                {/* DESKTOP MENU */}
                <div className="menu desktop-only">
                    <a onClick={handleHomeClick}>Home</a>
                    <a onClick={() => navigate("/categories")}>Categories</a>
                    <a onClick={() => navigate("/collections")}>Collections</a>
                    {/* <a onClick={() => navigate("/saved")}>Saved</a> */}
                    <a onClick={() => navigate("/saved")}>
                        ⭐ Saved {savedCount > 0 && `(${savedCount})`}
                    </a>

                    <a onClick={() => navigate("/about")}>About</a>
                    <a onClick={() => navigate("/contact")}>Contact</a>

                    {!user ? (
                        <button
                            className="auth-btn"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>
                    ) : (
                        <div
                            className="profile-box"
                            onClick={() => navigate("/profile")}
                        >
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "50%",
                                    background: "linear-gradient(145deg, #ff9f1a, #ff7b00)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#000",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                }}
                            >
                                {getInitials(profile?.name || "User")}
                            </div>
                        </div>

                    )}
                </div>
            </nav>

            {/* MOBILE MENU */}
            <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
                <button
                    className="mobile-close"
                    onClick={() => setMenuOpen(false)}
                >
                    ✕
                </button>

                <form className="mobile-search" onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="Search wallpapers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>

                {/* ✅ FIXED LINKS */}
                <a onClick={() => goTo("/")}>Home</a>
                <a onClick={() => goTo("/categories")}>Categories</a>
                <a onClick={() => goTo("/collections")}>Collections</a>
                {/* <a onClick={() => goTo("/saved")}>Saved</a> */}
                <a onClick={() => goTo("/saved")}>
                    ⭐ Saved {savedCount > 0 && `(${savedCount})`}
                </a>

                <a onClick={() => goTo("/about")}>About</a>
                <a onClick={() => goTo("/contact")}>Contact</a>

                {!user ? (
                    <button
                        className="auth-btn"
                        onClick={() => goTo("/login")}
                    >
                        Login
                    </button>
                ) : (
                    <>
                        <button
                            className="auth-btn"
                            onClick={() => goTo("/profile")}
                        >
                            Profile
                        </button>

                        <button
                            className="auth-btn logout"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>

            {menuOpen && (
                <div
                    className="mobile-backdrop"
                    onClick={() => setMenuOpen(false)}
                />
            )}
        </>
    );
}

export default Navbar;
