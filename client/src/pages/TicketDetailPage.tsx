import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/Navbar";
import TicketResponse from "@/components/TicketResponse";
import TicketStatusSelect from "@/components/TicketStatusSelect";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import type { Ticket, Response as TicketResponseType } from "@shared/schema";

export default function TicketDetailPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [message, setMessage] = useState("");

  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/auth/me"],
  });

  const { data: ticketData, isLoading: isTicketLoading } = useQuery<{ ticket: Ticket }>({
    queryKey: ["/api/tickets", id],
    enabled: !!id,
  });

  const { data: responsesData, isLoading: isResponsesLoading } = useQuery<{ responses: TicketResponseType[] }>({
    queryKey: ["/api/tickets", id, "responses"],
    enabled: !!id,
  });

  useEffect(() => {
    if (!isTicketLoading && !isResponsesLoading && !userData?.user) {
      setLocation("/login");
    }
  }, [isTicketLoading, isResponsesLoading, userData, setLocation]);

  const sendResponseMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest("POST", `/api/tickets/${id}/responses`, { message });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets", id, "responses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      setMessage("");
      toast({
        title: "Response sent",
        description: "Your message has been added to the conversation.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send response",
        variant: "destructive",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      const res = await apiRequest("PATCH", `/api/tickets/${id}/status`, { status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      toast({
        title: "Status updated",
        description: "Ticket status has been changed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/logout", {});
      return await res.json();
    },
    onSuccess: () => {
      setLocation("/login");
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendResponseMutation.mutate(message);
  };

  if (isTicketLoading || isResponsesLoading || !userData?.user || !ticketData?.ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!ticketData?.ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Ticket not found</div>
      </div>
    );
  }

  const ticket = ticketData.ticket;
  const responses = responsesData?.responses || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        userName={userData.user.fullName}
        isAdmin={userData.user.isAdmin === "true"}
        onLogout={() => logoutMutation.mutate()}
        onCreateTicket={() => setLocation("/dashboard")}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => setLocation(userData.user.isAdmin === "true" ? "/admin" : "/dashboard")}
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tickets
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="space-y-4">
                  <CardTitle className="text-2xl" data-testid="text-ticket-title">
                    {ticket.title}
                  </CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary" data-testid="badge-service">
                      {ticket.service}
                    </Badge>
                    <Badge variant="outline" data-testid="badge-category">
                      {ticket.category}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground" data-testid="text-description">
                    {ticket.description}
                  </p>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {responses.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No responses yet</p>
                ) : (
                  responses.map((response) => (
                    <TicketResponse 
                      key={response.id}
                      id={response.id}
                      message={response.message}
                      authorName={response.isStaff === "true" ? "Support Team" : userData.user.fullName}
                      isStaff={response.isStaff === "true"}
                      createdAt={new Date(response.createdAt)}
                    />
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Type your response..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-24"
                    data-testid="textarea-response"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || sendResponseMutation.isPending}
                    className="gap-2"
                    data-testid="button-send"
                  >
                    <Send className="h-4 w-4" />
                    {sendResponseMutation.isPending ? "Sending..." : "Send Response"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData.user.isAdmin === "true" ? (
                  <TicketStatusSelect
                    value={ticket.status}
                    onChange={(status) => updateStatusMutation.mutate(status)}
                    disabled={updateStatusMutation.isPending}
                  />
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className="mt-1" data-testid="badge-status">
                      {ticket.status}
                    </Badge>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-sm font-medium mt-1" data-testid="text-created">
                    {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="text-sm font-medium mt-1" data-testid="text-service">
                    {ticket.service}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="text-sm font-medium mt-1" data-testid="text-category">
                    {ticket.category}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
