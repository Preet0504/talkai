"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

// We wrap the content in Suspense because useSearchParams() requires it in Next.js 13+
const VerifyEmailContent = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    setLoading(true);
    await authClient.sendVerificationEmail({
      email: email,
      callbackURL: "/", 
    }, {
      onSuccess: () => {
        setResent(true);
        setLoading(false);
      },
      onError: () => {
        setLoading(false);
      }
    });
  };

  return (
    <Card className="w-full max-w-md shadow-xl border-none overflow-hidden">
      <CardContent className="p-8 text-center">
        {/* Animated Icon */}
        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-700">
          <Mail className="h-10 w-10 animate-bounce" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Confirm your email</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          We&apos;ve sent a verification link to <br />
          <span className="font-semibold text-slate-900">{email || "your email"}</span>
        </p>

        <div className="mt-8 space-y-3">
          <Button 
            className="w-full bg-green-700 hover:bg-green-800" 
            size="lg"
            onClick={handleResend}
            disabled={loading || !email}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {resent ? "Email Sent Again!" : "Resend Link"}
          </Button>

          <Button variant="ghost" asChild className="w-full">
            <Link href="/sign-in" className="flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
          </Button>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Can&apos;t find it? Check your spam folder or try resending.
        </p>
      </CardContent>
    </Card>
  );
};

// Final Export with Suspense Boundary
export const VerifyEmailView = () => {
  return (
    // This wrapper ensures the content is centered horizontally and vertically
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
};