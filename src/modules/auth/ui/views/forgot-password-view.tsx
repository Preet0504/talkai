"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { KeyRound, Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const ForgotPasswordView = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page reload on submit
    setLoading(true);
    
    await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    }, {
      onSuccess: () => setSent(true),
      onError: (ctx) => alert(ctx.error.message),
    });
    setLoading(false);
  };

  return (
    // Centering wrapper to match the rest of your auth flow
    <div className="flex min-h-[80vh] w-full items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-none overflow-hidden">
        <CardContent className="p-8">
          {sent ? (
            // Success State
            <div className="text-center animate-in fade-in zoom-in duration-300">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Check your inbox</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                We've sent a password reset link to <br />
                <span className="font-semibold text-slate-900">{email}</span>
              </p>
              <Button asChild className="mt-8 w-full bg-green-700 hover:bg-green-800">
                <Link href="/sign-in">Return to Sign In</Link>
              </Button>
            </div>
          ) : (
            // Input State
            <>
              <div className="flex flex-col items-center mb-6 text-center">
                <div className="h-12 w-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
                  <KeyRound className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Forgot password?</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  No worries, we'll send you reset instructions.
                </p>
              </div>

              <form onSubmit={handleReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email"
                      type="email" 
                      placeholder="name@example.com" 
                      className="pl-10"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-green-700 hover:bg-green-800" 
                  disabled={loading || !email}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : "Send Reset Link"}
                </Button>

                <Button variant="ghost" asChild className="w-full text-muted-foreground">
                  <Link href="/sign-in" className="flex items-center justify-center gap-2 text-sm">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Sign In
                  </Link>
                </Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};