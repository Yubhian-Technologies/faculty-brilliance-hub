import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Plus, Pencil, Trash2, GraduationCap, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { User, UserRole } from '@/types/fpms';

interface FacultyMember extends User {
  status: 'active' | 'inactive';
  joinDate: string;
}

const DEPARTMENTS = [
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Civil',
  'Electrical',
  'Information Technology',
];

const DESIGNATIONS = [
  'Assistant Professor',
  'Associate Professor',
  'Professor',
  // 'Professor & HOD',
  'Lecturer',
];

// Mock faculty data
const INITIAL_FACULTY: FacultyMember[] = [
  {
    id: '1',
    email: 'faculty@demo.edu',
    name: 'Dr. John Smith',
    role: 'faculty',
    department: 'Computer Science',
    designation: 'Associate Professor',
    experience: 8,
    hasPhD: true,
    status: 'active',
    joinDate: '2016-08-01',
  },
  {
    id: '5',
    email: 'jane.doe@demo.edu',
    name: 'Dr. Jane Doe',
    role: 'faculty',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    experience: 5,
    hasPhD: true,
    status: 'active',
    joinDate: '2019-07-15',
  },
  {
    id: '6',
    email: 'robert.wilson@demo.edu',
    name: 'Prof. Robert Wilson',
    role: 'faculty',
    department: 'Electronics',
    designation: 'Professor',
    experience: 15,
    hasPhD: true,
    status: 'active',
    joinDate: '2009-06-01',
  },
  {
    id: '7',
    email: 'mary.johnson@demo.edu',
    name: 'Mary Johnson',
    role: 'faculty',
    department: 'Mechanical',
    designation: 'Lecturer',
    experience: 3,
    hasPhD: false,
    status: 'active',
    joinDate: '2021-01-10',
  },
  {
    id: '8',
    email: 'david.lee@demo.edu',
    name: 'Dr. David Lee',
    role: 'faculty',
    department: 'Civil',
    designation: 'Associate Professor',
    experience: 10,
    hasPhD: true,
    status: 'inactive',
    joinDate: '2014-03-20',
  },
];

