import { useState } from 'react';
import { contactService } from '@/lib/contactService';
import userService, { User } from '@/lib/userService';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [contacts, setContacts] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userStats, setUserStats] = useState<any>(null);

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const response = await contactService.getAll();
      setContacts(response.data);
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Failed to load contacts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: 'new' | 'read' | 'replied') => {
    try {
      await contactService.updateStatus(id, status);
      loadContacts();
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      try {
        await contactService.delete(id);
        loadContacts();
      } catch (err: any) {
        setMessage(err.response?.data?.error || 'Failed to delete contact');
      }
    }
  };

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const [usersResponse, statsResponse] = await Promise.all([
        userService.getAllUsers(),
        userService.getUserStats()
      ]);
      setUsers(usersResponse);
      setUserStats(statsResponse);
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserStatusChange = async (id: string, isActive: boolean) => {
    try {
      await userService.updateUser(id, { isActive });
      loadUsers();
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Failed to update user status');
    }
  };

  const handleUserRoleChange = async (id: string, role: 'user' | 'admin') => {
    try {
      await userService.updateUser(id, { role });
      loadUsers();
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(id);
        loadUsers();
      } catch (err: any) {
        setMessage(err.response?.data?.error || 'Failed to delete user');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        </div>

      {message && (
        <Alert className="mb-6">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="contacts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contacts">Contact Management</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Contact Messages</h2>
            <Button onClick={loadContacts} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Load Contacts'}
            </Button>
          </div>

          <div className="grid gap-4">
            {contacts.map((contact) => (
              <Card key={contact._id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>{contact.name}</span>
                    <Badge variant={
                      contact.status === 'new' ? 'default' : 
                      contact.status === 'read' ? 'secondary' : 
                      'outline'
                    }>
                      {contact.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{contact.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p><strong>Subject:</strong> {contact.subject}</p>
                    <p><strong>Message:</strong> {contact.message}</p>
                    {contact.phone && <p><strong>Phone:</strong> {contact.phone}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={contact.status}
                      onValueChange={(value) => handleStatusChange(contact._id, value as any)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="replied">Replied</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(contact._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">User Management</h2>
            <Button onClick={loadUsers} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Load Users'}
            </Button>
          </div>

          {userStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userStats.totalUsers}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{userStats.activeUsers}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{userStats.adminUsers}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">New Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{userStats.newUsers}</div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid gap-4">
            {users.map((user) => (
              <Card key={user._id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>{user.name}</span>
                    <div className="flex gap-2">
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                      <Badge variant={user.isActive ? 'default' : 'destructive'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
                    <p><strong>Orders:</strong> {user.ordersCount || 0}</p>
                    <p><strong>Total Spent:</strong> ${user.totalSpent || 0}</p>
                    <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Select
                      value={user.role}
                      onValueChange={(value) => handleUserRoleChange(user._id, value as 'user' | 'admin')}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant={user.isActive ? "destructive" : "default"}
                      size="sm"
                      onClick={() => handleUserStatusChange(user._id, !user.isActive)}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
