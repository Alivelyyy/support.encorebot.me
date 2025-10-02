import StatsCard from '../StatsCard';
import { Ticket, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function StatsCardExample() {
  return (
    <div className="bg-background p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Tickets"
        value={142}
        icon={Ticket}
        description="All time tickets created"
      />
      <StatsCard
        title="Open Tickets"
        value={23}
        icon={Clock}
        description="Awaiting response"
      />
      <StatsCard
        title="In Progress"
        value={8}
        icon={Clock}
        description="Being worked on"
      />
      <StatsCard
        title="Resolved"
        value={111}
        icon={CheckCircle}
        description="Successfully resolved"
      />
    </div>
  );
}
