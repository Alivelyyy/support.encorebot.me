import { Button } from "@/components/ui/button";
import { Ticket, Headphones } from "lucide-react";

interface HeroSectionProps {
  onCreateTicket: () => void;
}

export default function HeroSection({ onCreateTicket }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-chart-2 opacity-10" />
      
      <div className="relative px-6 py-16 md:py-24 text-center space-y-6">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20">
            <Headphones className="h-12 w-12 text-primary" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            EncoreBot & Team Epic
          </span>
          <br />
          Support Center
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Get help with Encore music bot features, Team Epic services, or any technical issues. 
          Our support team is here to assist you.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button 
            size="lg" 
            onClick={onCreateTicket}
            className="gap-2"
            data-testid="button-create-ticket"
          >
            <Ticket className="h-5 w-5" />
            Create New Ticket
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="gap-2 backdrop-blur-sm"
            data-testid="button-view-tickets"
          >
            View My Tickets
          </Button>
        </div>
      </div>
    </div>
  );
}
