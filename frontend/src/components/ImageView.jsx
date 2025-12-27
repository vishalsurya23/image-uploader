import React, { useState } from "react";
import ImageModal from "./ImageModal";

const ImageView = ({ imageUrls = [] }) => {
  const [modalSrc, setModalSrc] = useState(null);

  return (
    <>
      <div className="image-view-container">
        {imageUrls.map((imageUrl, index) => (
          <img
            key={index}
            src={imageUrl}
            alt={`Attachment ${index + 1}`}
            onClick={() => setModalSrc(imageUrl)}
            style={{ cursor: "zoom-in" }}
            loading="lazy"
          />
        ))}
      </div>
      <ImageModal src={modalSrc} alt="Preview" onClose={() => setModalSrc(null)} />
    </>
  );
};

export default ImageView;
