import "../styles/wallpaperModal.css";
// import { useSaved } from "../context/SavedContext";
import { useCollections } from "../context/CollectionContext";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function WallpaperModal({
    photo,
    onClose,
    onRemove,
    mode = "normal",
    collection = "favorites",
    suggestionsSource = [],
    onSelectPhoto
}) {
    const navigate = useNavigate();
    // const { collections, saveToCollection, removeFromCollection, createCollection } = useSaved();
    const { collections, refreshCollections } = useCollections();

    const [toast, setToast] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [newCollection, setNewCollection] = useState("");
    const [showDetails, setShowDetails] = useState(false);

    const [isSaving, setIsSaving] = useState(false);
    const [isAdding, setIsAdding] = useState(false);


    useEffect(() => {
        console.log("showPicker 👉", showPicker);
    }, [showPicker]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => (document.body.style.overflow = "auto");
    }, []);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                if (showPicker) setShowPicker(false);
                else onClose();
            }
        };

        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [showPicker, onClose]);

    /* ================= AI SUGGESTIONS ================= */
    const suggestions = useMemo(() => {
        if (!photo || !suggestionsSource?.length) return [];

        const getRGB = (hex) => {
            if (!hex) return null;
            const c = hex.replace("#", "");
            return {
                r: parseInt(c.substr(0, 2), 16),
                g: parseInt(c.substr(2, 2), 16),
                b: parseInt(c.substr(4, 2), 16),
            };
        };

        const colorDistance = (a, b) =>
            Math.sqrt(
                Math.pow(a.r - b.r, 2) +
                Math.pow(a.g - b.g, 2) +
                Math.pow(a.b - b.b, 2)
            );

        const base = getRGB(photo.avg_color);

        return suggestionsSource
            .filter((p) => p.id !== photo.id)
            .map((p) => ({
                ...p,
                score: colorDistance(base, getRGB(p.avg_color)),
            }))
            .sort((a, b) => a.score - b.score)
            .slice(0, 8);
    }, [photo, suggestionsSource]);

    if (!photo) return null;

    const resolution =
        photo.width && photo.height
            ? `${photo.width} × ${photo.height}`
            : "—";

    const orientation = photo.height > photo.width ? "Portrait" : "Landscape";

    /* ================= ACTIONS ================= */

    const handleDownload = async () => {
        const res = await fetch(photo.src?.original || photo.src);

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "wallrush-wallpaper.jpg";
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleSetWallpaper = () => {
        window.open(photo.src.original, "_blank");

        setToast({
            text: "Right click → Save image / Set as wallpaper",
        });

        setTimeout(() => setToast(null), 3500);
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: photo.alt || "WallRush Wallpaper",
                url: photo.src.original,
            });
        } else {
            await navigator.clipboard.writeText(photo.src.original);
            setToast({ text: "Link copied to clipboard" });
            setTimeout(() => setToast(null), 2500);
        }
    };

    // ✅ Create collection in DB and add wallpaper to it
    const handleCreateCollectionDB = async () => {
        setIsAdding(true);

        const trimmed = newCollection.trim();
        if (!trimmed) return;

        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:5000/api/collections", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: trimmed }),
            });

            const data = await res.json();

            if (!res.ok) {
                setToast({ text: data.message || "Failed to add to collection" });
                return;
            }


            // ✅ add wallpaper to newly created collection
            await addToCollectionDB(data.collection._id);

            await refreshCollections();

            setNewCollection("");
            setShowPicker(false);
        } catch (err) {
            console.error(err);
            setToast({ text: "Create failed" });
        } finally {
            setIsAdding(false);
        }
    };

    const saveToDB = async () => {
        setIsSaving(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setToast({ text: "Please login first" });
                return;
            }

            const res = await fetch("http://localhost:5000/api/saved/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    wallpaperId: photo.id,
                    src: photo.src.large,
                    alt: photo.alt,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setToast({ text: data.message || "Already saved" });
                return;
            }

            setToast({ text: "Wallpaper saved ❤️" });
            window.dispatchEvent(new Event("savedUpdated"));

        } catch (err) {
            console.error(err);
            setToast({ text: "Save failed" });
        } finally {
            setIsSaving(false);
        }
    };

    // ✅ ADD WALLPAPER TO COLLECTION (MongoDB)
    // ✅ Add wallpaper to existing collection (MongoDB)
    const addToCollectionDB = async (collectionId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setToast({ text: "Please login first" });
                return;
            }

            const res = await fetch(
                "http://localhost:5000/api/collection-wallpapers",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        collectionId,
                        wallpaper: {
                            wallpaperId: photo.id || photo._id,
                            src: {
                                original:
                                    photo.src?.original ||
                                    photo.src?.large2x ||
                                    photo.src?.large ||
                                    photo.src,
                            },
                            alt: photo.alt || "",
                        },
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                setToast({ text: data.message || "Failed to add" });
                return;
            }

            // ✅ IMPORTANT UI FIXES
            await refreshCollections();   // 🔥 refresh context
            setShowPicker(false);         // 🔥 close modal
            const colName =
                collections.find((c) => c._id === collectionId)?.name || "collection";

            setToast({ text: `Added to "${colName}" ❤️` });


            setTimeout(() => setToast(null), 2500);

        } catch (err) {
            console.error(err);
            setToast({ text: "Add failed" });
        }
    };


    const handleSave = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/saved/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    wallpaperId: photo.id,
                    src: photo.src,
                    alt: photo.alt,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Already saved");
                return;
            }

            alert("Wallpaper saved ❤️");
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        }
    };


    // const handleCreateCollection = () => {
    //     if (!newCollection.trim()) return;
    //     createCollection(newCollection);
    //     saveToCollection(newCollection, photo);
    //     setShowPicker(false);
    //     setToast({ text: `Added to ${newCollection}` });
    //     setNewCollection("");
    //     setTimeout(() => setToast(null), 2500);
    // };

    // const handleRemove = () => {
    //     removeFromCollection(collection, photo.id);
    //     setToast({ text: "Wallpaper removed" });
    //     setTimeout(() => {
    //         setToast(null);
    //         onClose();
    //     }, 1000);
    // };

    return (
        <>
            <div
                className={`wm-overlay ${showPicker ? "disabled" : ""}`}
                onClick={() => {
                    if (!showPicker) onClose();
                }}
            >


                <div className="wm-modal" onClick={(e) => e.stopPropagation()}>

                    <button className="wm-close" onClick={onClose}>✕</button>

                    <div className="wm-left">
                        <img
                            src={photo.src?.large2x || photo.src?.large || photo.src}
                            alt={photo.alt || "wallpaper"}
                        />

                    </div>

                    <div className="wm-right">
                        <h3>{photo.alt || "Wallpaper"}</h3>

                        <button
                            className="wm-details-toggle"
                            onClick={() => setShowDetails(!showDetails)}
                        >
                            ℹ Details
                        </button>

                        <div className={`wm-details ${showDetails ? "open" : ""}`}>
                            <div><span>Resolution</span><b>{resolution}</b></div>
                            <div><span>Orientation</span><b>{orientation}</b></div>
                        </div>

                        <button className="wm-btn primary" onClick={handleDownload}>
                            ⬇ Download
                        </button>

                        <button className="wm-btn accent" onClick={handleSetWallpaper}>
                            🖼 Set as Wallpaper
                        </button>

                        <button className="wm-btn" onClick={handleShare}>
                            🔗 Share
                        </button>

                        {mode === "normal" && (
                            <>
                                {/* <button className="wm-btn" onClick={() => saveToCollection("favorites", photo)}>
                                    ⭐ Save
                                </button> */}
                                <button
                                    className="wm-btn"
                                    onClick={saveToDB}
                                    disabled={isSaving}
                                >
                                    {isSaving ? "Saving..." : "⭐ Save"}
                                </button>


                                <button
                                    className="wm-btn"
                                    disabled={isAdding}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowPicker(true);
                                    }}
                                >
                                    📁 Add to Collection
                                </button>



                            </>
                        )}

                        {(mode === "saved" || mode === "collection") &&
                            typeof onRemove === "function" && (
                                <button
                                    className="wm-btn danger"
                                    onClick={() => {
                                        onRemove();
                                        setToast({ text: "Wallpaper removed" });
                                        setTimeout(() => {
                                            setToast(null);
                                            onClose();
                                        }, 700);
                                    }}
                                >
                                    🗑 Remove
                                </button>
                            )}

                        {/* 🔥 AI SUGGESTIONS */}
                        {suggestions.length > 0 && onSelectPhoto && (
                            <div className="wm-suggestions">
                                <h4>✨ You may also like</h4>
                                <div className="wm-suggestions-row">
                                    {suggestions.map((s) => (
                                        <img
                                            key={s.id}
                                            src={s.src.medium}
                                            alt=""
                                            onClick={() => onSelectPhoto(s)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* COLLECTION PICKER */}
            {showPicker && (
                <div
                    className="wm-collection-overlay"
                    onClick={() => setShowPicker(false)}
                >
                    <div
                        className="wm-collection-picker"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <h3>Create or Choose Collection</h3>

                        <input
                            className="collection-input"
                            placeholder="Collection name"
                            value={newCollection}
                            onChange={(e) => setNewCollection(e.target.value)}
                        />

                        <button
                            className={`wm-btn primary ${isAdding ? "loading" : ""}`}
                            onClick={handleCreateCollectionDB}
                            disabled={isAdding}
                        >
                            {isAdding ? (
                                <>
                                    <span className="wm-loader"></span>
                                    Adding...
                                </>
                            ) : (
                                "➕ Create & Add"
                            )}
                        </button>



                        <div className="collection-list">
                            {collections.map((col) => (
                                <div
                                    key={col._id}
                                    className="wm-collection-item"
                                    onClick={() => addToCollectionDB(col._id)}
                                >

                                    📂 {col.name}
                                </div>
                            ))}

                        </div>

                    </div>
                </div>
            )}


            {toast && (
                <div className="wm-toast">
                    <span className="wm-toast-text">{toast.text}</span>
                </div>
            )}
        </>
    );
}

export default WallpaperModal;
