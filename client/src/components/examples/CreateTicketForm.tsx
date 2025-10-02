import CreateTicketForm from '../CreateTicketForm';

export default function CreateTicketFormExample() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <CreateTicketForm
        onSubmit={(data) => console.log('Create ticket:', data)}
        onCancel={() => console.log('Cancel clicked')}
      />
    </div>
  );
}
