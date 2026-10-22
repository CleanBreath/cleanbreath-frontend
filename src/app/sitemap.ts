import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cleanbreath.cmu02-studio.com";

  // 페이지 내용이 바뀌면 해당 lastModified 날짜도 함께 갱신할 것
  return [
    { url: baseUrl, lastModified: "2026-10-22" },
    { url: `${baseUrl}/statute`, lastModified: "2026-10-22" },
    { url: `${baseUrl}/board`, lastModified: "2026-10-22" },
    { url: `${baseUrl}/about`, lastModified: "2026-10-22" },
    { url: `${baseUrl}/privacy`, lastModified: "2026-10-22" },
  ];
}
