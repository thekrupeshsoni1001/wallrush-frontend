import { useParams } from "react-router-dom";
// import { useSaved } from "../context/SavedContext";
import { useCollections } from "../context/CollectionContext";
import { useState, useEffect } from "react";
import WallpaperModal from "../components/WallpaperModal";
// import useAutoCollections from "../hooks/useAutoCollections";
import "../styles/categoryPage.css";

function CollectionPage() {
    // 🔥 ROUTE PARAMS
    // Expected route:
    // /collection/:type/:name
    const { type, name } = useParams();
    const { collections } = useCollections();

    const isAuto = type === "auto";

    // 🔥 DERIVED WALLPAPERS (NO STATE – ALWAYS FRESH)
    // let wallpapers = [];
    const [wallpapers, setWallpapers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);


    const [active, setActive] = useState(null);

    // 🔥 BULK SELECTION
    const [selected, setSelected] = useState([]);
    const [showBulkMove, setShowBulkMove] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState("");

    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (!collections.length || !hasMore) return;

        const fetchWallpapers = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const collection = collections.find(
                    (c) => c.name.toLowerCase() === name.toLowerCase()
                );
                if (!collection) return;

                const res = await fetch(
                    `http://localhost:5000/api/collection-wallpapers/${collection._id}?page=${page}&limit=20`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();

                if (!data.wallpapers || data.wallpapers.length === 0) {
                    setHasMore(false);
                    return;
                }

                setWallpapers((prev) =>
                    page === 1 ? data.wallpapers : [...prev, ...data.wallpapers]
                );
            } catch (err) {
                console.error("Failed to load collection wallpapers", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWallpapers();
    }, [page, collections, name, hasMore]);

    useEffect(() => {
        setWallpapers([]);
        setPage(1);
        setHasMore(true);
        setLoading(true);
    }, [name]);


    const handleRemoveFromCollection = async (docId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            await fetch(
                `http://localhost:5000/api/collection-wallpapers/${docId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // 🔥 update UI
            setWallpapers((prev) => prev.filter((w) => w._id !== docId));
            setActive(null);
        } catch (err) {
            console.error("Remove from collection failed", err);
        }
    };

    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
        );
    };

    const clearSelection = () => setSelected([]);

    const handleBulkMove = async (targetCollectionId) => {
        const token = localStorage.getItem("token");

        // 1️⃣ move to target collection
        await fetch(
            "http://localhost:5000/api/collection-wallpapers/bulk-move",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    wallpaperIds: wallpapers
                        .filter((w) => selected.includes(w._id))
                        .map((w) => w.wallpaperId), // ✅ ONLY IDs
                    targetCollectionId,
                }),

            }
        );

        // 2️⃣ remove from CURRENT collection (source)
        await Promise.all(
            selected.map((id) =>
                fetch(
                    `http://localhost:5000/api/collection-wallpapers/${id}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
            )
        );

        // 3️⃣ update UI immediately
        setWallpapers((prev) =>
            prev.filter((w) => !selected.includes(w._id))
        );

        // 4️⃣ toast
        const targetName =
            collections.find((c) => c._id === targetCollectionId)?.name ||
            "collection";

        setToast({ text: `Moved to ${targetName} ❤️` });

        setTimeout(() => setToast(null), 2500);

        clearSelection();
        setShowBulkMove(false);
    };


    const handleCreateAndMove = async () => {
        if (!newCollectionName.trim()) return;

        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/collections", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: newCollectionName }),
        });

        const data = await res.json();
        if (!res.ok) return;

        await handleBulkMove(data.collection._id);
        setNewCollectionName("");
    };

    const handleBulkDelete = async () => {
        const token = localStorage.getItem("token");

        await fetch(
            "http://localhost:5000/api/collection-wallpapers/bulk-delete",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ids: selected }),
            }
        );

        setWallpapers((prev) =>
            prev.filter((w) => !selected.includes(w._id))
        );

        clearSelection();
    };


    /* =========================
       EMPTY STATE
    ========================= */
    if (!loading && wallpapers.length === 0) {
        return (
            <div className="category-page">
                <div className="empty-state">
                    <div className="empty-icon">📂</div>
                    <h2>No wallpapers found</h2>
                    <p>This collection is empty or not generated yet.</p>
                </div>
            </div>
        );
    }

    /* =========================
       RENDER
    ========================= */
    return (
        <div className="category-page">
            <h1>
                {isAuto
                    ? name.replace(/([A-Z])/g, " $1")
                    : `${name} Collection`}
            </h1>

            <div className="wallpaper-grid">
                {wallpapers.map((photo) => (
                    <div
                        key={photo._id}
                        style={{
                            position: "relative",
                            breakInside: "avoid",
                            marginBottom: "18px",
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={selected.includes(photo._id)}
                            onChange={() => toggleSelect(photo._id)}
                            style={{
                                position: "absolute",
                                top: "10px",
                                left: "10px",
                                zIndex: 2,
                                transform: "scale(1.2)",
                            }}
                        />

                        <img
                            src={photo.src?.large || photo.src}
                            alt={photo.alt || "wallpaper"}
                            onClick={() => setActive(photo)}
                            style={{
                                cursor: "pointer",
                                outline: selected.includes(photo._id)
                                    ? "3px solid #ff8a00"
                                    : "none",
                            }}
                        />
                    </div>

                ))}
            </div>

            {active && (
                <WallpaperModal
                    photo={active}
                    mode="collection"
                    collection={isAuto ? "auto" : name}
                    onClose={() => setActive(null)}
                    onRemove={
                        !isAuto
                            ? () => handleRemoveFromCollection(active._id)
                            : undefined
                    }
                />
            )}
            {showBulkMove && (
                <div
                    className="collection-overlay"
                    onClick={() => setShowBulkMove(false)}
                >
                    <div
                        className="collection-picker"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 🔥 CLOSE BUTTON */}
                        <button
                            type="button"
                            className="close-btn"
                            onClick={() => setShowBulkMove(false)}
                        >
                            ✕
                        </button>


                        <h3>Move {selected.length} wallpapers</h3>


                        <input
                            className="collection-input"
                            placeholder="New collection name"
                            value={newCollectionName}
                            onChange={(e) => setNewCollectionName(e.target.value)}
                        />

                        <button onClick={handleCreateAndMove}>
                            ➕ Create & Move
                        </button>

                        <hr />

                        {collections.map((col) => (
                            <div
                                key={col._id}
                                className="collection-item"
                                onClick={() => handleBulkMove(col._id)}
                            >
                                📂 {col.name}
                            </div>
                        ))}

                        <button onClick={() => setShowBulkMove(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {selected.length > 0 && !showBulkMove && (
                <div className="bulk-bar">
                    <span>{selected.length} selected</span>

                    <button
                        className="move"
                        onClick={() => setShowBulkMove(true)}
                    >
                        📁 Move
                    </button>

                    <button
                        className="danger"
                        onClick={handleBulkDelete}
                    >
                        🗑 Delete
                    </button>

                    <button
                        className="close"
                        onClick={clearSelection}
                    >
                        ✕
                    </button>
                </div>
            )}


            {toast && (
                <div className="wm-toast">
                    <span className="wm-toast-text">{toast.text}</span>
                </div>
            )}

        </div>

    );
}

export default CollectionPage;
