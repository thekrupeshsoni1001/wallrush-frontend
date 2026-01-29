import { useNavigate, useLocation } from "react-router-dom";
import "../styles/backButton.css";

export default function GlobalBack() {
    const navigate = useNavigate();
    const location = useLocation();

    // ❌ Home page par back nahi dikhana
    if (location.pathname === "/") return null;

    return (
        <div className="global-back">
            <button onClick={() => navigate(-1)}>
                ← Back
            </button>
        </div>
    );
}
