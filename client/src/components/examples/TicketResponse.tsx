import TicketResponse from '../TicketResponse';

export default function TicketResponseExample() {
  return (
    <div className="bg-background p-8 space-y-6 max-w-3xl">
      <TicketResponse
        id="1"
        message="Hi, I'm having trouble with the bot not responding to my commands. I've tried everything but nothing seems to work."
        authorName="John Doe"
        isStaff={false}
        createdAt={new Date(Date.now() - 1000 * 60 * 60 * 2)}
      />
      
      <TicketResponse
        id="2"
        message="Thanks for reaching out! I'll look into this issue right away. Can you tell me which commands you've tried and what server you're using the bot on?"
        authorName="Support Team"
        isStaff={true}
        createdAt={new Date(Date.now() - 1000 * 60 * 45)}
      />
      
      <TicketResponse
        id="3"
        message="I've tried /play, /skip, and /queue commands on my server 'Music Lovers'. The bot shows as online but doesn't respond."
        authorName="John Doe"
        isStaff={false}
        createdAt={new Date(Date.now() - 1000 * 60 * 30)}
      />
    </div>
  );
}
