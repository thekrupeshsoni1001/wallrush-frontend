import Cropper from "react-easy-crop";
import { useState } from "react";
import "../styles/cropper.css";

export default function ImageCropper({ image, onCropDone, onCancel }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState(null);

    return (
        <div className="cropper-overlay">
            <div className="cropper-container">
                {/* CROP AREA */}
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={(_, area) => setCroppedArea(area)}
                />

                {/* CONTROLS */}
                <div className="cropper-controls">
                    <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={zoom}
                        onChange={(e) => setZoom(e.target.value)}
                    />

                    <div className="cropper-buttons">
                        <button className="cancel-btn" onClick={onCancel}>
                            Cancel
                        </button>

                        <button
                            className="crop-btn"
                            onClick={() => onCropDone(croppedArea)}
                        >
                            Crop & Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
