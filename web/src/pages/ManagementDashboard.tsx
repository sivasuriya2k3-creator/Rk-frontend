import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  ShoppingCart,
  Plus,
  Edit,
  Trash2,
  IndianRupee,
  CheckCircle,
  ArrowLeft,
  TrendingUp,
  UserCog,
  FileText,
  Eye,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { employeeService } from '@/lib/employeeService';
import { projectService } from '@/lib/projectService';
import orderService from '@/lib/orderService';
import userService from '@/lib/userService';
import revenueService from '@/lib/revenueService';
import { applicationService } from '@/lib/applicationService';

export default function ManagementDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    employees: { totalEmployees: 0, activeEmployees: 0, onLeave: 0 },
    projects: { totalProjects: 0, activeProjects: 0, completedProjects: 0, budget: { total: 0, paid: 0 } },
    orders: { total: 0, pending: 0, completed: 0 },
    users: { totalUsers: 0, activeUsers: 0, usersWithOrders: 0 },
    revenue: { today: 0, week: 0, month: 0 }
  });

  // Data
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [revenueChart, setRevenueChart] = useState([]);
  const [applications, setApplications] = useState([]);

  // Dialogs
  const [employeeDialog, setEmployeeDialog] = useState(false);
  const [projectDialog, setProjectDialog] = useState(false);
  const [userDialog, setUserDialog] = useState(false);
  const [orderStatusDialog, setOrderStatusDialog] = useState(false);
  const [applicationDialog, setApplicationDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [editingApplication, setEditingApplication] = useState<any>(null);
  const [newEmployeeData, setNewEmployeeData] = useState<any>(null);

  // Form data
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: '',
    status: 'Active'
  });

  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    category: '',
    status: 'Planning',
    priority: 'Medium',
    budget: '',
    startDate: '',
    deadline: '',
    clientName: '',
    clientEmail: '',
    clientPhone: ''
  });

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    isActive: true
  });

  const [orderStatusForm, setOrderStatusForm] = useState({
    status: '',
    notes: ''
  });

  const [applicationStatusForm, setApplicationStatusForm] = useState({
    adminNotes: '',
    salary: '',
    joiningDate: ''
  });

  const [employeeConfirmationForm, setEmployeeConfirmationForm] = useState({
    salary: ''
  });

  // Redirect if not admin
  useEffect(() => {
    if (!user) return; // Wait for user to load
    
    setIsInitialized(true);
    
    if (user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Load data
  useEffect(() => {
    if (!isInitialized || !user) return; // Wait for initialization
    
    if (activeTab === 'overview' || activeTab === 'employees') {
      loadEmployees();
      loadEmployeeStats();
    }
    if (activeTab === 'overview' || activeTab === 'projects') {
      loadProjects();
      loadProjectStats();
    }
    if (activeTab === 'overview' || activeTab === 'orders') {
      loadOrders();
    }
    if (activeTab === 'overview' || activeTab === 'users') {
      loadUsers();
      loadUserStats();
    }
    if (activeTab === 'overview' || activeTab === 'revenue') {
      loadRevenue();
    }
    if (activeTab === 'overview' || activeTab === 'applications') {
      loadApplications();
    }
  }, [activeTab, isInitialized, user]);

  const loadEmployees = async () => {
    try {
      const response = await employeeService.getAll();
      setEmployees(response.data || []);
    } catch (err: any) {
      console.error('Load employees error:', err);
    }
  };

  const loadEmployeeStats = async () => {
    try {
      const response = await employeeService.getStats();
      setStats(prev => ({ ...prev, employees: response.data }));
    } catch (err: any) {
      console.error('Load employee stats error:', err);
    }
  };

  const loadProjects = async () => {
    try {
      const response = await projectService.getAll();
      setProjects(response.data || []);
    } catch (err: any) {
      console.error('Load projects error:', err);
    }
  };

  const loadProjectStats = async () => {
    try {
      const response = await projectService.getStats();
      setStats(prev => ({ ...prev, projects: response.data }));
    } catch (err: any) {
      console.error('Load project stats error:', err);
    }
  };

  const loadOrders = async () => {
    try {
      console.log('Loading orders...');
      const response = await orderService.getAllOrdersAdmin();
      console.log('Orders loaded:', response);
      setOrders(response || []);
      
      // Calculate order stats
      const total = response?.length || 0;
      const pending = response?.filter((o: any) => o.status === 'pending').length || 0;
      const completed = response?.filter((o: any) => o.status === 'completed').length || 0;
      
      setStats(prev => ({ ...prev, orders: { total, pending, completed } }));
    } catch (err: any) {
      console.error('Load orders error:', err);
      console.error('Error details:', err.response?.data);
      setError('Failed to load orders: ' + (err.response?.data?.message || err.message));
    }
  };

  const loadUsers = async () => {
    try {
      console.log('Loading users...');
      const response = await userService.getAllUsers();
      console.log('Users loaded:', response);
      setUsers(response || []);
    } catch (err: any) {
      console.error('Load users error:', err);
      console.error('Error details:', err.response?.data);
      setError('Failed to load users: ' + (err.response?.data?.message || err.message));
    }
  };

  const loadUserStats = async () => {
    try {
      console.log('Loading user stats...');
      const response = await userService.getUserStats();
      console.log('User stats loaded:', response);
      setStats(prev => ({ 
        ...prev, 
        users: { 
          totalUsers: response.totalUsers, 
          activeUsers: response.activeUsers, 
          usersWithOrders: response.usersWithOrders 
        } 
      }));
    } catch (err: any) {
      console.error('Load user stats error:', err);
      console.error('Error details:', err.response?.data);
    }
  };

  const loadRevenue = async () => {
    try {
      console.log('Loading revenue...');
      const response = await revenueService.getRevenueStats();
      console.log('Revenue loaded:', response);
      setRevenueData(response);
      setRevenueChart(response.chart || []);
      setStats(prev => ({ 
        ...prev, 
        revenue: { 
          today: response.today?.revenue || 0, 
          week: response.week?.revenue || 0, 
          month: response.month?.revenue || 0 
        } 
      }));
    } catch (err: any) {
      console.error('Load revenue error:', err);
      console.error('Error details:', err.response?.data);
      setError('Failed to load revenue: ' + (err.response?.data?.message || err.message));
    }
  };

  const loadApplications = async () => {
    try {
      const response = await applicationService.getAllApplications();
      setApplications(response.applications || []);
    } catch (err: any) {
      console.error('Load applications error:', err);
      setError('Failed to load applications');
    }
  };

  const handleApplicationAction = async (id: string, action: 'accept' | 'reject') => {
    try {
      setLoading(true);
      setError(''); // Clear any previous errors

      const notes = applicationStatusForm.adminNotes;

      if (action === 'accept') {
        let salary = undefined;
        const joiningDate = applicationStatusForm.joiningDate && applicationStatusForm.joiningDate.trim() !== '' ? applicationStatusForm.joiningDate : undefined;

        // Parse salary safely
        if (applicationStatusForm.salary && applicationStatusForm.salary.trim() !== '') {
          const parsedSalary = parseInt(applicationStatusForm.salary.trim());
          if (!isNaN(parsedSalary) && parsedSalary > 0) {
            salary = parsedSalary;
          } else {
            setError('Please enter a valid salary amount');
            return;
          }
        }

        console.log('Accepting application with data:', { id, notes, salary, joiningDate });

        const result = await applicationService.acceptApplication(id, notes, salary, joiningDate);

        console.log('Application acceptance result:', result);

        if (result.data && result.data.employee) {
          // Employee was created, show confirmation within the same dialog
          console.log('Employee created:', result.data.employee);
          setNewEmployeeData(result.data.employee);
          setEmployeeConfirmationForm({ salary: result.data.employee.salary.toString() });
          // Don't close the application dialog - show confirmation within it
          setSuccess('Employee created successfully. Please confirm the details below.');
        } else {
          console.log('No employee data in response, but application accepted');
          setSuccess('Application accepted successfully');
          // Close the application dialog since no confirmation needed
          setApplicationDialog(false);
          setEditingApplication(null);
          setApplicationStatusForm({ adminNotes: '', salary: '', joiningDate: '' });
          loadApplications();
        }

        // Refresh employees list after accepting application
        await loadEmployees();
        await loadEmployeeStats();
      } else {
        console.log('Rejecting application:', id);
        await applicationService.rejectApplication(id, notes);
        setSuccess('Application rejected');

        // Close the application dialog
        setApplicationDialog(false);
        setEditingApplication(null);
        setApplicationStatusForm({ adminNotes: '', salary: '', joiningDate: '' });
        loadApplications();
      }

    } catch (err: any) {
      console.error('Application action error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Action failed';
      setError(errorMessage);
      // Don't close the dialog on error so user can try again
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeConfirmation = async (action: 'confirm' | 'cancel') => {
    console.log('Handling employee confirmation:', action, newEmployeeData);
    try {
      setLoading(true);
      
      if (!newEmployeeData || !newEmployeeData._id) {
        console.error('Employee data not available:', newEmployeeData);
        setError('Employee data not available');
        return;
      }
      
      if (action === 'confirm') {
        // Update employee salary if changed
        const newSalary = parseInt(employeeConfirmationForm.salary);
        const currentSalary = parseInt(newEmployeeData.salary);
        
        if (!isNaN(newSalary) && newSalary !== currentSalary) {
          await employeeService.update(newEmployeeData._id, { salary: newSalary });
          setSuccess('Employee salary updated successfully');
        } else {
          setSuccess('Employee confirmed successfully');
        }
      } else {
        // Cancel: delete the employee
        await employeeService.delete(newEmployeeData._id);
        setSuccess('Employee creation cancelled');
      }
      
      // Refresh data
      loadEmployees();
      loadEmployeeStats();
      
      // Close dialogs and refresh
      setApplicationDialog(false);
      setEditingApplication(null);
      setApplicationStatusForm({ adminNotes: '', salary: '', joiningDate: '' });
      setNewEmployeeData(null);
      setEmployeeConfirmationForm({ salary: '' });
      loadApplications();
    } catch (err: any) {
      console.error('Employee confirmation error:', err);
      setError(err.response?.data?.error || 'Failed to process employee confirmation');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (editingEmployee) {
        await employeeService.update(editingEmployee._id, employeeForm);
        setSuccess('Employee updated successfully');
      } else {
        await employeeService.create(employeeForm);
        setSuccess('Employee created successfully');
      }
      
      setEmployeeDialog(false);
      resetEmployeeForm();
      loadEmployees();
      loadEmployeeStats();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    
    try {
      await employeeService.delete(id);
      setSuccess('Employee deleted successfully');
      loadEmployees();
      loadEmployeeStats();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete employee');
    }
  };

  const handleCreateProject = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Transform form data to match backend schema
      const projectData = {
        ...projectForm,
        client: {
          name: projectForm.clientName,
          email: projectForm.clientEmail,
          phone: projectForm.clientPhone
        }
      };
      
      // Remove the flattened client fields
      delete (projectData as any).clientName;
      delete (projectData as any).clientEmail;
      delete (projectData as any).clientPhone;
      
      if (editingProject) {
        await projectService.update(editingProject._id, projectData);
        setSuccess('Project updated successfully');
      } else {
        await projectService.create(projectData);
        setSuccess('Project created successfully');
      }
      
      setProjectDialog(false);
      resetProjectForm();
      loadProjects();
      loadProjectStats();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await projectService.delete(id);
      setSuccess('Project deleted successfully');
      loadProjects();
      loadProjectStats();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete project');
    }
  };

  const handleUpdateUser = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (editingUser) {
        const updateData = {
          name: userForm.name,
          email: userForm.email,
          phone: userForm.phone,
          role: userForm.role as 'user' | 'admin',
          isActive: userForm.isActive
        };
        await userService.updateUser(editingUser._id, updateData);
        setSuccess('User updated successfully');
      }
      
      setUserDialog(false);
      setEditingUser(null);
      setUserForm({ name: '', email: '', phone: '', role: 'user', isActive: true });
      loadUsers();
      loadUserStats();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    
    try {
      await userService.deleteUser(id);
      setSuccess('User deleted successfully');
      loadUsers();
      loadUserStats();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleUpdateOrderStatus = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      if (!editingOrder) {
        setError('No order selected');
        return;
      }

      if (!orderStatusForm.status) {
        setError('Please select a status');
        return;
      }

      console.log('Updating order status:', {
        orderId: editingOrder._id,
        newStatus: orderStatusForm.status,
        notes: orderStatusForm.notes
      });
      
      const response = await orderService.updateOrderStatus(
        editingOrder._id, 
        orderStatusForm.status as 'pending' | 'completed' | 'in-progress' | 'review' | 'cancelled', 
        orderStatusForm.notes
      );
      
      console.log('Order status update response:', response);
      setSuccess('Order status updated successfully');
      
      // Close dialog and reset form
      setOrderStatusDialog(false);
      setEditingOrder(null);
      setOrderStatusForm({ status: '', notes: '' });
      
      // Reload orders to show updated data
      await loadOrders();
    } catch (err: any) {
      console.error('Update order status error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.error || err.message || 'Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const handleEditEmployee = (employee: any) => {
    setEditingEmployee(employee);
    setEmployeeForm({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      salary: employee.salary.toString(),
      status: employee.status
    });
    setEmployeeDialog(true);
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      category: project.category,
      status: project.status,
      priority: project.priority,
      budget: project.budget.toString(),
      startDate: new Date(project.startDate).toISOString().split('T')[0],
      deadline: new Date(project.deadline).toISOString().split('T')[0],
      clientName: project.client?.name || '',
      clientEmail: project.client?.email || '',
      clientPhone: project.client?.phone || ''
    });
    setProjectDialog(true);
  };

  const resetEmployeeForm = () => {
    setEmployeeForm({
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      salary: '',
      status: 'Active'
    });
    setEditingEmployee(null);
  };

  const resetProjectForm = () => {
    setProjectForm({
      title: '',
      description: '',
      category: '',
      status: 'Planning',
      priority: 'Medium',
      budget: '',
      startDate: '',
      deadline: '',
      clientName: '',
      clientEmail: '',
      clientPhone: ''
    });
    setEditingProject(null);
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      'Active': 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30',
      'On Leave': 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
      'Inactive': 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30',
      'Planning': 'bg-slate-700/20 text-slate-300 dark:text-slate-200 border-slate-700/30',
      'In Progress': 'bg-slate-700/20 text-slate-300 dark:text-slate-200 border-slate-700/30',
      'in-progress': 'bg-slate-700/20 text-slate-300 dark:text-slate-200 border-slate-700/30',
      'Completed': 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30',
      'completed': 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30',
      'On Hold': 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30',
      'pending': 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
      'review': 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30',
      'cancelled': 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30';
  };

  const getPriorityColor = (priority: string) => {
    const colors: any = {
      'Low': 'bg-blue-500/20 text-blue-500 border-blue-500/50',
      'Medium': 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50',
      'High': 'bg-orange-500/20 text-orange-500 border-orange-500/50',
      'Urgent': 'bg-red-500/20 text-red-500 border-red-500/50'
    };
    return colors[priority] || 'bg-gray-500/20 text-gray-500 border-gray-500/50';
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-4">You need admin privileges to access this page.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="mb-4 md:mb-8 gap-2 text-xs md:text-sm py-1 md:py-2 px-2 md:px-4 h-8 md:h-10"
          >
            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </Button>
          
          <div className="flex items-center justify-between gap-2 md:gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">
                Management <span className="gradient-text">Dashboard</span>
              </h1>
              <p className="text-xs md:text-base text-muted-foreground">
                Manage employees, projects, and orders
              </p>
            </div>
            <LayoutDashboard className="w-8 h-8 md:w-12 md:h-12 text-accent flex-shrink-0" />
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 bg-green-900/20 border-green-500/50">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-500">{success}</AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-7 gap-1 md:gap-0 bg-black p-1 md:p-0 h-auto md:h-auto">
            <TabsTrigger value="overview" className="text-xs md:text-sm text-[#D4AF37] data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black py-2 md:py-3 px-1 md:px-4">
              <LayoutDashboard className="w-3 h-3 md:w-4 md:h-4 mr-0 md:mr-2" />
              <span className="hidden md:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs md:text-sm text-[#D4AF37] data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black py-2 md:py-3 px-1 md:px-4">
              <UserCog className="w-3 h-3 md:w-4 md:h-4 mr-0 md:mr-2" />
              <span className="hidden md:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="employees" className="text-xs md:text-sm text-[#D4AF37] data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black py-2 md:py-3 px-1 md:px-4">
              <Users className="w-3 h-3 md:w-4 md:h-4 mr-0 md:mr-2" />
              <span className="hidden md:inline">Employees</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="text-xs md:text-sm text-[#D4AF37] data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black py-2 md:py-3 px-1 md:px-4">
              <FileText className="w-3 h-3 md:w-4 md:h-4 mr-0 md:mr-2" />
              <span className="hidden md:inline">Apps</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="text-xs md:text-sm text-[#D4AF37] data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black py-2 md:py-3 px-1 md:px-4">
              <FolderKanban className="w-3 h-3 md:w-4 md:h-4 mr-0 md:mr-2" />
              <span className="hidden md:inline">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-xs md:text-sm text-[#D4AF37] data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black py-2 md:py-3 px-1 md:px-4">
              <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 mr-0 md:mr-2" />
              <span className="hidden md:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="revenue" className="text-xs md:text-sm text-[#D4AF37] data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black py-2 md:py-3 px-1 md:px-4">
              <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-0 md:mr-2" />
              <span className="hidden md:inline">Revenue</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {/* Employee Stats */}
              <Card className="border-border bg-card hover:shadow-gold transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 py-3 md:py-4">
                  <CardTitle className="text-xs md:text-sm font-medium">Total Employees</CardTitle>
                  <Users className="h-3 w-3 md:h-4 md:w-4 text-accent" />
                </CardHeader>
                <CardContent className="pb-2 md:pb-4">
                  <div className="text-xl md:text-2xl font-bold">{stats.employees.totalEmployees || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.employees.activeEmployees || 0} active, {stats.employees.onLeave || 0} on leave
                  </p>
                </CardContent>
              </Card>

              {/* Project Stats */}
              <Card className="border-border bg-card hover:shadow-gold transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 py-3 md:py-4">
                  <CardTitle className="text-xs md:text-sm font-medium">Total Projects</CardTitle>
                  <FolderKanban className="h-3 w-3 md:h-4 md:w-4 text-accent" />
                </CardHeader>
                <CardContent className="pb-2 md:pb-4">
                  <div className="text-xl md:text-2xl font-bold">{stats.projects.totalProjects || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.projects.activeProjects || 0} active, {stats.projects.completedProjects || 0} completed
                  </p>
                </CardContent>
              </Card>

              {/* Order Stats */}
              <Card className="border-border bg-card hover:shadow-gold transition-shadow sm:col-span-2 lg:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2 py-3 md:py-4">
                  <CardTitle className="text-xs md:text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 text-accent" />
                </CardHeader>
                <CardContent className="pb-2 md:pb-4">
                  <div className="text-xl md:text-2xl font-bold">{stats.orders.total || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.orders.pending || 0} pending, {stats.orders.completed || 0} completed
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Card */}
            {stats.projects.budget && (
              <Card className="border-border bg-card">
                <CardHeader className="py-3 md:py-4">
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                    <IndianRupee className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                    Revenue Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 md:space-y-4">
                  <div className="flex justify-between items-center text-xs md:text-sm">
                    <span className="text-muted-foreground">Total Budget</span>
                    <span className="text-lg md:text-2xl font-bold gradient-text">
                      ₹{stats.projects.budget.total?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs md:text-sm">
                    <span className="text-muted-foreground">Amount Paid</span>
                    <span className="text-base md:text-xl font-semibold text-green-500">
                      ₹{stats.projects.budget.paid?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs md:text-sm">
                    <span className="text-muted-foreground">Pending Payment</span>
                    <span className="text-base md:text-xl font-semibold text-yellow-500">
                      ₹{((stats.projects.budget.total || 0) - (stats.projects.budget.paid || 0)).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Employees Tab */}
          <TabsContent value="employees" className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
              <h2 className="text-xl md:text-2xl font-bold">Employee Management</h2>
              <Dialog open={employeeDialog} onOpenChange={(open) => {
                setEmployeeDialog(open);
                if (!open) resetEmployeeForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-accent hover:bg-accent/90 w-full sm:w-auto text-xs md:text-sm py-1 md:py-2 px-2 md:px-4 h-8 md:h-10">
                    <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Add Employee</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl w-[95vw] md:w-full max-h-[90vh] overflow-y-auto bg-card border-border">
                  <DialogHeader>
                    <DialogTitle>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
                    <DialogDescription>
                      Fill in the employee details below
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 py-3 md:py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs md:text-sm">Full Name *</Label>
                      <Input
                        id="name"
                        value={employeeForm.name}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                        placeholder="John Doe"
                        className="text-xs md:text-sm h-8 md:h-10"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs md:text-sm">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={employeeForm.email}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                        placeholder="john@example.com"
                        className="text-xs md:text-sm h-8 md:h-10"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs md:text-sm">Phone *</Label>
                      <Input
                        id="phone"
                        value={employeeForm.phone}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                        placeholder="+1 234 567 8900"
                        className="text-xs md:text-sm h-8 md:h-10"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-xs md:text-sm">Position *</Label>
                      <Select value={employeeForm.position} onValueChange={(value) => setEmployeeForm({ ...employeeForm, position: value })}>
                        <SelectTrigger className="text-xs md:text-sm h-8 md:h-10">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Developer" className="text-xs md:text-sm">Developer</SelectItem>
                          <SelectItem value="Designer" className="text-xs md:text-sm">Designer</SelectItem>
                          <SelectItem value="3D Artist" className="text-xs md:text-sm">3D Artist</SelectItem>
                          <SelectItem value="UI/UX Designer" className="text-xs md:text-sm">UI/UX Designer</SelectItem>
                          <SelectItem value="Project Manager" className="text-xs md:text-sm">Project Manager</SelectItem>
                          <SelectItem value="Marketing" className="text-xs md:text-sm">Marketing</SelectItem>
                          <SelectItem value="Sales" className="text-xs md:text-sm">Sales</SelectItem>
                          <SelectItem value="HR" className="text-xs md:text-sm">HR</SelectItem>
                          <SelectItem value="Other" className="text-xs md:text-sm">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-xs md:text-sm">Department *</Label>
                      <Select value={employeeForm.department} onValueChange={(value) => setEmployeeForm({ ...employeeForm, department: value })}>
                        <SelectTrigger className="text-xs md:text-sm h-8 md:h-10">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Development" className="text-xs md:text-sm">Development</SelectItem>
                          <SelectItem value="Design" className="text-xs md:text-sm">Design</SelectItem>
                          <SelectItem value="3D Animation" className="text-xs md:text-sm">3D Animation</SelectItem>
                          <SelectItem value="UI/UX" className="text-xs md:text-sm">UI/UX</SelectItem>
                          <SelectItem value="Management" className="text-xs md:text-sm">Management</SelectItem>
                          <SelectItem value="Marketing" className="text-xs md:text-sm">Marketing</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="HR">HR</SelectItem>
                          <SelectItem value="Operations">Operations</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="salary">Salary *</Label>
                      <Input
                        id="salary"
                        type="number"
                        value={employeeForm.salary}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, salary: e.target.value })}
                        placeholder="50000"
                      />
                    </div>
                    
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="status">Status *</Label>
                      <Select value={employeeForm.status} onValueChange={(value) => setEmployeeForm({ ...employeeForm, status: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="On Leave">On Leave</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEmployeeDialog(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateEmployee}
                      disabled={loading}
                      className="bg-accent hover:bg-accent/90"
                    >
                      {loading ? 'Saving...' : editingEmployee ? 'Update Employee' : 'Create Employee'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="border-border bg-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">Name</TableHead>
                        <TableHead className="text-xs md:text-sm hidden sm:table-cell">Email</TableHead>
                        <TableHead className="text-xs md:text-sm">Position</TableHead>
                        <TableHead className="text-xs md:text-sm hidden md:table-cell">Department</TableHead>
                        <TableHead className="text-xs md:text-sm hidden lg:table-cell">Salary</TableHead>
                        <TableHead className="text-xs md:text-sm">Status</TableHead>
                        <TableHead className="text-xs md:text-sm text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-6 md:py-8 text-xs md:text-sm">
                            No employees found. Add your first employee to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        employees.map((employee: any) => (
                          <TableRow key={employee._id}>
                            <TableCell className="font-medium text-xs md:text-sm">{employee.name}</TableCell>
                            <TableCell className="text-muted-foreground text-xs md:text-sm hidden sm:table-cell">{employee.email}</TableCell>
                            <TableCell className="text-xs md:text-sm">{employee.position}</TableCell>
                            <TableCell className="text-xs md:text-sm hidden md:table-cell">{employee.department}</TableCell>
                            <TableCell className="text-xs md:text-sm hidden lg:table-cell">₹{employee.salary.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(employee.status)} text-xs md:text-sm`}>
                                {employee.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1 md:gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditEmployee(employee)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteEmployee(employee._id)}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
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
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
              <h2 className="text-xl md:text-2xl font-bold">Job Applications</h2>
              <div className="flex gap-2">
                <Badge variant="outline" className="py-1 md:py-2 px-2 md:px-3 text-xs md:text-sm">
                  Total: {applications.length}
                </Badge>
              </div>
            </div>

            <Card className="border-border bg-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">Name</TableHead>
                        <TableHead className="text-xs md:text-sm hidden sm:table-cell">Email</TableHead>
                        <TableHead className="text-xs md:text-sm hidden md:table-cell">Phone</TableHead>
                        <TableHead className="text-xs md:text-sm">Position</TableHead>
                        <TableHead className="text-xs md:text-sm hidden lg:table-cell">Experience</TableHead>
                        <TableHead className="text-xs md:text-sm">Status</TableHead>
                        <TableHead className="text-xs md:text-sm text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-6 md:py-8 text-xs md:text-sm">
                            No applications yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        applications.map((app: any) => (
                          <TableRow key={app._id}>
                            <TableCell className="font-medium text-xs md:text-sm">{app.name}</TableCell>
                            <TableCell className="text-muted-foreground text-xs md:text-sm hidden sm:table-cell">{app.email}</TableCell>
                            <TableCell className="text-xs md:text-sm hidden md:table-cell">{app.phone}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="text-xs md:text-sm">{app.position}</Badge>
                            </TableCell>
                            <TableCell className="text-xs md:text-sm hidden lg:table-cell">{app.experience}</TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(app.status)} text-xs md:text-sm`}>
                                {app.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1 md:gap-2">
                                <Dialog open={applicationDialog && editingApplication?._id === app._id} onOpenChange={(open) => {
                                  if (open) {
                                    setEditingApplication(app);
                                  } else {
                                    setApplicationDialog(false);
                                    setEditingApplication(null);
                                    setNewEmployeeData(null);
                                    setEmployeeConfirmationForm({ salary: '' });
                                  }
                                }}>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setEditingApplication(app);
                                        setApplicationDialog(true);
                                      }}
                                      className="h-7 md:h-8 px-2"
                                    >
                                      <Eye className="w-3 h-3 md:w-4 md:h-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-3xl w-[95vw] md:w-full max-h-[90vh] overflow-y-auto bg-card border-border">
                                    <DialogHeader>
                                      <DialogTitle>Application Details</DialogTitle>
                                      <DialogDescription>
                                        Review the application and provide your decision
                                      </DialogDescription>
                                    </DialogHeader>
                                    
                                    {editingApplication && (
                                      <div className="space-y-6 py-4">
                                        {/* Personal Information */}
                                        <div className="border-b pb-4">
                                          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <Label className="text-muted-foreground">Name</Label>
                                              <p className="mt-1 font-medium">{editingApplication.name}</p>
                                            </div>
                                            <div>
                                              <Label className="text-muted-foreground">Email</Label>
                                              <p className="mt-1 font-medium">{editingApplication.email}</p>
                                            </div>
                                            <div>
                                              <Label className="text-muted-foreground">Phone</Label>
                                              <p className="mt-1 font-medium">{editingApplication.phone}</p>
                                            </div>
                                            <div>
                                              <Label className="text-muted-foreground">Education</Label>
                                              <p className="mt-1 font-medium">{editingApplication.education}</p>
                                            </div>
                                          </div>
                                          {/* Profile Photo */}
                                          {editingApplication.profilePhoto && (
                                            <div className="mt-4">
                                              <Label className="text-muted-foreground">Profile Photo</Label>
                                              <div className="mt-2">
                                                <img
                                                  src={`https://rk-backend.vercel.app${editingApplication.profilePhoto}`}
                                                  alt={`${editingApplication.name}'s profile`}
                                                  className="w-24 h-24 rounded-full object-cover border-2 border-border"
                                                  onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          )}
                                        </div>

                                        {/* Position Details */}
                                        <div className="border-b pb-4">
                                          <h3 className="text-lg font-semibold mb-4">Position Details</h3>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <Label className="text-muted-foreground">Position</Label>
                                              <p className="mt-1 font-medium">{editingApplication.position}</p>
                                            </div>
                                            <div>
                                              <Label className="text-muted-foreground">Department</Label>
                                              <p className="mt-1 font-medium">{editingApplication.department}</p>
                                            </div>
                                            <div>
                                              <Label className="text-muted-foreground">Experience</Label>
                                              <p className="mt-1 font-medium">{editingApplication.experience}</p>
                                            </div>
                                            <div>
                                              <Label className="text-muted-foreground">Expected Salary</Label>
                                              <p className="mt-1 font-medium">₹{editingApplication.expectedSalary?.toLocaleString() || 'Not specified'}</p>
                                            </div>
                                            <div className="col-span-2">
                                              <Label className="text-muted-foreground">Work Preference</Label>
                                              <p className="mt-1 font-medium">{editingApplication.workPreference}</p>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Skills & Documents */}
                                        <div className="border-b pb-4">
                                          <h3 className="text-lg font-semibold mb-4">Skills & Documents</h3>
                                          <div className="space-y-4">
                                            <div>
                                              <Label className="text-muted-foreground">Skills</Label>
                                              <p className="mt-2 whitespace-pre-wrap text-sm">{editingApplication.skills}</p>
                                            </div>
                                            <div>
                                              <Label className="text-muted-foreground">Portfolio URL</Label>
                                              {editingApplication.portfolio ? (
                                                <a href={editingApplication.portfolio} target="_blank" rel="noopener noreferrer" className="mt-1 text-accent hover:underline block">
                                                  {editingApplication.portfolio}
                                                </a>
                                              ) : (
                                                <p className="mt-1 text-muted-foreground">Not provided</p>
                                              )}
                                            </div>
                                            <div>
                                              <Label className="text-muted-foreground">Resume URL</Label>
                                              {editingApplication.resume ? (
                                                <a href={editingApplication.resume} target="_blank" rel="noopener noreferrer" className="mt-1 text-accent hover:underline block">
                                                  {editingApplication.resume}
                                                </a>
                                              ) : (
                                                <p className="mt-1 text-muted-foreground">Not provided</p>
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        {/* Cover Letter */}
                                        <div className="border-b pb-4">
                                          <h3 className="text-lg font-semibold mb-4">Cover Letter</h3>
                                          <p className="whitespace-pre-wrap text-sm">{editingApplication.coverLetter}</p>
                                        </div>

                                        {/* Application Status & Admin Review */}
                                        <div>
                                          <h3 className="text-lg font-semibold mb-4">Application Status</h3>
                                          <div className="space-y-4">
                                            <div>
                                              <Label className="text-muted-foreground">Status</Label>
                                              <Badge className={`mt-1 ${getStatusColor(editingApplication.status)}`}>
                                                {editingApplication.status}
                                              </Badge>
                                            </div>
                                            {editingApplication.status !== 'pending' && (
                                              <>
                                                <div>
                                                  <Label className="text-muted-foreground">Reviewed By</Label>
                                                  <p className="mt-1 font-medium">{editingApplication.reviewedBy?.name || 'Admin'}</p>
                                                </div>
                                                {editingApplication.adminNotes && (
                                                  <div>
                                                    <Label className="text-muted-foreground">Admin Notes</Label>
                                                    <p className="mt-1 whitespace-pre-wrap text-sm">{editingApplication.adminNotes}</p>
                                                  </div>
                                                )}
                                              </>
                                            )}
                                          </div>
                                        </div>

                                        {/* Admin Decision (if pending) */}
                                        {editingApplication.status === 'pending' && (
                                          <div className="border-t pt-4 space-y-4">
                                            <h3 className="text-lg font-semibold">Your Decision</h3>
                                            <div className="space-y-2">
                                              <Label htmlFor="adminNotes">Admin Notes</Label>
                                              <Textarea
                                                id="adminNotes"
                                                placeholder="Add your review notes..."
                                                value={applicationStatusForm.adminNotes}
                                                onChange={(e) => setApplicationStatusForm({
                                                  ...applicationStatusForm,
                                                  adminNotes: e.target.value
                                                })}
                                                className="bg-background border-border"
                                                rows={4}
                                              />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                              <div className="space-y-2">
                                                <Label htmlFor="salary">Salary (₹)</Label>
                                                <Input
                                                  id="salary"
                                                  type="number"
                                                  placeholder={editingApplication.expectedSalary?.toString() || "50000"}
                                                  value={applicationStatusForm.salary}
                                                  onChange={(e) => setApplicationStatusForm({
                                                    ...applicationStatusForm,
                                                    salary: e.target.value
                                                  })}
                                                  className="bg-background border-border"
                                                />
                                              </div>
                                              <div className="space-y-2">
                                                <Label htmlFor="joiningDate">Joining Date</Label>
                                                <Input
                                                  id="joiningDate"
                                                  type="date"
                                                  value={applicationStatusForm.joiningDate}
                                                  onChange={(e) => setApplicationStatusForm({
                                                    ...applicationStatusForm,
                                                    joiningDate: e.target.value
                                                  })}
                                                  className="bg-background border-border"
                                                />
                                              </div>
                                            </div>
                                            <div className="flex gap-3">
                                              <Button
                                                onClick={() => handleApplicationAction(editingApplication._id, 'accept')}
                                                disabled={loading}
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                              >
                                                <ThumbsUp className="w-4 h-4 mr-2" />
                                                Accept Application
                                              </Button>
                                              <Button
                                                onClick={() => handleApplicationAction(editingApplication._id, 'reject')}
                                                disabled={loading}
                                                variant="destructive"
                                                className="flex-1"
                                              >
                                                <ThumbsDown className="w-4 h-4 mr-2" />
                                                Reject Application
                                              </Button>
                                            </div>
                                          </div>
                                        )}

                                        {/* Employee Confirmation (if employee was created) */}
                                        {newEmployeeData && (
                                          <div className="border-t pt-4 space-y-4">
                                            <h3 className="text-lg font-semibold text-green-600">Employee Created Successfully!</h3>
                                            <p className="text-sm text-muted-foreground">Please review and confirm the employee salary package.</p>
                                            
                                            {/* Employee Details */}
                                            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                                              {/* Profile Photo */}
                                              {newEmployeeData.avatar && (
                                                <div className="flex justify-center mb-4">
                                                  <img
                                                    src={`https://rk-backend.vercel.app${newEmployeeData.avatar}`}
                                                    alt={`${newEmployeeData.name}'s profile`}
                                                    className="w-20 h-20 rounded-full object-cover border-2 border-border"
                                                    onError={(e) => {
                                                      e.currentTarget.style.display = 'none';
                                                    }}
                                                  />
                                                </div>
                                              )}
                                              <div className="flex justify-between items-center">
                                                <span className="font-medium">Name:</span>
                                                <span>{newEmployeeData.name || 'N/A'}</span>
                                              </div>
                                              <div className="flex justify-between items-center">
                                                <span className="font-medium">Email:</span>
                                                <span className="text-sm">{newEmployeeData.email || 'N/A'}</span>
                                              </div>
                                              <div className="flex justify-between items-center">
                                                <span className="font-medium">Position:</span>
                                                <span>{newEmployeeData.position || 'N/A'}</span>
                                              </div>
                                              <div className="flex justify-between items-center">
                                                <span className="font-medium">Department:</span>
                                                <span>{newEmployeeData.department || 'N/A'}</span>
                                              </div>
                                              <div className="flex justify-between items-center">
                                                <span className="font-medium">Joining Date:</span>
                                                <span>{newEmployeeData.joiningDate ? new Date(newEmployeeData.joiningDate).toLocaleDateString() : 'N/A'}</span>
                                              </div>
                                            </div>

                                            {/* Salary Input */}
                                            <div className="space-y-2">
                                              <Label htmlFor="confirmSalary" className="text-sm font-medium">
                                                Salary Package (₹)
                                              </Label>
                                              <Input
                                                id="confirmSalary"
                                                type="number"
                                                value={employeeConfirmationForm.salary || (newEmployeeData.salary ? newEmployeeData.salary.toString() : '')}
                                                onChange={(e) => setEmployeeConfirmationForm({ 
                                                  salary: e.target.value 
                                                })}
                                                placeholder="Enter salary amount"
                                                className="text-center text-lg font-semibold bg-background border-border"
                                                min="0"
                                              />
                                            </div>

                                            {/* Confirmation Buttons */}
                                            <div className="flex gap-3">
                                              <Button
                                                onClick={() => handleEmployeeConfirmation('confirm')}
                                                disabled={loading}
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                              >
                                                {loading ? 'Confirming...' : 'Confirm Employee'}
                                              </Button>
                                              <Button
                                                onClick={() => handleEmployeeConfirmation('cancel')}
                                                disabled={loading}
                                                variant="outline"
                                                className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                              >
                                                Cancel & Delete
                                              </Button>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>
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
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
              <h2 className="text-xl md:text-2xl font-bold">Project Management</h2>
              <Dialog open={projectDialog} onOpenChange={(open) => {
                setProjectDialog(open);
                if (!open) resetProjectForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-accent hover:bg-accent/90 w-full sm:w-auto text-xs md:text-sm py-1 md:py-2 px-2 md:px-4 h-8 md:h-10">
                    <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Add Project</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl w-[95vw] md:w-full max-h-[90vh] overflow-y-auto bg-card border-border">
                  <DialogHeader>
                    <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                    <DialogDescription>
                      Fill in the project details below
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 py-3 md:py-4">
                    <div className="space-y-2 col-span-1 sm:col-span-2">
                      <Label htmlFor="title" className="text-xs md:text-sm">Project Title *</Label>
                      <Input
                        id="title"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        placeholder="E-commerce Website Redesign"
                        className="text-xs md:text-sm h-8 md:h-10"
                      />
                    </div>
                    
                    <div className="space-y-2 col-span-1 sm:col-span-2">
                      <Label htmlFor="description" className="text-xs md:text-sm">Description *</Label>
                      <textarea
                        id="description"
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        placeholder="Project description..."
                        className="w-full min-h-[80px] md:min-h-[100px] px-3 py-2 text-xs md:text-sm bg-background border border-border rounded-md"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-xs md:text-sm">Category *</Label>
                      <Select value={projectForm.category} onValueChange={(value) => setProjectForm({ ...projectForm, category: value })}>
                        <SelectTrigger className="text-xs md:text-sm h-8 md:h-10">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Web Development" className="text-xs md:text-sm">Web Development</SelectItem>
                          <SelectItem value="3D Animation" className="text-xs md:text-sm">3D Animation</SelectItem>
                          <SelectItem value="UI/UX Design" className="text-xs md:text-sm">UI/UX Design</SelectItem>
                          <SelectItem value="Branding" className="text-xs md:text-sm">Branding</SelectItem>
                          <SelectItem value="Marketing" className="text-xs md:text-sm">Marketing</SelectItem>
                          <SelectItem value="Other" className="text-xs md:text-sm">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="status">Status *</Label>
                      <Select value={projectForm.status} onValueChange={(value) => setProjectForm({ ...projectForm, status: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Planning">Planning</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Review">Review</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="On Hold">On Hold</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority *</Label>
                      <Select value={projectForm.priority} onValueChange={(value) => setProjectForm({ ...projectForm, priority: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget *</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={projectForm.budget}
                        onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
                        placeholder="10000"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={projectForm.startDate}
                        onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Deadline *</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={projectForm.deadline}
                        onChange={(e) => setProjectForm({ ...projectForm, deadline: e.target.value })}
                      />
                    </div>
                    
                    <div className="col-span-2 pt-4 border-t border-border">
                      <h4 className="font-semibold mb-4">Client Information</h4>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="clientName">Client Name *</Label>
                      <Input
                        id="clientName"
                        value={projectForm.clientName}
                        onChange={(e) => setProjectForm({ ...projectForm, clientName: e.target.value })}
                        placeholder="Acme Corp"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="clientEmail">Client Email *</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        value={projectForm.clientEmail}
                        onChange={(e) => setProjectForm({ ...projectForm, clientEmail: e.target.value })}
                        placeholder="client@acmecorp.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="clientPhone">Client Phone</Label>
                      <Input
                        id="clientPhone"
                        value={projectForm.clientPhone}
                        onChange={(e) => setProjectForm({ ...projectForm, clientPhone: e.target.value })}
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setProjectDialog(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateProject}
                      disabled={loading}
                      className="bg-accent hover:bg-accent/90"
                    >
                      {loading ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="border-border bg-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                            No projects found. Add your first project to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        projects.map((project: any) => (
                          <TableRow key={project._id}>
                            <TableCell className="font-medium">{project.title}</TableCell>
                            <TableCell className="text-muted-foreground">{project.client?.name}</TableCell>
                            <TableCell>{project.category}</TableCell>
                            <TableCell>₹{project.budget.toLocaleString()}</TableCell>
                            <TableCell>{new Date(project.deadline).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge className={getPriorityColor(project.priority)}>
                                {project.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(project.status)}>
                                {project.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditProject(project)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteProject(project._id)}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
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
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4 md:space-y-6">
            <h2 className="text-xl md:text-2xl font-bold">Order Management</h2>

            <Card className="border-border bg-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">Order ID</TableHead>
                        <TableHead className="text-xs md:text-sm">Service</TableHead>
                        <TableHead className="text-xs md:text-sm hidden sm:table-cell">Customer</TableHead>
                        <TableHead className="text-xs md:text-sm hidden md:table-cell">Email</TableHead>
                        <TableHead className="text-xs md:text-sm">Budget</TableHead>
                        <TableHead className="text-xs md:text-sm hidden lg:table-cell">Date</TableHead>
                        <TableHead className="text-xs md:text-sm">Status</TableHead>
                        <TableHead className="text-xs md:text-sm text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-muted-foreground py-6 md:py-8 text-xs md:text-sm">
                            No orders found.
                          </TableCell>
                        </TableRow> 
                      ) : (
                        orders.map((order: any) => (
                          <TableRow key={order._id}>
                            <TableCell className="font-mono text-xs">{order._id.slice(-8)}</TableCell>
                            <TableCell className="font-medium text-xs md:text-sm">{order.service}</TableCell>
                            <TableCell className="text-xs md:text-sm hidden sm:table-cell">{order.user?.name}</TableCell>
                            <TableCell className="text-muted-foreground text-xs md:text-sm hidden md:table-cell">{order.user?.email}</TableCell>
                            <TableCell className="text-xs md:text-sm">₹{order.budget?.toLocaleString()}</TableCell>
                            <TableCell className="text-xs md:text-sm hidden lg:table-cell">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(order.status)} text-xs md:text-sm`}>
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingOrder(order);
                                  setOrderStatusForm({ status: order.status, notes: '' });
                                  setOrderStatusDialog(true);
                                }}
                                className="border-accent text-accent hover:bg-accent h-7 md:h-8 px-2 text-xs md:text-sm"
                              >
                                <Edit className="w-3 h-3 md:w-4 md:h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4 md:space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold">User Management</h2>
            </div>

            <Card className="border-border bg-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">Name</TableHead>
                        <TableHead className="text-xs md:text-sm">Email</TableHead>
                        <TableHead className="text-xs md:text-sm hidden sm:table-cell">Phone</TableHead>
                        <TableHead className="text-xs md:text-sm">Role</TableHead>
                        <TableHead className="text-xs md:text-sm hidden md:table-cell">Orders</TableHead>
                        <TableHead className="text-xs md:text-sm hidden lg:table-cell">Total Spent</TableHead>
                        <TableHead className="text-xs md:text-sm">Status</TableHead>
                        <TableHead className="text-xs md:text-sm hidden lg:table-cell">Joined</TableHead>
                        <TableHead className="text-xs md:text-sm text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center text-muted-foreground py-6 md:py-8 text-xs md:text-sm">
                            No users found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((user: any) => (
                          <TableRow key={user._id}>
                            <TableCell className="font-medium text-xs md:text-sm">{user.name}</TableCell>
                            <TableCell className="text-muted-foreground text-xs md:text-sm">{user.email}</TableCell>
                            <TableCell className="text-xs md:text-sm hidden sm:table-cell">{user.phone || '-'}</TableCell>
                            <TableCell>
                              <Badge className={`${user.role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'} text-xs md:text-sm`}>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs md:text-sm hidden md:table-cell">{user.ordersCount || 0}</TableCell>
                            <TableCell className="text-xs md:text-sm hidden lg:table-cell">₹{(user.totalSpent || 0).toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge className={`${user.isActive ? 'bg-green-500' : 'bg-red-500'} text-xs md:text-sm`}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs md:text-sm hidden lg:table-cell">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right space-x-1 md:space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingUser(user);
                                  setUserForm({
                                    name: user.name,
                                    email: user.email,
                                    phone: user.phone || '',
                                    role: user.role,
                                    isActive: user.isActive
                                  });
                                  setUserDialog(true);
                                }}
                                className="h-7 md:h-8 px-2 text-xs md:text-sm border-accent text-accent hover:bg-accent"
                              >
                                <Edit className="w-3 h-3 md:w-4 md:h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteUser(user._id)}
                                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
              <h2 className="text-xl md:text-2xl font-bold">Revenue Overview</h2>
              <Button
                onClick={async () => {
                  try {
                    setLoading(true);
                    await revenueService.updateTodayRevenue();
                    setSuccess('Revenue data updated successfully');
                    loadRevenue();
                  } catch (err) {
                    setError('Failed to update revenue data');
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="bg-accent hover:bg-accent/90 w-full sm:w-auto text-xs md:text-sm py-1 md:py-2 px-2 md:px-4 h-8 md:h-10"
              >
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Refresh Data</span>
                <span className="sm:hidden">Refresh</span>
              </Button>
            </div>

            {/* Revenue Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              <Card className="border-border bg-card hover:shadow-gold transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 py-3 md:py-4">
                  <CardTitle className="text-xs md:text-sm font-medium">Today's Revenue</CardTitle>
                  <IndianRupee className="h-3 w-3 md:h-4 md:w-4 text-accent" />
                </CardHeader>
                <CardContent className="pb-2 md:pb-4">
                  <div className="text-lg md:text-2xl font-bold">₹{(revenueData?.today?.revenue || 0).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {revenueData?.today?.orders || 0} orders
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card hover:shadow-gold transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 py-3 md:py-4">
                  <CardTitle className="text-xs md:text-sm font-medium">This Week</CardTitle>
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-accent" />
                </CardHeader>
                <CardContent className="pb-2 md:pb-4">
                  <div className="text-lg md:text-2xl font-bold">₹{(revenueData?.week?.revenue || 0).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {revenueData?.week?.orders || 0} orders
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card hover:shadow-gold transition-shadow sm:col-span-2 lg:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2 py-3 md:py-4">
                  <CardTitle className="text-xs md:text-sm font-medium">This Month</CardTitle>
                  <IndianRupee className="h-3 w-3 md:h-4 md:w-4 text-accent" />
                </CardHeader>
                <CardContent className="pb-2 md:pb-4">
                  <div className="text-lg md:text-2xl font-bold">₹{(revenueData?.month?.revenue || 0).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {revenueData?.month?.orders || 0} orders
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Chart */}
            <Card className="border-border bg-card">
              <CardHeader className="py-3 md:py-4">
                <CardTitle className="text-sm md:text-base">Last 30 Days Revenue</CardTitle>
              </CardHeader>
              <CardContent className="p-0 md:p-6">
                <div className="overflow-x-auto pb-4">
                  <div className="min-w-[800px] md:min-w-[1200px]">
                    {revenueChart.length === 0 ? (
                      <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                        No revenue data available
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Chart */}
                        <div className="h-[350px] flex items-end justify-between gap-1 px-2 border-b border-border pb-12">
                          {revenueChart.map((day: any, index: number) => {
                            const maxRevenue = Math.max(...revenueChart.map((d: any) => d.revenue || 0));
                            const height = maxRevenue > 0 ? ((day.revenue || 0) / maxRevenue) * 100 : 5;
                            const hasRevenue = day.revenue > 0;
                            
                            return (
                              <div key={index} className="flex-1 flex flex-col items-center group min-w-[30px]">
                                {/* Bar */}
                                <div className="w-full flex flex-col justify-end h-full pb-2">
                                  <div 
                                    className={`w-full rounded-t transition-all relative ${
                                      hasRevenue 
                                        ? 'bg-accent hover:bg-accent/80' 
                                        : 'bg-muted hover:bg-muted/80'
                                    }`}
                                    style={{ height: `${height}%`, minHeight: hasRevenue ? '4px' : '2px' }}
                                  >
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/90 text-white text-xs px-3 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                      <div className="font-semibold">
                                        {new Date(day.date).toLocaleDateString('en-US', { 
                                          month: 'short', 
                                          day: 'numeric',
                                          year: 'numeric'
                                        })}
                                      </div>
                                      <div className="text-accent">₹{(day.revenue || 0).toLocaleString()}</div>
                                      <div className="text-gray-300">{day.orders || 0} orders</div>
                                      {day.profit !== undefined && (
                                        <div className="text-green-400">Profit: ₹{(day.profit || 0).toLocaleString()}</div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Date Label */}
                                <div className="text-[10px] text-muted-foreground mt-1 transform -rotate-45 origin-top whitespace-nowrap">
                                  {new Date(day.date).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-4 gap-4 pt-2">
                          <div className="text-center p-3 bg-secondary/50 rounded-lg">
                            <div className="text-xs text-muted-foreground">Total Revenue</div>
                            <div className="text-lg font-bold text-accent">
                              ₹{revenueChart.reduce((sum: number, day: any) => sum + (day.revenue || 0), 0).toLocaleString()}
                            </div>
                          </div>
                          <div className="text-center p-3 bg-secondary/50 rounded-lg">
                            <div className="text-xs text-muted-foreground">Total Orders</div>
                            <div className="text-lg font-bold">
                              {revenueChart.reduce((sum: number, day: any) => sum + (day.orders || 0), 0)}
                            </div>
                          </div>
                          <div className="text-center p-3 bg-secondary/50 rounded-lg">
                            <div className="text-xs text-muted-foreground">Avg per Day</div>
                            <div className="text-lg font-bold">
                              ₹{Math.round(revenueChart.reduce((sum: number, day: any) => sum + (day.revenue || 0), 0) / revenueChart.length).toLocaleString()}
                            </div>
                          </div>
                          <div className="text-center p-3 bg-secondary/50 rounded-lg">
                            <div className="text-xs text-muted-foreground">Peak Day</div>
                            <div className="text-lg font-bold">
                              ₹{Math.max(...revenueChart.map((d: any) => d.revenue || 0)).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Order Status Update Dialog */}
        <Dialog open={orderStatusDialog} onOpenChange={setOrderStatusDialog}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Update Order Status</DialogTitle>
              <DialogDescription>
                Update the status and add notes for order #{editingOrder?._id.slice(-8)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={orderStatusForm.status}
                  onValueChange={(value) => setOrderStatusForm({ ...orderStatusForm, status: value })}
                >
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  value={orderStatusForm.notes}
                  onChange={(e) => setOrderStatusForm({ ...orderStatusForm, notes: e.target.value })}
                  placeholder="Add status update notes..."
                  className="border-border"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setOrderStatusDialog(false);
                  setEditingOrder(null);
                  setOrderStatusForm({ status: '', notes: '' });
                }}
                className="border-border"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateOrderStatus}
                disabled={loading || !orderStatusForm.status}
                className="bg-accent hover:bg-accent/90"
              >
                Update Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* User Edit Dialog */}
        <Dialog open={userDialog} onOpenChange={setUserDialog}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information and permissions
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userName">Name</Label>
                <Input
                  id="userName"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="John Doe"
                  className="border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userEmail">Email</Label>
                <Input
                  id="userEmail"
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  placeholder="john@example.com"
                  className="border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userPhone">Phone</Label>
                <Input
                  id="userPhone"
                  value={userForm.phone}
                  onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                  className="border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={userForm.role}
                  onValueChange={(value) => setUserForm({ ...userForm, role: value })}
                >
                  <SelectTrigger className="border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={userForm.isActive}
                  onChange={(e) => setUserForm({ ...userForm, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="isActive">Active User</Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setUserDialog(false);
                  setEditingUser(null);
                  setUserForm({ name: '', email: '', phone: '', role: 'user', isActive: true });
                }}
                className="border-border"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateUser}
                disabled={loading || !userForm.name || !userForm.email}
                className="bg-accent hover:bg-accent/90"
              >
                Update User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
