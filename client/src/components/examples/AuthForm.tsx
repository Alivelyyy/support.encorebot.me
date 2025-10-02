import AuthForm from '../AuthForm';

export default function AuthFormExample() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <AuthForm
        onLogin={(email, password) => console.log('Login:', email, password)}
        onSignup={(email, password, fullName) => console.log('Signup:', email, password, fullName)}
      />
    </div>
  );
}
