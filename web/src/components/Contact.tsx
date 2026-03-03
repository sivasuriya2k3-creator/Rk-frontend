import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, Send, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { contactService } from "@/lib/contactService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { applicationService } from "@/lib/applicationService";

const Contact = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
  const [isApplyingSubmitting, setIsApplyingSubmitting] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "Developer",
    department: "Development",
    experience: "0-1 years",
    education: "",
    skills: "",
    portfolio: "",
    resume: "",
    coverLetter: "",
    expectedSalary: "",
    workPreference: "On-site",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "consultation",
    subject: "",
    message: "",
  });

  // Check URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    if (type === 'consultation' || type === 'collaboration') {
      setFormData(prev => ({ ...prev, inquiryType: type }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to send a message.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);

    try {
      await contactService.sendMessage({
        name: formData.name,
        email: formData.email,
        inquiryType: formData.inquiryType as 'consultation' | 'collaboration' | 'quote' | 'support' | 'other',
        subject: formData.subject,
        message: formData.message,
      });

      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
      
      // Reset form
      setFormData({ 
        name: "", 
        email: "", 
        inquiryType: "consultation", 
        subject: "", 
        message: "" 
      });
    } catch (error: any) {
      console.error('Contact form error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplyingSubmitting(true);

    try {
      // Validate required fields
      if (!applicationForm.name || !applicationForm.email || !applicationForm.phone) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields (Name, Email, Phone)",
          variant: "destructive",
        });
        setIsApplyingSubmitting(false);
        return;
      }

      await applicationService.submitApplication(applicationForm);

      toast({
        title: "Application Submitted!",
        description: "Thank you for applying. We'll review your application and get back to you soon.",
      });

      // Reset form and close dialog
      setApplicationForm({
        name: "",
        email: "",
        phone: "",
        position: "Developer",
        department: "Development",
        experience: "0-1 years",
        education: "",
        skills: "",
        portfolio: "",
        resume: "",
        coverLetter: "",
        expectedSalary: "",
        workPreference: "On-site",
      });
      setApplicationDialogOpen(false);
    } catch (error: any) {
      console.error('Application error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApplyingSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "rajkayal7281@gmail.com",
      href: "mailto:rajkayal7281@gmail.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 8754616454",
      href: "tel:+91 8754616454",
    },
    {
      icon: MapPin,
      label: "Trichy, Tamil Nadu, India",
      value: "Trichy, Tamil Nadu, India",
      href: "#",
    },
  ];

  return (
    <section id="contact" className="relative py-24 md:py-32 bg-secondary/30 dark:bg-background shadow-sm">
      {/* Smooth fade from previous section */}
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-transparent to-background pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold break-words">
              Get in <span className="gradient-text">Touch</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto break-words">
              Ready to start your next project? We'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground">
                      Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      className="bg-background border-border focus:border-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      className="bg-background border-border focus:border-accent"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="inquiryType" className="text-sm font-medium text-foreground">
                    Inquiry Type *
                  </label>
                  <Select
                    value={formData.inquiryType}
                    onValueChange={(value) => setFormData({ ...formData, inquiryType: value })}
                  >
                    <SelectTrigger className="bg-background border-border focus:border-accent">
                      <SelectValue placeholder="Select inquiry type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Free Consultation</SelectItem>
                      <SelectItem value="collaboration">Collaboration</SelectItem>
                      <SelectItem value="quote">Request Quote</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-foreground">
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    required
                    className="bg-background border-border focus:border-accent"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project..."
                    required
                    rows={6}
                    className="bg-background border-border focus:border-accent resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-accent hover:bg-accent/90 shadow-gold group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-foreground break-words">
                  Contact Information
                </h3>
                <p className="text-muted-foreground leading-relaxed break-words">
                  We're here to answer any questions you may have about our services. 
                  Reach out to us and we'll respond as soon as we can.
                </p>
              </div>

              {/* Apply for Employee Button */}
              <Button 
                className="w-full bg-accent hover:bg-accent/90 shadow-gold group"
                onClick={() => navigate('/apply-employee')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Apply for Employee Position
              </Button>

              {/* Hidden Dialog for backward compatibility */}
              {false && (
              <Dialog open={applicationDialogOpen} onOpenChange={setApplicationDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full bg-accent hover:bg-accent/90 shadow-gold group"
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault();
                        toast({
                          title: "Login Required",
                          description: "Please log in to apply for an employee position.",
                          variant: "destructive",
                        });
                        navigate('/login');
                      }
                    }}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Apply for Employee Position
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
                  <DialogHeader>
                    <DialogTitle>Apply for Employee Position</DialogTitle>
                    <DialogDescription>
                      Fill in your details below. All fields marked with * are required.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleApplicationSubmit} className="space-y-4">
                    {/* Personal Information */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Personal Information</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Name *</label>
                          <Input
                            value={applicationForm.name}
                            onChange={(e) => setApplicationForm({...applicationForm, name: e.target.value})}
                            placeholder="Your full name"
                            required
                            className="bg-background border-border focus:border-accent"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email *</label>
                          <Input
                            type="email"
                            value={applicationForm.email}
                            onChange={(e) => setApplicationForm({...applicationForm, email: e.target.value})}
                            placeholder="your@email.com"
                            required
                            className="bg-background border-border focus:border-accent"
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <label className="text-sm font-medium">Phone *</label>
                          <Input
                            type="tel"
                            value={applicationForm.phone}
                            onChange={(e) => setApplicationForm({...applicationForm, phone: e.target.value})}
                            placeholder="+91 XXXXXXXXXX"
                            required
                            className="bg-background border-border focus:border-accent"
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <label className="text-sm font-medium">Education</label>
                          <Input
                            value={applicationForm.education}
                            onChange={(e) => setApplicationForm({...applicationForm, education: e.target.value})}
                            placeholder="e.g., Bachelor's in Computer Science"
                            className="bg-background border-border focus:border-accent"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Position Details */}
                    <div className="space-y-3 border-t pt-3">
                      <h4 className="font-semibold text-sm">Position Details</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Position</label>
                          <Select value={applicationForm.position} onValueChange={(value) => setApplicationForm({...applicationForm, position: value})}>
                            <SelectTrigger className="bg-background border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Developer">Developer</SelectItem>
                              <SelectItem value="Designer">Designer</SelectItem>
                              <SelectItem value="3D Artist">3D Artist</SelectItem>
                              <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                              <SelectItem value="Project Manager">Project Manager</SelectItem>
                              <SelectItem value="Marketing">Marketing</SelectItem>
                              <SelectItem value="Sales">Sales</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Department</label>
                          <Select value={applicationForm.department} onValueChange={(value) => setApplicationForm({...applicationForm, department: value})}>
                            <SelectTrigger className="bg-background border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Development">Development</SelectItem>
                              <SelectItem value="Design">Design</SelectItem>
                              <SelectItem value="3D Animation">3D Animation</SelectItem>
                              <SelectItem value="UI/UX">UI/UX</SelectItem>
                              <SelectItem value="Management">Management</SelectItem>
                              <SelectItem value="Marketing">Marketing</SelectItem>
                              <SelectItem value="Sales">Sales</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Experience</label>
                          <Select value={applicationForm.experience} onValueChange={(value) => setApplicationForm({...applicationForm, experience: value})}>
                            <SelectTrigger className="bg-background border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0-1 years">0-1 years</SelectItem>
                              <SelectItem value="1-3 years">1-3 years</SelectItem>
                              <SelectItem value="3-5 years">3-5 years</SelectItem>
                              <SelectItem value="5-10 years">5-10 years</SelectItem>
                              <SelectItem value="10+ years">10+ years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Work Preference</label>
                          <Select value={applicationForm.workPreference} onValueChange={(value) => setApplicationForm({...applicationForm, workPreference: value})}>
                            <SelectTrigger className="bg-background border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="On-site">On-site</SelectItem>
                              <SelectItem value="Remote">Remote</SelectItem>
                              <SelectItem value="Hybrid">Hybrid</SelectItem>
                              <SelectItem value="Contract">Contract</SelectItem>
                              <SelectItem value="Freelance">Freelance</SelectItem>
                              <SelectItem value="Full-time">Full-time</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 col-span-2">
                          <label className="text-sm font-medium">Expected Salary</label>
                          <Input
                            type="number"
                            value={applicationForm.expectedSalary}
                            onChange={(e) => setApplicationForm({...applicationForm, expectedSalary: e.target.value})}
                            placeholder="₹ Amount"
                            className="bg-background border-border focus:border-accent"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Skills & Documents */}
                    <div className="space-y-3 border-t pt-3">
                      <h4 className="font-semibold text-sm">Skills & Documents</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Skills</label>
                          <Textarea
                            value={applicationForm.skills}
                            onChange={(e) => setApplicationForm({...applicationForm, skills: e.target.value})}
                            placeholder="List your key skills (e.g., React, Node.js, UI Design)"
                            rows={3}
                            className="bg-background border-border focus:border-accent resize-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Portfolio URL</label>
                          <Input
                            type="url"
                            value={applicationForm.portfolio}
                            onChange={(e) => setApplicationForm({...applicationForm, portfolio: e.target.value})}
                            placeholder="https://yourportfolio.com"
                            className="bg-background border-border focus:border-accent"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Resume URL</label>
                          <Input
                            type="url"
                            value={applicationForm.resume}
                            onChange={(e) => setApplicationForm({...applicationForm, resume: e.target.value})}
                            placeholder="https://link-to-your-resume.com"
                            className="bg-background border-border focus:border-accent"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Cover Letter */}
                    <div className="space-y-3 border-t pt-3">
                      <h4 className="font-semibold text-sm">Cover Letter</h4>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Message</label>
                        <Textarea
                          value={applicationForm.coverLetter}
                          onChange={(e) => setApplicationForm({...applicationForm, coverLetter: e.target.value})}
                          placeholder="Tell us why you're interested in this position..."
                          rows={4}
                          className="bg-background border-border focus:border-accent resize-none"
                        />
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-3 border-t pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setApplicationDialogOpen(false)}
                        className="flex-1 border-border"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isApplyingSubmitting}
                        className="flex-1 bg-accent hover:bg-accent/90 disabled:opacity-50"
                      >
                        {isApplyingSubmitting ? "Submitting..." : "Submit Application"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              )}

              <div className="space-y-6">
                {contactInfo.map((info) => (
                  <a
                    key={info.label}
                    href={info.href}
                    className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border hover:border-accent/50 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors flex-shrink-0">
                      <info.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-muted-foreground mb-1 break-words">
                        {info.label}
                      </div>
                      <div className="text-foreground font-medium break-words">
                        {info.value}
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Office Hours */}
              <div className="p-6 rounded-lg bg-card border border-border">
                <h4 className="text-lg font-bold text-foreground mb-4 break-words">
                  Office Hours
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="text-foreground font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="text-foreground font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="text-foreground font-medium">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

