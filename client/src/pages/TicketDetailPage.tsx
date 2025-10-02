import { useState } from "react";
import Navbar from "@/components/Navbar";
import TicketResponse from "@/components/TicketResponse";
import TicketStatusSelect from "@/components/TicketStatusSelect";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function TicketDetailPage() {
  const [status, setStatus] = useState("open");
  const [message, setMessage] = useState("");

  const mockTicket = {
    id: "1",
    title: "Bot not responding to commands",
    description: "The Encore bot is not responding to any of my commands. I've tried using different prefixes but nothing works. I need help as soon as possible.",
    category: "Bugs",
    service: "Encore Bot",
    status: "open",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  };

  const mockResponses = [
    {
      id: "1",
      message: "Hi, I'm having trouble with the bot not responding to my commands. I've tried everything but nothing seems to work.",
      authorName: "John Doe",
      isStaff: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: "2",
      message: "Thanks for reaching out! I'll look into this issue right away. Can you tell me which commands you've tried and what server you're using the bot on?",
      authorName: "Support Team",
      isStaff: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 45),
    },
    {
      id: "3",
      message: "I've tried /play, /skip, and /queue commands on my server 'Music Lovers'. The bot shows as online but doesn't respond.",
      authorName: "John Doe",
      isStaff: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
    },
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;
    console.log("Send message:", message);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        userName="John Doe"
        isAdmin={false}
        onLogout={() => console.log("Logout")}
        onCreateTicket={() => console.log("Create ticket")}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => console.log("Go back")}
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
                    {mockTicket.title}
                  </CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary" data-testid="badge-service">
                      {mockTicket.service}
                    </Badge>
                    <Badge variant="outline" data-testid="badge-category">
                      {mockTicket.category}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground" data-testid="text-description">
                    {mockTicket.description}
                  </p>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {mockResponses.map((response) => (
                  <TicketResponse key={response.id} {...response} />
                ))}
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
                    disabled={!message.trim()}
                    className="gap-2"
                    data-testid="button-send"
                  >
                    <Send className="h-4 w-4" />
                    Send Response
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
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className="mt-1" data-testid="badge-status">
                    {status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-sm font-medium mt-1" data-testid="text-created">
                    {formatDistanceToNow(mockTicket.createdAt, { addSuffix: true })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="text-sm font-medium mt-1" data-testid="text-service">
                    {mockTicket.service}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="text-sm font-medium mt-1" data-testid="text-category">
                    {mockTicket.category}
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
