import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(email, password);

    if (success) {
      toast({
        title: 'Login successful',
        description: 'Welcome to FPMS!',
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password.',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-lg">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold text-foreground">FPMS</h1>
          <p className="mt-1 text-muted-foreground">Faculty Performance Management System</p>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-display">Sign in</CardTitle>
            <CardDescription>Enter your credentials to access the system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="faculty@demo.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 rounded-lg bg-muted/50 p-4">
              <p className="text-sm font-medium text-foreground mb-2">Demo Credentials</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>
                  <strong>Faculty:</strong> faculty@demo.edu / faculty123
                </p>
                <p>
                  <strong>HOD:</strong> hod@demo.edu / hod123
                </p>
                <p>
                  <strong>Committee:</strong> committee@demo.edu / committee123
                </p>
                <p>
                  <strong>Admin:</strong> admin@demo.edu / admin123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}