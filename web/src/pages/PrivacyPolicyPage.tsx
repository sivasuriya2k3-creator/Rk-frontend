import { Shield, Lock, Eye, Database, UserCheck, Globe, Mail, FileText, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();
  
  const sections = [
    {
      icon: FileText,
      title: "Information We Collect",
      content: [
        "Personal identification information (Name, email address, phone number)",
        "Project details and requirements shared during consultation",
        "Payment and billing information for services rendered",
        "Technical data including IP address, browser type, and device information",
        "Usage data and analytics to improve our services"
      ]
    },
    {
      icon: Database,
      title: "How We Use Your Information",
      content: [
        "To provide and deliver the services you request",
        "To communicate with you about projects, updates, and support",
        "To process payments and maintain transaction records",
        "To improve our website, services, and user experience",
        "To send marketing communications (with your consent)",
        "To comply with legal obligations and protect our rights"
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        "We implement industry-standard security measures to protect your data",
        "All sensitive information is encrypted using SSL/TLS protocols",
        "Regular security audits and vulnerability assessments",
        "Restricted access to personal information on a need-to-know basis",
        "Secure backup systems to prevent data loss"
      ]
    },
    {
      icon: Eye,
      title: "Information Sharing",
      content: [
        "We do not sell, trade, or rent your personal information to third parties",
        "Information may be shared with service providers who assist in our operations",
        "Legal authorities when required by law or to protect our rights",
        "Business partners only with your explicit consent",
        "All third parties are bound by strict confidentiality agreements"
      ]
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: [
        "Access: Request a copy of the personal data we hold about you",
        "Correction: Request correction of inaccurate or incomplete information",
        "Deletion: Request deletion of your personal data",
        "Portability: Request transfer of your data to another service",
        "Objection: Object to processing of your personal data",
        "Withdrawal: Withdraw consent for marketing communications at any time"
      ]
    },
    {
      icon: Globe,
      title: "Cookies and Tracking",
      content: [
        "We use cookies to enhance your browsing experience",
        "Analytics cookies help us understand how visitors use our site",
        "Marketing cookies enable personalized content and advertisements",
        "You can control cookie preferences through your browser settings",
        "Essential cookies are necessary for website functionality"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-secondary/30 to-background">
        <div className="container mx-auto max-w-4xl">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="mb-8 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center border-2 border-accent/20">
                <Shield className="w-10 h-10 text-accent" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 break-words">
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-4 break-words">
              Your privacy is important to us. This policy outlines how RajKayal Digital Studio collects, uses, and protects your information.
            </p>
            <Badge className="bg-accent shadow-gold">
              Last Updated: November 2024
            </Badge>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-border bg-card">
            <CardContent className="p-8">
              <p className="text-muted-foreground leading-relaxed mb-4 break-words">
                At RajKayal Digital Studio, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains our practices regarding the collection, use, and disclosure of information that we receive through our website and services.
              </p>
              <p className="text-muted-foreground leading-relaxed break-words">
                By using our services, you agree to the terms outlined in this Privacy Policy. We encourage you to read this document carefully and contact us if you have any questions or concerns.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl space-y-8">
          {sections.map((section, index) => (
            <Card key={index} className="border-border hover:border-accent/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-accent" />
                  </div>
                  <span className="text-2xl break-words">{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.content.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span className="break-words">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl space-y-8">
          {/* Data Retention */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Database className="w-6 h-6 text-accent" />
                </div>
                <span className="text-2xl break-words">Data Retention</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed break-words">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce our agreements. When information is no longer needed, it is securely deleted or anonymized.
              </p>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <span className="text-2xl break-words">Children's Privacy</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed break-words">
                Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child, we will take steps to delete such information promptly.
              </p>
            </CardContent>
          </Card>

          {/* Policy Updates */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-accent" />
                </div>
                <span className="text-2xl break-words">Policy Updates</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed break-words">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes by posting the new policy on our website and updating the "Last Updated" date. We encourage you to review this policy periodically.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-border bg-card">
            <CardContent className="p-8 text-center">
              <Mail className="w-12 h-12 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4 break-words">Questions About Privacy?</h2>
              <p className="text-muted-foreground mb-6 break-words">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please don't hesitate to contact us.
              </p>
              <div className="space-y-2">
                <p className="text-foreground">
                  <strong>Email:</strong> <a href="mailto:rajkayal7281@gmail.com" className="text-accent hover:underline">rajkayal7281@gmail.com</a>
                </p>
                <p className="text-foreground">
                  <strong>Phone:</strong> <a href="tel:+918754616454" className="text-accent hover:underline">+91 8754616454</a>
                </p>
                <p className="text-foreground break-words">
                  <strong>Location:</strong> Trichy, Tamil Nadu, India
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
