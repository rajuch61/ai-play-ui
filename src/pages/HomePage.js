import React, { useEffect, useRef, useState } from "react";
import { FaPaperPlane, FaPlay, FaTimes } from "react-icons/fa";
import config from "../config";
import "./HomePage.css";

// const CURRENT_USER = localStorage.getItem("currentUser"); // Replace with actual logged-in user

const HomePage = ({ CURRENT_USER }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComments, setNewComments] = useState({});
  const [descExpanded, setDescExpanded] = useState({});
  const [expandedVideo, setExpandedVideo] = useState(null);

  // refs
  const videoRefs = useRef({});      // preview video elements
  const hoverTimers = useRef({});    // timers for 5s hover
  const hasPreviewed = useRef({});   // if preview started once for a video
  const expandedPlayerRef = useRef(null);

  useEffect(() => {
    fetch(`${config.API_BASE_URL}`)
      .then((res) => res.json())
      .then((data) => {
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

    // cleanup on unmount
    return () => {
      Object.values(hoverTimers.current).forEach((t) => clearTimeout(t));
    };
  }, []);

  /* ------------------ helpers ------------------ */
  const safePlay = async (vid) => {
    if (!vid) return;
    try {
      // only call play if paused
      if (vid.paused) await vid.play();
    } catch (err) {
      // ignore/play interruption due to user gesture policy
      console.warn("play() failed:", err);
    }
  };

  const safePause = (vid) => {
    try {
      if (vid && !vid.paused) vid.pause();
    } catch (err) {
      console.warn("pause() failed:", err);
    }
  };

  const pauseAllExcept = (allowedId) => {
    Object.entries(videoRefs.current).forEach(([k, v]) => {
      if (!v) return;
      if (String(k) !== String(allowedId)) {
        safePause(v);
        try { v.currentTime = 0; } catch (_) {}
      }
    });
  };

  /* ------------------ preview hover logic ------------------ */
  const handleMouseEnter = (videoId) => {
    // clear any previous timer for safety
    clearTimeout(hoverTimers.current[videoId]);

    // if this video already previewed once, resume immediately (muted)
    if (hasPreviewed.current[videoId]) {
      pauseAllExcept(videoId);
      const vid = videoRefs.current[videoId];
      if (vid) {
        vid.muted = true;
        safePlay(vid);
      }
      return;
    }

    // start 5 second timer to start preview
    hoverTimers.current[videoId] = setTimeout(() => {
      pauseAllExcept(videoId);
      const vid = videoRefs.current[videoId];
      if (vid) {
        vid.muted = true;
        safePlay(vid);
        hasPreviewed.current[videoId] = true;
      }
    }, 2000);
  };

  const handleMouseLeave = (videoId) => {
    // cancel pending preview start
    clearTimeout(hoverTimers.current[videoId]);

    // pause and reset
    const vid = videoRefs.current[videoId];
    if (vid) {
      safePause(vid);
      try { vid.currentTime = 0; } catch (_) {}
    }
  };

  /* ------------------ open expanded player ------------------ */
  const openExpandedPlayer = (video) => {
    // stop preview for that video (avoid double-play)
    const vid = videoRefs.current[video.id];
    if (vid) {
      clearTimeout(hoverTimers.current[video.id]);
      safePause(vid);
      try { vid.currentTime = 0; } catch (_) {}
    }

    // open modal (user gesture -> autoplay with audio allowed)
    setExpandedVideo(video);
  };

  const closeExpandedPlayer = () => {
    // pause expanded player if exists
    if (expandedPlayerRef.current) {
      try {
        expandedPlayerRef.current.pause();
        expandedPlayerRef.current.currentTime = 0;
      } catch (_) {}
    }
    setExpandedVideo(null);
  };

  /* ------------------ rest of your existing handlers (unchanged) ------------------ */
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
    setNewComments((prev) => ({ ...prev, [videoId]: text }));
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

      setNewComments((prev) => ({ ...prev, [videoId]: "" }));
    } catch (error) {
      console.error("Failed to submit comment", error);
      alert("Failed to submit comment");
    }
  };

  const toggleDescription = (videoId) => {
    setDescExpanded((prev) => ({ ...prev, [videoId]: !prev[videoId] }));
  };

  /* ------------------ render ------------------ */
  if (loading) return <div>Loading videos...</div>;
  if (!videos.length) return <div>No videos found.</div>;

  return (
    <div className="video-list">
      {videos.map((video) => (
        <div
          key={video.id}
          className="video-card"
          onMouseEnter={() => handleMouseEnter(video.id)}
          onMouseLeave={() => handleMouseLeave(video.id)}
        >
          <div className="video-thumbnail-container">
            {/* preview video (no native click control) */}
            <video
              poster={video.thumbnailUrl || ""}
              ref={(el) => (videoRefs.current[video.id] = el)}
              className="video-thumbnail"
              // remove native click/controls to avoid toggling preview
            >
              <source src={video.fileUrl} type="video/mp4" />
            </video>

            {/* overlay play button: user clicks this to open expanded player */}
            <button
              className="play-btn"
              onClick={(e) => {
                e.stopPropagation();
                openExpandedPlayer(video);
              }}
              aria-label="Open player"
            >
              <FaPlay />
            </button>
          </div>

          <div className="video-info">
            <div className="title-and-likes">
              <h3>{video.name}</h3>
              <div className="likes-dislikes">
                <button
                  onClick={() => handleLikeDislike(video.id, "like")}
                  className={(video.likedBy || []).includes(CURRENT_USER) ? "active" : ""}
                  disabled={(video.likedBy || []).includes(CURRENT_USER)}
                >
                  👍 {video.likes || 0}
                </button>
                <button
                  onClick={() => handleLikeDislike(video.id, "dislike")}
                  className={(video.dislikedBy || []).includes(CURRENT_USER) ? "active" : ""}
                  disabled={(video.dislikedBy || []).includes(CURRENT_USER)}
                >
                  👎 {video.dislikes || 0}
                </button>
              </div>
            </div>

            <p className={`description ${descExpanded[video.id] ? "expanded" : ""}`}>
              {video.description}
            </p>
            {video.description.length > 100 && (
              <button className="see-more-btn" onClick={() => toggleDescription(video.id)}>
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
              <button className="submit-icon-btn" onClick={() => handleCommentSubmit(video.id)}>
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

      {/* Expanded Video Modal */}
      {expandedVideo && (
        <div className="video-modal" onClick={closeExpandedPlayer}>
          <button className="close-btn" onClick={(e) => { e.stopPropagation(); closeExpandedPlayer(); }}>
            <FaTimes />
          </button>

          <div className="expanded-video-wrapper" onClick={(e) => e.stopPropagation()}>
            <video
              ref={expandedPlayerRef}
              src={expandedVideo.fileUrl}
              controls
              autoPlay
              className="expanded-video"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
