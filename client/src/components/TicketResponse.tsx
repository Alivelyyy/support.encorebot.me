import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Shield } from "lucide-react";

interface TicketResponseProps {
  id: string;
  message: string;
  authorName: string;
  isStaff: boolean;
  createdAt: Date;
}

export default function TicketResponse({
  id,
  message,
  authorName,
  isStaff,
  createdAt,
}: TicketResponseProps) {
  const initials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div 
      className={`flex gap-3 ${isStaff ? 'flex-row-reverse' : 'flex-row'}`}
      data-testid={`response-${id}`}
    >
      <Avatar className="h-10 w-10">
        <AvatarFallback 
          className={isStaff ? "bg-primary text-primary-foreground" : ""}
          data-testid={`avatar-${id}`}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
      
      <div className={`flex-1 space-y-1 ${isStaff ? 'text-right' : 'text-left'}`}>
        <div className={`flex items-center gap-2 ${isStaff ? 'justify-end' : 'justify-start'}`}>
          <span className="font-medium text-sm" data-testid={`text-author-${id}`}>
            {authorName}
          </span>
          {isStaff && (
            <Badge variant="secondary" className="text-xs gap-1" data-testid={`badge-staff-${id}`}>
              <Shield className="h-3 w-3" />
              Staff
            </Badge>
          )}
          <span className="text-xs text-muted-foreground" data-testid={`text-time-${id}`}>
            {formatDistanceToNow(createdAt, { addSuffix: true })}
          </span>
        </div>
        
        <div 
          className={`inline-block rounded-lg p-3 ${
            isStaff 
              ? 'bg-primary/10 text-foreground' 
              : 'bg-muted text-foreground'
          }`}
          data-testid={`text-message-${id}`}
        >
          {message}
        </div>
      </div>
    </div>
  );
}
