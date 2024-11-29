import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Next.js PWA",
    short_name: "NextPWA",
    description: "A Progressive Web App built with Next.js",
    start_url: "/",
    display: "fullscreen", // Ensures the app opens in full screen
    background_color: "#ffffff",
    theme_color: "#000000",
  };
}
