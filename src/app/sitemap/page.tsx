import React from "react";

async function fetchSitemap(): Promise<string[]> {
  const res = await fetch("https://afrivendor.ng/sitemap.xml");
  const text = await res.text();

  // Extract URLs using regex
  const urls = Array.from(text.matchAll(/<loc>(.*?)<\/loc>/g)).map((match) => match[1]);
  return urls;
}

export default async function SitemapPage() {
  const urls = await fetchSitemap();

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Sitemap</h1>
      <ul className="list-disc pl-6">
        {urls.map((url, index) => (
          <li key={index}>
            <a href={url} className="text-blue-600 hover:underline">
              {url}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
