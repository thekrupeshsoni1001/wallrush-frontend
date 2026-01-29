import { useEffect, useRef, useState } from "react";
import "../styles/hero.css";

const PEXELS_KEY = "nbvRuK3O4oQt51sT1gLDh9mg4cPlxSi4JPJLiPMJH8b4tAqHZLgANZ9b ";

const quotes = [
    { small: "Refresh your", big: "SCREEN" },
    { small: "Your screen has a", big: "MOOD" },
    { small: "Design that", big: "MOVES" },
    { small: "Wallpapers that feel", big: "ALIVE" },
    { small: "Pixels with", big: "SOUL" }

];

function Hero() {
    const heroRef = useRef(null);

    const activeQueue = useRef([]);
    const nextQueue = useRef([]);
    const loadingRef = useRef(false);

    const [quoteIndex, setQuoteIndex] = useState(0);

    /* 🔥 SAFE PEXELS FETCH (NO BLOCKING) */
    const fetchBatch = async () => {
        if (loadingRef.current) return [];
        loadingRef.current = true;

        try {
            const page = Math.floor(Math.random() * 50) + 1;

            const res = await fetch(
                `https://api.pexels.com/v1/search?query=wallpaper&orientation=landscape&size=large&per_page=12&page=${page}`,
                {
                    headers: {
                        Authorization: PEXELS_KEY
                    }
                }
            );

            const data = await res.json();

            if (!data.photos || !data.photos.length) return [];

            return data.photos.map(photo => photo.src.large);
        } catch (err) {
            console.error("Pexels fetch failed:", err);
            return [];
        } finally {
            loadingRef.current = false;
        }
    };

    /* INITIAL LOAD (NO LOOP, NO FREEZE) */
    useEffect(() => {
        fetchBatch().then(images => {
            activeQueue.current = images;
        });

        fetchBatch().then(images => {
            nextQueue.current = images;
        });
    }, []);

    /* WALLPAPER STORM */
    useEffect(() => {
        const hero = heroRef.current;
        if (!hero) return;

        const spawnWallpaper = async () => {
            if (activeQueue.current.length === 0) {
                activeQueue.current = nextQueue.current;
                nextQueue.current = await fetchBatch();
            }

            if (!activeQueue.current.length) return;

            const image = activeQueue.current.shift();

            const w = document.createElement("div");
            w.className = "storm-wallpaper";

            const size = 200 + Math.random() * 300;
            w.style.width = `${size}px`;
            w.style.height = `${size * 0.65}px`;

            w.style.left = `${Math.random() * 80}%`;
            w.style.top = `${Math.random() * 80}%`;

            w.style.backgroundImage = `url(${image})`;
            w.style.zIndex = Math.floor(Math.random() * 10) + 1;

            hero.appendChild(w);
            setTimeout(() => w.remove(), 7000);
        };

        const interval = setInterval(spawnWallpaper, 900);
        return () => clearInterval(interval);
    }, []);

    /* QUOTE ROTATION */
    useEffect(() => {
        const interval = setInterval(() => {
            setQuoteIndex(prev => (prev + 1) % quotes.length);
        }, 4200);
        return () => clearInterval(interval);
    }, []);

    const currentQuote = quotes[quoteIndex];

    return (
        <section className="hero-storm" ref={heroRef}>
            <div className="kinetic-quote">
                <span className="line small">{currentQuote.small}</span>

                <span className="line big blend-text">
                    {[...currentQuote.big].map((char, i) => (
                        <span className="char" key={i}>
                            {char}
                        </span>
                    ))}
                </span>
            </div>
        </section>
    );
}

export default Hero;
