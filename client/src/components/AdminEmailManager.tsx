
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminEmail {
  id: string;
  email: string;
  createdAt: string;
}

export default function AdminEmailManager() {
  const [newEmail, setNewEmail] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: emailsData, isLoading } = useQuery<{ emails: AdminEmail[] }>({
    queryKey: ["/api/admin/emails"],
  });

  const addEmailMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiRequest("POST", "/api/admin/emails", { email });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/emails"] });
      setNewEmail("");
      toast({
        title: "Admin email added",
        description: "The email has been added to the admin whitelist.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add email",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteEmailMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/admin/emails/${id}`, {});
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/emails"] });
      toast({
        title: "Admin email removed",
        description: "The email has been removed from the admin whitelist.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to remove email",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmail.trim()) {
      addEmailMutation.mutate(newEmail.trim());
    }
  };

  const emails = emailsData?.emails || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Admin Email Whitelist
        </CardTitle>
        <CardDescription>
          Manage which email addresses can register as admins. Users who register with these emails will automatically receive admin privileges.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleAddEmail} className="flex gap-2">
          <Input
            type="email"
            placeholder="admin@example.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={addEmailMutation.isPending}>
            <Plus className="h-4 w-4 mr-2" />
            Add Email
          </Button>
        </form>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : emails.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No admin emails configured. Add emails to control admin access.
          </div>
        ) : (
          <div className="space-y-2">
            {emails.map((email) => (
              <div
                key={email.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">
                    <Mail className="h-3 w-3 mr-1" />
                    {email.email}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Added {new Date(email.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteEmailMutation.mutate(email.id)}
                  disabled={deleteEmailMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
