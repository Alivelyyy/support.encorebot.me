import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CreateTicketFormProps {
  onSubmit: (data: TicketFormData) => void;
  onCancel?: () => void;
}

export interface TicketFormData {
  title: string;
  description: string;
  service: string;
  category: string;
}

const serviceCategories = {
  "Team Epic": [
    "General Support",
    "Web Development",
    "Discord Bots",
    "Roblox Games",
    "Graphic Design"
  ],
  "Encore Bot": [
    "No Prefix",
    "Bugs",
    "Suggestions",
    "Feedback",
    "Premium"
  ]
};

export default function CreateTicketForm({ onSubmit, onCancel }: CreateTicketFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [service, setService] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await onSubmit({
      title,
      description,
      service,
      category
    });
    
    setLoading(false);
  };

  const availableCategories = service ? serviceCategories[service as keyof typeof serviceCategories] : [];

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create New Ticket</CardTitle>
        <CardDescription>
          Fill out the form below and our support team will get back to you as soon as possible
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="service" data-testid="label-service">Service</Label>
            <Select 
              value={service} 
              onValueChange={(value) => {
                setService(value);
                setCategory("");
              }}
              required
            >
              <SelectTrigger id="service" data-testid="select-service">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Team Epic">Team Epic</SelectItem>
                <SelectItem value="Encore Bot">Encore Bot</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {service && (
            <div className="space-y-2">
              <Label htmlFor="category" data-testid="label-category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category" data-testid="select-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title" data-testid="label-title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Brief summary of your issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              data-testid="input-title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" data-testid="label-description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide detailed information about your issue or request..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="min-h-32"
              data-testid="textarea-description"
            />
          </div>

          <div className="flex gap-2 justify-end">
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={loading || !service || !category}
              data-testid="button-submit"
            >
              {loading ? "Creating..." : "Create Ticket"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
