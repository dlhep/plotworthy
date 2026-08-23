import { BriefHub } from "@/components/BriefHub";

export const metadata = {
  title: "Your project — PlotWorthy",
};

export default function BriefPage() {
  return (
    <section className="container-content py-14 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <BriefHub />
      </div>
    </section>
  );
}
