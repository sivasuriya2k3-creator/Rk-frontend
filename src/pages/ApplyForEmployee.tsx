import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const ApplyForEmployee = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    experience: '',
    education: '',
    skills: '',
    portfolio: '',
    resume: '',
    coverLetter: '',
    expectedSalary: '',
    workPreference: 'Full-time'
  });

  const positions = ['Developer', 'Designer', '3D Artist', 'UI/UX Designer', 'Project Manager', 'Marketing', 'Sales', 'HR', 'Other'];
  const departments = ['Development', 'Design', '3D Animation', 'UI/UX', 'Management', 'Marketing', 'Sales', 'HR', 'Operations'];
  const experiences = ['0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years'];
  const workPreferences = ['Full-time', 'Part-time', 'Contract', 'Remote', 'On-site', 'Hybrid'];

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
      const response = await fetch('/api/applications/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Application submission failed');
      }

      setSuccess('Application submitted successfully! Our team will review your application shortly.');
      setTimeout(() => navigate('/'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-8 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-3xl">Apply for Employee Position</CardTitle>
              <CardDescription>
                Join RajKayal Creative Hub team. Fill in all your details below.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-900/20 border-green-500/50">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-500">{success}</AlertDescription>
                  </Alert>
                )}

                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Full Name *</label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email *</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
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

                {/* Job Position */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Position Details</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Position *</label>
                      <Select value={formData.position} onValueChange={(value) => handleSelectChange('position', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          {positions.map(pos => (
                            <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Department *</label>
                      <Select value={formData.department} onValueChange={(value) => handleSelectChange('department', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map(dept => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Experience *</label>
                      <Select value={formData.experience} onValueChange={(value) => handleSelectChange('experience', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          {experiences.map(exp => (
                            <SelectItem key={exp} value={exp}>{exp}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Work Preference *</label>
                      <Select value={formData.workPreference} onValueChange={(value) => handleSelectChange('workPreference', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select work preference" />
                        </SelectTrigger>
                        <SelectContent>
                          {workPreferences.map(pref => (
                            <SelectItem key={pref} value={pref}>{pref}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Expected Salary (₹) *</label>
                    <Input
                      type="number"
                      name="expectedSalary"
                      value={formData.expectedSalary}
                      onChange={handleChange}
                      placeholder="100000"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Skills and Experience */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Skills & Experience</h3>

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

                  <div>
                    <label className="text-sm font-medium mb-2 block">Resume URL</label>
                    <Input
                      type="url"
                      name="resume"
                      value={formData.resume}
                      onChange={handleChange}
                      placeholder="https://yourresume.com"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Cover Letter</h3>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Cover Letter *</label>
                    <Textarea
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleChange}
                      placeholder="Tell us why you're interested in joining RajKayal..."
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
                    className="flex-1 bg-accent text-black hover:bg-accent/90"
                  >
                    {isLoading ? 'Submitting...' : 'Submit Application'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/')}
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

export default ApplyForEmployee;
