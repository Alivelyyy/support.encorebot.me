import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Sparkles } from "lucide-react";

interface AuthFormProps {
  onLogin: (email: string, password: string) => void;
  onSignup: (email: string, password: string, fullName: string) => void;
  onResendVerification?: (email: string) => void;
  onClearUnverified?: () => void;
  unverifiedEmail?: string | null;
  isResending?: boolean;
}

export default function AuthForm({ onLogin, onSignup, onResendVerification, onClearUnverified, unverifiedEmail, isResending }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setFullName("");
    onClearUnverified?.();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (isLogin) {
      await onLogin(email, password);
    } else {
      await onSignup(email, password, fullName);
    }
    
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-chart-2">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-2xl">{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
        </div>
        <CardDescription className="text-base">
          {isLogin 
            ? "Sign in to view and manage your support tickets" 
            : "Sign up to get started with EncoreBot & Team Epic support"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {unverifiedEmail && (
          <Alert className="border-primary/20 bg-primary/5" data-testid="alert-verification">
            <Mail className="h-4 w-4 text-primary" />
            <AlertDescription className="ml-2">
              <p className="mb-2 text-sm" data-testid="text-verification-message">
                Please verify your email ({unverifiedEmail}) to continue.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onResendVerification?.(unverifiedEmail)}
                disabled={isResending}
                data-testid="button-resend-verification"
                className="mt-2"
              >
                {isResending ? "Sending..." : "Resend verification email"}
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label htmlFor="fullName" data-testid="label-fullname">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                data-testid="input-fullname"
                className="transition-all duration-200 focus:scale-[1.01]"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" data-testid="label-email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-testid="input-email"
              className="transition-all duration-200 focus:scale-[1.01]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" data-testid="label-password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              data-testid="input-password"
              className="transition-all duration-200 focus:scale-[1.01]"
            />
            {!isLogin && (
              <p className="text-xs text-muted-foreground">
                Must be at least 6 characters
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full relative overflow-hidden group" 
            disabled={loading}
            data-testid="button-submit"
          >
            <span className="relative z-10">
              {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-chart-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={handleToggleMode}
            data-testid="button-toggle-mode"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
