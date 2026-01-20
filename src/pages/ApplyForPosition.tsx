import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import DragDropUpload from '@/components/DragDropUpload';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, CheckCircle, Briefcase } from 'lucide-react';
import { applicationService } from '@/lib/applicationService';

interface Position {
  _id: string;
  title: string;
  department: string;
  description: string;
  requirements: string[];
  salary?: string;
  workType?: string;
  location?: string;
}

const ApplyForPosition = () => {
  const navigate = useNavigate();
  const { positionId } = useParams<{ positionId: string }>();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [position, setPosition] = useState<Position | null>(null);
  const [resumeFile, setResumeFile] = useState<File[]>([]);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    education: '',
    experience: '',
    skills: '',
    portfolio: '',
    coverLetter: '',
    expectedSalary: '',
  });
  const experiences = ['0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years'];

  // Removed login redirect - show popup on form submit if not authenticated

  useEffect(() => {
    // In a real app, fetch the position details from API
    // For now, using mock data
    const loadPosition = async () => {
      try {
        // Mock position data - replace with actual API call
        const mockPosition: Position = {
          _id: positionId || '1',
          title: 'React Developer',
          department: 'Development',
          description: 'We are looking for an experienced React Developer to join our team.',
          requirements: ['React', 'TypeScript', 'REST APIs', '3+ years experience'],
          salary: '60,000 - 100,000 per month',
          workType: 'Full-time',
          location: 'Remote',
        };
        setPosition(mockPosition);
      } catch (err: any) {
        setError(err.message || 'Failed to load position');
      } finally {
        setLoading(false);
      }
    };

    loadPosition();
  }, [user, navigate, positionId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      // Add text fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key as keyof typeof formData]);
      });

      // Add position info
      formDataToSend.append('positionId', positionId || '');
      formDataToSend.append('positionTitle', position?.title || '');
      formDataToSend.append('department', position?.department || '');

      // Add files
      if (resumeFile.length > 0) {
        formDataToSend.append('resumeFile', resumeFile[0]);
      }
      if (profilePhotoFile.length > 0) {
        formDataToSend.append('profilePhoto', profilePhotoFile[0]);
      }

      await applicationService.submitPositionApplication(formDataToSend);
      setSuccess('Application submitted successfully! Our team will review your application shortly.');
      setTimeout(() => navigate('/'), 2000);
    } catch (err: any) {
      console.error('Application submission error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to submit application');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
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

  if (!position) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="mb-6 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Alert variant="destructive">
              <AlertDescription>{error || 'Position not found'}</AlertDescription>
            </Alert>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-6 md:mb-8 gap-2 text-xs md:text-sm py-1 md:py-2 px-2 md:px-4 h-8 md:h-10"
          >
            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
            Back
          </Button>

          {/* Position Info Card */}
          <Card className="border-border bg-card mb-6">
            <CardHeader>
              <div className="flex items-start gap-4">
                <Briefcase className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
                <div>
                  <CardTitle className="text-2xl md:text-3xl">{position.title}</CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    {position.department} • {position.location}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Work Type</p>
                  <p className="text-sm md:text-base font-medium">{position.workType}</p>
                </div>
                {position.salary && (
                  <div>
                    <p className="text-xs text-muted-foreground">Salary</p>
                    <p className="text-sm md:text-base font-medium">{position.salary}</p>
                  </div>
                )}
              </div>
              {position.description && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">About the Role</p>
                  <p className="text-sm text-foreground">{position.description}</p>
                </div>
              )}
              {position.requirements && position.requirements.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Key Requirements</p>
                  <ul className="text-sm text-foreground space-y-1">
                    {position.requirements.map((req, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-accent">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Application Form */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-4 md:pb-6">
              <CardTitle className="text-2xl md:text-3xl">Submit Your Application</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Complete the form below to apply for this position.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription className="text-xs md:text-sm">{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-900/20 border-green-500/50">
                    <CheckCircle className="h-3 h-3 md:h-4 md:w-4 text-green-500" />
                    <AlertDescription className="text-green-500 text-xs md:text-sm">{success}</AlertDescription>
                  </Alert>
                )}

                {/* Personal Information */}
                <div className="space-y-3 md:space-y-4">
                  <h3 className="text-base md:text-lg font-semibold">Personal Information</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="text-xs md:text-sm font-medium mb-1 md:mb-2 block">Full Name *</label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        disabled={isLoading}
                        className="text-xs md:text-sm h-8 md:h-10"
                      />
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium mb-1 md:mb-2 block">Email *</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="text-xs md:text-sm h-8 md:h-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Phone Number *</label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 1234567890"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Education *</label>
                      <Input
                        type="text"
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        placeholder="e.g., B.Tech in Computer Science"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Profile Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Profile Information</h3>

                  <DragDropUpload
                    label="Profile Photo *"
                    description="Upload a professional profile photo"
                    acceptedFormats={['.jpg', '.jpeg', '.png', '.webp']}
                    maxSize={2 * 1024 * 1024}
                    type="photo"
                    onFilesSelected={setProfilePhotoFile}
                    value={profilePhotoFile}
                    disabled={isLoading}
                  />
                </div>

                {/* Experience */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Professional Experience</h3>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Years of Experience *</label>
                    <Select value={formData.experience} onValueChange={(value) => handleSelectChange('experience', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        {experiences.map(exp => (
                          <SelectItem key={exp} value={exp}>{exp}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Skills *</label>
                    <Textarea
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="e.g., React, TypeScript, UI Design, etc."
                      required
                      disabled={isLoading}
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Portfolio URL</label>
                    <Input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      placeholder="https://yourportfolio.com"
                      disabled={isLoading}
                    />
                  </div>

                  <DragDropUpload
                    label="Resume/CV *"
                    description="Upload your resume or CV as PDF"
                    acceptedFormats={['.pdf', '.doc', '.docx']}
                    maxSize={5 * 1024 * 1024}
                    type="resume"
                    onFilesSelected={setResumeFile}
                    value={resumeFile}
                    disabled={isLoading}
                  />
                </div>

                {/* Expected Salary */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Expected Salary (₹)</label>
                  <Input
                    type="number"
                    name="expectedSalary"
                    value={formData.expectedSalary}
                    onChange={handleChange}
                    placeholder="100000"
                    disabled={isLoading}
                  />
                </div>

                {/* Cover Letter */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Cover Letter</h3>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Tell us why you're interested in this role *</label>
                    <Textarea
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleChange}
                      placeholder="Share your interest, motivation, and how your skills match the role..."
                      required
                      disabled={isLoading}
                      rows={5}
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-accent hover:bg-accent/90"
                  >
                    {isLoading ? 'Submitting...' : 'Submit Application'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ApplyForPosition;
