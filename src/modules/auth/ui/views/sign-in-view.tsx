"use client";

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { authClient } from "@/lib/auth-client";
import { useRouter } from 'next/navigation';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';

// Optional: Install 'lucide-react' for icons if you haven't
import { Chrome, Github } from 'lucide-react';
import { use, useState } from 'react';
import { auth } from '@/lib/auth';

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});



export const SignInView = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
        email: "",
        password: "",
        },
  });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setError(null);

        authClient.signIn.email({
            email: data.email,
            password: data.password,
        },
        {
            onSuccess: () => {
                router.push("/");
            },
            onError: ({ error }) => {
                setError(error.message);
            }
        }
    );
    };

    const handleSocialSignIn = async(provider: 'google' | 'github') => {
        console.log(`Signing in with ${provider}`);
        // authClient.signIn.social({ provider });
        authClient.signIn.social({ provider }, {
          onSuccess: () => {
            router.push("/");
          },
          onError: ({ error }) => {
            setError(error.message);
          }
        });
    };

  return (
    <div className="flex flex-col gap-6 w-full">
      <Card className="w-full max-w-4xl overflow-hidden p-0 shadow-xl border-none">
        <CardContent className="grid p-0 md:grid-cols-2">
          
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Sign In</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your details to access your account.
              </p>
            </div>

            {/* Social Buttons Section */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button variant="outline" className="w-full" onClick={() => handleSocialSignIn('google')}>
                <Chrome className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button variant="outline" className="w-full" onClick={() => handleSocialSignIn('github')}>
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>

            {/* Visual Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Button variant="link" size="sm" className="px-0 font-normal text-green-700 hover:text-green-800">
                          Forgot password?
                        </Button>
                      </div>
                      <FormControl>
                        <Input placeholder="••••••••" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-green-700 hover:bg-green-800" size="lg">
                  Sign In
                </Button>
              </form>
            </Form>

            <div className="mt-8 text-center text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <Link 
                href="/sign-up" 
                className="font-semibold text-green-700 hover:underline underline-offset-4"
              >
                Sign up for free
              </Link>
            </div>
          </div>

          {/* Branding Side */}
          <div className="relative hidden flex-col items-center justify-center bg-gradient-to-br from-green-700 to-green-900 md:flex">
            <div className="flex flex-col items-center gap-y-4 z-10 text-center p-8">
              <img src="/logo.svg" alt="Talk.AI Logo" className="h-24 w-24 brightness-0 invert" />
              <div>
                <p className="text-3xl font-bold text-white tracking-wider">Talk.AI</p>
                <p className="text-green-100/70 text-sm mt-2">The future of intelligent conversation.</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          </div>

        </CardContent>
      </Card>
      
      <p className="px-8 text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-4 hover:text-primary">Terms of Service</Link> and <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">Privacy Policy</Link>.
      </p>
    </div>
  );
};