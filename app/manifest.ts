import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest { return { name: "PlotWorthy", short_name: "PlotWorthy", description: "Evidence-led UK property feasibility.", start_url: "/", display: "standalone", background_color: "#f8f4eb", theme_color: "#14342d", icons: [{ src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }] }; }
