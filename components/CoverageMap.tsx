"use client";

import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

const GEOJSON_URL =
  "https://raw.githubusercontent.com/missinglink/uk-postcode-polygons/master/geojson/B.geojson";
const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

function codeOf(props: Record<string, unknown>): string {
  const raw =
    props.name ??
    props.Name ??
    props.pc_district ??
    props.postdist ??
    props.PostDist ??
    props.district ??
    "";
  return String(raw).toUpperCase().replace(/\s+/g, "");
}

/** Real map: OpenFreeMap tiles + postcode-district boundaries, click to toggle. */
export function CoverageMap({
  selected,
  onToggle,
}: {
  selected: Set<string>;
  onToggle: (code: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const onToggleRef = useRef(onToggle);
  onToggleRef.current = onToggle;

  useEffect(() => {
    let cancelled = false;
    let map: any;
    (async () => {
      try {
        const maplibregl = (await import("maplibre-gl")).default;
        if (cancelled || !containerRef.current) return;
        map = new maplibregl.Map({
          container: containerRef.current,
          style: STYLE_URL,
          center: [-1.9, 52.45],
          zoom: 10.2,
        });
        mapRef.current = map;
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

        map.on("load", async () => {
          try {
            const res = await fetch(GEOJSON_URL);
            const gj = await res.json();
            gj.features.forEach((f: any) => {
              f.properties = f.properties || {};
              f.properties.code = codeOf(f.properties);
            });
            map.addSource("pd", { type: "geojson", data: gj });
            map.addLayer({
              id: "pd-fill",
              type: "fill",
              source: "pd",
              paint: { "fill-color": "#dc8c52", "fill-opacity": 0.04 },
            });
            map.addLayer({
              id: "pd-line",
              type: "line",
              source: "pd",
              paint: { "line-color": "#375741", "line-width": 0.8, "line-opacity": 0.5 },
            });
            map.on("click", "pd-fill", (e: any) => {
              const code = e.features?.[0]?.properties?.code;
              if (code) onToggleRef.current(code);
            });
            map.on("mouseenter", "pd-fill", () => (map.getCanvas().style.cursor = "pointer"));
            map.on("mouseleave", "pd-fill", () => (map.getCanvas().style.cursor = ""));
            if (!cancelled) {
              setStatus("ready");
              applyPaint();
            }
          } catch {
            if (!cancelled) setStatus("error");
          }
        });
        map.on("error", () => {
          /* tile errors are non-fatal */
        });
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      if (map) map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyPaint() {
    const map = mapRef.current;
    if (!map || !map.getLayer || !map.getLayer("pd-fill")) return;
    const sel = Array.from(selected);
    if (sel.length === 0) {
      map.setPaintProperty("pd-fill", "fill-opacity", 0.04);
      map.setPaintProperty("pd-line", "line-width", 0.8);
      return;
    }
    const inSel = ["in", ["get", "code"], ["literal", sel]];
    map.setPaintProperty("pd-fill", "fill-opacity", ["case", inSel, 0.55, 0.04]);
    map.setPaintProperty("pd-line", "line-width", ["case", inSel, 2.2, 0.8]);
  }

  useEffect(() => {
    applyPaint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <div ref={containerRef} style={{ height: 460, width: "100%" }} />
      {status === "loading" && (
        <p className="px-4 py-2 text-xs text-muted">Loading map…</p>
      )}
      {status === "error" && (
        <p className="px-4 py-2 text-xs text-clay-700">
          Map tiles couldn’t load in this environment. On your deployed site (with network access) the
          full OpenFreeMap map renders here — click districts to select them.
        </p>
      )}
    </div>
  );
}
