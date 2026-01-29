import { useEffect, useState } from "react";
import WallpaperModal from "../components/WallpaperModal";
import "../styles/categoryPage.css";
import API from "../api/api";


function Saved() {
    const [saved, setSaved] = useState([]);
    const [activeWallpaper, setActiveWallpaper] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ REMOVE FROM DB + UI
    const handleRemove = async (id) => {
        try {
            await API.delete(`/saved/${id}`);


            // 🔥 instant UI update
            setSaved((prev) => prev.filter((w) => w._id !== id));
        } catch (err) {
            console.error("Remove failed", err);
        }
    };

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            setLoading(false);
            return;
        }

        const fetchSaved = async () => {
            try {
                const res = await API.get("/saved");
                setSaved(res.data.wallpapers || []);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSaved();
    }, []);

    if (loading) {
        return <div className="category-page"><h2>Loading...</h2></div>;
    }

    if (saved.length === 0) {
        return (
            <div className="category-page">
                <div className="empty-state">
                    <div className="empty-icon">⭐</div>
                    <h2>No saved wallpapers yet</h2>
                    <p>Save your favorite wallpapers and they’ll appear here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="category-page">
            <h1>Saved Wallpapers</h1>

            <div className="wallpaper-grid">
                {saved.map((photo) => (
                    <img
                        key={photo._id}
                        src={photo.src}
                        alt={photo.alt || "saved wallpaper"}
                        loading="lazy"
                        onClick={() => setActiveWallpaper(photo)}
                        style={{ cursor: "pointer" }}
                    />
                ))}
            </div>

            {activeWallpaper && (
                <WallpaperModal
                    photo={{
                        ...activeWallpaper,
                        src: {
                            large: activeWallpaper.src,
                            original: activeWallpaper.src,
                        },
                    }}
                    mode="saved"
                    onClose={() => setActiveWallpaper(null)}
                    onRemove={() => handleRemove(activeWallpaper._id)}
                />
            )}
        </div>
    );
}

export default Saved;
