import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, Search, AlertTriangle } from "lucide-react";
import Logo from "@/components/ui/logo";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-slide-up">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-4">
            404
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Oops! Page not found
          </p>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Card className="card-premium animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500/10 to-red-500/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-xl">Page Not Found</CardTitle>
            <CardDescription>
              We couldn't find the page at <code className="bg-muted px-2 py-1 rounded text-sm">{location.pathname}</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button 
                onClick={() => navigate("/")}
                className="btn-accent w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                Go to Homepage
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="w-full border-border/50 hover:border-accent/50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
            
            <div className="pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground text-center">
                Need help? Contact our support team
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
