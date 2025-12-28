import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFPMS } from '@/contexts/FPMSContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/ui/status-badge';
import { ModuleProgress } from '@/components/dashboard/ModuleProgress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Check, X, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FPMSSubmission } from '@/types/fpms';

export default function Review() {
  const { user } = useAuth();
  const { getAllSubmissions, approveSubmission, rejectSubmission } = useFPMS();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<FPMSSubmission | null>(null);
  const [remarks, setRemarks] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const { toast } = useToast();

  if (!user) return null;

  const submissions = getAllSubmissions().filter(
    (s) => s.status === 'submitted' || (user.role === 'committee' && s.status === 'under_review')
  );

  const handleAction = () => {
    if (!selectedSubmission || !actionType) return;

    if (actionType === 'approve') {
      approveSubmission(selectedSubmission.id, remarks);
      toast({
        title: user.role === 'hod' ? 'Forwarded to Committee' : 'Submission Approved',
        description: 'The submission has been processed successfully.',
      });
    } else {
      rejectSubmission(selectedSubmission.id, remarks);
      toast({
        title: 'Submission Rejected',
        description: 'The faculty will be notified.',
        variant: 'destructive',
      });
    }

    setSelectedSubmission(null);
    setRemarks('');
    setActionType(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl font-bold">Review Submissions</h1>
          <p className="text-muted-foreground mt-1">
            {user.role === 'hod' ? 'Review and forward submissions to committee' : 'Final review and approval'}
          </p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by faculty name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Pending Reviews</CardTitle>
            <CardDescription>{submissions.length} submissions awaiting your review</CardDescription>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No submissions pending review.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Faculty ID</TableHead>
                    <TableHead>Academic Year</TableHead>
                    <TableHead>Total Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.facultyId}</TableCell>
                      <TableCell>{submission.academicYear}</TableCell>
                      <TableCell>
                        <span className="font-semibold">{submission.totalScore}</span>
                        <span className="text-muted-foreground"> / 300</span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={submission.status} />
                      </TableCell>
                      <TableCell>
                        {submission.submittedAt
                          ? new Date(submission.submittedAt).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-success hover:text-success"
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setActionType('approve');
                            }}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setActionType('reject');
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* View Details Dialog */}
        <Dialog open={!!selectedSubmission && !actionType} onOpenChange={() => setSelectedSubmission(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-display">Submission Details</DialogTitle>
              <DialogDescription>
                Faculty ID: {selectedSubmission?.facultyId} | Year: {selectedSubmission?.academicYear}
              </DialogDescription>
            </DialogHeader>
            {selectedSubmission && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <StatusBadge status={selectedSubmission.status} />
                  <p className="text-2xl font-bold font-display">
                    {selectedSubmission.totalScore} <span className="text-muted-foreground text-base">/ 300</span>
                  </p>
                </div>
                <ModuleProgress modules={selectedSubmission.modules} />
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
                Close
              </Button>
              <Button
                variant="default"
                onClick={() => setActionType('approve')}
              >
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => setActionType('reject')}
              >
                Reject
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Action Dialog */}
        <Dialog open={!!actionType} onOpenChange={() => setActionType(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">
                {actionType === 'approve'
                  ? user.role === 'hod'
                    ? 'Forward to Committee'
                    : 'Approve Submission'
                  : 'Reject Submission'}
              </DialogTitle>
              <DialogDescription>
                {actionType === 'approve'
                  ? 'Add any remarks before proceeding.'
                  : 'Please provide a reason for rejection.'}
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="Enter your remarks..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={4}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionType(null)}>
                Cancel
              </Button>
              <Button
                variant={actionType === 'approve' ? 'default' : 'destructive'}
                onClick={handleAction}
                disabled={actionType === 'reject' && !remarks.trim()}
              >
                {actionType === 'approve'
                  ? user.role === 'hod'
                    ? 'Forward'
                    : 'Approve'
                  : 'Reject'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}