"use client";

import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

function geojsonUrl(area: string) {
  return `https://raw.githubusercontent.com/missinglink/uk-postcode-polygons/master/geojson/${area}.geojson`;
}

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

// Walk a GeoJSON FeatureCollection and return [minLng, minLat, maxLng, maxLat].
function bboxOf(gj: any): [number, number, number, number] | null {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const visit = (c: any) => {
    if (typeof c[0] === "number" && typeof c[1] === "number") {
      const [x, y] = c;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    } else if (Array.isArray(c)) {
      c.forEach(visit);
    }
  };
  (gj.features || []).forEach((f: any) => f.geometry && visit(f.geometry.coordinates));
  if (!Number.isFinite(minX)) return null;
  return [minX, minY, maxX, maxY];
}

/** Real map: OpenFreeMap tiles + postcode-district boundaries for one area, click to toggle. */
export function CoverageMap({
  area,
  selected,
  onToggle,
  onDistrictsLoaded,
}: {
  area: string;
  selected: Set<string>;
  onToggle: (code: string) => void;
  onDistrictsLoaded?: (codes: string[]) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const onToggleRef = useRef(onToggle);
  onToggleRef.current = onToggle;
  const onLoadedRef = useRef(onDistrictsLoaded);
  onLoadedRef.current = onDistrictsLoaded;

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
          center: [-1.5, 53.5], // UK-ish; we fitBounds once the area data loads
          zoom: 5,
        });
        mapRef.current = map;
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

        map.on("load", async () => {
          try {
            const res = await fetch(geojsonUrl(area));
            if (!res.ok) throw new Error("geojson");
            const gj = await res.json();
            const codes: string[] = [];
            gj.features.forEach((f: any) => {
              f.properties = f.properties || {};
              const c = codeOf(f.properties);
              f.properties.code = c;
              if (c && !codes.includes(c)) codes.push(c);
            });
            codes.sort((a, b) => {
              const na = parseInt(a.replace(/\D/g, ""), 10);
              const nb = parseInt(b.replace(/\D/g, ""), 10);
              return na - nb || a.localeCompare(b);
            });
            onLoadedRef.current?.(codes);

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
            const bbox = bboxOf(gj);
            if (bbox) map.fitBounds(bbox, { padding: 24, duration: 0 });

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
  }, [area]);

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
          Couldn&apos;t load the map for {area} here. You can still add and remove districts using the
          field and pills on the left — they save to your account either way.
        </p>
      )}
    </div>
  );
}
