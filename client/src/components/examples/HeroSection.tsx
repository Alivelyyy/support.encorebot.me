import HeroSection from '../HeroSection';

export default function HeroSectionExample() {
  return (
    <div className="bg-background min-h-screen">
      <HeroSection onCreateTicket={() => console.log('Create ticket clicked')} />
    </div>
  );
}
