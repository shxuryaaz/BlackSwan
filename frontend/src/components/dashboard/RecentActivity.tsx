import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Mail, MessageSquare, Phone, Users, DollarSign, Activity } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "email" | "whatsapp" | "voice" | "customer";
  customer: string;
  amount: number;
  status: "sent" | "delivered" | "failed" | "responded" | "pending" | "paid" | "overdue";
  timestamp: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity = ({ activities }: RecentActivityProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "whatsapp":
        return <MessageSquare className="h-4 w-4" />;
      case "voice":
        return <Phone className="h-4 w-4" />;
      case "customer":
        return <Users className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
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
      case "customer":
        return "bg-gradient-to-br from-accent/10 to-accent/5";
      default:
        return "bg-gradient-to-br from-muted/50 to-muted/30";
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      sent: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300",
      delivered: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300",
      failed: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300",
      responded: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300",
      pending: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300",
      paid: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300",
      overdue: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300"
    };

    return (
      <Badge className={`${colors[status as keyof typeof colors]} font-semibold`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getActivityDescription = (activity: ActivityItem) => {
    if (activity.type === "customer") {
      return `Payment due: $${activity.amount.toLocaleString()}`;
    }
    return `$${activity.amount.toLocaleString()} reminder via ${activity.type}`;
  };

  return (
    <Card className="card-premium">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-accent" />
          <span>Recent Activity</span>
        </CardTitle>
        <CardDescription>
          {activities.some(a => a.type !== "customer") 
            ? "Latest payment reminders sent to customers"
            : "Recent customer payment activities"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-muted/50 to-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No recent activity</h3>
            <p className="text-muted-foreground">Start sending reminders to see activity here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div 
                key={activity.id} 
                className="flex items-center justify-between p-4 bg-gradient-to-br from-muted/20 to-muted/10 rounded-xl border border-border/30 hover:bg-muted/30 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${getIconBg(activity.type)}`}>
                    {getIcon(activity.type)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{activity.customer}</p>
                    <p className="text-sm text-muted-foreground">
                      {getActivityDescription(activity)}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(activity.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;