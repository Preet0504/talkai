"use client";

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Chrome, Github } from 'lucide-react'; // Added icons

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authClient } from "@/lib/auth-client";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';

const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export const SignUpView = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Added loading state

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setError(null);
    setLoading(true);

    await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    },
    {
      onSuccess: () => {
        router.push("/");
      },
      onError: ({ error }) => {
        setError(error.message || "An error occurred during sign up.");
        setLoading(false);
      }
    });
  };

//   const handleSocialSignUp = (provider: 'google' | 'github') => {
//     console.log(`Signing up with ${provider}`);
//     // authClient.signIn.social({ provider });
//     authClient.signIn.social({ provider }, {
//         onSuccess: () => {
//             router.push("/");
//         },
//         onError: ({ error }) => {
//             setError(error.message);
//         }
//     });
//   };

  return (
    <div className='flex flex-col gap-6 w-full'>
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className='overflow-hidden p-0 shadow-xl border-none'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          
          <div className="p-8 md:p-12">
            <div className="mb-6">
              <h2 className='text-2xl font-bold tracking-tight'>Create an Account</h2>
              <p className='text-sm text-muted-foreground'>
                Join Talk.AI today and start chatting.
              </p>
            </div>

            {/* Social Sign Up Options */}
            {/* <div className="grid grid-cols-2 gap-4 mb-6">
              <Button 
                variant="outline" 
                onClick={() => handleSocialSignUp('google')}
                type="button"
              >
                <Chrome className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleSocialSignUp('github')}
                type="button"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div> */}

            {/* Divider */}
            {/* <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or sign up with email</span>
              </div>
            </div> */}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="••••••••" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  disabled={loading} 
                  type="submit" 
                  className='w-full bg-green-700 hover:bg-green-800' 
                  size="lg"
                >
                  {loading ? "Creating account..." : "Get Started"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-semibold text-green-700 hover:underline">
                Sign In
              </Link>
            </div>
          </div>

          {/* Branding Side */}
          <div className='bg-gradient-to-br from-green-700 to-green-900 relative hidden md:flex flex-col gap-y-4 justify-center items-center p-12 text-center'>
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
            <img 
              src="/logo.svg" 
              alt="Talk.AI Logo" 
              className='h-[92px] w-[92px] brightness-0 invert'
            />
            <p className='text-3xl font-bold text-white'>Talk.AI</p>
          </div>

        </CardContent>
      </Card>
      
      <p className="px-8 text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-4 hover:text-primary">Terms of Service</Link> and <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">Privacy Policy</Link>.
      </p>
    </div>
  );
}