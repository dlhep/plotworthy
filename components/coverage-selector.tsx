"use client";

import Script from "next/script";
import { Check, LocateFixed, MapPin, Plus, Save, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { updateCoverage } from "@/app/professional/coverage/actions";

type Point = { code: string; latitude: number; longitude: number };
type GeoJSON = { type: "FeatureCollection"; features: Array<{ type: "Feature"; properties: { code: string }; geometry: { type: "Polygon"; coordinates: number[][][] } }> };
type MapSource = { setData(data: GeoJSON): void };
type MapInstance = { on(event: string, callback: () => void): void; addControl(control: unknown, position?: string): void; addSource(id: string, source: object): void; addLayer(layer: object): void; getSource(id: string): MapSource | undefined; getLayer(id: string): unknown; fitBounds(bounds: unknown, options?: object): void; remove(): void };
type MapLibre = { Map: new (options: object) => MapInstance; NavigationControl: new (options?: object) => unknown; LngLatBounds: new () => { extend(point: [number, number]): unknown } };

declare global { interface Window { maplibregl?: MapLibre } }

const suggestions = ["B1", "B2", "B3", "B4", "B5", "B13", "B14", "B15", "B16", "B17", "B18", "B23", "B24", "B29", "B30", "B31", "B32", "B42", "B43", "B44"];
const codePattern = /^[A-Z]{1,2}[0-9][0-9A-Z]?$/;

function circleFeature(point: Point) {
  const radiusKm = 7;
  const coordinates: number[][] = [];
  for (let step = 0; step <= 48; step += 1) {
    const angle = (step / 48) * Math.PI * 2;
    const latitude = point.latitude + (radiusKm / 111) * Math.sin(angle);
    const longitude = point.longitude + (radiusKm / (111 * Math.cos(point.latitude * Math.PI / 180))) * Math.cos(angle);
    coordinates.push([longitude, latitude]);
  }
  return { type: "Feature" as const, properties: { code: point.code }, geometry: { type: "Polygon" as const, coordinates: [coordinates] } };
}

export function CoverageSelector({ initialCoverage, saved }: { initialCoverage: string[]; saved?: string }) {
  const [selected, setSelected] = useState(initialCoverage);
  const [input, setInput] = useState("");
  const [points, setPoints] = useState<Point[]>([]);
  const [scriptReady, setScriptReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapInstance | null>(null);
  const visiblePoints = useMemo(() => points.filter((point) => selected.includes(point.code)), [points, selected]);
  const geojson = useMemo<GeoJSON>(() => ({ type: "FeatureCollection", features: visiblePoints.map(circleFeature) }), [visiblePoints]);

  function add(codeValue = input) {
    const code = codeValue.toUpperCase().replace(/\s/g, "");
    if (!codePattern.test(code) || selected.includes(code) || selected.length >= 30) return;
    setSelected((current) => [...current, code]);
    setInput("");
  }

  useEffect(() => {
    if (!selected.length) return;
    const controller = new AbortController();
    fetch(`/api/postcodes/coverage?codes=${encodeURIComponent(selected.join(","))}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Coverage lookup failed")))
      .then((payload: { points?: Point[] }) => setPoints(payload.points ?? []))
      .catch((error: unknown) => { if (error instanceof Error && error.name !== "AbortError") setMapError(true); });
    return () => controller.abort();
  }, [selected]);

  useEffect(() => {
    if (!scriptReady || !mapContainer.current || mapRef.current || !window.maplibregl) return;
    try {
      const map = new window.maplibregl.Map({ container: mapContainer.current, style: "https://tiles.openfreemap.org/styles/positron", center: [-1.9, 52.48], zoom: 9 });
      map.addControl(new window.maplibregl.NavigationControl({ showCompass: false }), "top-right");
      map.on("load", () => {
        map.addSource("coverage", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
        map.addLayer({ id: "coverage-fill", type: "fill", source: "coverage", paint: { "fill-color": "#d5a62e", "fill-opacity": 0.28 } });
        map.addLayer({ id: "coverage-line", type: "line", source: "coverage", paint: { "line-color": "#143c34", "line-width": 2 } });
      });
      mapRef.current = map;
    } catch { queueMicrotask(() => setMapError(true)); }
    return () => { mapRef.current?.remove(); mapRef.current = null; };
  }, [scriptReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.maplibregl) return;
    map.getSource("coverage")?.setData(geojson);
    if (!visiblePoints.length) return;
    const bounds = new window.maplibregl.LngLatBounds();
    visiblePoints.forEach((point) => bounds.extend([point.longitude, point.latitude]));
    map.fitBounds(bounds, { padding: 90, maxZoom: 10, duration: 500 });
  }, [geojson, visiblePoints]);

  return <>
    <Script src="https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.js" strategy="afterInteractive" onLoad={() => setScriptReady(true)} onError={() => setMapError(true)} />
    <link rel="stylesheet" href="https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.css" />
    {saved ? <div className="workspace-success"><Check /> Coverage saved. New project matching now uses these postcode districts.</div> : null}
    <form className="coverage-workspace" action={updateCoverage}>
      <input type="hidden" name="postcodes" value={JSON.stringify(selected)} />
      <section className="coverage-control-panel">
        <div className="coverage-panel-heading"><div><p className="workspace-kicker">Lead preferences</p><h2>Select postcode districts</h2></div><span>{selected.length}/30</span></div>
        <p>Choose the districts where you want first access to new projects. You can change this at any time.</p>
        <div className="coverage-search"><Search /><input value={input} onChange={(event) => setInput(event.target.value.toUpperCase())} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); add(); } }} placeholder="For example B17" maxLength={4} /><button type="button" onClick={() => add()} disabled={!codePattern.test(input.replace(/\s/g, ""))}><Plus /> Add</button></div>
        <div className="coverage-selected"><div><strong>Included districts</strong><button type="button" onClick={() => setSelected([])}>Clear all</button></div>{selected.length ? <div className="coverage-chips">{selected.map((code) => <button type="button" key={code} onClick={() => setSelected((current) => current.filter((item) => item !== code))}>{code}<X /></button>)}</div> : <p>No districts selected yet.</p>}</div>
        <div className="coverage-suggestions"><strong>Nearby suggestions</strong><div>{suggestions.map((code) => <button className={selected.includes(code) ? "selected" : undefined} type="button" key={code} onClick={() => selected.includes(code) ? setSelected((current) => current.filter((item) => item !== code)) : add(code)}>{selected.includes(code) ? <Check /> : null}{code}</button>)}</div></div>
        <button className="button button-wide" type="submit" disabled={!selected.length}><Save /> Save coverage</button>
      </section>
      <section className="coverage-map-panel">
        <div className="coverage-map-head"><div><p className="workspace-kicker">Coverage preview</p><h2>Your local project area</h2></div><span><LocateFixed /> {visiblePoints.length} mapped</span></div>
        <div className="coverage-map" ref={mapContainer}>{(!scriptReady || mapError) ? <div className="coverage-map-fallback"><MapPin /><strong>{mapError ? "Map preview unavailable" : "Loading map…"}</strong><span>Your selected districts are still saved and used for matching.</span></div> : null}</div>
        <p className="coverage-map-note"><MapPin /> The shaded circles are an approximate visual guide. Project matching uses the exact postcode districts selected on the left.</p>
      </section>
    </form>
  </>;
}
