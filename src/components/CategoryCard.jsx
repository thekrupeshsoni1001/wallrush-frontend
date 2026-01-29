import { useNavigate } from "react-router-dom";
import "../styles/categoryCard.css";

function CategoryCard({ title, slug, image }) {
    const navigate = useNavigate();

    return (
        <div
            className="category-card"
            onClick={() => navigate(`/category/${slug}`)}
        >
            {image && <img src={image} alt={title} />}
            <div className="category-overlay">
                <h3>{title}</h3>
            </div>
        </div>
    );
}

export default CategoryCard;
