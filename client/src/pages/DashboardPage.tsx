import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FilterBar from "@/components/FilterBar";
import TicketCard from "@/components/TicketCard";
import CreateTicketForm from "@/components/CreateTicketForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function DashboardPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

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
  ];

  const filteredTickets = mockTickets.filter((ticket) => {
    if (statusFilter !== "all" && ticket.status !== statusFilter) return false;
    if (serviceFilter !== "all" && ticket.service !== serviceFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        userName="John Doe"
        isAdmin={false}
        onLogout={() => console.log("Logout")}
        onCreateTicket={() => setShowCreateDialog(true)}
      />
      
      <HeroSection onCreateTicket={() => setShowCreateDialog(true)} />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-6">My Tickets</h2>
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

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <CreateTicketForm
            onSubmit={(data) => {
              console.log("Create ticket:", data);
              setShowCreateDialog(false);
            }}
            onCancel={() => setShowCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
