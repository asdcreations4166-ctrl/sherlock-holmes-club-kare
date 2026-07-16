"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail, Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid academic/admin email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const { login, resetPassword, user } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Redirect if user is already logged in
  React.useEffect(() => {
    if (user) {
      router.push("/admin");
    }
  }, [user, router]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
      toast.success("Welcome back! Signing in to dashboard...");
      router.push("/admin");
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Invalid email or password. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleForgotPassword = async () => {
    const email = getValues("email");
    if (!email) {
      toast.error("Please enter your email address to reset password.");
      return;
    }
    try {
      setResetLoading(true);
      await resetPassword(email);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send reset email.";
      toast.error(errorMessage);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-transparent">
      <Card className="w-full max-w-md p-8 border border-border/80 bg-white/60 dark:bg-card/60 backdrop-blur-md rounded-3xl shadow-lg flex flex-col gap-6">
        {/* Banner Logo */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl overflow-hidden bg-white border border-border/40 shadow-md">
            <img src="/logo.jpg" alt="SH Logo" className="h-full w-full object-cover" />
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            Club Admin Portal
          </h1>
          <p className="font-sans text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            Sherlock Holmes Club • KARE
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="admin@kare.edu.in"
                className="pl-10 rounded-xl border-border bg-white dark:bg-background text-foreground"
                disabled={isSubmitting}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={resetLoading}
                className="text-xs text-primary hover:underline font-semibold"
              >
                {resetLoading ? "Sending..." : "Forgot Password?"}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10 rounded-xl border-border bg-white dark:bg-background text-foreground"
                disabled={isSubmitting}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive font-medium">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me & Show Password Checkboxes */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="rounded text-primary border-border focus:ring-primary h-4 w-4"
                {...register("rememberMe")}
              />
              <span className="text-xs text-muted-foreground font-semibold">Remember Me</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="rounded text-primary border-border focus:ring-primary h-4 w-4"
              />
              <span className="text-xs text-muted-foreground font-semibold">Show Password</span>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-6 rounded-xl font-bold uppercase tracking-wider text-xs shadow-xs active:scale-[0.98] transition-transform bg-primary text-primary-foreground hover:bg-primary/95 mt-2 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Panel</span>
            )}
          </Button>
        </form>

        {/* Back Link */}
        <p className="text-xs text-center text-muted-foreground leading-normal">
          Security Alert: This dashboard logs audit trails of all events, announcements, and configuration changes.{" "}
          <Link href="/" className="text-primary hover:underline font-bold">
            Back to Public Website
          </Link>
        </p>
      </Card>
    </div>
  );
}
