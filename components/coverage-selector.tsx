"use client";

import Script from "next/script";
import { Check, CreditCard, LocateFixed, LockKeyhole, MapPin, Plus, Save, Search, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { updateCoverage } from "@/app/professional/coverage/actions";
import { openCoverageBillingPortal, startCoverageCheckout } from "@/app/professional/coverage/billing-actions";
import { coveragePlans, formatMonthlyPrice } from "@/lib/coverage-plans";

type BoundaryGeometry = { type: "Polygon" | "MultiPolygon"; coordinates: number[][][] | number[][][][] };
type BoundaryFeature = { type: "Feature"; properties: { code: string }; geometry: BoundaryGeometry };
type GeoJSON = { type: "FeatureCollection"; features: BoundaryFeature[] };
type MapSource = { setData(data: GeoJSON): void };
type MapInstance = { on(event: string, callback: () => void): void; addControl(control: unknown, position?: string): void; addSource(id: string, source: object): void; addLayer(layer: object): void; getSource(id: string): MapSource | undefined; getLayer(id: string): unknown; fitBounds(bounds: unknown, options?: object): void; remove(): void };
type MapLibre = { Map: new (options: object) => MapInstance; NavigationControl: new (options?: object) => unknown; LngLatBounds: new () => { extend(point: [number, number]): unknown } };

declare global { interface Window { maplibregl?: MapLibre } }

const suggestions = ["B1", "B2", "B3", "B4", "B5", "B13", "B14", "B15", "B16", "B17", "B18", "B23", "B24", "B29", "B30", "B31", "B32", "B42", "B43", "B44"];
const codePattern = /^[A-Z]{1,2}[0-9][0-9A-Z]?$/;
const emptyCoverage: GeoJSON = { type: "FeatureCollection", features: [] };

function coordinatesFor(feature: BoundaryFeature) {
  const coordinates: [number, number][] = [];
  const visit = (value: unknown) => {
    if (!Array.isArray(value)) return;
    if (typeof value[0] === "number" && typeof value[1] === "number") {
      coordinates.push([value[0], value[1]]);
      return;
    }
    value.forEach(visit);
  };
  visit(feature.geometry.coordinates);
  return coordinates;
}

type CoverageSelectorProps = {
  initialCoverage: string[];
  allowance: number;
  saved?: string;
  billing?: string;
  billingConfigured: boolean;
  billingStatus: string;
  coveragePackage: string | null;
  cancelAtPeriodEnd: boolean;
};

const billingMessages: Record<string, string> = {
  success: "Payment received. Your new district allowance will appear as soon as Stripe confirms the subscription.",
  cancelled: "Checkout cancelled. Your current coverage has not changed.",
  unavailable: "Stripe billing is not connected yet. Add the Stripe keys and price IDs to activate purchases.",
  manage: "You already have a coverage subscription. Use Manage billing to change or cancel it.",
  missing: "No Stripe billing account was found for this profile.",
  invalid: "That coverage package was not recognised.",
  error: "Stripe could not open billing. Please try again or contact support."
};

export function CoverageSelector({ initialCoverage, allowance, saved, billing, billingConfigured, billingStatus, coveragePackage, cancelAtPeriodEnd }: CoverageSelectorProps) {
  const [selected, setSelected] = useState(initialCoverage);
  const [input, setInput] = useState("");
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [limitNotice, setLimitNotice] = useState(false);
  const [coverage, setCoverage] = useState<GeoJSON>(emptyCoverage);
  const [scriptReady, setScriptReady] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapInstance | null>(null);

  function add(codeValue = input) {
    const code = codeValue.toUpperCase().replace(/\s/g, "");
    if (!codePattern.test(code) || selected.includes(code)) return;
    if (selected.length >= allowance) {
      setLimitNotice(true);
      setUpgradeOpen(true);
      return;
    }
    setSelected((current) => [...current, code]);
    setInput("");
  }

  useEffect(() => {
    if (!selected.length) {
      queueMicrotask(() => setCoverage(emptyCoverage));
      return;
    }
    const controller = new AbortController();
    fetch(`/api/postcodes/coverage?codes=${encodeURIComponent(selected.join(","))}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Coverage lookup failed")))
      .then((payload: GeoJSON) => { setCoverage(payload); setMapError(false); })
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
        map.addLayer({ id: "coverage-fill", type: "fill", source: "coverage", paint: { "fill-color": "#d5a62e", "fill-opacity": 0.38 } });
        map.addLayer({ id: "coverage-line", type: "line", source: "coverage", paint: { "line-color": "#143c34", "line-width": 2.4 } });
        map.addLayer({ id: "coverage-label", type: "symbol", source: "coverage", layout: { "text-field": ["get", "code"], "text-size": 13, "text-font": ["Noto Sans Regular"] }, paint: { "text-color": "#143c34", "text-halo-color": "#fffaf0", "text-halo-width": 2 } });
        setMapReady(true);
      });
      mapRef.current = map;
    } catch { queueMicrotask(() => setMapError(true)); }
    return () => { mapRef.current?.remove(); mapRef.current = null; };
  }, [scriptReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !window.maplibregl) return;
    map.getSource("coverage")?.setData(coverage);
    if (!coverage.features.length) return;
    const bounds = new window.maplibregl.LngLatBounds();
    coverage.features.flatMap(coordinatesFor).forEach((coordinate) => bounds.extend(coordinate));
    map.fitBounds(bounds, { padding: 70, maxZoom: 11, duration: 500 });
  }, [coverage, mapReady]);

  return <>
    <Script src="https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.js" strategy="afterInteractive" onLoad={() => setScriptReady(true)} onError={() => setMapError(true)} />
    <link rel="stylesheet" href="https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.css" />
    {saved ? <div className="workspace-success"><Check /> Coverage saved. New project matching now uses these postcode districts.</div> : null}
    {billing && billingMessages[billing] ? <div className={billing === "success" ? "workspace-success" : "workspace-preview-banner"}><CreditCard /> {billingMessages[billing]}</div> : null}
    <form className="coverage-workspace" action={updateCoverage}>
      <input type="hidden" name="postcodes" value={JSON.stringify(selected)} />
      <section className="coverage-control-panel">
        <div className="coverage-panel-heading"><div><p className="workspace-kicker">Lead preferences</p><h2>Select postcode districts</h2></div><span>{selected.length}/{allowance}</span></div>
        <p>Choose the districts where you want first access to new projects. You can change this at any time.</p>
        <div className="coverage-search"><Search /><input value={input} onChange={(event) => setInput(event.target.value.toUpperCase())} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); add(); } }} placeholder="For example B17" maxLength={4} /><button type="button" onClick={() => add()} disabled={!codePattern.test(input.replace(/\s/g, ""))}><Plus /> Add</button></div>
        <div className="coverage-selected"><div><strong>Included districts</strong><button type="button" onClick={() => setSelected([])}>Clear all</button></div>{selected.length ? <div className="coverage-chips">{selected.map((code) => <button type="button" key={code} onClick={() => setSelected((current) => current.filter((item) => item !== code))}>{code}<X /></button>)}</div> : <p>No districts selected yet.</p>}</div>
        <div className="coverage-suggestions"><strong>Nearby suggestions</strong><div>{suggestions.map((code) => <button className={selected.includes(code) ? "selected" : undefined} type="button" key={code} onClick={() => selected.includes(code) ? setSelected((current) => current.filter((item) => item !== code)) : add(code)}>{selected.includes(code) ? <Check /> : null}{code}</button>)}</div></div>
        <div className="coverage-allowance-card">
          <div><LockKeyhole /><div><strong>{allowance} districts available</strong><span>5 are included with professional membership{allowance > 5 ? ` and ${allowance - 5} are added by your coverage plan` : ""}.</span></div></div>
          {coveragePackage && ["active", "trialing", "past_due"].includes(billingStatus) ? <>
            <p className="coverage-current-plan"><Check /> {coveragePlans[coveragePackage as keyof typeof coveragePlans]?.name ?? "Coverage add-on"}{cancelAtPeriodEnd ? " · ends after the current billing period" : " · active"}</p>
            <button className="coverage-manage-button" type="submit" formAction={openCoverageBillingPortal}><CreditCard /> Manage billing</button>
          </> : <button className="coverage-upgrade-button" type="button" onClick={() => setUpgradeOpen((current) => !current)}><Sparkles /> Add more districts</button>}
        </div>
        {limitNotice ? <p className="coverage-limit-notice">You have used all {allowance} available districts. Choose an add-on to increase the limit.</p> : null}
        {upgradeOpen && !coveragePackage ? <div className="coverage-upgrade-panel">
          <div><p className="workspace-kicker">Flexible monthly add-ons</p><h3>Reach more local projects</h3><p>District slots are reusable. Change your chosen postcodes at any time.</p></div>
          <div className="coverage-plan-grid">{Object.values(coveragePlans).map((plan) => <article className={plan.key === "local" ? "recommended" : undefined} key={plan.key}>{plan.key === "local" ? <span>Best value</span> : null}<strong>{plan.shortName}</strong><b>{formatMonthlyPrice(plan.monthlyPricePence)}<small>/month</small></b><p>{plan.key === "single" ? "Ideal for one adjoining area." : plan.key === "local" ? "Save £10 against single slots." : "Broad regional coverage for growing firms."}</p><button type="submit" name="package" value={plan.key} formAction={startCoverageCheckout} disabled={!billingConfigured}>Choose {plan.shortName}</button></article>)}</div>
          {!billingConfigured ? <p className="coverage-stripe-note">Preview only — connect Stripe and add the three recurring price IDs to activate these buttons.</p> : <p className="coverage-stripe-note">Secure recurring billing by Stripe. Cancel or change your package through the billing portal.</p>}
        </div> : null}
        <button className="button button-wide" type="submit" disabled={!selected.length}><Save /> Save coverage</button>
      </section>
      <section className="coverage-map-panel">
        <div className="coverage-map-head"><div><p className="workspace-kicker">Coverage preview</p><h2>Your selected postcode districts</h2></div><span><LocateFixed /> {coverage.features.length} mapped</span></div>
        <div className="coverage-map" ref={mapContainer}>{(!scriptReady || mapError) ? <div className="coverage-map-fallback"><MapPin /><strong>{mapError ? "Map preview unavailable" : "Loading map…"}</strong><span>Your selected districts are still saved and used for matching.</span></div> : null}</div>
        <p className="coverage-map-note"><MapPin /> Shaded shapes follow postcode-district boundaries. Your saved list controls matching and alerts. Boundary data © Wikipedia contributors.</p>
      </section>
    </form>
  </>;
}
