import { CheckCircle2, CircleHelp, Gauge } from "lucide-react";
import type { EvidenceItem } from "@/lib/types";

const statusMeta = {
  verified: { label: "Verified", icon: CheckCircle2 },
  indicative: { label: "Indicative", icon: Gauge },
  unknown: { label: "Needs evidence", icon: CircleHelp }
};

export function EvidenceCard({ item }: { item: EvidenceItem }) {
  const meta = statusMeta[item.status];
  const Icon = meta.icon;

  return (
    <article className="evidence-card">
      <div className={`status status-${item.status}`}><Icon size={15} /> {meta.label}</div>
      <p className="evidence-label">{item.label}</p>
      <h3>{item.value}</h3>
      <p>{item.detail}</p>
      {item.source ? <small>Source: {item.source}{item.sourceDate ? ` · ${item.sourceDate}` : ""}</small> : null}
    </article>
  );
}
