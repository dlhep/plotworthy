import { WorkspaceSidebar } from "@/components/WorkspaceSidebar";

export const metadata = { title: "Professional workspace — PlotWorthy" };

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <WorkspaceSidebar />
      <div className="min-w-0 flex-1 bg-canvas">{children}</div>
    </div>
  );
}
