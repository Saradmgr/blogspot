"use client";
import PromptCard from "@/components/PromptCard";
import { useRouter } from "next/navigation"; // Correct import for Next.js 13+
import { useEffect, useState } from "react";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState(""); 
  const [searchedResults, setSearchedResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const router = useRouter(); // Initialize the router

  useEffect(() => {
    if (searchText.trim()) setIsLoading(true);
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 3000);

    return () => clearTimeout(handler);
  }, [searchText]);

  const fetchData = async () => {
    if (!debouncedSearchText.trim()) {
      setIsLoading(false);
      return;
    }

    setError(null);
    const apiUrl = `/api/search?q=${debouncedSearchText}&page=${currentPage}&limit=15`;

    let retries = 0;
    const maxRetries = 5;

    while (retries < maxRetries) {
      try {
        const res = await fetch(apiUrl);

        if (!res.ok) {
          if (res.status === 429) {
            const backoffTime = Math.pow(2, retries) * 1000;
            console.log(`Rate limit exceeded, retrying in ${backoffTime / 1000} seconds...`);
            await delay(backoffTime);
            retries += 1;
            continue;
          }
          throw new Error(`HTTP Error: ${res.status}`);
        }

        const data = await res.json();

        if (data.blogs && Array.isArray(data.blogs)) {
          setSearchedResults(data.blogs);
          setTotalPages(data.totalPages);
        } else {
          setError("No posts found for your search.");
        }
        break;
      } catch (err) {
        setError("Failed to fetch results. Please try again.");
        break;
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [debouncedSearchText, currentPage]);

  // Navigate to the selected post
  const handleBlogClick = (post) => {
    setSelectedBlog(post);
    router.push(`/post/${post.id}`); // Navigate to the post page using its ID
  };

  return (
    <section className="feed w-full max-w-full px-0">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          required
          className="search_input peer w-1/2 max-w-md mx-auto"
        />
      </form>

      {isLoading && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-gray-200 animate-pulse h-48 rounded-lg"></div>
          ))}
        </div>
      )}

      {error && <div className="text-red-500 mt-4">{error}</div>}

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-full">
        {!isLoading &&
          searchedResults.map((post, index) => (
            <div
              key={index}
              onClick={() => handleBlogClick(post)} // Navigate on click
              className="cursor-pointer"
            >
              <PromptCard post={post} />
            </div>
          ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn-primary disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn-primary disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default Feed;
