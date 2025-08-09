import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  description?: string;
  trend?: string;
  trendDirection?: "up" | "down";
}

const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  description, 
  trend, 
  trendDirection 
}: StatsCardProps) => {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getTrendColor = () => {
    if (trendDirection === "up") {
      return "text-green-600";
    } else if (trendDirection === "down") {
      return "text-red-600";
    }
    return "text-muted-foreground";
  };

  return (
    <Card className="stats-card group h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-sm font-semibold text-muted-foreground flex-1 min-w-0">
          {title}
        </CardTitle>
        <div className="p-2 bg-red-500 rounded-full flex-shrink-0 ml-3">
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-end justify-between mb-4">
          <div className="text-3xl font-bold text-foreground break-words">{value}</div>
          {trend && (
            <div className={`flex items-center space-x-1 text-sm font-semibold ${getTrendColor()} flex-shrink-0 ml-2`}>
              {trendDirection === "up" ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : trendDirection === "down" ? (
                <ArrowDownRight className="h-4 w-4" />
              ) : null}
              <span>{trend}</span>
            </div>
          )}
        </div>
        
        {(change || description) && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-4 border-t border-border/30">
            {change && (
              <p className={`text-xs font-medium ${getChangeColor()} break-words`}>
                {change}
              </p>
            )}
            {description && (
              <p className="text-xs text-muted-foreground break-words sm:text-right">
                {description}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;