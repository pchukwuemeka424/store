import React from "react";

async function fetchSitemap(): Promise<string[]> {
  try {
    // Fetch sitemap with no cache to ensure fresh data
    const res = await fetch("https://afrivendor.ng/sitemap.xml", { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to fetch sitemap");
    }

    const text = await res.text();

    // Extract URLs using regex
    return Array.from(text.matchAll(/<loc>(.*?)<\/loc>/g)).map((match) => match[1]);
  } catch (error) {
    console.error("Error fetching sitemap:", error);
    return []; // Return an empty array if fetching fails
  }
}

export default async function SitemapPage() {
  const urlsPromise = fetchSitemap(); // Fetch asynchronously

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Sitemap</h1>
      <ul className="list-disc pl-6">
        {(await urlsPromise).length > 0 ? (
          (await urlsPromise).map((url, index) => (
            <li key={index}>
              <a href={url} className="text-blue-600 hover:underline">
                {url}
              </a>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No sitemap data available.</p>
        )}
      </ul>
    </main>
  );
}
