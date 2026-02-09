import React, { useState } from "react";
import { Heart, MessageSquare, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConnectButton from "../network/connectButton";

const PostCard = ({ post, userData, likedPosts, handleLike, handleAddComment }) => {
  const navigate = useNavigate();

  const [commentInput, setCommentInput] = useState("");
  const [expandedComments, setExpandedComments] = useState(false);
  const [likedByModal, setLikedByModal] = useState(false);
  const [openCarousel, setOpenCarousel] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const toggleExpandComments = () => setExpandedComments((prev) => !prev);

  return (
    <>
      {/* ================= POST CARD ================= */}
      <div className="bg-[#0d0d0d] rounded-2xl border border-white/10 p-6 space-y-4">
        {/* AUTHOR */}
        <div className="flex gap-4 items-center">
          <img
            src={post.author.profileImage}
            className="w-12 h-12 rounded-full cursor-pointer"
            onClick={() => navigate(`/profile/${post.author._id}`)}
          />
          <div>
            <p
              className="font-semibold cursor-pointer"
              onClick={() => navigate(`/profile/${post.author._id}`)}
            >
              {post.author.firstname} {post.author.lastname}
            </p>
            <p className="text-xs text-white/40">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
          <MoreHorizontal className="ml-auto text-white/50" />
          {post.author._id !== userData?._id && (
            <ConnectButton userId={post.author._id} />
          )}
        </div>

        {/* DESCRIPTION */}
        {post.description && (
          <p className="text-white/90">{post.description}</p>
        )}

        {/* MEDIA GRID */}
        {post.media?.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
            {post.media.slice(0, 4).map((m, i) => {
              const isLast = i === 3 && post.media.length > 4;

              return (
                <div
                  key={i}
                  className="relative cursor-pointer"
                  onClick={() => {
                    setCarouselIndex(i);
                    setOpenCarousel(true);
                  }}
                >
                  {m.type === "image" ? (
                    <img
                      src={m.url}
                      className="w-full h-[250px] object-cover"
                    />
                  ) : (
                    <video
                      src={m.url}
                      className="w-full h-[250px] object-cover"
                      muted
                    />
                  )}

                  {isLast && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-3xl font-bold text-white">
                      +{post.media.length - 4}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex gap-8 pt-4 border-t border-white/10">
          <button
            onClick={() => handleLike(post._id)}
            className={`flex items-center gap-2 ${
              likedPosts[post._id] ? "text-red-500" : "text-white/70"
            }`}
          >
            <Heart size={18} />
            {post.like.length}
          </button>

          <div className="flex gap-2 text-white/70">
            <MessageSquare size={18} />
            {post.comment.length}
          </div>
        </div>

        {/* LIKED BY */}
        {post.like.length > 0 && (
          <p
            onClick={() => setLikedByModal(true)}
            className="text-sm text-white/60 cursor-pointer hover:text-white"
          >
            Liked by{" "}
            <span className="font-semibold">
              {post.like[0].firstname}
            </span>
            {post.like.length > 1 &&
              ` and ${post.like.length - 1} others`}
          </p>
        )}

        {/* COMMENT INPUT */}
        <div className="flex gap-2">
          <input
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            className="flex-1 bg-[#1a1a1a] p-2 rounded text-white/90"
            placeholder="Add a comment..."
          />
          <button
            onClick={() => {
              handleAddComment(post._id, commentInput);
              setCommentInput("");
            }}
            className="bg-[#8b1a1a] px-4 rounded"
          >
            Post
          </button>
        </div>

        {/* COMMENTS */}
        {post.comment.length > 0 && (
          <div className="space-y-2">
            {(expandedComments
              ? post.comment
              : post.comment.slice(-1)
            ).map((c, i) => (
              <div key={i} className="flex gap-2 items-start">
                <img
                  src={c.user.profileImage}
                  className="w-6 h-6 rounded-full cursor-pointer"
                  onClick={() =>
                    navigate(`/profile/${c.user._id}`)
                  }
                />
                <p className="text-sm">
                  <span
                    onClick={() =>
                      navigate(`/profile/${c.user._id}`)
                    }
                    className="font-semibold cursor-pointer"
                  >
                    {c.user.firstname} {c.user.lastname}
                  </span>{" "}
                  {c.content}
                </p>
              </div>
            ))}
            {post.comment.length > 1 && (
              <button
                onClick={toggleExpandComments}
                className="text-xs text-white/50 hover:text-white"
              >
                {expandedComments
                  ? "Hide comments"
                  : `See all ${post.comment.length} comments`}
              </button>
            )}
          </div>
        )}

        {/* LIKED BY MODAL */}
        {likedByModal && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[999]">
            <div className="bg-[#0d0d0d] w-[320px] p-4 rounded-xl">
              <h3 className="mb-3 font-semibold">Liked by</h3>
              {post.like.map((u) => (
                <div
                  key={u._id}
                  onClick={() => {
                    navigate(`/profile/${u._id}`);
                    setLikedByModal(false);
                  }}
                  className="flex gap-3 items-center p-2 hover:bg-white/5 cursor-pointer"
                >
                  <img
                    src={u.profileImage}
                    className="w-8 h-8 rounded-full"
                  />
                  <p>
                    {u.firstname} {u.lastname}
                  </p>
                </div>
              ))}
              <button
                onClick={() => setLikedByModal(false)}
                className="text-red-500 mt-3 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= MEDIA CAROUSEL ================= */}
      {openCarousel && (
        <div className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center">
          <button
            className="absolute top-6 right-6 text-white text-3xl"
            onClick={() => setOpenCarousel(false)}
          >
            ✕
          </button>

          <button
            className="absolute left-6 text-white text-4xl"
            onClick={() =>
              setCarouselIndex(
                (carouselIndex - 1 + post.media.length) %
                  post.media.length
              )
            }
          >
            ‹
          </button>

          <div className="max-w-[90vw] max-h-[90vh]">
            {post.media[carouselIndex].type === "image" ? (
              <img
                src={post.media[carouselIndex].url}
                className="max-h-[90vh] rounded-xl"
              />
            ) : (
              <video
                src={post.media[carouselIndex].url}
                controls
                autoPlay
                className="max-h-[90vh] rounded-xl"
              />
            )}
          </div>

          <button
            className="absolute right-6 text-white text-4xl"
            onClick={() =>
              setCarouselIndex(
                (carouselIndex + 1) % post.media.length
              )
            }
          >
            ›
          </button>
        </div>
      )}
    </>
  );
};

export default PostCard;
