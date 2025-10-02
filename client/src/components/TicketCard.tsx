import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageSquare, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TicketCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  service: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: Date;
  responseCount?: number;
  onClick?: () => void;
}

const statusColors = {
  open: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  in_progress: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  resolved: "bg-green-500/10 text-green-500 border-green-500/20",
  closed: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

const statusLabels = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

export default function TicketCard({
  id,
  title,
  description,
  category,
  service,
  status,
  createdAt,
  responseCount = 0,
  onClick,
}: TicketCardProps) {
  return (
    <Card 
      className="hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 group overflow-visible relative"
      onClick={onClick}
      data-testid={`card-ticket-${id}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-chart-2/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md" />
      <CardHeader className="space-y-3 relative z-10">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors duration-200" data-testid={`text-ticket-title-${id}`}>
            {title}
          </CardTitle>
          <Badge 
            className={`${statusColors[status]} transition-all duration-200`}
            data-testid={`badge-status-${id}`}
          >
            {statusLabels[status]}
          </Badge>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" data-testid={`badge-service-${id}`}>
            {service}
          </Badge>
          <Badge variant="outline" data-testid={`badge-category-${id}`}>
            {category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 relative z-10">
        <CardDescription className="line-clamp-2" data-testid={`text-description-${id}`}>
          {description}
        </CardDescription>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span data-testid={`text-time-${id}`}>
              {formatDistanceToNow(createdAt, { addSuffix: true })}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {responseCount > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span data-testid={`text-responses-${id}`}>{responseCount}</span>
              </div>
            )}
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
