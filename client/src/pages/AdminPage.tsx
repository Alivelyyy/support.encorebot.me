import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/Navbar";
import FilterBar from "@/components/FilterBar";
import StatsCard from "@/components/StatsCard";
import TicketCard from "@/components/TicketCard";
import AdminEmailManager from "@/components/AdminEmailManager";
import { Ticket as TicketIcon, Clock, CheckCircle, Loader } from "lucide-react";
import type { Ticket } from "@shared/schema";

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");

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
    } else if (!isUserLoading && userData?.user && userData.user.isAdmin !== "true") {
      setLocation("/dashboard");
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

  if (isUserLoading || isTicketsLoading || !userData?.user || userData.user.isAdmin !== "true") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const tickets = ticketsData?.tickets || [];
  
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === "open").length,
    inProgress: tickets.filter(t => t.status === "in_progress").length,
    resolved: tickets.filter(t => t.status === "resolved").length,
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (statusFilter !== "all" && ticket.status !== statusFilter) return false;
    if (serviceFilter !== "all" && ticket.service !== serviceFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        userName={userData.user.fullName}
        isAdmin={true}
        onLogout={() => logoutMutation.mutate()}
        onViewDashboard={() => setLocation("/dashboard")}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage and respond to support tickets</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Tickets"
            value={stats.total}
            icon={TicketIcon}
            description="All time tickets"
          />
          <StatsCard
            title="Open"
            value={stats.open}
            icon={Clock}
            description="Awaiting response"
          />
          <StatsCard
            title="In Progress"
            value={stats.inProgress}
            icon={Loader}
            description="Being worked on"
          />
          <StatsCard
            title="Resolved"
            value={stats.resolved}
            icon={CheckCircle}
            description="Successfully resolved"
          />
        </div>

        <AdminEmailManager />

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
    </div>
  );
}
