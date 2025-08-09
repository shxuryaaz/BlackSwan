import { Button } from "@/components/ui/button";
import { LogOut, User, Settings, Menu, X, BarChart3, Users, Bell } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "@/components/ui/logo";
import type { User as FirebaseUser } from 'firebase/auth';
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  user?: FirebaseUser;
  onLogout?: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "Reminders", href: "/reminders", icon: Bell },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="nav-premium sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Logo size="md" />
            {user && (
              <Badge variant="secondary" className="hidden sm:flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-medium">Live</span>
              </Badge>
            )}
          </div>

          {/* Desktop Navigation */}
          {user && (
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Button
                    key={item.name}
                    variant={isActive(item.href) ? "default" : "ghost"}
                    onClick={() => navigate(item.href)}
                    className={`relative px-4 py-2 rounded-xl transition-all duration-300 ${
                      isActive(item.href)
                        ? "bg-gradient-to-r from-accent to-accent/90 text-accent-foreground shadow-button"
                        : "hover:bg-muted/50 hover:text-accent"
                    }`}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {item.name}
                    {isActive(item.href) && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent-foreground rounded-full"></div>
                    )}
                  </Button>
                );
              })}
            </nav>
          )}

          {/* User Section */}
          {user && (
            <div className="flex items-center space-x-4">
              {/* Desktop User Info */}
              <div className="hidden sm:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {user.displayName || user.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-muted-foreground">Finance Manager</p>
                </div>
                <Avatar className="h-8 w-8 border-2 border-accent/20">
                  <AvatarImage src={user.photoURL || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground text-sm font-semibold">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Logout Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="hidden sm:flex items-center space-x-2 border-border/50 hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          )}

          {/* Get Started Button for non-authenticated users */}
          {!user && (
            <Button 
              onClick={() => navigate("/auth")}
              className="btn-accent"
            >
              Get Started
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && user && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/50">
            <nav className="flex flex-col space-y-2 pt-4">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Button
                    key={item.name}
                    variant={isActive(item.href) ? "default" : "ghost"}
                    onClick={() => {
                      navigate(item.href);
                      setMobileMenuOpen(false);
                    }}
                    className={`justify-start px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive(item.href)
                        ? "bg-gradient-to-r from-accent to-accent/90 text-accent-foreground shadow-button"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <IconComponent className="h-4 w-4 mr-3" />
                    {item.name}
                  </Button>
                );
              })}
              
              {/* Mobile User Info */}
              <div className="flex items-center space-x-3 px-4 py-3 bg-muted/30 rounded-xl">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.photoURL || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground text-sm font-semibold">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {user.displayName || user.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-muted-foreground">Finance Manager</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  className="border-border/50 hover:border-accent/50"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;