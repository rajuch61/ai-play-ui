import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import config from "../config";
import "./MyPlaylist.css";

const MyPlaylist = ({ user }) => {
  const location = useLocation();
  const newPlaylistName = location.state?.newPlaylistName || null;
  const username = user.username;

  const [playlists, setPlaylists] = useState({});
  const [uploadingPlaylists, setUploadingPlaylists] = useState([]);
  const [failedPlaylists, setFailedPlaylists] = useState([]);

  // Fetch playlists on mount and on newPlaylistName change
  useEffect(() => {
    fetch(`${config.API_BASE_URL}/${username}`)
      .then((res) => res.json())
      .then((data) => setPlaylists(data))
      .catch(console.error);
  }, [username]);

  // Manage uploading/fail status for new playlist
  useEffect(() => {
    if (!newPlaylistName) return;

    setUploadingPlaylists((prev) => {
      if (!prev.includes(newPlaylistName)) return [...prev, newPlaylistName];
      return prev;
    });

    const interval = setInterval(() => {
      const status = localStorage.getItem(`uploadStatus_${newPlaylistName}`);

      if (status === "success") {
        setUploadingPlaylists((prev) => prev.filter((pl) => pl !== newPlaylistName));
        setFailedPlaylists((prev) => prev.filter((pl) => pl !== newPlaylistName));
        localStorage.removeItem(`uploadStatus_${newPlaylistName}`);
        clearInterval(interval);
        // Optionally refetch playlists to update UI
        fetch(`${config.API_BASE_URL}/${username}`)
          .then((res) => res.json())
          .then((data) => setPlaylists(data));
      } else if (status === "fail") {
        setUploadingPlaylists((prev) => prev.filter((pl) => pl !== newPlaylistName));
        setFailedPlaylists((prev) => {
          if (!prev.includes(newPlaylistName)) return [...prev, newPlaylistName];
          return prev;
        });
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [newPlaylistName, username]);

  // Retry upload handler (should call upload API again)
  const retryUpload = (playlist) => {
    // Clear fail status and set uploading
    setFailedPlaylists((prev) => prev.filter((pl) => pl !== playlist));
    setUploadingPlaylists((prev) => [...prev, playlist]);

    localStorage.removeItem(`uploadStatus_${playlist}`);

    // Simulate retry (You should implement actual retry upload here)
    // For demo, just clear uploading after 5s and mark success
    setTimeout(() => {
      localStorage.setItem(`uploadStatus_${playlist}`, "success");
    }, 5000);
  };

  return (
    <div className="myplaylist-container">
      <h2>My Playlists</h2>
      {Object.entries(playlists).map(([playlistName, videos]) => (
        <div key={playlistName} className="playlist-section">
          <h3 className="playlist-title">
            {playlistName}
            {uploadingPlaylists.includes(playlistName) && (
              <span className="uploading-indicator">⏳ Uploading...</span>
            )}
            {failedPlaylists.includes(playlistName) && (
              <button className="retry-btn" onClick={() => retryUpload(playlistName)}>
                Retry ⟳
              </button>
            )}
          </h3>
          <div className="videos-container">
            {videos.map((video) => (
              <div key={video.id} className="video-card">
                <video
                  width="320"
                  height="180"
                  controls
                  poster={video.thumbnailUrl || ""}
                >
                  <source src={video.fileUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="video-info">
                  <h4>{video.name}</h4>
                  <p>{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyPlaylist;
