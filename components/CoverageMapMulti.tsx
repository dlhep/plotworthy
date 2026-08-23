"use client";

import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { postcodeArea } from "@/lib/postcodes";

const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

function areaUrl(area: string) {
  return `https://raw.githubusercontent.com/missinglink/uk-postcode-polygons/master/geojson/${area}.geojson`;
}

function codeOf(props: Record<string, unknown>): string {
  const raw =
    props.name ?? (props as any).Name ?? (props as any).pc_district ?? (props as any).postdist ?? (props as any).district ?? "";
  return String(raw).toUpperCase().replace(/\s+/g, "");
}

function extendBbox(b: number[], c: any) {
  if (typeof c[0] === "number" && typeof c[1] === "number") {
    if (c[0] < b[0]) b[0] = c[0];
    if (c[1] < b[1]) b[1] = c[1];
    if (c[0] > b[2]) b[2] = c[0];
    if (c[1] > b[3]) b[3] = c[1];
  } else if (Array.isArray(c)) {
    c.forEach((x) => extendBbox(b, x));
  }
}

/** Read-only map that highlights a professional's districts across every
 *  postcode area they cover, and zooms to fit them. */
export function CoverageMapMulti({ districts }: { districts: string[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    let map: any;
    const wanted = new Set(districts.map((d) => d.toUpperCase()));
    const areas = Array.from(new Set(districts.map((d) => postcodeArea(d)).filter(Boolean))).slice(0, 12);

    (async () => {
      try {
        const maplibregl = (await import("maplibre-gl")).default;
        if (cancelled || !containerRef.current) return;
        map = new maplibregl.Map({
          container: containerRef.current,
          style: STYLE_URL,
          center: [-1.9, 53],
          zoom: 5,
        });
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

        map.on("load", async () => {
          try {
            const features: any[] = [];
            await Promise.all(
              areas.map(async (area) => {
                try {
                  const res = await fetch(areaUrl(area));
                  if (!res.ok) return;
                  const gj = await res.json();
                  (gj.features || []).forEach((f: any) => {
                    f.properties = f.properties || {};
                    const c = codeOf(f.properties);
                    f.properties.code = c;
                    f.properties.on = wanted.has(c) ? 1 : 0;
                    features.push(f);
                  });
                } catch {
                  /* skip this area */
                }
              })
            );

            if (cancelled) return;
            if (features.length === 0) {
              setStatus("error");
              return;
            }

            map.addSource("pd", { type: "geojson", data: { type: "FeatureCollection", features } });
            map.addLayer({
              id: "pd-fill",
              type: "fill",
              source: "pd",
              paint: {
                "fill-color": "#dc8c52",
                "fill-opacity": ["case", ["==", ["get", "on"], 1], 0.5, 0.03],
              },
            });
            map.addLayer({
              id: "pd-line",
              type: "line",
              source: "pd",
              paint: {
                "line-color": "#375741",
                "line-width": ["case", ["==", ["get", "on"], 1], 2, 0.5],
                "line-opacity": ["case", ["==", ["get", "on"], 1], 0.9, 0.3],
              },
            });

            // Fit to the selected districts (fall back to everything loaded).
            const bbox = [Infinity, Infinity, -Infinity, -Infinity];
            features
              .filter((f) => f.properties.on === 1)
              .forEach((f) => f.geometry && extendBbox(bbox, f.geometry.coordinates));
            if (!Number.isFinite(bbox[0])) {
              features.forEach((f) => f.geometry && extendBbox(bbox, f.geometry.coordinates));
            }
            if (Number.isFinite(bbox[0])) map.fitBounds(bbox as any, { padding: 40, duration: 0, maxZoom: 11 });

            if (!cancelled) setStatus("ready");
          } catch {
            if (!cancelled) setStatus("error");
          }
        });
        map.on("error", () => {});
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, [districts]);

  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <div ref={containerRef} style={{ height: 480, width: "100%" }} />
      {status === "loading" && <p className="px-4 py-2 text-xs text-muted">Loading your coverage map…</p>}
      {status === "error" && (
        <p className="px-4 py-2 text-xs text-clay-700">
          Couldn&apos;t load the map here. Your districts are listed below either way.
        </p>
      )}
    </div>
  );
}
