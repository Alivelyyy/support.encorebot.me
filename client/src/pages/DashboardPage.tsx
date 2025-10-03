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
import { Skeleton } from "@/components/ui/skeleton";
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
      setLocation("/login");
    }
  }, [isUserLoading, userData, setLocation]);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/logout", {});
      return await res.json();
    },
    onSuccess: () => {
      setLocation("/login");
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
        description: "Your support ticket has been submitted successfully.",
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
      <div className="min-h-screen bg-background">
        <Navbar
          userName="Loading..."
          isAdmin={false}
          onLogout={() => {}}
          onCreateTicket={() => {}}
        />
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 space-y-8">
          <Skeleton className="h-64 w-full rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        </div>
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
      
      <div id="my-tickets" className="max-w-7xl mx-auto px-4 md:px-6 py-12 space-y-8">
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-3xl font-bold tracking-tight">My Tickets</h2>
          <FilterBar
            selectedStatus={statusFilter}
            onStatusChange={setStatusFilter}
            selectedService={serviceFilter}
            onServiceChange={setServiceFilter}
          />
        </div>

        {filteredTickets.length === 0 ? (
          <div className="text-center py-20 animate-in fade-in duration-700">
            <div className="inline-block p-6 rounded-full bg-muted/50 mb-4">
              <svg className="h-16 w-16 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-xl font-medium text-muted-foreground mb-2">No tickets found</p>
            <p className="text-sm text-muted-foreground mb-6">Create your first support ticket to get started</p>
            <button 
              onClick={() => setShowCreateDialog(true)}
              className="text-primary hover:underline font-medium"
            >
              Create a ticket
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-500">
            {filteredTickets.map((ticket, index) => (
              <div 
                key={ticket.id}
                className="animate-in fade-in slide-in-from-bottom-2 duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TicketCard
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
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <CreateTicketForm
            onSubmit={(data) => createTicketMutation.mutate(data)}
            onCancel={() => setShowCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