export default function Faculty() {
  const [faculty, setFaculty] = useState<FacultyMember[]>(() => {
    const stored = localStorage.getItem('fpms_faculty');
    return stored ? JSON.parse(stored) : INITIAL_FACULTY;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<FacultyMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    designation: '',
    experience: '',
    hasPhD: false,
    status: 'active' as 'active' | 'inactive',
  });

  const saveFaculty = (updatedFaculty: FacultyMember[]) => {
    setFaculty(updatedFaculty);
    localStorage.setItem('fpms_faculty', JSON.stringify(updatedFaculty));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      department: '',
      designation: '',
      experience: '',
      hasPhD: false,
      status: 'active',
    });
    setEditingFaculty(null);
  };

  const handleAddFaculty = () => {
    if (!formData.name || !formData.email || !formData.department || !formData.designation) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newFaculty: FacultyMember = {
      id: Math.random().toString(36).substring(2, 9),
      name: formData.name,
      email: formData.email,
      role: 'faculty' as UserRole,
      department: formData.department,
      designation: formData.designation,
      experience: parseInt(formData.experience) || 0,
      hasPhD: formData.hasPhD,
      status: formData.status,
      joinDate: new Date().toISOString().split('T')[0],
    };

    saveFaculty([...faculty, newFaculty]);
    toast({ title: 'Faculty Added', description: `${formData.name} has been added successfully.` });
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditFaculty = () => {
    if (!editingFaculty) return;

    const updated = faculty.map((f) =>
      f.id === editingFaculty.id
        ? {
            ...f,
            name: formData.name,
            email: formData.email,
            department: formData.department,
            designation: formData.designation,
            experience: parseInt(formData.experience) || 0,
            hasPhD: formData.hasPhD,
            status: formData.status,
          }
        : f
    );

    saveFaculty(updated);
    toast({ title: 'Faculty Updated', description: `${formData.name} has been updated successfully.` });
    resetForm();
  };

  const handleDeleteFaculty = (id: string) => {
    const memberToDelete = faculty.find((f) => f.id === id);
    saveFaculty(faculty.filter((f) => f.id !== id));
    toast({ title: 'Faculty Removed', description: `${memberToDelete?.name} has been removed.` });
  };

  const openEditDialog = (member: FacultyMember) => {
    setEditingFaculty(member);
    setFormData({
      name: member.name,
      email: member.email,
      department: member.department,
      designation: member.designation,
      experience: member.experience.toString(),
      hasPhD: member.hasPhD,
      status: member.status,
    });
  };

  const filteredFaculty = faculty.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const stats = {
    total: faculty.length,
    active: faculty.filter((f) => f.status === 'active').length,
    withPhD: faculty.filter((f) => f.hasPhD).length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Faculty Management</h1>
            <p className="text-muted-foreground">Manage faculty members and their profiles</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Faculty
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Faculty</DialogTitle>
                <DialogDescription>Enter the details for the new faculty member.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Dr. John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john.smith@university.edu"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Department *</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Designation *</Label>
                    <Select
                      value={formData.designation}
                      onValueChange={(value) => setFormData({ ...formData, designation: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {DESIGNATIONS.map((desig) => (
                          <SelectItem key={desig} value={desig}>
                            {desig}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience (Years)</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: 'active' | 'inactive') =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hasPhD"
                    checked={formData.hasPhD}
                    onChange={(e) => setFormData({ ...formData, hasPhD: e.target.checked })}
                    className="h-4 w-4 rounded border-border"
                  />
                  <Label htmlFor="hasPhD" className="font-normal">
                    Has PhD/Doctorate
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddFaculty}>Add Faculty</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-card">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Faculty</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <Users className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Faculty</p>
                <p className="text-2xl font-bold text-foreground">{stats.active}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/10">
                <GraduationCap className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">With PhD</p>
                <p className="text-2xl font-bold text-foreground">{stats.withPhD}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Faculty List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Faculty Table */}
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Faculty Member</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFaculty.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No faculty members found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFaculty.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                {member.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">{member.name}</p>
                              <p className="text-sm text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{member.department}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-foreground">{member.designation}</span>
                            {member.hasPhD && (
                              <Badge variant="secondary" className="text-xs">
                                PhD
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{member.experience} years</TableCell>
                        <TableCell>
                          <Badge
                            variant={member.status === 'active' ? 'default' : 'secondary'}
                            className={
                              member.status === 'active'
                                ? 'bg-success/10 text-success hover:bg-success/20'
                                : 'bg-muted text-muted-foreground'
                            }
                          >
                            {member.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditDialog(member)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Edit Faculty</DialogTitle>
                                  <DialogDescription>Update faculty member details.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-name">Full Name *</Label>
                                    <Input
                                      id="edit-name"
                                      value={formData.name}
                                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-email">Email *</Label>
                                    <Input
                                      id="edit-email"
                                      type="email"
                                      value={formData.email}
                                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Department *</Label>
                                      <Select
                                        value={formData.department}
                                        onValueChange={(value) =>
                                          setFormData({ ...formData, department: value })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {DEPARTMENTS.map((dept) => (
                                            <SelectItem key={dept} value={dept}>
                                              {dept}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Designation *</Label>
                                      <Select
                                        value={formData.designation}
                                        onValueChange={(value) =>
                                          setFormData({ ...formData, designation: value })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {DESIGNATIONS.map((desig) => (
                                            <SelectItem key={desig} value={desig}>
                                              {desig}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-experience">Experience (Years)</Label>
                                      <Input
                                        id="edit-experience"
                                        type="number"
                                        value={formData.experience}
                                        onChange={(e) =>
                                          setFormData({ ...formData, experience: e.target.value })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Status</Label>
                                      <Select
                                        value={formData.status}
                                        onValueChange={(value: 'active' | 'inactive') =>
                                          setFormData({ ...formData, status: value })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="active">Active</SelectItem>
                                          <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      id="edit-hasPhD"
                                      checked={formData.hasPhD}
                                      onChange={(e) =>
                                        setFormData({ ...formData, hasPhD: e.target.checked })
                                      }
                                      className="h-4 w-4 rounded border-border"
                                    />
                                    <Label htmlFor="edit-hasPhD" className="font-normal">
                                      Has PhD/Doctorate
                                    </Label>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={resetForm}>
                                    Cancel
                                  </Button>
                                  <Button onClick={handleEditFaculty}>Save Changes</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteFaculty(member.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
