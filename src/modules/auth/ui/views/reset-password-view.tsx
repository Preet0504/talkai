"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { KeyRound, Loader2 } from "lucide-react";

export const ResetPasswordView = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!token) {
    alert("Reset token is missing. Please request a new link.");
    return;
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault(); // Added to prevent page reload
    
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    await authClient.resetPassword({
      newPassword: password,
      token: token,
    }, {
      onSuccess: () => {
        router.push("/sign-in?reset=success");
      },
      onError: (ctx) => {
        alert(ctx.error.message);
      }
    });
    setLoading(false);
  };

  return (
    /* 1. This wrapper is the magic fix for centering */
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardContent className="p-8">
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="h-12 w-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
              <KeyRound className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Set new password</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Must be at least 8 characters long.
            </p>
          </div>

          {/* 2. Using a form tag allows 'Enter' key to submit */}
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input 
                id="password"
                type="password" 
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm New Password</Label>
              <Input 
                id="confirm"
                type="password" 
                placeholder="••••••••"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-700 hover:bg-green-800"
              disabled={loading || !password}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}