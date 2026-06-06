import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border p-6 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">
            Welcome Back
          </h1>

          <p className="text-muted-foreground text-sm">
            Login to continue
          </p>
        </div>

        <LoginForm />
        <div className="text-center">
          <a
            href="/forgot-password"
            className="text-sm text-muted-foreground underline"
          >
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
}
