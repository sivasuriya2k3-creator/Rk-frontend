import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  GraduationCap,
  Target,
  Download,
  Eye,
  Trash2,
  Edit,
  Clock,
  DollarSign,
} from 'lucide-react';
import { employeeService } from '@/lib/employeeService';

interface Employee {
  _id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  experience: string;
  education: string;
  skills: string[];
  portfolio?: string;
  profilePhoto?: string;
  resume?: string;
  coverLetter?: string;
  expectedSalary?: string;
  workPreference?: string;
  status?: string;
  appliedDate?: string;
  joinDate?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

export default function EmployeeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Removed login redirect - show popup on action if not authenticated

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        if (!id) throw new Error('Employee ID not provided');
        const response = await employeeService.getById(id);
        setEmployee(response.data || response);
      } catch (err: any) {
        setError(err.message || 'Failed to load employee details');
        console.error('Load employee error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadEmployee();
  }, [id, user, navigate]);

  const handleDelete = async () => {
    if (!id) return;

    try {
      await employeeService.delete(id);
      setSuccess('Employee deleted successfully. Redirecting...');
      setTimeout(() => navigate('/management-dashboard?tab=employees'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete employee');
    }
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-muted rounded-lg w-24"></div>
              <div className="h-64 bg-muted rounded-lg"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="mb-6 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Alert variant="destructive">
              <AlertDescription>{error || 'Employee not found'}</AlertDescription>
            </Alert>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const skillsList = typeof employee.skills === 'string' 
    ? (employee.skills as string).split(',').map(s => s.trim())
    : Array.isArray(employee.skills) ? employee.skills : [];

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-400',
    approved: 'bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-400',
    rejected: 'bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-400',
    joined: 'bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-400',
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-6 md:mb-8 gap-2 text-xs md:text-sm py-1 md:py-2 px-2 md:px-4 h-8 md:h-10"
          >
            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
            Back
          </Button>

          {/* Alerts */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription className="text-xs md:text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-900/20 border-green-500/50">
              <AlertDescription className="text-green-500 text-xs md:text-sm">{success}</AlertDescription>
            </Alert>
          )}

          {/* Header with Profile */}
          <Card className="border-border bg-card mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Photo */}
                {employee.profilePhoto && (
                  <div className="flex-shrink-0">
                    <img
                      src={employee.profilePhoto}
                      alt={employee.name}
                      className="w-32 h-32 rounded-lg object-cover border border-muted-foreground/30"
                    />
                  </div>
                )}

                {/* Header Info */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-foreground">{employee.name}</h1>
                      <p className="text-muted-foreground text-sm md:text-base mt-1">{employee.position}</p>
                      {employee.status && (
                        <Badge className={`mt-3 text-xs md:text-sm ${statusColor[employee.status] || statusColor.pending}`}>
                          {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                        </Badge>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/apply-employee/${id}/edit`)}
                        className="gap-2 text-xs md:text-sm h-8 md:h-10"
                      >
                        <Edit className="w-3 h-3 md:w-4 md:h-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteConfirm(true)}
                        className="gap-2 text-xs md:text-sm h-8 md:h-10"
                      >
                        <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                    <Mail className="w-5 h-5 text-accent" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm md:text-base font-medium">{employee.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm md:text-base font-medium">{employee.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              {employee.address && (
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-accent" />
                      Address Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {employee.address.street && (
                      <div>
                        <p className="text-xs text-muted-foreground">Address Line 1</p>
                        <p className="text-sm md:text-base font-medium">{employee.address.street}</p>
                      </div>
                    )}
                    {employee.address.city && (
                      <div>
                        <p className="text-xs text-muted-foreground">Address Line 2</p>
                        <p className="text-sm md:text-base font-medium">{employee.address.city}</p>
                      </div>
                    )}
                    {(employee.address.state || employee.address.zipCode) && (
                      <div className="grid grid-cols-2 gap-4">
                        {employee.address.state && (
                          <div>
                            <p className="text-xs text-muted-foreground">State</p>
                            <p className="text-sm md:text-base font-medium">{employee.address.state}</p>
                          </div>
                        )}
                        {employee.address.zipCode && (
                          <div>
                            <p className="text-xs text-muted-foreground">ZIP Code</p>
                            <p className="text-sm md:text-base font-medium">{employee.address.zipCode}</p>
                          </div>
                        )}
                      </div>
                    )}
                    {employee.address.country && (
                      <div>
                        <p className="text-xs text-muted-foreground">Country</p>
                        <p className="text-sm md:text-base font-medium">{employee.address.country}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Position Details */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-accent" />
                    Position Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Position</p>
                      <p className="text-sm md:text-base font-medium">{employee.position}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Department</p>
                      <p className="text-sm md:text-base font-medium">{employee.department}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Experience</p>
                      <p className="text-sm md:text-base font-medium">{employee.experience}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Work Preference</p>
                      <p className="text-sm md:text-base font-medium">{employee.workPreference || 'Not specified'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Education & Experience */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-accent" />
                    Education & Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Education</p>
                    <p className="text-sm md:text-base">{employee.education}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                    <Award className="w-5 h-5 text-accent" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skillsList.length > 0 ? (
                      skillsList.map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No skills listed</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Cover Letter */}
              {employee.coverLetter && (
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">Cover Letter</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm md:text-base text-muted-foreground whitespace-pre-wrap">{employee.coverLetter}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar - Financial & Documents */}
            <div className="space-y-6">
              {/* Expected Salary */}
              {employee.expectedSalary && (
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-accent" />
                      Expected Salary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl md:text-2xl font-bold text-accent">₹{Number(employee.expectedSalary).toLocaleString('en-IN')}</p>
                  </CardContent>
                </Card>
              )}

              {/* Application Dates */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-accent" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {employee.appliedDate && (
                    <div>
                      <p className="text-xs text-muted-foreground">Applied On</p>
                      <p className="text-sm font-medium">{new Date(employee.appliedDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {employee.joinDate && (
                    <div>
                      <p className="text-xs text-muted-foreground">Join Date</p>
                      <p className="text-sm font-medium">{new Date(employee.joinDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Documents */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Download className="w-5 h-5 text-accent" />
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {employee.resume && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(employee.resume!, 'Resume.pdf')}
                      className="w-full justify-start text-xs gap-2 h-8"
                    >
                      <Download className="w-3 h-3" />
                      Download Resume
                    </Button>
                  )}
                  {employee.profilePhoto && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewImage(employee.profilePhoto!)}
                      className="w-full justify-start text-xs gap-2 h-8"
                    >
                      <Eye className="w-3 h-3" />
                      View Photo
                    </Button>
                  )}
                  {employee.portfolio && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full justify-start text-xs gap-2 h-8"
                    >
                      <a href={employee.portfolio} target="_blank" rel="noopener noreferrer">
                        <Eye className="w-3 h-3" />
                        View Portfolio
                      </a>
                    </Button>
                  )}
                  {!employee.resume && !employee.profilePhoto && !employee.portfolio && (
                    <p className="text-xs text-muted-foreground">No documents available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm} onOpenChange={setDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Employee Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this employee application? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Profile Photo</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <img src={previewImage} alt="Profile" className="w-full h-auto rounded-lg" />
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
