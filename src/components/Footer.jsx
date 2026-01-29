import "../styles/footer.css";
import logo from "../assets/logo1.png";

import facebook from "../assets/facebook.png";
import instagram from "../assets/instagram.png";
import linkedin from "../assets/linkedin.png";

import { useNavigate } from "react-router-dom";

function Footer() {
    const navigate = useNavigate();

    const goTo = (path) => {
        navigate(path);
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <footer className="footer">

            {/* TOP GRID */}
            <div className="footer-grid">

                {/* BRAND */}
                <div className="footer-brand">
                    <img src={logo} alt="WallRush logo" />
                    <p>
                        WallRush is a curated wallpaper platform delivering
                        aesthetic, minimal and high-quality backgrounds for
                        every screen.
                    </p>
                </div>

                {/* EXPLORE */}
                <div className="footer-col">
                    <h4>Explore</h4>
                    <span onClick={() => goTo("/")}>Home</span>
                    <span onClick={() => goTo("/collections")}>Trending</span>
                    <span onClick={() => goTo("/collections")}>Latest</span>
                    <span onClick={() => goTo("/collections")}>Popular</span>
                </div>

                {/* CATEGORIES */}
                <div className="footer-col">
                    <h4>Categories</h4>
                    <span onClick={() => goTo("/category/aesthetic")}>Aesthetic</span>
                    <span onClick={() => goTo("/category/minimal")}>Minimal</span>
                    <span onClick={() => goTo("/category/nature")}>Nature</span>
                    <span onClick={() => goTo("/category/dark")}>Dark</span>
                </div>

                {/* SOCIAL */}
                <div className="footer-col">
                    <h4>Connect</h4>
                    <div className="footer-socials">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer">
                            <img src={facebook} alt="Facebook" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer">
                            <img src={instagram} alt="Instagram" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                            <img src={linkedin} alt="LinkedIn" />
                        </a>
                    </div>
                </div>

            </div>

            {/* BOTTOM */}
            <div className="footer-bottom">
                © {new Date().getFullYear()} WallRush. All rights reserved.
            </div>

        </footer>
    );
}

export default Footer;
