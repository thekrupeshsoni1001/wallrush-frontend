import { useEffect, useState } from "react";
import CategoryCard from "../components/CategoryCard";
import categories from "../data/categories";
import "../styles/categories.css";

function Categories() {
    const [covers, setCovers] = useState({});

    useEffect(() => {
        categories.forEach(async (cat) => {
            try {
                const res = await fetch(
                    `https://api.pexels.com/v1/search?query=${cat.query}&per_page=1&orientation=portrait&people=false`,
                    {
                        headers: {
                            Authorization: process.env.REACT_APP_PEXELS_API_KEY,
                        },
                    }
                );

                const data = await res.json();
                if (!data.photos || !data.photos[0]) return;

                setCovers((prev) => ({
                    ...prev,
                    [cat.slug]: data.photos[0].src.large,
                }));
            } catch (err) {
                console.error("Pexels error:", err);
            }
        });
    }, []);

    return (
        <div className="categories-page">
            <h1>Categories</h1>

            <div className="categories-grid">
                {categories.map((cat) => (
                    <CategoryCard
                        key={cat.slug}
                        title={cat.title}
                        slug={cat.slug}
                        image={covers[cat.slug]}
                    />
                ))}
            </div>
        </div>
    );
}

export default Categories;
