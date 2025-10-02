import TicketCard from '../TicketCard';

export default function TicketCardExample() {
  return (
    <div className="bg-background p-8 space-y-4">
      <TicketCard
        id="1"
        title="Bot not responding to commands"
        description="The Encore bot is not responding to any of my commands. I've tried using different prefixes but nothing works."
        category="Bugs"
        service="Encore Bot"
        status="open"
        createdAt={new Date(Date.now() - 1000 * 60 * 30)}
        responseCount={2}
        onClick={() => console.log('Ticket clicked')}
      />
      <TicketCard
        id="2"
        title="Premium subscription not activating"
        description="I purchased premium yesterday but my account still shows as free tier."
        category="Premium"
        service="Encore Bot"
        status="in_progress"
        createdAt={new Date(Date.now() - 1000 * 60 * 60 * 2)}
        responseCount={5}
        onClick={() => console.log('Ticket clicked')}
      />
      <TicketCard
        id="3"
        title="Website design consultation"
        description="Looking for help with redesigning my portfolio website."
        category="Web Development"
        service="Team Epic"
        status="resolved"
        createdAt={new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)}
        onClick={() => console.log('Ticket clicked')}
      />
    </div>
  );
}
