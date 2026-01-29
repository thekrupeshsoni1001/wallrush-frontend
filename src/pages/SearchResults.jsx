import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "../styles/searchResults.css";
import WallpaperModal from "../components/WallpaperModal";

function SearchResults() {
    const [params] = useSearchParams();
    const query = params.get("q");

    const [wallpapers, setWallpapers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeWallpaper, setActiveWallpaper] = useState(null);

    const pageRef = useRef(1);
    const loadedIds = useRef(new Set());

    /* =========================
       FETCH SEARCH RESULTS
    ========================= */
    const fetchResults = async () => {
        if (!query || loading) return;
        setLoading(true);

        try {
            const res = await fetch(
                `https://api.pexels.com/v1/search?query=${query}&per_page=30&page=${pageRef.current}&orientation=portrait&people=false`,
                {
                    headers: {
                        Authorization: process.env.REACT_APP_PEXELS_API_KEY,
                    },
                }
            );

            const data = await res.json();
            if (!data.photos) return;

            const unique = data.photos.filter(p => {
                if (loadedIds.current.has(p.id)) return false;
                loadedIds.current.add(p.id);
                return true;
            });

            setWallpapers(prev => [...prev, ...unique]);
            pageRef.current += 1;
        } catch (err) {
            console.error("Search error:", err);
        }

        setLoading(false);
    };

    /* =========================
       RESET ON NEW QUERY
    ========================= */
    useEffect(() => {
        setWallpapers([]);
        pageRef.current = 1;
        loadedIds.current.clear();
        window.scrollTo(0, 0);
        fetchResults();
        // eslint-disable-next-line
    }, [query]);

    /* =========================
       INFINITE SCROLL
    ========================= */
    useEffect(() => {
        const onScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 600
            ) {
                fetchResults();
            }
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
        // eslint-disable-next-line
    }, [query, loading]);

    return (
        <div className="search-page">
            <h1>
                Results for <span>“{query}”</span>
            </h1>

            <div className="search-grid">
                {wallpapers.map(photo => (
                    <div
                        key={photo.id}
                        className="search-card"
                        onClick={() => setActiveWallpaper(photo)}
                    >
                        <img
                            src={photo.src.large}
                            alt={photo.alt || "wallpaper"}
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>

            {loading && <p className="loading">Loading more wallpapers…</p>}

            {activeWallpaper && (
                <WallpaperModal
                    photo={activeWallpaper}
                    onClose={() => setActiveWallpaper(null)}
                    suggestionsSource={wallpapers}
                    onSelectPhoto={(photo) => setActiveWallpaper(photo)}
                />
            )}
        </div>
    );
}

export default SearchResults;
