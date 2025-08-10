import React, { useEffect, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import config from "../config";
import "./HomePage.css";

const CURRENT_USER = null; // Replace with actual logged-in user

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComments, setNewComments] = useState({});
  const [descExpanded, setDescExpanded] = useState({});

  useEffect(() => {
    fetch(`${config.API_BASE_URL}`)
      .then((res) => res.json())
      .then((data) => {
        // Normalize likedBy and dislikedBy arrays
        const updatedData = data.map((v) => ({
          ...v,
          likedBy: v.likedBy || [],
          dislikedBy: v.dislikedBy || [],
        }));
        setVideos(updatedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch videos", err);
        setLoading(false);
      });
  }, []);

  const handleLikeDislike = async (videoId, type) => {
    const video = videos.find((v) => v.id === videoId);
    if (!video) return;

    if (type === "like" && (video.likedBy || []).includes(CURRENT_USER)) {
      alert("You already liked this video.");
      return;
    }
    if (type === "dislike" && (video.dislikedBy || []).includes(CURRENT_USER)) {
      alert("You already disliked this video.");
      return;
    }

    try {
      const response = await fetch(`${config.API_BASE_URL}/${videoId}/${type}`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("API error");

      setVideos((prevVideos) =>
        prevVideos.map((v) => {
          if (v.id === videoId) {
            if (type === "like") {
              return {
                ...v,
                likes: (v.likes || 0) + 1,
                likedBy: [...(v.likedBy || []), CURRENT_USER],
                dislikedBy: (v.dislikedBy || []).filter((u) => u !== CURRENT_USER),
              };
            } else if (type === "dislike") {
              return {
                ...v,
                dislikes: (v.dislikes || 0) + 1,
                dislikedBy: [...(v.dislikedBy || []), CURRENT_USER],
                likedBy: (v.likedBy || []).filter((u) => u !== CURRENT_USER),
              };
            }
          }
          return v;
        })
      );
    } catch (error) {
      console.error(`Failed to ${type} video`, error);
      alert(`Failed to ${type} video`);
    }
  };

  const handleCommentChange = (videoId, text) => {
    setNewComments((prev) => ({
      ...prev,
      [videoId]: text,
    }));
  };

  const handleCommentSubmit = async (videoId) => {
    const commentText = newComments[videoId]?.trim();
    if (!commentText) return;

    const url = `${config.API_BASE_URL}/${videoId}/comment?comment=${encodeURIComponent(
      commentText
    )}&commentedBy=${encodeURIComponent(CURRENT_USER || "unknown")}`;

    try {
      const response = await fetch(url, { method: "POST" });
      if (!response.ok) throw new Error("API error");

      setVideos((prevVideos) =>
        prevVideos.map((v) => {
          if (v.id === videoId) {
            const updatedComments = v.comments
              ? [...v.comments, { commentedBy: CURRENT_USER, comment: commentText }]
              : [{ commentedBy: CURRENT_USER, comment: commentText }];
            return { ...v, comments: updatedComments };
          }
          return v;
        })
      );

      setNewComments((prev) => ({
        ...prev,
        [videoId]: "",
      }));
    } catch (error) {
      console.error("Failed to submit comment", error);
      alert("Failed to submit comment");
    }
  };

  const toggleDescription = (videoId) => {
    setDescExpanded((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }));
  };

  if (loading) return <div>Loading videos...</div>;

  if (!videos.length) return <div>No videos found.</div>;

  return (
    <div className="video-list">
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
            <div className="title-and-likes">
              <h3>{video.name}</h3>
              <div className="likes-dislikes">
                <button
                  onClick={() => handleLikeDislike(video.id, "like")}
                  className={(video.likedBy || []).includes(CURRENT_USER) ? "active" : ""}
                  disabled={(video.likedBy || []).includes(CURRENT_USER)}
                  aria-label="Like video"
                >
                  👍 {video.likes || 0}
                </button>
                <button
                  onClick={() => handleLikeDislike(video.id, "dislike")}
                  className={(video.dislikedBy || []).includes(CURRENT_USER) ? "active" : ""}
                  disabled={(video.dislikedBy || []).includes(CURRENT_USER)}
                  aria-label="Dislike video"
                >
                  👎 {video.dislikes || 0}
                </button>
              </div>
            </div>

            <p className={`description ${descExpanded[video.id] ? "expanded" : ""}`}>
              {video.description}
            </p>
            {video.description.length > 100 && (
              <button
                className="see-more-btn"
                onClick={() => toggleDescription(video.id)}
              >
                {descExpanded[video.id] ? "See less" : "See more"}
              </button>
            )}

            <p>
              <strong>Uploaded by:</strong> {video.username}
            </p>

            <div className="add-comment">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComments[video.id] || ""}
                onChange={(e) => handleCommentChange(video.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCommentSubmit(video.id);
                }}
              />
              <button
                className="submit-icon-btn"
                onClick={() => handleCommentSubmit(video.id)}
                aria-label="Submit comment"
              >
                <FaPaperPlane />
              </button>
            </div>

            <div className="comments">
              <strong>Comments:</strong>
              {video.comments && video.comments.length > 0 && (
                <ul className="comments-list">
                  {video.comments.map((c, i) => (
                    <li key={i}>
                      <em>{c.commentedBy || "unKnown"}</em>: {c.comment}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
