import Navbar from '../Navbar';

export default function NavbarExample() {
  return (
    <div className="bg-background min-h-screen">
      <Navbar
        userName="John Doe"
        isAdmin={true}
        onLogout={() => console.log('Logout clicked')}
        onCreateTicket={() => console.log('Create ticket clicked')}
        onViewDashboard={() => console.log('Dashboard clicked')}
        onToggleSidebar={() => console.log('Toggle sidebar')}
      />
      <div className="p-8">
        <p className="text-muted-foreground">Page content goes here</p>
      </div>
    </div>
  );
}
