import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import categories from "../data/categories";
import "../styles/categoryPage.css";
import WallpaperModal from "../components/WallpaperModal";

function CategoryPage() {
    const { slug } = useParams();
    const category = categories.find((c) => c.slug === slug);

    const [wallpapers, setWallpapers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeWallpaper, setActiveWallpaper] = useState(null);

    const pageRef = useRef(1);
    const loadedIds = useRef(new Set());

    const fetchWallpapers = async () => {
        if (loading || !category) return;
        setLoading(true);

        try {
            const res = await fetch(
                `https://api.pexels.com/v1/search?query=${category.query}&per_page=30&page=${pageRef.current}&orientation=portrait&people=false`,
                {
                    headers: {
                        Authorization: process.env.REACT_APP_PEXELS_API_KEY,
                    },
                }
            );

            const data = await res.json();
            if (!data.photos) return;

            const unique = data.photos.filter((p) => {
                if (loadedIds.current.has(p.id)) return false;
                loadedIds.current.add(p.id);
                return true;
            });

            setWallpapers((prev) => [...prev, ...unique]);
            pageRef.current += 1;
        } catch (err) {
            console.error(err);
        }

        setLoading(false);
    };

    useEffect(() => {
        if (!category) return;

        window.scrollTo(0, 0);
        fetchWallpapers();

        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 600
            ) {
                fetchWallpapers();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [slug]);

    if (!category) return <p style={{ padding: 40 }}>Category not found</p>;

    return (
        <div className="category-page">
            <h1>{category.title}</h1>

            <div className="wallpaper-grid">
                {/* Skeletons */}
                {loading &&
                    [...Array(10)].map((_, i) => (
                        <div key={i} className="skeleton-card" />
                    ))}

                {/* Wallpapers */}
                {wallpapers.map((photo) => (
                    <img
                        key={photo.id}
                        src={photo.src.large}
                        alt={photo.alt || "wallpaper"}
                        onClick={() => setActiveWallpaper(photo)}
                    />
                ))}
            </div>

            {activeWallpaper && (
                <WallpaperModal
                    photo={activeWallpaper}
                    onClose={() => setActiveWallpaper(null)}
                    suggestionsSource={wallpapers}
                    onSelectPhoto={(photo) => setActiveWallpaper(photo)}  // ✅ ADD THIS
                />
            )}


        </div>
    );
}

export default CategoryPage;
