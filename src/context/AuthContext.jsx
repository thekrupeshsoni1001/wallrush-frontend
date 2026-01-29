import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // 🔁 Load user on refresh
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    // ✅ LOGIN
    const login = (data) => {
        const freshUser = { ...data.user }; // 🔥 FORCE NEW OBJECT

        localStorage.setItem("user", JSON.stringify(freshUser));

        if (data.token) {
            localStorage.setItem("token", data.token);
        }

        setUser(freshUser); // 🔥 THIS triggers re-render
    };

    // ✅ LOGOUT (🔥 IMPORTANT FIX)
    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token"); // 👈 THIS WAS MISSING
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
