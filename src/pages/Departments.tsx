import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Plus, Pencil, Trash2, Building2, Users, GraduationCap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Department {
  id: string;
  name: string;
  code: string;
  hodName: string;
  hodEmail: string;
  facultyCount: number;
  establishedYear: number;
  status: 'active' | 'inactive';
}

// Mock departments data
const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: '1',
    name: 'Computer Science',
    code: 'CS',
    hodName: 'Dr. Sarah Johnson',
    hodEmail: 'hod@demo.edu',
    facultyCount: 15,
    establishedYear: 1995,
    status: 'active',
  },
  {
    id: '2',
    name: 'Electronics',
    code: 'ECE',
    hodName: 'Dr. Michael Chen',
    hodEmail: 'm.chen@demo.edu',
    facultyCount: 12,
    establishedYear: 1998,
    status: 'active',
  },
  {
    id: '3',
    name: 'Mechanical',
    code: 'ME',
    hodName: 'Dr. James Wilson',
    hodEmail: 'j.wilson@demo.edu',
    facultyCount: 18,
    establishedYear: 1990,
    status: 'active',
  },
  {
    id: '4',
    name: 'Civil',
    code: 'CE',
    hodName: 'Dr. Emily Brown',
    hodEmail: 'e.brown@demo.edu',
    facultyCount: 10,
    establishedYear: 1992,
    status: 'active',
  },
  {
    id: '5',
    name: 'Electrical',
    code: 'EE',
    hodName: 'Dr. Robert Taylor',
    hodEmail: 'r.taylor@demo.edu',
    facultyCount: 14,
    establishedYear: 1994,
    status: 'active',
  },
  {
    id: '6',
    name: 'Information Technology',
    code: 'IT',
    hodName: 'Dr. Lisa Anderson',
    hodEmail: 'l.anderson@demo.edu',
    facultyCount: 11,
    establishedYear: 2005,
    status: 'active',
  },
];

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>(() => {
    const stored = localStorage.getItem('fpms_departments');
    return stored ? JSON.parse(stored) : INITIAL_DEPARTMENTS;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    hodName: '',
    hodEmail: '',
    facultyCount: '',
    establishedYear: '',
    status: 'active' as 'active' | 'inactive',
  });

  const saveDepartments = (updatedDepts: Department[]) => {
    setDepartments(updatedDepts);
    localStorage.setItem('fpms_departments', JSON.stringify(updatedDepts));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      hodName: '',
      hodEmail: '',
      facultyCount: '',
      establishedYear: '',
      status: 'active',
    });
    setEditingDepartment(null);
  };

  const handleAddDepartment = () => {
    if (!formData.name || !formData.code || !formData.hodName) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newDepartment: Department = {
      id: Math.random().toString(36).substring(2, 9),
      name: formData.name,
      code: formData.code.toUpperCase(),
      hodName: formData.hodName,
      hodEmail: formData.hodEmail,
      facultyCount: parseInt(formData.facultyCount) || 0,
      establishedYear: parseInt(formData.establishedYear) || new Date().getFullYear(),
      status: formData.status,
    };

    saveDepartments([...departments, newDepartment]);
    toast({ title: 'Department Added', description: `${formData.name} department has been created.` });
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditDepartment = () => {
    if (!editingDepartment) return;

    const updated = departments.map((d) =>
      d.id === editingDepartment.id
        ? {
            ...d,
            name: formData.name,
            code: formData.code.toUpperCase(),
            hodName: formData.hodName,
            hodEmail: formData.hodEmail,
            facultyCount: parseInt(formData.facultyCount) || 0,
            establishedYear: parseInt(formData.establishedYear) || d.establishedYear,
            status: formData.status,
          }
        : d
    );

    saveDepartments(updated);
    toast({ title: 'Department Updated', description: `${formData.name} has been updated.` });
    resetForm();
  };

  const handleDeleteDepartment = (id: string) => {
    const deptToDelete = departments.find((d) => d.id === id);
    saveDepartments(departments.filter((d) => d.id !== id));
    toast({ title: 'Department Removed', description: `${deptToDelete?.name} has been removed.` });
  };

  const openEditDialog = (dept: Department) => {
    setEditingDepartment(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      hodName: dept.hodName,
      hodEmail: dept.hodEmail,
      facultyCount: dept.facultyCount.toString(),
      establishedYear: dept.establishedYear.toString(),
      status: dept.status,
    });
  };

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.hodName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: departments.length,
    active: departments.filter((d) => d.status === 'active').length,
    totalFaculty: departments.reduce((sum, d) => sum + d.facultyCount, 0),
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Departments</h1>
            <p className="text-muted-foreground">Manage academic departments and their details</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Department</DialogTitle>
                <DialogDescription>Create a new academic department.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Department Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Computer Science"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Code *</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="CS"
                      maxLength={5}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hodName">HOD Name *</Label>
                  <Input
                    id="hodName"
                    value={formData.hodName}
                    onChange={(e) => setFormData({ ...formData, hodName: e.target.value })}
                    placeholder="Dr. John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hodEmail">HOD Email</Label>
                  <Input
                    id="hodEmail"
                    type="email"
                    value={formData.hodEmail}
                    onChange={(e) => setFormData({ ...formData, hodEmail: e.target.value })}
                    placeholder="john.smith@university.edu"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facultyCount">Faculty Count</Label>
                    <Input
                      id="facultyCount"
                      type="number"
                      value={formData.facultyCount}
                      onChange={(e) => setFormData({ ...formData, facultyCount: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="establishedYear">Established Year</Label>
                    <Input
                      id="establishedYear"
                      type="number"
                      value={formData.establishedYear}
                      onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
                      placeholder="2000"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddDepartment}>Add Department</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-card">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Departments</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <GraduationCap className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Departments</p>
                <p className="text-2xl font-bold text-foreground">{stats.active}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/10">
                <Users className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Faculty</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalFaculty}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Department List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, code, or HOD..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Departments Table */}
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Department</TableHead>
                    <TableHead>Head of Department</TableHead>
                    <TableHead>Faculty</TableHead>
                    <TableHead>Established</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDepartments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No departments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDepartments.map((dept) => (
                      <TableRow key={dept.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                              <span className="text-sm font-bold text-primary">{dept.code}</span>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{dept.name}</p>
                              <p className="text-sm text-muted-foreground">Code: {dept.code}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{dept.hodName}</p>
                            <p className="text-sm text-muted-foreground">{dept.hodEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-muted">
                            {dept.facultyCount} members
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{dept.establishedYear}</TableCell>
                        <TableCell>
                          <Badge
                            variant={dept.status === 'active' ? 'default' : 'secondary'}
                            className={
                              dept.status === 'active'
                                ? 'bg-success/10 text-success hover:bg-success/20'
                                : 'bg-muted text-muted-foreground'
                            }
                          >
                            {dept.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditDialog(dept)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Edit Department</DialogTitle>
                                  <DialogDescription>Update department details.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-name">Department Name *</Label>
                                      <Input
                                        id="edit-name"
                                        value={formData.name}
                                        onChange={(e) =>
                                          setFormData({ ...formData, name: e.target.value })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-code">Code *</Label>
                                      <Input
                                        id="edit-code"
                                        value={formData.code}
                                        onChange={(e) =>
                                          setFormData({ ...formData, code: e.target.value })
                                        }
                                        maxLength={5}
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-hodName">HOD Name *</Label>
                                    <Input
                                      id="edit-hodName"
                                      value={formData.hodName}
                                      onChange={(e) =>
                                        setFormData({ ...formData, hodName: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-hodEmail">HOD Email</Label>
                                    <Input
                                      id="edit-hodEmail"
                                      type="email"
                                      value={formData.hodEmail}
                                      onChange={(e) =>
                                        setFormData({ ...formData, hodEmail: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-facultyCount">Faculty Count</Label>
                                      <Input
                                        id="edit-facultyCount"
                                        type="number"
                                        value={formData.facultyCount}
                                        onChange={(e) =>
                                          setFormData({ ...formData, facultyCount: e.target.value })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-establishedYear">Established Year</Label>
                                      <Input
                                        id="edit-establishedYear"
                                        type="number"
                                        value={formData.establishedYear}
                                        onChange={(e) =>
                                          setFormData({ ...formData, establishedYear: e.target.value })
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={resetForm}>
                                    Cancel
                                  </Button>
                                  <Button onClick={handleEditDepartment}>Save Changes</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteDepartment(dept.id)}
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
