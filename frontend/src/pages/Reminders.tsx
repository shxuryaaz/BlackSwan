import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MessageSquare, Phone, Search, Filter, Download, Bell, Clock, TrendingUp, Zap } from "lucide-react";
import { getRemindersWithCustomerData, signOutUser } from "@/integrations/firebase/database";
import type { User } from 'firebase/auth';

interface RemindersProps {
  user: User;
}

interface Reminder {
  id: string;
  type: string;
  status: string;
  created_at: string;
  sent_at?: string;
  message_content: string;
  ai_tone: string;
  customer: {
    name: string;
    email: string;
  };
}

const Reminders = ({ user }: RemindersProps) => {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchReminders();
  }, [user.uid]);

  const fetchReminders = async () => {
    try {
      const data = await getRemindersWithCustomerData(user.uid);
      setReminders(data as Reminder[]);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOutUser();
    navigate("/");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "whatsapp":
        return <MessageSquare className="h-4 w-4" />;
      case "voice":
        return <Phone className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "email":
        return "bg-gradient-to-br from-blue-500/10 to-blue-500/5";
      case "whatsapp":
        return "bg-gradient-to-br from-green-500/10 to-green-500/5";
      case "voice":
        return "bg-gradient-to-br from-purple-500/10 to-purple-500/5";
      default:
        return "bg-gradient-to-br from-muted/50 to-muted/30";
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300",
      sent: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300",
      delivered: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300",
      failed: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300",
      responded: "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300"
    };

    return (
      <Badge className={`${colors[status as keyof typeof colors]} font-semibold`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredReminders = reminders.filter(reminder => {
    const matchesSearch = reminder.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reminder.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || reminder.status === statusFilter;
    const matchesType = typeFilter === "all" || reminder.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getResponseTime = (reminder: Reminder) => {
    if (reminder.status === 'responded' && reminder.sent_at) {
      const sentTime = new Date(reminder.sent_at).getTime();
      const responseTime = new Date(reminder.created_at).getTime();
      const diffHours = Math.round((responseTime - sentTime) / (1000 * 60 * 60));
      return `${diffHours}h`;
    }
    return "-";
  };

  // Calculate stats
  const totalReminders = reminders.length;
  const deliveredReminders = reminders.filter(r => r.status === 'delivered').length;
  const respondedReminders = reminders.filter(r => r.status === 'responded').length;
  const failedReminders = reminders.filter(r => r.status === 'failed').length;
  const deliveryRate = totalReminders > 0 ? Math.round((deliveredReminders / totalReminders) * 100) : 0;
  const responseRate = totalReminders > 0 ? Math.round((respondedReminders / totalReminders) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <Header user={user} onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-muted-foreground text-lg">Loading reminders...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-accent to-accent/80 rounded-xl">
              <Bell className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Reminder History
              </h1>
              <p className="text-muted-foreground text-lg">
                Track all payment reminders sent to your customers with AI-powered insights.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <Card className="stats-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{totalReminders}</p>
                    <p className="text-sm text-muted-foreground">Total Reminders</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Card className="stats-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{deliveryRate}%</p>
                    <p className="text-sm text-muted-foreground">Delivery Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <Card className="stats-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-lg">
                    <Zap className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{responseRate}%</p>
                    <p className="text-sm text-muted-foreground">Response Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <Card className="stats-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-red-500/10 to-red-500/5 rounded-lg">
                    <Clock className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{failedReminders}</p>
                    <p className="text-sm text-muted-foreground">Failed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filter Card */}
        <Card className="card-premium mb-6 animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-accent" />
              <span>Filter & Search</span>
            </CardTitle>
            <CardDescription>Find specific reminders and analyze performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-premium pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="input-premium w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="input-premium w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="voice">Voice</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-border/50 hover:border-accent/50 flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reminders List */}
        <Card className="table-premium animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <CardHeader>
            <CardTitle>Reminder History ({filteredReminders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredReminders.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gradient-to-br from-muted/50 to-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No reminders found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReminders.map((reminder) => (
                  <div key={reminder.id} className="p-6 bg-gradient-to-br from-muted/20 to-muted/10 rounded-xl border border-border/30 hover:bg-muted/30 transition-all duration-200">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className={`p-3 rounded-xl ${getIconBg(reminder.type)}`}>
                            {getIcon(reminder.type)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{reminder.customer.name}</h3>
                            <p className="text-sm text-muted-foreground">{reminder.customer.email}</p>
                          </div>
                          {getStatusBadge(reminder.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="p-3 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg">
                            <p className="text-xs text-muted-foreground font-medium">Sent At</p>
                            <p className="font-semibold text-foreground">{reminder.sent_at ? formatDate(reminder.sent_at) : 'Not sent'}</p>
                          </div>
                          <div className="p-3 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg">
                            <p className="text-xs text-muted-foreground font-medium">Response Time</p>
                            <p className="font-semibold text-foreground">{getResponseTime(reminder)}</p>
                          </div>
                          <div className="p-3 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg">
                            <p className="text-xs text-muted-foreground font-medium">AI Tone</p>
                            <p className="font-semibold text-foreground">{reminder.ai_tone.charAt(0).toUpperCase() + reminder.ai_tone.slice(1)}</p>
                          </div>
                          <div className="p-3 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg">
                            <p className="text-xs text-muted-foreground font-medium">Type</p>
                            <p className="font-semibold text-foreground">{reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)}</p>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-muted/30 to-muted/10 p-4 rounded-lg border border-border/30">
                          <p className="text-xs text-muted-foreground font-medium mb-2">Message Content</p>
                          <p className="text-sm text-foreground">{reminder.message_content}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Reminders;