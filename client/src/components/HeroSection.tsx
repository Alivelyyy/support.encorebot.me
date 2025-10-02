import { Button } from "@/components/ui/button";
import { Ticket, Headphones, Sparkles } from "lucide-react";

interface HeroSectionProps {
  onCreateTicket: () => void;
}

export default function HeroSection({ onCreateTicket }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-chart-2/10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-chart-2/5 rounded-full blur-3xl" />
      
      <div className="relative px-6 py-16 md:py-24 text-center space-y-6 animate-in fade-in duration-700">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-gradient-to-br from-primary to-chart-2 backdrop-blur-sm shadow-lg animate-in zoom-in duration-500">
            <Headphones className="h-12 w-12 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-in slide-in-from-bottom-4 duration-700">
          <span className="bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent animate-gradient">
            EncoreBot & Team Epic
          </span>
          <br />
          <span className="text-foreground">Support Center</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-700 delay-150">
          Get help with Encore music bot features, Team Epic services, or any technical issues. 
          Our support team is here to assist you 24/7.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-in slide-in-from-bottom-4 duration-700 delay-300">
          <Button 
            size="lg" 
            onClick={onCreateTicket}
            className="gap-2 relative overflow-hidden group shadow-lg"
            data-testid="button-create-ticket"
          >
            <Ticket className="h-5 w-5 relative z-10" />
            <span className="relative z-10">Create New Ticket</span>
            <Sparkles className="h-4 w-4 absolute right-2 opacity-0 group-hover:opacity-100 group-hover:right-4 transition-all duration-300" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="gap-2 backdrop-blur-sm hover:bg-primary/5"
            onClick={() => {
              document.getElementById('my-tickets')?.scrollIntoView({ behavior: 'smooth' });
            }}
            data-testid="button-view-tickets"
          >
            View My Tickets
          </Button>
        </div>
      </div>
    </div>
  );
}
