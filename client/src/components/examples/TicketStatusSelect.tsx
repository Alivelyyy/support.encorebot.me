import { useState } from 'react';
import TicketStatusSelect from '../TicketStatusSelect';

export default function TicketStatusSelectExample() {
  const [status, setStatus] = useState("open");
  
  return (
    <div className="bg-background p-8 max-w-sm">
      <TicketStatusSelect
        value={status}
        onChange={(value) => {
          setStatus(value);
          console.log('Status changed to:', value);
        }}
      />
    </div>
  );
}
