import AuthForm from "@/components/AuthForm";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const res = await apiRequest("POST", "/api/auth/login", { email, password });
      return await res.json();
    },
    onSuccess: (data: any) => {
      setUnverifiedEmail(null);
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      // Small delay to ensure session is established
      setTimeout(() => {
        if (data.user?.isAdmin === "true") {
          setLocation("/admin");
        } else {
          setLocation("/dashboard");
        }
      }, 100);
    },
    onError: (error: any) => {
      if (error.requiresVerification) {
        setUnverifiedEmail(error.email);
        toast({
          title: "Email not verified",
          description: "Please check your email and click the verification link.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login failed",
          description: error.message || "Invalid email or password",
          variant: "destructive",
        });
      }
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
        description: data.message || "Please check your email to verify your account.",
      });
      setUnverifiedEmail(data.user?.email || null);
    },
    onError: (error: any) => {
      toast({
        title: "Signup failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
    },
  });

  const resendMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiRequest("POST", "/api/auth/resend-verification", { email });
      return await res.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Verification email sent",
        description: data.message || "Please check your inbox.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to resend",
        description: error.message || "Could not send verification email",
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

  const handleResendVerification = (email: string) => {
    resendMutation.mutate(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <AuthForm 
        onLogin={handleLogin} 
        onSignup={handleSignup}
        onResendVerification={handleResendVerification}
        onClearUnverified={() => setUnverifiedEmail(null)}
        unverifiedEmail={unverifiedEmail}
        isResending={resendMutation.isPending}
      />
    </div>
  );
}
