import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { signIn, signUp, signInWithGoogle } from "@/integrations/firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Shield, Zap, Users } from "lucide-react";
import Logo from "@/components/ui/logo";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError("");
    
    try {
      await signIn(email, password);
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to your account.",
      });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
      toast({
        title: "Sign in failed",
        description: err.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    setError("");
    
    try {
      await signUp(email, password, fullName);
      toast({
        title: "Account created!",
        description: "Welcome to BlackSwan. Your account has been created successfully.",
      });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
      toast({
        title: "Sign up failed",
        description: err.message || "Please check your information and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    
    try {
      await signInWithGoogle();
      toast({
        title: "Welcome!",
        description: "Successfully signed in with Google.",
      });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
      toast({
        title: "Google sign in failed",
        description: err.message || "Please try again or use email sign in.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: Zap,
      title: "AI-Powered",
      description: "Intelligent payment reminders that adapt to customer behavior"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with end-to-end encryption"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together seamlessly with your finance team"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Auth Form */}
        <div className="animate-slide-up">
          <div className="text-center lg:text-left mb-8">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
              <Logo size="lg" />
              <Badge className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground px-3 py-1 text-sm font-semibold">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {isLogin ? "Welcome Back" : "Get Started"}
            </h1>
            <p className="text-xl text-muted-foreground">
              {isLogin 
                ? "Sign in to your BlackSwan account to continue managing your payment collections."
                : "Join thousands of finance teams automating their payment reminders."
              }
            </p>
          </div>

          <Card className="card-premium max-w-md mx-auto lg:mx-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {isLogin ? "Sign In" : "Create Account"}
              </CardTitle>
              <CardDescription>
                {isLogin 
                  ? "Enter your credentials to access your dashboard"
                  : "Start your free trial with no credit card required"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLogin ? (
                <LoginForm
                  onLogin={handleLogin}
                  onGoogleSignIn={handleGoogleSignIn}
                  onSwitchToSignup={() => setIsLogin(false)}
                  loading={loading}
                  error={error}
                />
              ) : (
                <SignupForm
                  onSignup={handleSignup}
                  onGoogleSignIn={handleGoogleSignIn}
                  onSwitchToLogin={() => setIsLogin(true)}
                  loading={loading}
                  error={error}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Benefits */}
        <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Why Finance Teams Choose BlackSwan
              </h2>
              <p className="text-lg text-muted-foreground">
                Join 500+ finance professionals who have transformed their collection process
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl flex-shrink-0">
                    <benefit.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">500+</div>
                <div className="text-sm text-muted-foreground">Teams</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">35%</div>
                <div className="text-sm text-muted-foreground">Faster Collections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">92%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>

            {/* Testimonial */}
            <Card className="card-premium">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-accent-foreground font-semibold">S</span>
                  </div>
                  <div>
                    <p className="text-muted-foreground italic mb-3">
                      "BlackSwan has completely transformed our collection process. We've seen a 40% improvement in payment times."
                    </p>
                    <div>
                      <p className="font-semibold text-foreground">Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">CFO, TechFlow Inc</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;