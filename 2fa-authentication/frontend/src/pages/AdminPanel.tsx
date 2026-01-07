import { useState, useEffect } from 'react';
import { api, Tool, User, Statistics } from '@/lib/api';
import { MainLayout } from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  Loader2,
  Check,
  X,
  Users,
  Wrench,
  TrendingUp,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'];

export default function AdminPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingTools, setPendingTools] = useState<Tool[]>([]);
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedToolId, setSelectedToolId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [pending, tools, usersData, stats] = await Promise.all([
          api.getPendingTools(),
          api.getTools({ limit: 100 }),
          user?.role === 'admin' ? api.getAllUsers() : Promise.resolve([]),
          api.getStatistics(),
        ]);
        setPendingTools(pending);
        setAllTools(tools.tools);
        setUsers(usersData);
        setStatistics(stats);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load admin data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast, user?.role]);

  const handleApprove = async (id: number) => {
    setProcessingId(id);
    try {
      await api.approveTool(id);
      setPendingTools((prev) => prev.filter((t) => t.id !== id));
      toast({ title: 'Tool approved successfully' });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to approve',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectDialog = (id: number) => {
    setSelectedToolId(id);
    setRejectReason('');
    setRejectDialogOpen(true);
  };

  const handleReject = async () => {
    if (!selectedToolId) return;
    setProcessingId(selectedToolId);
    try {
      await api.rejectTool(selectedToolId, rejectReason);
      setPendingTools((prev) => prev.filter((t) => t.id !== selectedToolId));
      setRejectDialogOpen(false);
      toast({ title: 'Tool rejected' });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to reject',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleRoleChange = async (userId: number, role: string) => {
    try {
      await api.updateUserRole(userId, role);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: role as User['role'] } : u))
      );
      toast({ title: 'User role updated' });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update role',
        variant: 'destructive',
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'moderator':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">
            Manage tools, users, and view statistics
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="h-4 w-4" />
              Pending
              {pendingTools.length > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                  {pendingTools.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="tools" className="gap-2">
              <Wrench className="h-4 w-4" />
              All Tools
            </TabsTrigger>
            {user?.role === 'admin' && (
              <TabsTrigger value="users" className="gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
            )}
            <TabsTrigger value="statistics" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Statistics
            </TabsTrigger>
          </TabsList>

          {/* Pending Tools Tab */}
          <TabsContent value="pending" className="space-y-4">
            {pendingTools.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <Check className="h-12 w-12 text-success mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                  <p className="text-muted-foreground">No pending tools to review.</p>
                </CardContent>
              </Card>
            ) : (
              pendingTools.map((tool) => (
                <Card key={tool.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        <CardDescription className="mt-1">
                          Submitted by {tool.created_by} on{' '}
                          {format(new Date(tool.created_at), 'MMM d, yyyy')}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <a href={tool.url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Visit
                          </Button>
                        </a>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleApprove(tool.id)}
                          disabled={processingId === tool.id}
                        >
                          {processingId === tool.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openRejectDialog(tool.id)}
                          disabled={processingId === tool.id}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{tool.description}</p>
                    <Badge variant={tool.category as any}>{tool.category}</Badge>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* All Tools Tab */}
          <TabsContent value="tools">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allTools.map((tool) => (
                      <TableRow key={tool.id}>
                        <TableCell className="font-medium">{tool.name}</TableCell>
                        <TableCell>
                          <Badge variant={tool.category as any}>{tool.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={tool.status as any}>{tool.status}</Badge>
                        </TableCell>
                        <TableCell>{tool.created_by}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(tool.created_at), 'MMM d, yyyy')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          {user?.role === 'admin' && (
            <TabsContent value="users">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>2FA</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">{u.username}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>
                            <Badge variant={getRoleBadgeVariant(u.role) as any}>
                              {u.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {u.is_2fa_enabled ? (
                              <Badge variant="success">Enabled</Badge>
                            ) : (
                              <Badge variant="secondary">Disabled</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(u.created_at), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={u.role}
                              onValueChange={(value) => handleRoleChange(u.id, value)}
                              disabled={u.id === user?.id}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="moderator">Moderator</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Statistics Tab */}
          <TabsContent value="statistics">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Users by Role */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Users by Role</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={statistics?.users_by_role || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="role"
                        label={({ role, count }) => `${role}: ${count}`}
                      >
                        {statistics?.users_by_role.map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Tools by Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tools by Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={statistics?.tools_by_status || []}>
                      <XAxis dataKey="status" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Tools by Category */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tools by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={statistics?.tools_by_category || []} layout="vertical">
                      <XAxis type="number" />
                      <YAxis dataKey="category" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {statistics?.recent_activity && statistics.recent_activity.length > 0 ? (
                    <div className="space-y-3">
                      {statistics.recent_activity.slice(0, 8).map((activity, index) => (
                        <div key={index} className="flex items-start gap-3 text-sm">
                          <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                          <div className="flex-1">
                            <p>{activity.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No recent activity</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Tool</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={processingId !== null}>
              {processingId !== null && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Reject Tool
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
