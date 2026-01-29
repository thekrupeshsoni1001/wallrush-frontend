import "../styles/preferences.css";
// import { useNavigate } from "react-router-dom";

export default function Preferences() {
    // const navigate = useNavigate();

    return (
        <div className="preferences-wrapper">
            {/* <button className="back-btn" onClick={() => navigate(-1)}>
                ← Back
            </button> */}

            <div className="preferences-container">
                <h1 className="title">Preferences</h1>
                <p className="subtitle">
                    Personalize your WallRush experience in your way ✨
                </p>

                <div className="coming-card">
                    <div className="glow-circle"></div>

                    <h2>Something exciting is on the way 🚀</h2>

                    <p>
                        We’re carefully crafting a smoother, smarter and more
                        personalized experience for you.
                        <br />
                        This space will soon help you shape WallRush exactly how
                        you like it.
                    </p>

                    <span className="coming-note">
                        Stay tuned — good things take time 😉
                    </span>
                </div>
            </div>
        </div>
    );
}
