import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function VerifyEmailPage() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link");
        return;
      }

      try {
        const res = await apiRequest("GET", `/api/auth/verify-email?token=${encodeURIComponent(token)}`);
        const data = await res.json();
        
        setStatus("success");
        setMessage(data.message || "Email verified successfully!");
        
        setTimeout(() => {
          if (data.user?.isAdmin === "true") {
            setLocation("/admin");
          } else {
            setLocation("/dashboard");
          }
        }, 2000);
      } catch (error: any) {
        setStatus("error");
        setMessage(error.message || error.error || "Verification failed. The link may be invalid or expired.");
      }
    };

    verifyEmail();
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            Verifying your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {status === "loading" && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary" data-testid="icon-loading" />
              <p className="text-center text-muted-foreground" data-testid="text-loading">
                Verifying your email...
              </p>
            </>
          )}
          
          {status === "success" && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500" data-testid="icon-success" />
              <p className="text-center text-foreground font-medium" data-testid="text-success">
                {message}
              </p>
              <p className="text-center text-muted-foreground text-sm" data-testid="text-redirect">
                Redirecting to dashboard...
              </p>
            </>
          )}
          
          {status === "error" && (
            <>
              <XCircle className="h-12 w-12 text-destructive" data-testid="icon-error" />
              <p className="text-center text-foreground font-medium" data-testid="text-error">
                {message}
              </p>
              <Button 
                onClick={() => setLocation("/login")}
                className="mt-4"
                data-testid="button-back-login"
              >
                Back to Login
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
