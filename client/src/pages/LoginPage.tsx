import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  const handleLogin = async (email: string, password: string) => {
    console.log("Login:", email, password);
  };

  const handleSignup = async (email: string, password: string, fullName: string) => {
    console.log("Signup:", email, password, fullName);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <AuthForm onLogin={handleLogin} onSignup={handleSignup} />
    </div>
  );
}
