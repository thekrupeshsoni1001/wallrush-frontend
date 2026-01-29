import { createContext, useContext, useEffect, useRef, useState } from "react";

const CollectionContext = createContext();

export function CollectionProvider({ children }) {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchedRef = useRef(false);

    const fetchCollections = async () => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await fetch("http://localhost:5000/api/collections", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            setCollections(data.collections || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollections();
    }, []);

    return (
        <CollectionContext.Provider
            value={{ collections, loading, refreshCollections: fetchCollections }}
        >
            {children}
        </CollectionContext.Provider>
    );
}

export const useCollections = () => useContext(CollectionContext);
