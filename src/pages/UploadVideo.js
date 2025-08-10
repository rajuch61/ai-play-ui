import React, { useState } from "react";
import config from "../config";
import "./UploadVideo.css";

const UploadVideo = ({ user }) => {
  const [file, setFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [uploading, setUploading] = useState(false);

  // NEW: State for success message
  const [successMessage, setSuccessMessage] = useState("");

  // Assume user info saved in localStorage
  // const user = localStorage.getItem("currentUser");
  const username = user.username;
  const userId = user.id;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSelectedFileName(selectedFile.name);
      setName(selectedFile.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a video file to upload.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("playlistName", playlistName);
    formData.append("username", username);
    formData.append("userId", userId);

    try {
      const response = await fetch(`${config.API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      // Replace alert with inline message
      setSuccessMessage("Video uploaded successfully!");

      // Clear the success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      setFile(null);
      setSelectedFileName("");
      setName("");
      setDescription("");
      setPlaylistName("");
    } catch (error) {
      console.error(error);
      alert("Error uploading video.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-video-container">
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-row">
          <label htmlFor="file-upload">Video File:</label>
          <label className="custom-file-upload" htmlFor="file-upload">
            Choose File
          </label>
          <input
            id="file-upload"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
          />
          {selectedFileName && <span className="file-name">{selectedFileName}</span>}
        </div>

        <div className="form-row">
          <label htmlFor="name">Video Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            placeholder="Enter video name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            placeholder="Enter description"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label htmlFor="playlistName">Playlist Name:</label>
          <input
            id="playlistName"
            type="text"
            value={playlistName}
            placeholder="Enter playlist name"
            onChange={(e) => setPlaylistName(e.target.value)}
          />
        </div>

        <button type="submit" disabled={uploading} className="upload-btn">
          {uploading ? "Uploading..." : "Upload Video"}
        </button>

        {/* NEW: Display success message below the button */}
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default UploadVideo;
