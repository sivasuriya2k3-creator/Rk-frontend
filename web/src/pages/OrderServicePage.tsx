import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import orderService, { CreateOrderData } from '@/lib/orderService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react';

const OrderServicePage = () => {
  const navigate = useNavigate();
  const { serviceName } = useParams<{ serviceName: string }>();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<CreateOrderData>({
    service: serviceName || '',
    title: '',
    description: '',
    budget: 0,
    timeline: '',
    priority: 'medium',
    requirements: '',
    clientInfo: {
      companyName: '',
      industry: '',
      website: '',
      phone: '',
      preferredContactMethod: 'email'
    }
  });

  const services = [
    {
      title: "Web Design & Development",
      startingPrice: 5000,
      priceRange: "₹5,000 - ₹6,00,000",
      pricingUnit: "",
      features: ["Responsive Design", "SEO Optimized", "Fast Loading", "Mobile First"]
    },
    {
      title: "Branding & Identity",
      startingPrice: 1000,
      priceRange: "₹1,000 - ₹1,00,000",
      pricingUnit: "",
      features: ["Logo Design", "Brand Guidelines", "Color Palette", "Typography"]
    },
    {
      title: "3D Animation",
      startingPrice: 2111,
      priceRange: "₹2,111 - ₹8,00,000",
      pricingUnit: "per Minute",
      features: ["3D Modeling", "Motion Graphics", "Product Visualization", "Character Animation"]
    },
    {
      title: "Video Production",
      startingPrice: 5000,
      priceRange: "₹5,000 - ₹15,000",
      pricingUnit: "per Hour",
      features: ["Script Writing", "HD Video", "Editing", "Sound Design"]
    },
    {
      title: "UI/UX Design",
      startingPrice: 5000,
      priceRange: "₹5,000 - ₹50,000",
      pricingUnit: "per Screen",
      features: ["User Research", "Wireframing", "Prototyping", "Usability Testing"]
    },
    {
      title: "Digital Strategy",
      startingPrice: 10000,
      priceRange: "₹10,000 - ₹2,00,000",
      pricingUnit: "per Month",
      features: ["Market Analysis", "Content Strategy", "Social Media", "Performance Tracking"]
    }
  ];

  const currentService = services.find(s => s.title === serviceName);

  useEffect(() => {
    if (serviceName) {
      setFormData(prev => ({ ...prev, service: serviceName }));
    }
  }, [serviceName]);

  const handleChange = (field: keyof CreateOrderData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!formData.title.trim()) {
      setError('Project title is required');
      setIsLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError('Project description is required');
      setIsLoading(false);
      return;
    }

    if (formData.budget < 8300) {
      setError('Budget must be at least ₹8,300');
      setIsLoading(false);
      return;
    }

    if (!formData.timeline) {
      setError('Please select a timeline');
      setIsLoading(false);
      return;
    }

    try {
      await orderService.createOrder(formData);
      setSuccess(true);
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err: any) {
      console.error('Order creation error:', err);
      setError(err.response?.data?.error || 'Failed to create order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <Card className="w-full max-w-md bg-card border-border">
            <CardContent className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold gradient-text mb-2">Order Submitted!</h2>
              <p className="text-muted-foreground mb-6">
                Your order has been successfully submitted. We'll review it and get back to you soon.
              </p>
              <Button onClick={() => navigate('/orders')} className="w-full bg-accent hover:bg-accent/90 shadow-gold">
                View My Orders
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 max-w-4xl pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate('/services')}
            variant="outline"
            className="mb-8 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Button>

          <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2 break-words">Order {serviceName}</h1>
          <p className="text-muted-foreground break-words">Fill out the details below to place your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Info */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Service Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentService && (
                  <>
                    <div className="flex items-start justify-between">
                      <span className="text-muted-foreground">Pricing</span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">{(currentService as any).priceRange}</div>
                        {(currentService as any).pricingUnit && (
                          <div className="text-xs text-muted-foreground mt-1">{(currentService as any).pricingUnit}</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-2">What's Included:</h4>
                      <ul className="space-y-1">
                        {currentService.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-center">
                            <CheckCircle className="w-3 h-3 text-accent mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Form */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Project Details</CardTitle>
                <CardDescription>
                  Tell us about your project requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Client Information Section */}
                  <div className="space-y-4 p-4 border border-border rounded-lg">
                    <h3 className="text-lg font-semibold text-foreground flex items-center">
                      👤 Client Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Company Name</label>
                        <Input
                          type="text"
                          value={formData.clientInfo?.companyName || ''}
                          onChange={(e) => handleChange('clientInfo', { 
                            ...formData.clientInfo, 
                            companyName: e.target.value 
                          })}
                          placeholder="Your Company Name"
                          disabled={isLoading}
                          className="bg-secondary border-border text-foreground"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Industry</label>
                        <Select
                          value={formData.clientInfo?.industry || ''}
                          onValueChange={(value) => handleChange('clientInfo', { 
                            ...formData.clientInfo, 
                            industry: value 
                          })}
                          disabled={isLoading}
                        >
                          <SelectTrigger className="bg-secondary border-border text-foreground">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="ecommerce">E-commerce</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="real-estate">Real Estate</SelectItem>
                            <SelectItem value="restaurant">Restaurant & Food</SelectItem>
                            <SelectItem value="fashion">Fashion & Beauty</SelectItem>
                            <SelectItem value="nonprofit">Non-profit</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Current Website</label>
                        <Input
                          type="url"
                          value={formData.clientInfo?.website || ''}
                          onChange={(e) => handleChange('clientInfo', { 
                            ...formData.clientInfo, 
                            website: e.target.value 
                          })}
                          placeholder="https://yourwebsite.com"
                          disabled={isLoading}
                          className="bg-secondary border-border text-foreground"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Phone Number</label>
                        <Input
                          type="tel"
                          value={formData.clientInfo?.phone || ''}
                          onChange={(e) => handleChange('clientInfo', { 
                            ...formData.clientInfo, 
                            phone: e.target.value 
                          })}
                          placeholder="+1 (555) 123-4567"
                          disabled={isLoading}
                          className="bg-secondary border-border text-foreground"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Preferred Contact Method</label>
                      <Select
                        value={formData.clientInfo?.preferredContactMethod || 'email'}
                        onValueChange={(value: any) => handleChange('clientInfo', { 
                          ...formData.clientInfo, 
                          preferredContactMethod: value 
                        })}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="bg-secondary border-border text-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="email">📧 Email</SelectItem>
                          <SelectItem value="phone">📞 Phone Call</SelectItem>
                          <SelectItem value="whatsapp">💬 WhatsApp</SelectItem>
                          <SelectItem value="teams">🎥 Microsoft Teams</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Project Details Section */}
                  <div className="space-y-4 p-4 border border-border rounded-lg">
                    <h3 className="text-lg font-semibold text-foreground flex items-center">
                      🎯 Project Details
                    </h3>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Project Title *</label>
                    <Input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="e.g., E-commerce Website Redesign"
                      required
                      disabled={isLoading}
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Project Description *</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Describe your project in detail..."
                      rows={4}
                      required
                      disabled={isLoading}
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Budget (INR) *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-muted-foreground">₹</span>
                        <Input
                          type="number"
                          value={formData.budget || ''}
                          onChange={(e) => handleChange('budget', parseInt(e.target.value) || 0)}
                          placeholder="415000"
                          min="8300"
                          required
                          disabled={isLoading}
                          className="bg-secondary border-border text-foreground pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Timeline *</label>
                      <Select
                        value={formData.timeline}
                        onValueChange={(value) => handleChange('timeline', value)}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="bg-secondary border-border text-foreground">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                          <SelectItem value="2-4 weeks">2-4 weeks</SelectItem>
                          <SelectItem value="1-2 months">1-2 months</SelectItem>
                          <SelectItem value="2-3 months">2-3 months</SelectItem>
                          <SelectItem value="3-6 months">3-6 months</SelectItem>
                          <SelectItem value="6+ months">6+ months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Priority Level</label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: any) => handleChange('priority', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="bg-secondary border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="low">Low Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Additional Requirements</label>
                    <Textarea
                      value={formData.requirements || ''}
                      onChange={(e) => handleChange('requirements', e.target.value)}
                      placeholder="Any specific requirements, preferences, or additional details..."
                      rows={3}
                      disabled={isLoading}
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r bg-accent hover:bg-accent/90 font-semibold py-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Submitting Order...
                      </>
                    ) : (
                      'Submit Order'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderServicePage;
