import { createContext, useContext, useEffect, useState } from "react";

const SavedContext = createContext();

export function SavedProvider({ children }) {
    const [collections, setCollections] = useState(null);

    /* =========================
       LOAD FROM LOCALSTORAGE
    ========================= */
    useEffect(() => {
        const stored = localStorage.getItem("wallrush_collections");
        if (stored) {
            setCollections(JSON.parse(stored));
        } else {
            setCollections({
                favorites: [],
            });
        }
    }, []);

    /* =========================
       SAVE TO LOCALSTORAGE
    ========================= */
    useEffect(() => {
        if (collections) {
            localStorage.setItem(
                "wallrush_collections",
                JSON.stringify(collections)
            );
        }
    }, [collections]);

    /* =========================
       CREATE COLLECTION
    ========================= */
    const createCollection = (name) => {
        setCollections((prev) => {
            if (prev[name]) return prev;
            return { ...prev, [name]: [] };
        });
    };

    /* =========================
       SAVE TO COLLECTION
       ✅ savedAt added safely
    ========================= */
    const saveToCollection = (collection, photo) => {
        setCollections((prev) => {
            const exists = prev[collection]?.some(
                (p) => p.id === photo.id
            );
            if (exists) return prev;

            return {
                ...prev,
                [collection]: [
                    ...prev[collection],
                    {
                        ...photo,
                        savedAt: photo.savedAt || Date.now(),
                    },
                ],
            };
        });
    };

    /* =========================
       REMOVE FROM COLLECTION
    ========================= */
    const removeFromCollection = (collection, photoId) => {
        setCollections((prev) => {
            const updated = { ...prev };

            // 🔥 SMART COLLECTION → remove from ALL real collections
            if (collection === "auto") {
                Object.keys(updated).forEach((key) => {
                    updated[key] = updated[key].filter(
                        (p) => p.id !== photoId
                    );
                });
                return updated;
            }

            // 🔥 NORMAL COLLECTION
            if (!updated[collection]) return prev;

            updated[collection] = updated[collection].filter(
                (p) => p.id !== photoId
            );

            return updated;
        });
    };


    /* =========================
       DELETE COLLECTION
    ========================= */
    const deleteCollection = (name) => {
        if (name === "favorites") return;

        setCollections((prev) => {
            const updated = { ...prev };
            delete updated[name];
            return updated;
        });
    };

    if (!collections) return null;

    return (
        <SavedContext.Provider
            value={{
                collections,
                createCollection,
                saveToCollection,
                removeFromCollection,
                deleteCollection,
            }}
        >
            {children}
        </SavedContext.Provider>
    );
}

export const useSaved = () => useContext(SavedContext);
