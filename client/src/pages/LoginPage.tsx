import AuthForm from "@/components/AuthForm";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const res = await apiRequest("POST", "/api/auth/login", { email, password });
      return await res.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      if (data.user?.isAdmin === "true") {
        setLocation("/admin");
      } else {
        setLocation("/dashboard");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    },
  });

  const signupMutation = useMutation({
    mutationFn: async ({ email, password, fullName }: { email: string; password: string; fullName: string }) => {
      const res = await apiRequest("POST", "/api/auth/register", { email, password, fullName });
      return await res.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Account created!",
        description: "Welcome to the support system.",
      });
      if (data.user?.isAdmin === "true") {
        setLocation("/admin");
      } else {
        setLocation("/dashboard");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Signup failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
    },
  });

  const handleLogin = async (email: string, password: string) => {
    loginMutation.mutate({ email, password });
  };

  const handleSignup = async (email: string, password: string, fullName: string) => {
    signupMutation.mutate({ email, password, fullName });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <AuthForm onLogin={handleLogin} onSignup={handleSignup} />
    </div>
  );
}
