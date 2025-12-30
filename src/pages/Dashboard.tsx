import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusCards } from "@/components/dashboard/StatusCards";
import { ScoreOverview } from "@/components/dashboard/ScoreOverview";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { DeadlineAlert } from "@/components/dashboard/DeadlineAlert";
import { FPMSFormOverview } from "@/components/fpms/FPMSFormOverview";

export default function Dashboard() {
  return (
    <DashboardLayout 
      title="Faculty Dashboard" 
      subtitle="Welcome back, Dr. Rajesh Kumar"
      currentPath="/dashboard"
    >
      <div className="space-y-6">
        {/* Deadline Alert */}
        <DeadlineAlert />

        {/* Status Cards */}
        <StatusCards />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Score Overview */}
          <div className="lg:col-span-1">
            <ScoreOverview />
          </div>

          {/* Quick Actions & Activity */}
          <div className="space-y-6 lg:col-span-2">
            <QuickActions />
            <RecentActivity />
          </div>
        </div>

        {/* FPMS Form Overview */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">FPMS Categories</h2>
            <p className="text-sm text-muted-foreground">
              Complete all sections to submit your annual performance report
            </p>
          </div>
          <FPMSFormOverview />
        </div>
      </div>
    </DashboardLayout>
  );
}
