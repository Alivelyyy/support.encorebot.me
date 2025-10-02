import { useState } from 'react';
import FilterBar from '../FilterBar';

export default function FilterBarExample() {
  const [status, setStatus] = useState("all");
  const [service, setService] = useState("all");
  
  return (
    <div className="bg-background p-8">
      <FilterBar
        selectedStatus={status}
        onStatusChange={(value) => {
          setStatus(value);
          console.log('Status filter:', value);
        }}
        selectedService={service}
        onServiceChange={(value) => {
          setService(value);
          console.log('Service filter:', value);
        }}
      />
    </div>
  );
}
