import { FileText, AlertCircle, CheckCircle, XCircle, Scale, Shield, Gavel, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const TermsOfServicePage = () => {
  const navigate = useNavigate();
  
  const sections = [
    {
      icon: FileText,
      title: "1. Acceptance of Terms",
      content: "By accessing and using RajKayal Digital Studio's services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We reserve the right to modify these terms at any time, and your continued use constitutes acceptance of any changes."
    },
    {
      icon: CheckCircle,
      title: "2. Services Provided",
      content: "RajKayal Digital Studio provides creative digital services including web design and development, branding and identity, 3D animation, video production, UI/UX design, and digital strategy. The scope, timeline, and deliverables for each project will be defined in a separate agreement or statement of work.",
      list: [
        "Custom website design and development",
        "Brand identity and visual design services",
        "3D modeling and animation production",
        "UI/UX design for web and mobile applications",
        "Digital marketing and strategy consulting",
        "Video production and editing services"
      ]
    },
    {
      icon: Scale,
      title: "3. Client Responsibilities",
      content: "To ensure successful project completion, clients agree to:",
      list: [
        "Provide accurate and timely information, content, and materials",
        "Respond to queries and review deliverables within agreed timeframes",
        "Ensure they have rights to all materials provided to us",
        "Make payments according to the agreed schedule",
        "Provide constructive feedback during revision stages",
        "Communicate changes or concerns promptly"
      ]
    },
    {
      icon: Gavel,
      title: "4. Intellectual Property Rights",
      content: "Upon full payment, clients receive ownership of the final deliverables as specified in the project agreement. However:",
      list: [
        "RajKayal retains ownership of preliminary concepts and unused designs",
        "We reserve the right to showcase completed work in our portfolio",
        "Third-party assets (fonts, stock images, plugins) are subject to their respective licenses",
        "Source code and proprietary tools remain our intellectual property unless explicitly transferred",
        "Clients must not reproduce, modify, or distribute work without proper licensing"
      ]
    },
    {
      icon: AlertCircle,
      title: "5. Payment Terms",
      content: "Clear payment terms ensure smooth project execution:",
      list: [
        "Project cost will be outlined in a detailed quote or proposal",
        "50% deposit required before project commencement",
        "Remaining balance due upon project completion",
        "Payment accepted via bank transfer or online payment systems",
        "Late payments may incur interest charges",
        "All prices are in Indian Rupees (INR) unless stated otherwise",
        "Refunds are subject to our cancellation policy"
      ]
    },
    {
      icon: XCircle,
      title: "6. Project Revisions and Changes",
      content: "We include a specified number of revisions in each project:",
      list: [
        "Revision limits are defined in the project agreement",
        "Additional revisions beyond the scope will incur extra charges",
        "Major scope changes require a new agreement and adjusted timeline",
        "Revision requests must be consolidated and clearly communicated",
        "Approval of deliverables must be in writing",
        "Changes after approval may delay the project timeline"
      ]
    },
    {
      icon: Shield,
      title: "7. Confidentiality",
      content: "We respect the confidentiality of client information:",
      list: [
        "All proprietary client information will be kept confidential",
        "Non-disclosure agreements available upon request",
        "Client data is stored securely and accessed only by authorized personnel",
        "We do not share client information with third parties without consent",
        "Confidentiality obligations survive termination of the agreement"
      ]
    },
    {
      icon: FileText,
      title: "8. Project Timeline",
      content: "Timelines are estimated based on project scope and client cooperation:",
      list: [
        "Project timelines are outlined in the initial agreement",
        "Delays caused by client may extend the completion date",
        "We strive to meet deadlines but cannot guarantee exact delivery dates",
        "Rush projects may incur additional fees",
        "Timeline extensions must be mutually agreed upon"
      ]
    },
    {
      icon: XCircle,
      title: "9. Cancellation and Refunds",
      content: "Our cancellation policy:",
      list: [
        "Projects can be cancelled with written notice",
        "Deposits are non-refundable once work has commenced",
        "Partial refunds may be issued for undelivered work",
        "Completed work remains our property until full payment",
        "Client retains no rights to work if payment is not received",
        "We reserve the right to terminate projects for breach of terms"
      ]
    },
    {
      icon: AlertCircle,
      title: "10. Warranties and Disclaimers",
      content: "Understanding limitations of our services:",
      list: [
        "We warrant that work will be performed professionally and with reasonable care",
        "We do not guarantee specific business results or outcomes",
        "Third-party services and tools are provided 'as is'",
        "Website performance depends on hosting and external factors",
        "We are not liable for losses resulting from website downtime",
        "All work is subject to technical limitations and industry standards"
      ]
    },
    {
      icon: Scale,
      title: "11. Limitation of Liability",
      content: "Our liability is limited as follows:",
      list: [
        "Total liability limited to the amount paid for the specific project",
        "Not liable for indirect, incidental, or consequential damages",
        "Not responsible for third-party services or content",
        "Client responsible for backup of their own data",
        "Force majeure events exempt us from liability",
        "Legal disputes subject to jurisdiction of Trichy, Tamil Nadu, India"
      ]
    },
    {
      icon: Gavel,
      title: "12. Governing Law",
      content: "These terms are governed by the laws of India. Any disputes arising from these terms or our services shall be subject to the exclusive jurisdiction of the courts in Trichy, Tamil Nadu, India. Both parties agree to attempt resolution through negotiation before pursuing legal action."
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
                <FileText className="w-10 h-10 text-accent" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 break-words">
              Terms of <span className="gradient-text">Service</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-4 break-words">
              Please read these terms carefully before using our services. These terms govern your use of RajKayal Digital Studio's services.
            </p>
            <Badge className="bg-accent shadow-gold">
              Effective Date: November 2024
            </Badge>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <Alert className="border-accent/50 bg-accent/5">
            <AlertCircle className="h-5 w-5 text-accent" />
            <AlertDescription className="text-foreground">
              <strong>Important:</strong> By engaging our services, you agree to these Terms of Service. Please ensure you understand and accept these terms before proceeding with any project.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl space-y-8">
          {sections.map((section, index) => (
            <Card key={index} className="border-border hover:border-accent/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-accent" />
                  </div>
                  <span className="text-xl md:text-2xl break-words">{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4 break-words">
                  {section.content}
                </p>
                {section.list && (
                  <ul className="space-y-2 mt-4">
                    {section.list.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                        <span className="break-words">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Agreement Acceptance */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-accent/30 bg-card">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-12 h-12 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4 break-words">Agreement and Contact</h2>
              <p className="text-muted-foreground mb-6 break-words">
                By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you have any questions or need clarification, please contact us.
              </p>
              <div className="space-y-2 text-center">
                <p className="text-foreground">
                  <strong>Email:</strong> <a href="mailto:rajkayal7281@gmail.com" className="text-accent hover:underline break-words">rajkayal7281@gmail.com</a>
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

export default TermsOfServicePage;
