export async function GET(req) {
  try {
    // Parse search parameters from the URL
    const { searchParams } = new URL(req.url, "http://localhost");
    const query = searchParams.get("q");
    const page = parseInt(searchParams.get("page")) || 1;  // Default to page 1
    const limit = parseInt(searchParams.get("limit")) || 15; // Default to 15 posts per page

    if (!query) {
      return new Response(JSON.stringify({ error: "Query parameter is required" }), { status: 400 });
    }

    // Calculate the offset for pagination
    const offset = (page - 1) * limit;

    const apiKey = "3607CE47-B341-415C-ACDD-ED992348FE5E";
    const apiUrl = `https://api.twingly.com/blog/search/api/v3/search?apikey=${apiKey}&q=tag:${query}&format=json`;

    console.log("🌍 Fetching from API:", apiUrl);

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`❌ Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Full API Response:", JSON.stringify(data, null, 2));

    // Validate the API response structure
    if (!data.documents || !Array.isArray(data.documents)) {
      console.error("🚨 Unexpected API Response Structure:", JSON.stringify(data, null, 2));
      return new Response(JSON.stringify({ error: "Invalid API response structure", rawData: data }), { status: 500 });
    }

    // Extract the required fields, limit to `limit` posts, and apply pagination
    const totalResults = data.documents.length;
    const paginatedResults = data.documents.slice(offset, offset + limit).map(doc => ({
      title: doc.title,           // Blog title
      text: doc.text,             // Blog content snippet
      published_at: doc.published_at, // Date of publication
      blog_id: doc.blog_id,       // Unique blog ID
      author: doc.author,         // Author name
      tags: doc.tags || []        // Blog tags (default to empty array if missing)
    }));

    console.log("✅ Paginated Results:", JSON.stringify(paginatedResults, null, 2));

    // Return the paginated results along with total count
    return new Response(
      JSON.stringify({
        blogs: paginatedResults,
        totalPosts: totalResults, // Send total number of posts for pagination calculations
        totalPages: Math.ceil(totalResults / limit), // Calculate total pages
        currentPage: page,  // Current page
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("🚨 API Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch data", details: error.message }),
      { status: 500 }
    );
  }
}
