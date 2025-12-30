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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Plus, Pencil, Trash2, Users, GraduationCap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

/* ================= TYPES ================= */

interface Administrator {
  id: string;
  name: string;
  email: string;
  experience: number;
  hasPhD: boolean;
  collegeName: string;
  joinDate: string;
}

/* ================= COMPONENT ================= */

export default function AdministratorManagement() {
  const [admins, setAdmins] = useState<Administrator[]>(() => {
    const stored = localStorage.getItem('fpms_admins');
    return stored ? JSON.parse(stored) : [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Administrator | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    experience: '',
    hasPhD: false,
    collegeName: '',
  });

  /* ================= HELPERS ================= */

  const saveAdmins = (updated: Administrator[]) => {
    setAdmins(updated);
    localStorage.setItem('fpms_admins', JSON.stringify(updated));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      experience: '',
      hasPhD: false,
      collegeName: '',
    });
    setEditingAdmin(null);
  };

  /* ================= ADD / EDIT ================= */

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.collegeName) {
      toast({
        title: 'Validation Error',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (editingAdmin) {
      const updated = admins.map((a) =>
        a.id === editingAdmin.id
          ? {
              ...a,
              name: formData.name,
              email: formData.email,
              collegeName: formData.collegeName,
              experience: parseInt(formData.experience) || 0,
              hasPhD: formData.hasPhD,
            }
          : a
      );

      saveAdmins(updated);
      toast({ title: 'Administrator Updated' });
    } else {
      const newAdmin: Administrator = {
        id: Math.random().toString(36).substring(2, 9),
        name: formData.name,
        email: formData.email,
        collegeName: formData.collegeName,
        experience: parseInt(formData.experience) || 0,
        hasPhD: formData.hasPhD,
        joinDate: new Date().toISOString().split('T')[0],
      };

      saveAdmins([...admins, newAdmin]);
      toast({ title: 'Administrator Added' });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const admin = admins.find((a) => a.id === id);
    saveAdmins(admins.filter((a) => a.id !== id));
    toast({ title: 'Removed', description: admin?.name });
  };

  const openEdit = (admin: Administrator) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      collegeName: admin.collegeName,
      experience: admin.experience.toString(),
      hasPhD: admin.hasPhD,
    });
    setIsDialogOpen(true);
  };

  /* ================= FILTER ================= */

  const filteredAdmins = admins.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.collegeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ================= STATS ================= */

  const stats = {
    total: admins.length,
    withPhD: admins.filter((a) => a.hasPhD).length,
  };

  /* ================= UI ================= */

  return (
    <DashboardLayout title="Administrator" subtitle="" currentPath="/add">
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Administrator Management</h1>
            <p className="text-muted-foreground">Manage college administrators</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" /> Add Administrator
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingAdmin ? 'Edit Administrator' : 'Add Administrator'}
                </DialogTitle>
                <DialogDescription>Administrator details</DialogDescription>
              </DialogHeader>

              {/* FORM */}
              <div className="space-y-4 py-4">
                <div>
                  <Label>Name *</Label>
                  <Input value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>

                <div>
                  <Label>Email *</Label>
                  <Input type="email" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>

                <div>
                  <Label>College Name *</Label>
                  <Input value={formData.collegeName}
                    onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })} />
                </div>

                <div>
                  <Label>Experience (Years)</Label>
                  <Input type="number" value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })} />
                </div>

                <div className="flex gap-2 items-center">
                  <input type="checkbox"
                    checked={formData.hasPhD}
                    onChange={(e) => setFormData({ ...formData, hasPhD: e.target.checked })} />
                  <Label className="font-normal">Has PhD / Doctorate</Label>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-6 flex gap-4">
              <Users />
              <div>
                <p>Total Administrators</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex gap-4">
              <GraduationCap />
              <div>
                <p>With PhD</p>
                <p className="text-2xl font-bold">{stats.withPhD}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SEARCH */}
        <Input
          placeholder="Search by name, email or college..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* TABLE */}
        <Card>
          <CardHeader>
            <CardTitle>Administrators</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Administrator</TableHead>
                  <TableHead>College</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>PhD</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredAdmins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No administrators found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAdmins.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>
                        <div className="flex gap-3 items-center">
                          <Avatar>
                            <AvatarFallback>
                              {a.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{a.name}</p>
                            <p className="text-sm text-muted-foreground">{a.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{a.collegeName}</TableCell>
                      <TableCell>{a.experience} yrs</TableCell>
                      <TableCell>
                        {a.hasPhD ? <Badge>PhD</Badge> : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(a)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(a.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}
