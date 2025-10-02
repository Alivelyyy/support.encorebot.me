import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FilterBar from "@/components/FilterBar";
import TicketCard from "@/components/TicketCard";
import CreateTicketForm from "@/components/CreateTicketForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { Ticket } from "@shared/schema";

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: userData, isLoading: isUserLoading } = useQuery<{ user: any }>({
    queryKey: ["/api/auth/me"],
  });

  const { data: ticketsData, isLoading: isTicketsLoading } = useQuery<{ tickets: Ticket[] }>({
    queryKey: ["/api/tickets"],
    enabled: !!userData,
  });

  useEffect(() => {
    if (!isUserLoading && !userData?.user) {
      setLocation("/");
    }
  }, [isUserLoading, userData, setLocation]);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/logout", {});
      return await res.json();
    },
    onSuccess: () => {
      setLocation("/");
    },
  });

  const createTicketMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/tickets", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      toast({
        title: "Ticket created",
        description: "Your support ticket has been submitted.",
      });
      setShowCreateDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create ticket",
        variant: "destructive",
      });
    },
  });

  if (isUserLoading || isTicketsLoading || !userData?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const tickets = ticketsData?.tickets || [];
  const filteredTickets = tickets.filter((ticket) => {
    if (statusFilter !== "all" && ticket.status !== statusFilter) return false;
    if (serviceFilter !== "all" && ticket.service !== serviceFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        userName={userData.user.fullName}
        isAdmin={userData.user.isAdmin === "true"}
        onLogout={() => logoutMutation.mutate()}
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
                id={ticket.id}
                title={ticket.title}
                description={ticket.description}
                category={ticket.category}
                service={ticket.service}
                status={ticket.status as "open" | "in_progress" | "resolved" | "closed"}
                createdAt={new Date(ticket.createdAt)}
                responseCount={(ticket as any).responseCount || 0}
                onClick={() => setLocation(`/ticket/${ticket.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <CreateTicketForm
            onSubmit={(data) => createTicketMutation.mutate(data)}
            onCancel={() => setShowCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
