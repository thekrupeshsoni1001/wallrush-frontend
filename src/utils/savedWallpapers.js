const STORAGE_KEY = "wallrush_saved_wallpapers";

export const getSavedWallpapers = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
};

export const saveWallpaper = (photo) => {
    const saved = getSavedWallpapers();

    const exists = saved.some((p) => p.id === photo.id);
    if (exists) return false;

    saved.push(photo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    return true;
};

export const removeWallpaper = (id) => {
    const saved = getSavedWallpapers().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
};

export const isWallpaperSaved = (id) => {
    return getSavedWallpapers().some((p) => p.id === id);
};
