import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface TicketStatusSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const statuses = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export default function TicketStatusSelect({ value, onChange, disabled }: TicketStatusSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="status" data-testid="label-status">Status</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id="status" data-testid="select-status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
