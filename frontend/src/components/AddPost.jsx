import React, { useState } from "react";
import { useUploadContext } from "../hooks/useUploadContext";
import { useNavigate } from "react-router-dom";
import ImageUpload from "./ImageUpload";

export default function AddPost() {
  const { dispatch } = useUploadContext();
  const navigate = useNavigate();

  const [title, setTitle] = React.useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = React.useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  // images can be either an array of uploaded URLs (strings) or File objects from local selection
  const handleFileUpload = (filesArray) => {
    console.log("AddPost.handleFileUpload received:", filesArray);
    setImages(filesArray || []);
    setError(null);
    setEmptyFields([]);
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    console.log("Submitting — images state:", images, "Array.isArray:", Array.isArray(images));
    console.log("first item:", images && images[0]);

    if (!title) {
      setError("Please fill in all fields");
      return;
    }
    // If images state is empty, try to read directly from the file input as a fallback
    let imagesToUse = images;
    if (!imagesToUse || imagesToUse.length <= 0) {
      const fileInput = document.querySelector('.file-upload__input');
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        imagesToUse = Array.from(fileInput.files);
        // update state so UI reflects it
        setImages(imagesToUse);
        setError(null);
      }
    }

    if (!imagesToUse || imagesToUse.length <= 0) {
      setError("Image is required");
      return;
    }

    let response;
    // If first item is a File, send multipart/form-data to backend
    const first = imagesToUse[0];
    const isFileObject = first && (first instanceof File || (typeof first === "object" && (first.name || first.size)));

    if (isFileObject) {
      const formData = new FormData();
      formData.append("title", title);
      imagesToUse.forEach((file) => formData.append("images", file));

      response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
    } else {
      // assume images is array of URLs (strings) — send JSON
      const uploadInfo = { title, images };
      response = await fetch("/api/uploads", {
        method: "POST",
        body: JSON.stringify(uploadInfo),
        headers: { "Content-Type": "application/json" },
      });
    }

    const json = await response.json();

    if (!response.ok) {
      setError(json.error || "An error occurred");
      setEmptyFields(json.emptyFields || []);
      return;
    }

    // success
    setError(null);
    setTitle("");
    setImages([]);
    setEmptyFields([]);
    dispatch && dispatch({ type: "ADD_POST", payload: json });
    navigate("/");
  };

  return (
    <div className="add-post">
      <form onSubmit={handleSubmit}>
        <h3>Add A New Post</h3>

        <div className="form-row">
          <div className="label-muted">Choose files</div>
          <ImageUpload
            files={[]}
            multiple={true}
            onUpload={handleFileUpload}
            note={"Only JPG or PNG files allowed"}
          />
          {images && images.length > 0 && (
            <div style={{ marginTop: 8, color: "#333" }}>
              Selected {images.length} file(s): {images[0].name || images[0]}
            </div>
          )}
        </div>

        <div className="form-row">
          <label className="label-muted">Title:</label>
          <input
            type="text"
            className={emptyFields.includes("title") ? "form-input error" : "form-input"}
            name="title"
            placeholder="Enter title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button type="submit">
            Add Post
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setTitle("");
              setImages([]);
              setError(null);
              setEmptyFields([]);
            }}
          >
            Clear
          </button>
        </div>

        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}
