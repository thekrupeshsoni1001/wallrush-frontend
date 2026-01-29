import "../styles/saveToast.css";
import { useNavigate } from "react-router-dom";

function SaveToast({ onClose }) {
    const navigate = useNavigate();

    return (
        <div className="save-toast">
            <span>✨ Wallpaper saved successfully</span>

            <button
                onClick={() => {
                    navigate("/saved");
                    onClose();
                }}
            >
                View
            </button>

            <button className="close" onClick={onClose}>✕</button>
        </div>
    );
}

export default SaveToast;
