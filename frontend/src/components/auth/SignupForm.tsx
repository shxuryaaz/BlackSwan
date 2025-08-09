import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, User, AlertCircle, ArrowRight, CheckCircle } from "lucide-react";
import GoogleSignInButton from "./GoogleSignInButton";

interface SignupFormProps {
  onSignup: (email: string, password: string, fullName: string) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  onSwitchToLogin: () => void;
  loading: boolean;
  error: string;
}

const SignupForm = ({ onSignup, onGoogleSignIn, onSwitchToLogin, loading, error }: SignupFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Validation
    if (!email || !password || !confirmPassword || !fullName) {
      setValidationError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return;
    }

    try {
      await onSignup(email, password, fullName);
    } catch (err) {
      // Error is handled by parent component
    }
  };

  const passwordRequirements = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Passwords match", met: password === confirmPassword && password.length > 0 }
  ];

  return (
    <div className="space-y-6">
      {(error || validationError) && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">{error || validationError}</AlertDescription>
        </Alert>
      )}

      <GoogleSignInButton 
        onGoogleSignIn={onGoogleSignIn}
        loading={loading}
        children="Sign up with Google"
      />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-4 text-muted-foreground font-medium">
            Or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-semibold">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-premium pl-10"
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-premium pl-10"
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-premium pl-10"
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-semibold">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-premium pl-10"
              disabled={loading}
            />
          </div>
        </div>

        {/* Password Requirements */}
        {password.length > 0 && (
          <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
            <p className="text-xs font-medium text-muted-foreground">Password Requirements:</p>
            <div className="space-y-1">
              {passwordRequirements.map((requirement, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {requirement.met ? (
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border border-muted-foreground/30" />
                  )}
                  <span className={`text-xs ${requirement.met ? 'text-green-700' : 'text-muted-foreground'}`}>
                    {requirement.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button type="submit" className="btn-accent w-full" disabled={loading}>
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin"></div>
              <span>Creating Account...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>Create Account</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          )}
        </Button>
      </form>

      <div className="text-center pt-4">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto font-semibold text-accent hover:text-accent/80"
            onClick={onSwitchToLogin}
            disabled={loading}
          >
            Sign in
          </Button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;