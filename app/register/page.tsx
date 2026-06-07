import { RegisterForm } from "@/components/forms/register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border p-6 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">
            Create Account
          </h1>

          <p className="text-muted-foreground text-sm">
            Register to continue
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}
