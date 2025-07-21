"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthForm } from "@/components/auth/auth-form";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth-store";
import { loginSchema } from "@/schemas/auth";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = useAuthStore();

  const handleLogin = async (data: any) => {
    try {
      setIsLoading(true);
      setError("");

      const validatedData = loginSchema.parse(data);
      const supabase = createClient();

      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: validatedData.email,
          password: validatedData.password,
        });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (authData.user) {
        setUser(authData.user);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthForm
        type="login"
        onSubmit={handleLogin}
        isLoading={isLoading}
        error={error}
      />
      <div className="mt-4 text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
        <p className="text-sm text-muted-foreground">
          Forgot your password?{" "}
          <Link
            href="/auth/reset-password"
            className="text-primary hover:underline"
          >
            Reset it
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
