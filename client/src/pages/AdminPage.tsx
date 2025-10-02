import { useState } from "react";
import Navbar from "@/components/Navbar";
import FilterBar from "@/components/FilterBar";
import StatsCard from "@/components/StatsCard";
import TicketCard from "@/components/TicketCard";
import { Ticket, Clock, CheckCircle, Loader } from "lucide-react";

export default function AdminPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");

  const mockStats = {
    total: 142,
    open: 23,
    inProgress: 8,
    resolved: 111,
  };

  const mockTickets = [
    {
      id: "1",
      title: "Bot not responding to commands",
      description: "The Encore bot is not responding to any of my commands. I've tried using different prefixes but nothing works.",
      category: "Bugs",
      service: "Encore Bot",
      status: "open" as const,
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      responseCount: 2,
    },
    {
      id: "2",
      title: "Premium subscription not activating",
      description: "I purchased premium yesterday but my account still shows as free tier.",
      category: "Premium",
      service: "Encore Bot",
      status: "in_progress" as const,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      responseCount: 5,
    },
    {
      id: "3",
      title: "Website design consultation",
      description: "Looking for help with redesigning my portfolio website.",
      category: "Web Development",
      service: "Team Epic",
      status: "resolved" as const,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      responseCount: 8,
    },
    {
      id: "4",
      title: "Need help with Discord bot setup",
      description: "I want to create a custom Discord bot for my server but need guidance on the best approach.",
      category: "Discord Bots",
      service: "Team Epic",
      status: "open" as const,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      responseCount: 1,
    },
  ];

  const filteredTickets = mockTickets.filter((ticket) => {
    if (statusFilter !== "all" && ticket.status !== statusFilter) return false;
    if (serviceFilter !== "all" && ticket.service !== serviceFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        userName="Admin User"
        isAdmin={true}
        onLogout={() => console.log("Logout")}
        onViewDashboard={() => console.log("Dashboard")}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage and respond to support tickets</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Tickets"
            value={mockStats.total}
            icon={Ticket}
            description="All time tickets"
          />
          <StatsCard
            title="Open"
            value={mockStats.open}
            icon={Clock}
            description="Awaiting response"
          />
          <StatsCard
            title="In Progress"
            value={mockStats.inProgress}
            icon={Loader}
            description="Being worked on"
          />
          <StatsCard
            title="Resolved"
            value={mockStats.resolved}
            icon={CheckCircle}
            description="Successfully resolved"
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">All Tickets</h2>
          <FilterBar
            selectedStatus={statusFilter}
            onStatusChange={setStatusFilter}
            selectedService={serviceFilter}
            onServiceChange={setServiceFilter}
          />
        </div>

        {filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tickets found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                {...ticket}
                onClick={() => console.log("View ticket:", ticket.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
