import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Brain, 
  Mail, 
  MessageSquare, 
  Phone, 
  Shield, 
  TrendingUp, 
  Users,
  CheckCircle,
  Sparkles,
  Zap,
  Target,
  Clock,
  Star,
  Award,
  Globe
} from "lucide-react";
import type { User } from 'firebase/auth';
import Logo from "@/components/ui/logo";

interface IndexProps {
  user: User | null;
}

const Index = ({ user }: IndexProps) => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Messages",
      description: "Intelligent tone adjustment based on customer history and payment urgency",
      color: "from-black to-gray-900"
    },
    {
      icon: Mail,
      title: "Multi-Channel Reminders",
      description: "Send via Email, WhatsApp, and Voice calls for maximum reach",
      color: "from-black to-gray-900"
    },
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description: "Track delivery rates, response times, and payment success metrics",
      color: "from-black to-gray-900"
    },
    {
      icon: Shield,
      title: "Risk Assessment",
      description: "Automated risk scoring and escalation rules for problem accounts",
      color: "from-black to-gray-900"
    }
  ];

  const benefits = [
    "Reduce manual work by 80% with automation",
    "Improve collection rates by up to 35%",
    "Maintain professional customer relationships",
    "Real-time dashboard and reporting",
    "Secure API integrations with major providers",
    "Customizable message templates and tones"
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CFO, TechFlow Inc",
              content: "BlackSwan has transformed our collection process. We've seen a 40% improvement in payment times.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Finance Director, GrowthCorp",
      content: "The AI-powered messaging is incredible. Our customers actually respond faster now.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "VP Finance, StartupXYZ",
      content: "Finally, a solution that understands the delicate balance between persistence and professionalism.",
      rating: 5
    }
  ];

  const stats = [
    { value: "500+", label: "Finance Teams" },
    { value: "35%", label: "Faster Collections" },
    { value: "92%", label: "Delivery Rate" },
    { value: "24/7", label: "AI Support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <header className="nav-premium sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="md" />
          {user ? (
            <Button 
              onClick={() => navigate("/dashboard")}
              className="btn-accent"
            >
              Go to Dashboard
            </Button>
          ) : (
            <Button 
              onClick={() => navigate("/auth")}
              className="btn-accent"
            >
              Get Started
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-premium py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="animate-slide-up">
            <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-8 leading-tight">
              Smart Payment
              <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent"> Reminder Agent</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              Automate your payment collection process with AI-powered reminders. 
              Send personalized messages via email, WhatsApp, and voice calls to improve cash flow.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              {user ? (
                <Button 
                  size="lg" 
                  onClick={() => navigate("/dashboard")}
                  className="btn-accent text-lg px-8 py-4"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  onClick={() => navigate("/auth")}
                  className="btn-accent text-lg px-8 py-4"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-gradient-to-br from-muted/30 to-muted/10">
        <div className="container mx-auto">
          <div className="text-center mb-20 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Powerful Features for Finance Teams
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to streamline payment collection and maintain excellent customer relationships.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <Card className="card-premium group hover:scale-105 transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-up">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
                Why Finance Teams Choose BlackSwan
              </h2>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="p-2 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-accent" />
                    </div>
                    <p className="text-lg text-muted-foreground">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Card className="card-premium p-8 text-center">
                <CardHeader>
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-accent to-accent/80 rounded-xl">
                      <Users className="h-8 w-8 text-accent-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-foreground">Join 500+ Finance Teams</CardTitle>
                      <CardDescription className="text-lg">
                        Already improving their collection process
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl">
                      <div className="text-3xl font-bold text-green-600">35%</div>
                      <div className="text-sm text-green-700 font-medium">Faster Collections</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl">
                      <div className="text-3xl font-bold text-blue-600">92%</div>
                      <div className="text-sm text-blue-700 font-medium">Delivery Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-gradient-to-br from-muted/30 to-muted/10">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Trusted by Finance Leaders
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See what finance professionals are saying about BlackSwan
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <Card className="card-premium p-6 h-full">
                  <CardContent className="text-center">
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto text-center">
          <div className="animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Transform Your Payment Collection?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Join finance teams worldwide who have automated their payment reminders and improved cash flow with BlackSwan.
            </p>
            {user ? (
              <Button 
                size="lg" 
                onClick={() => navigate("/dashboard")}
                className="btn-accent text-lg px-8 py-4"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            ) : (
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="btn-accent text-lg px-8 py-4"
              >
                <span>Get Started Now</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-4 bg-gradient-to-br from-muted/20 to-muted/10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center md:text-left">
              <Logo size="md" />
              <p className="text-sm text-muted-foreground mt-4">
                Built for modern finance teams.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Features</li>
                <li>Pricing</li>
                <li>API</li>
                <li>Integrations</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Help Center</li>
                <li>Documentation</li>
                <li>Status</li>
                <li>Security</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 BlackSwan. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
