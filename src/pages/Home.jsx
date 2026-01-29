import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/home.css";
import categories from "../data/categories";
import WallpaperModal from "../components/WallpaperModal";

function Home() {
    const [rows, setRows] = useState({});
    const [activeWallpaper, setActiveWallpaper] = useState(null);

    const filterRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        categories.forEach(async (category) => {
            try {
                const res = await fetch(
                    `https://api.pexels.com/v1/search?query=${category.query}&per_page=12`,
                    {
                        headers: {
                            Authorization: process.env.REACT_APP_PEXELS_API_KEY,
                        },
                    }
                );

                const data = await res.json();
                if (data.photos) {
                    setRows((prev) => ({
                        ...prev,
                        [category.slug]: data.photos,
                    }));
                }
            } catch (err) {
                console.error(err);
            }
        });
    }, []);

    return (
        <div className="home">
            <div ref={filterRef} id="home-filter" className="filter-bar">
                {categories.map((cat) => (
                    <button
                        key={cat.slug}
                        onClick={() =>
                            document
                                .getElementById(cat.slug)
                                ?.scrollIntoView({ behavior: "smooth" })
                        }
                    >
                        {cat.title.replace(" Wallpapers", "")}
                    </button>
                ))}
            </div>

            {categories.map((cat) => {
                const photos = rows[cat.slug];

                return (
                    <section key={cat.slug} id={cat.slug}>
                        <h2>{cat.title}</h2>

                        <div className="row-scroll">
                            {!photos &&
                                [...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="skeleton-card horizontal"
                                    />
                                ))}

                            {photos?.map((photo) => (
                                <div
                                    key={photo.id}
                                    className="wall-card"
                                    onClick={() =>
                                        setActiveWallpaper(photo)
                                    }
                                >
                                    <img
                                        src={photo.src.large}
                                        alt=""
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                );
            })}

            {/* 🔥 MODAL WITH AI SUGGESTIONS */}
            {activeWallpaper && (
                <WallpaperModal
                    photo={activeWallpaper}
                    onClose={() => setActiveWallpaper(null)}
                    suggestionsSource={
                        rows[
                        categories.find(cat =>
                            rows[cat.slug]?.some(
                                p => p.id === activeWallpaper.id
                            )
                        )?.slug
                        ] || []
                    }
                    onSelectPhoto={(photo) => setActiveWallpaper(photo)}
                />
            )}
        </div>
    );
}

export default Home;
