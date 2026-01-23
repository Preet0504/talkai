"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export const HomeView = () => {
  const { data: session } = authClient.useSession()
  const router = useRouter();
  if (!session) {
    return (
      <div className="flex flex-col gap-y-4 p-4">
        <p> Session Time Out, Sign-in again </p>
        <Button onClick={() => authClient.signIn.social({ provider: 'google', callbackURL: '/' })}>
          Sign In with Google
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4 p-4">
      <p>Welcome back, {session.user.name}!</p>
      <Button onClick={() => authClient.signOut({
        fetchOptions: { onSuccess: () => router.push('/sign-in') }
    })}>
        Sign Out
      </Button>
    </div>
  );
}
