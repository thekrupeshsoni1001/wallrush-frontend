import { useNavigate } from "react-router-dom";
// import { useSaved } from "../context/SavedContext";
import { useCollections } from "../context/CollectionContext";
import { useState } from "react";
import useAutoCollections from "../hooks/useAutoCollections";
import "../styles/categoryPage.css";
// import GlobalBack from "./components/GlobalBack";

function Collections() {
    const { collections, loading, refreshCollections } = useCollections();

    const navigate = useNavigate();

    const [showCreate, setShowCreate] = useState(false);
    const [name, setName] = useState("");

    // const auto = useAutoCollections(collections);
    const auto = useAutoCollections([]); // temporary (saved wallpapers later connect)


    // const collectionNames = Object.keys(collections);
    const collectionNames = collections.map((c) => c.name);


    // const handleCreate = () => {
    //     const trimmed = name.trim();
    //     if (!trimmed) return;

    //     const exists = collectionNames.some(
    //         (c) => c.toLowerCase() === trimmed.toLowerCase()
    //     );
    //     if (exists) return;

    //     createCollection(trimmed);
    //     setName("");
    //     setShowCreate(false);
    // };

    const handleCreate = async () => {
        const trimmed = name.trim();
        if (!trimmed) return;

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
            alert(data.message);
            return;
        }

        await refreshCollections(); // 🔥 reload from DB
        setName("");
        setShowCreate(false);
    };



    const smartCollections = auto
        ? [
            { key: "mostSaved", title: "Most Saved", list: auto.mostSaved },
            {
                key: "recentlyAdded",
                title: "Recently Added",
                list: auto.recentlyAdded,
            },
            { key: "amoled", title: "AMOLED Picks", list: auto.amoledPicks },
            { key: "dark", title: "Dark Picks", list: auto.darkPicks },
            { key: "minimal", title: "Minimal Picks", list: auto.minimalPicks },
        ]
        : [];

    return (

        <div className="category-page">
            <h1>Collections</h1>
            {/* <GlobalBack /> */}
            {/* =====================
               SMART COLLECTIONS
            ===================== */}
            <h2>Smart Collections</h2>
            <div className="collections-grid">
                {smartCollections.map(
                    (col) =>
                        col.list.length > 0 && (
                            <div
                                key={col.key}
                                className="collection-card"
                                onClick={() =>
                                    navigate(`/collection/auto/${col.key}`)
                                }
                            >
                                <h3>{col.title}</h3>
                                <p>{col.list.length} wallpapers</p>
                            </div>
                        )
                )}
            </div>

            {/* =====================
               USER COLLECTIONS
            ===================== */}
            <h2>Your Collections</h2>

            <div className="collections-grid">
                {/* CREATE COLLECTION */}
                <div
                    className="collection-card create-card"
                    onClick={() => setShowCreate(true)}
                >
                    <div className="plus-icon">+</div>
                    <span>Create Collection</span>
                </div>

                {collections.map((col) => (
                    <div
                        key={col._id}
                        className="collection-card"
                        onClick={() => navigate(`/collection/${col.name}`)}
                    >
                        <h3>{col.name}</h3>
                        <p>—</p>


                        {col.name !== "Favorites" && (
                            <button
                                className="collection-delete"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    alert("Delete collection feature coming next 🚧");
                                }}
                            >
                                🗑
                            </button>
                        )}

                    </div>
                ))}
            </div>

            {/* CREATE MODAL */}
            {showCreate && (
                <div className="wm-overlay" onClick={() => setShowCreate(false)}>
                    <div
                        className="collection-picker"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="close-btn"
                            onClick={() => setShowCreate(false)}
                        >
                            ✕
                        </button>


                        <h3>Create New Collection</h3>

                        <input
                            className="collection-input"
                            placeholder="Collection name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <button
                            className="wm-btn primary"
                            onClick={handleCreate}
                        >
                            ➕ Create
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Collections;
