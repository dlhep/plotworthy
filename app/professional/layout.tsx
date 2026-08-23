import { WorkspaceSidebar } from "@/components/WorkspaceSidebar";

export const metadata = { title: "Professional workspace — PlotWorthy" };

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <WorkspaceSidebar />
      <div className="min-w-0 flex-1 bg-canvas">
        <div className="border-b border-clay-200 bg-clay-50 px-4 py-2 text-center sm:px-8 text-xs text-clay-700">
          Preview — a sample of the professional workspace using placeholder data. Professional
          accounts aren’t live yet, so this isn’t a real sign-in and nothing here is your data.
        </div>
        {children}
      </div>
    </div>
  );
}
