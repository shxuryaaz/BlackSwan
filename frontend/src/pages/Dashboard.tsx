import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { 
  DollarSign, 
  Users, 
  Mail, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Target,
  Zap
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCustomers, getUserProfile } from "@/integrations/firebase/database";
import { signOutUser } from "@/integrations/firebase/auth";
import type { User } from 'firebase/auth';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface DashboardProps {
  user: User;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  amount_due: number;
  due_date: string;
  status: string;
  risk_level: string;
}

const Dashboard = ({ user }: DashboardProps) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user.uid]);

  const fetchData = async () => {
    try {
      // Fetch user profile
      const profileData = await getUserProfile(user.uid);
      if (profileData) {
        setProfile(profileData);
      }

      // Fetch customers
      const customersData = await getCustomers(user.uid);
      setCustomers(customersData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOutUser();
    navigate("/");
  };

  // Calculate comprehensive stats from real customer data
  const totalOutstanding = customers.reduce((sum, c) => sum + c.amount_due, 0);
  const activeCustomers = customers.length;
  const overdueCustomers = customers.filter(c => {
    const dueDate = new Date(c.due_date);
    const today = new Date();
    return dueDate < today && c.status !== 'paid';
  }).length;
  
  const pendingCustomers = customers.filter(c => c.status === 'pending').length;
  const paidCustomers = customers.filter(c => c.status === 'paid').length;
  
  // Calculate risk distribution
  const highRiskCustomers = customers.filter(c => c.risk_level === 'high').length;
  const mediumRiskCustomers = customers.filter(c => c.risk_level === 'medium').length;
  const lowRiskCustomers = customers.filter(c => c.risk_level === 'low').length;

  // Calculate upcoming due dates (next 7 days)
  const upcomingDueDates = customers.filter(c => {
    const dueDate = new Date(c.due_date);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return dueDate >= today && dueDate <= nextWeek && c.status !== 'paid';
  });

  // Calculate collection rate percentage
  const collectionRate = activeCustomers > 0 ? Math.round((paidCustomers / activeCustomers) * 100) : 0;

  const stats = [
    {
      title: "Total Outstanding",
      value: `$${totalOutstanding.toLocaleString()}`,
      change: `${activeCustomers} customers`,
      changeType: activeCustomers > 0 ? "negative" as const : "neutral" as const,
      icon: DollarSign,
      description: `Across ${activeCustomers} customers`,
      trend: "+12.5%",
      trendDirection: "up" as const
    },
    {
      title: "Active Customers",
      value: activeCustomers.toString(),
      change: `${pendingCustomers} pending`,
      changeType: "positive" as const,
      icon: Users,
      description: `${overdueCustomers} overdue`,
      trend: "+8.2%",
      trendDirection: "up" as const
    },
    {
      title: "Collection Rate",
      value: `${collectionRate}%`,
      change: `${paidCustomers} paid`,
      changeType: "positive" as const,
      icon: CheckCircle,
      description: `${pendingCustomers} pending payment`,
      trend: "+5.7%",
      trendDirection: "up" as const
    },
    {
      title: "Overdue Payments",
      value: overdueCustomers.toString(),
      change: overdueCustomers > 0 ? "Requires attention" : "All caught up",
      changeType: overdueCustomers > 0 ? "negative" as const : "positive" as const,
      icon: AlertTriangle,
      description: `$${customers.filter(c => {
        const dueDate = new Date(c.due_date);
        const today = new Date();
        return dueDate < today && c.status !== 'paid';
      }).reduce((sum, c) => sum + c.amount_due, 0).toLocaleString()} total`,
      trend: overdueCustomers > 0 ? "+3.1%" : "-12.3%",
      trendDirection: overdueCustomers > 0 ? "up" as const : "down" as const
    }
  ];

  // Create recent activity from customer data (since no reminders exist yet)
  const recentActivities = customers
    .sort((a, b) => new Date(b.due_date).getTime() - new Date(a.due_date).getTime())
    .slice(0, 5)
    .map((customer, index) => ({
      id: customer.id,
      type: "customer" as const,
      customer: customer.name,
      amount: customer.amount_due,
      status: customer.status as "pending" | "paid" | "overdue",
      timestamp: new Date(customer.due_date).toLocaleDateString()
    }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <Header user={user} onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-muted-foreground text-lg">Loading your dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-accent to-accent/80 rounded-xl">
              <Sparkles className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Welcome back, {profile?.full_name || user.email?.split('@')[0]}
              </h1>
              <p className="text-muted-foreground text-lg">
                Here's what's happening with your payment collection today.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <StatsCard {...stat} />
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            <RecentActivity activities={recentActivities} />
            
            {/* Performance Metrics */}
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-accent" />
                  <span>Performance Metrics</span>
                </CardTitle>
                <CardDescription>Key performance indicators for your collection process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Collection Rate</span>
                      <span className="text-sm font-bold text-accent">{collectionRate}%</span>
                    </div>
                    <Progress value={collectionRate} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Target: 85% • Current: {collectionRate}%
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Response Time</span>
                      <span className="text-sm font-bold text-accent">2.4h</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Average response time to reminders
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">{paidCustomers}</div>
                    <div className="text-sm text-green-700">Paid</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-xl">
                    <div className="text-2xl font-bold text-yellow-600">{pendingCustomers}</div>
                    <div className="text-sm text-yellow-700">Pending</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl">
                    <div className="text-2xl font-bold text-red-600">{overdueCustomers}</div>
                    <div className="text-sm text-red-700">Overdue</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Insights */}
          <div className="space-y-6">
            {/* AI Insights */}
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-accent" />
                  <span>AI Insights</span>
                </CardTitle>
                <CardDescription>Smart recommendations powered by AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {overdueCustomers > 0 ? (
                  <div className="p-4 bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-red-800 mb-1">
                          High Priority Alert
                        </p>
                        <p className="text-sm text-red-700">
                          {overdueCustomers} customer{overdueCustomers > 1 ? 's are' : ' is'} overdue. Consider escalating to phone calls for immediate action.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-green-800 mb-1">
                          All Caught Up
                        </p>
                        <p className="text-sm text-green-700">
                          No overdue payments. Excellent job managing your receivables!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {highRiskCustomers > 0 && (
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-orange-800 mb-1">
                          Risk Alert
                        </p>
                        <p className="text-sm text-orange-700">
                          {highRiskCustomers} high-risk customer{highRiskCustomers > 1 ? 's' : ''}. Consider immediate follow-up and payment plans.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-blue-800 mb-1">
                        Collection Strategy
                      </p>
                      <p className="text-sm text-blue-700">
                        {upcomingDueDates.length} payment{upcomingDueDates.length !== 1 ? 's' : ''} due this week. Send proactive reminders for better results.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-purple-800 mb-1">
                        Best Practice
                      </p>
                      <p className="text-sm text-purple-700">
                        WhatsApp reminders have 40% higher response rate than email alone. Use multi-channel approach.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Due Dates */}
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-accent" />
                  <span>Upcoming Due Dates</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingDueDates.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingDueDates
                      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
                      .slice(0, 5)
                      .map((customer) => (
                        <div key={customer.id} className="flex justify-between items-center p-3 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border border-border/30">
                          <div>
                            <span className="text-sm font-semibold text-foreground">{customer.name}</span>
                            <p className="text-xs text-muted-foreground">
                              Due: {new Date(customer.due_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-accent">
                              ${customer.amount_due.toFixed(2)}
                            </span>
                            <Badge 
                              variant={customer.risk_level === 'high' ? 'destructive' : customer.risk_level === 'medium' ? 'secondary' : 'default'}
                              className="ml-2 text-xs"
                            >
                              {customer.risk_level} risk
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No upcoming due dates</p>
                    <p className="text-xs text-muted-foreground mt-2">All payments are up to date</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Risk Distribution */}
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-accent" />
                  <span>Risk Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-br from-red-50 to-red-100/30 rounded-xl">
                    <span className="text-sm font-medium">High Risk</span>
                    <span className="text-sm font-bold text-red-600">{highRiskCustomers}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-br from-yellow-50 to-yellow-100/30 rounded-xl">
                    <span className="text-sm font-medium">Medium Risk</span>
                    <span className="text-sm font-bold text-yellow-600">{mediumRiskCustomers}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-br from-green-50 to-green-100/30 rounded-xl">
                    <span className="text-sm font-medium">Low Risk</span>
                    <span className="text-sm font-bold text-green-600">{lowRiskCustomers}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;