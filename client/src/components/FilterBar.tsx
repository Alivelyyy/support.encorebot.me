import { Button } from "@/components/ui/button";

interface FilterBarProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedService: string;
  onServiceChange: (service: string) => void;
}

const statuses = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

const services = [
  { value: "all", label: "All Services" },
  { value: "Team Epic", label: "Team Epic" },
  { value: "Encore Bot", label: "Encore Bot" },
];

export default function FilterBar({ 
  selectedStatus, 
  onStatusChange,
  selectedService,
  onServiceChange 
}: FilterBarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {services.map((service) => (
          <Button
            key={service.value}
            variant={selectedService === service.value ? "default" : "outline"}
            size="sm"
            onClick={() => onServiceChange(service.value)}
            data-testid={`button-filter-service-${service.value}`}
          >
            {service.label}
          </Button>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <Button
            key={status.value}
            variant={selectedStatus === status.value ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onStatusChange(status.value)}
            data-testid={`button-filter-status-${status.value}`}
          >
            {status.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
