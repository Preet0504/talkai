"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { authClient } from "@/lib/auth-client" //import the auth client
import { on } from "events";
import { redirect } from "next/dist/server/api-utils";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { data: session } = authClient.useSession() 
  const onSubmit = () => {
      authClient.signUp.email({
        email,
        password,
        name,
      }, {
        onSuccess: () => {
            //redirect to the dashboard or sign in page
            window.alert("user created successfully");
        },
        onError: () => {
            // display the error message
            window.alert("something went wrong");
        },
      });
  }
  const onLogin = () => {
    authClient.signIn.email({
      email,
      password,
    }, {
      onSuccess: () => {
          //redirect to the dashboard or sign in page
          window.alert("user signed in successfully");
      },
      onError: () => {
          // display the error message
          window.alert("something went wrong");
      },
    });
  }
  if (session) {
    return (
      <div className="flex flex-col gap-y-4 p-4">
        <p>Welcome back, {session.user.name}!</p>
        <Button onClick={() => authClient.signOut()}>
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-10">
      <div className="p-4 flex flex-col gap-y-4">
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={onSubmit}>
          Create User
        </Button>
      </div>
      <div className="p-4 flex flex-col gap-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={onLogin}>
          Sign In
        </Button>
      </div>
    </div>
  );
}
