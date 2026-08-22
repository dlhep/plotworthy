import { StartFlow } from "@/components/StartFlow";

export const metadata = {
  title: "Start your journey — PlotWorthy",
};

export default function StartPage({
  searchParams,
}: {
  searchParams: { goal?: string };
}) {
  return (
    <section className="container-content py-14 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <StartFlow initialGoalId={searchParams.goal} />
      </div>
    </section>
  );
}
