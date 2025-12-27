import React from "react";

export default function ImageModal({ src, alt, onClose }) {
  if (!src) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(src);
      // small visual feedback could be added
      alert('Image URL copied to clipboard');
    } catch (e) {
      alert('Unable to copy URL');
    }
  };

  return (
    <div className="image-modal" onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="image-modal-close" onClick={onClose}>
          ×
        </button>
        <img src={src} alt={alt || "Image"} />
        <div style={{marginTop:8, display:'flex', gap:8, justifyContent:'flex-end'}}>
          <button onClick={handleCopy} style={{padding:'8px 10px', borderRadius:8, border:'none', cursor:'pointer'}}>Copy URL</button>
        </div>
      </div>
    </div>
  );
}
