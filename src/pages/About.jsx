import "../styles/about.css";
import logo from "../assets/logo1.png";


function About() {
    return (
        <div className="about-page">

            {/* HERO SECTION */}
            <section className="about-hero">
                <div className="about-logo">
                    <img src={logo} alt="WallRush Logo" />
                </div>

                <p className="about-tagline">
                    Premium wallpapers. Smart collections. Pure aesthetics.
                </p>
            </section>

            {/* ABOUT DESCRIPTION */}
            <section className="about-section glass">
                <h2>What is WallRush?</h2>
                <p>
                    WallRush is a modern wallpaper platform designed for users who
                    love minimal, premium, and high-quality visuals.
                    It combines smart collections, AI-based filtering, and a
                    clean UI to give you the best wallpaper experience.
                </p>
            </section>

            {/* FEATURES */}
            <section className="about-section">
                <h2>Features</h2>

                <div className="features-grid">
                    <div className="feature-card">⚡ Fast & Lightweight</div>
                    <div className="feature-card">🎨 Premium Wallpapers</div>
                    <div className="feature-card">🧠 Smart Collections</div>
                    <div className="feature-card">🌙 AMOLED Friendly</div>
                    <div className="feature-card">📁 Save & Organize</div>
                    <div className="feature-card">🔍 AI Color Suggestions</div>
                </div>
            </section>

            {/* TECH STACK */}
            <section className="about-section glass">
                <h2>Built With</h2>
                <div className="tech-stack">
                    <span>⚛ React</span>
                    <span>🧠 Context API</span>
                    <span>🎨 Custom CSS</span>
                    <span>📦 LocalStorage</span>
                    <span>📷 Pexels API</span>
                </div>
            </section>

            {/* FOOTER NOTE */}
            <section className="about-footer">
                <p>
                    Built with ❤️ for wallpaper lovers.
                </p>
                <span>© {new Date().getFullYear()} WallRush</span>
            </section>

        </div>
    );
}

export default About;
