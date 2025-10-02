import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthFormProps {
  onLogin: (email: string, password: string) => void;
  onSignup: (email: string, password: string, fullName: string) => void;
}

export default function AuthForm({ onLogin, onSignup }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
        <CardDescription>
          {isLogin 
            ? "Sign in to view and manage your support tickets" 
            : "Sign up to get started with EncoreBot & Team Epic support"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="fullName" data-testid="label-fullname">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                data-testid="input-fullname"
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
              data-testid="input-password"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
            data-testid="button-submit"
          >
            {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setIsLogin(!isLogin)}
            data-testid="button-toggle-mode"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
