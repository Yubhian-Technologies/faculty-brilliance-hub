import { useAuth } from '@/contexts/AuthContext';
import { useFPMS } from '@/contexts/FPMSContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ScoreCard } from '@/components/dashboard/ScoreCard';
import { ModuleProgress } from '@/components/dashboard/ModuleProgress';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, TrendingUp, Award, Calendar, FileText, ArrowRight, Users, ClipboardCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FPMS_MODULES } from '@/types/fpms';

export default function Dashboard() {
  const { user } = useAuth();
  const { currentSubmission, academicYear, setAcademicYear, createSubmission, getAllSubmissions } = useFPMS();

  if (!user) return null;

  const allSubmissions = getAllSubmissions();
  const pendingReviews = allSubmissions.filter((s) => s.status === 'submitted' || s.status === 'under_review');

  // Faculty Dashboard
  if (user.role === 'faculty') {
    const totalMaxPoints = FPMS_MODULES.reduce((sum, m) => sum + m.maxPoints, 0);
    const defaultModules = FPMS_MODULES.map((m) => ({
      id: m.id,
      name: m.name,
      maxPoints: m.maxPoints,
      score: 0,
      entries: [],
    }));

    return (
      <DashboardLayout>
        <div className="space-y-8 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold">Welcome back, {user.name.split(' ')[0]}</h1>
              <p className="text-muted-foreground mt-1">Track and manage your performance evaluation</p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={academicYear} onValueChange={setAcademicYear}>
                <SelectTrigger className="w-40">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-25">2024-25</SelectItem>
                  <SelectItem value="2023-24">2023-24</SelectItem>
                  <SelectItem value="2022-23">2022-23</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Score Overview */}
          <div className="grid gap-4 md:grid-cols-4">
            <ScoreCard
              title="Total Score"
              score={currentSubmission?.totalScore || 0}
              maxScore={totalMaxPoints}
              icon={<Target className="h-5 w-5" />}
            />
            <ScoreCard
              title="Teaching & Learning"
              score={currentSubmission?.modules.find((m) => m.id === 'teaching')?.score || 0}
              maxScore={70}
              icon={<TrendingUp className="h-5 w-5" />}
            />
            <ScoreCard
              title="Research"
              score={currentSubmission?.modules.find((m) => m.id === 'research')?.score || 0}
              maxScore={75}
              icon={<Award className="h-5 w-5" />}
            />
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {currentSubmission ? (
                  <StatusBadge status={currentSubmission.status} className="text-sm" />
                ) : (
                  <span className="text-sm text-muted-foreground">No submission</span>
                )}
                <p className="mt-2 text-xs text-muted-foreground">Academic Year {academicYear}</p>
              </CardContent>
            </Card>
          </div>

          {/* Module Progress & Actions */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ModuleProgress modules={currentSubmission?.modules || defaultModules} />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-display">Quick Actions</CardTitle>
                <CardDescription>Manage your FPMS submission</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {!currentSubmission ? (
                  <Button onClick={createSubmission} className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Start New Submission
                  </Button>
                ) : (
                  <Link to="/fpms-form">
                    <Button className="w-full">
                      {currentSubmission.status === 'draft' ? 'Continue Form' : 'View Submission'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Link to="/reports">
                  <Button variant="outline" className="w-full">
                    View Reports
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // HOD / Committee Dashboard
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold">
            {user.role === 'hod' ? 'HOD Dashboard' : 'Committee Dashboard'}
          </h1>
          <p className="text-muted-foreground mt-1">Review and manage faculty performance evaluations</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Submissions</CardTitle>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-display">{allSubmissions.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reviews</CardTitle>
              <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-display text-warning">{pendingReviews.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
              <Award className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-display text-success">
                {allSubmissions.filter((s) => s.status === 'approved').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Department</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{user.department}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Link to="/review">
              <Button>
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Review Submissions ({pendingReviews.length})
              </Button>
            </Link>
            <Link to="/reports">
              <Button variant="outline">View Reports</Button>
            </Link>
            <Link to="/faculty">
              <Button variant="outline">Faculty List</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}