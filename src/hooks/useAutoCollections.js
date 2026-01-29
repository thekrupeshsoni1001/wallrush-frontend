// src/hooks/useAutoCollections.js
import { useMemo } from "react";

export default function useAutoCollections(collections) {
    return useMemo(() => {
        if (!collections) return null;

        /* =========================
           FLATTEN + DEDUPE PHOTOS
        ========================= */
        const photoMap = new Map();
        const photoCountMap = {};

        Object.values(collections).forEach(list => {
            list.forEach(photo => {
                // count for "Most Saved"
                photoCountMap[photo.id] =
                    (photoCountMap[photo.id] || 0) + 1;

                // dedupe photos
                if (!photoMap.has(photo.id)) {
                    photoMap.set(photo.id, photo);
                }
            });
        });

        const allPhotos = Array.from(photoMap.values());

        /* =========================
           MOST SAVED
        ========================= */
        const mostSaved = Object.entries(photoCountMap)
            .sort((a, b) => b[1] - a[1])
            .map(([id]) => photoMap.get(Number(id)))
            .filter(Boolean)
            .slice(0, 30);

        /* =========================
           RECENTLY ADDED
        ========================= */
        const recentlyAdded = [...allPhotos]
            .sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0))
            .slice(0, 30);

        /* =========================
           AMOLED PICKS
        ========================= */
        const amoledPicks = allPhotos.filter(photo => {
            if (!photo.avg_color) return false;
            const hex = photo.avg_color.replace("#", "");
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            return r < 30 && g < 30 && b < 30;
        });

        /* =========================
           DARK PICKS
        ========================= */
        const darkPicks = allPhotos.filter(photo => {
            if (!photo.avg_color) return false;
            const hex = photo.avg_color.replace("#", "");
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            const brightness = (r + g + b) / 3;
            return brightness < 80;
        });

        /* =========================
           MINIMAL PICKS
        ========================= */
        const minimalPicks = allPhotos.filter(photo => {
            if (!photo.avg_color) return false;
            const hex = photo.avg_color.replace("#", "");
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            return Math.max(r, g, b) - Math.min(r, g, b) < 20;
        });

        return {
            mostSaved,
            recentlyAdded,
            amoledPicks,
            darkPicks,
            minimalPicks
        };
    }, [collections]);
}
