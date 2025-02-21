"use client";

import { useRouter } from "next/navigation";

const PromptCard = ({ post }) => {
  const router = useRouter();

  // Limit the number of tags to 3
  const limitedTags = post.tags ? post.tags.slice(0, 3) : [];

  // Extract Year, Month, and Day from published_at
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  // Handle post click
  const handlePostClick = () => {
    router.push(`/post/${post._id}`);
  };

  return (
    <div
      onClick={handlePostClick}
      className="p-4 border rounded shadow-md flex flex-col h-full bg-white w-full cursor-pointer hover:shadow-lg transition-shadow"
    >
      {/* Title */}
      <h3 className="text-lg font-semibold mb-2 truncate">{post.title}</h3>

      {/* Tags (limited to 3) */}
      <div className="flex flex-wrap space-x-2 mb-4">
        {limitedTags.length > 0 &&
          limitedTags.map((tag, index) => (
            <span
              key={index}
              className="text-sm text-blue-500 bg-blue-100 rounded-full px-2 py-1 truncate"
            >
              {tag}
            </span>
          ))}
      </div>

      {/* Main Text (Limited to 2 lines) */}
      <div className="flex-grow mb-4 text-gray-800 line-clamp-2">
        <p className="overflow-hidden text-ellipsis whitespace-nowrap">
          {post.text}
        </p>
      </div>

      {/* Footer with Author and Date */}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <p>{formattedDate}</p> {/* Shows Year, Month, and Day */}
        <p className="text-right">{post.author}</p>
      </div>
    </div>
  );
};

export default PromptCard;
