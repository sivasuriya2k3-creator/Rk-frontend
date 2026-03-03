import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowLeft, Send } from 'lucide-react';
import Navbar from '@/components/Navbar';
import GradientBlinds from '@/components/GradientBlinds';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { contactService } from '@/lib/contactService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ContactPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'consultation' as 'consultation' | 'collaboration' | 'quote' | 'support' | 'other',
    subject: '',
    message: '',
  });

  // Update form data when user loads
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  // Check URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    if (type === 'consultation' || type === 'collaboration') {
      setFormData(prev => ({ ...prev, inquiryType: type as any }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is logged in
    if (!user) {
      window.dispatchEvent(new CustomEvent('showAuthPopup'));
      return;
    }

    setIsSubmitting(true);

    try {
      await contactService.sendMessage({
        name: formData.name,
        email: formData.email,
        inquiryType: formData.inquiryType,
        subject: formData.subject,
        message: formData.message,
      });

      toast({
        title: 'Message Sent!',
        description: 'Thank you for reaching out. We\'ll get back to you soon.',
      });

      // Reset form with user data
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        inquiryType: 'consultation',
        subject: '',
        message: '',
      });
    } catch (error: any) {
      console.error('Contact form error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* GradientBlinds Background */}
      <div className="fixed inset-0 z-0 top-[80px] pointer-events-none">
        <GradientBlinds gradientColors={['#C6A345', '#8B7520', '#D4AF6A']} />
      </div>
      
      {/* Overlay for content readability */}
      <div className="fixed inset-0 bg-black/25 dark:bg-black/40 z-[5] top-[80px] pointer-events-none" />

      <div className="relative container mx-auto pt-20 sm:pt-24 md:pt-28 pb-0 px-4 sm:px-6 md:px-8 z-20">
        {/* Page Header with Back Button */}
        <div className="mb-12 md:mb-16">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="mb-4 gap-2 border-2 border-gold/60 text-gold dark:text-gold hover:bg-gold/15 hover:text-gold hover:border-gold transition-all duration-300"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </Button>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-3 sm:mb-4 md:mb-6">Get in Touch</h1>
          <p className="text-base sm:text-lg md:text-xl text-foreground/75 dark:text-foreground/85 max-w-2xl">
            Have a question or project in mind? We'd love to hear from you. Reach out and let's create something amazing together.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            {/* Email Card */}
            <Card className="bg-card/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gold/15">
                      <Mail className="text-gold" size={24} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">Email</h3>
                    <a
                      href="mailto:rajkayal7281@gmail.com"
                      className="text-foreground/70 dark:text-foreground/80 hover:text-gold transition-colors text-xs md:text-sm break-all"
                    >
                      rajkayal7281@gmail.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phone Card */}
            <Card className="bg-card/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gold/15">
                      <Phone className="text-gold" size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">Phone</h3>
                    <p className="text-foreground/70 dark:text-foreground/80 text-xs md:text-sm">Available during business hours</p>
                    <p className="text-xs text-foreground/60 dark:text-foreground/70 mt-1">Mon-Fri: 9:00 AM - 6:00 PM IST</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card className="bg-card/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gold/15">
                      <MapPin className="text-gold" size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">Location</h3>
                    <p className="text-foreground/70 dark:text-foreground/80 text-xs md:text-sm">India</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-card/95 backdrop-blur-sm">
              <CardContent className="pt-6 md:pt-8">
                <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm md:text-base font-medium">Full Name *</Label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your name"
                        className="text-sm h-10"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm md:text-base font-medium">Email Address *</Label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="text-sm h-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {/* Inquiry Type */}
                    <div className="space-y-2">
                      <Label htmlFor="inquiryType" className="text-sm md:text-base font-medium">Inquiry Type *</Label>
                      <Select value={formData.inquiryType} onValueChange={(value) => setFormData(prev => ({ ...prev, inquiryType: value as any }))}>
                        <SelectTrigger id="inquiryType" className="text-sm h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consultation">Consultation</SelectItem>
                          <SelectItem value="collaboration">Collaboration</SelectItem>
                          <SelectItem value="quote">Get Quote</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm md:text-base font-medium">Subject *</Label>
                      <Input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="How can we help?"
                        className="text-sm h-10"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm md:text-base font-medium">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell us more about your project or inquiry..."
                      className="text-sm resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full gap-2 bg-gold text-black hover:bg-gold/90 font-semibold h-11 text-base shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Send size={20} />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>

                <p className="text-center text-foreground/70 dark:text-foreground/80 text-sm mt-6 md:mt-8">
                  We typically respond within 24 hours during business days.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer - Positioned above fixed background */}
      <div className="relative z-[15] bg-background">
        <Footer />
      </div>
    </div>
  );
}
