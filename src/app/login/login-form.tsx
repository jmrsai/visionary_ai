"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/firebase";
import { initiateEmailSignUp, initiateEmailSignIn } from "@/firebase/non-blocking-login";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getOrCreateUser } from "@/services/firebase";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export function LoginForm() {
  const [formType, setFormType] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);
    
    const handleAuthSuccess = (userCredential: any) => {
        getOrCreateUser(userCredential.user);
        if (formType === 'signup') {
            toast({
              title: "Account created!",
              description: "Welcome to Visionary.",
            });
        }
        // No redirect needed, useUser hook will handle it.
        // We don't setIsLoading(false) here because we want to wait for the redirect.
    };

    const handleAuthError = (e: any) => {
        // Map Firebase auth errors to user-friendly messages
        let message = "An unexpected error occurred. Please try again.";
        switch (e.code) {
            case "auth/user-not-found":
            case "auth/wrong-password":
                message = "Invalid email or password.";
                break;
            case "auth/email-already-in-use":
                message = "An account with this email already exists.";
                break;
            case "auth/weak-password":
                message = "The password is too weak. Please use at least 6 characters.";
                break;
            case "auth/invalid-email":
                 message = "Please enter a valid email address.";
                 break;
        }
        setError(message);
        setIsLoading(false);
    };

    if (formType === "signup") {
      createUserWithEmailAndPassword(auth, values.email, values.password)
        .then(handleAuthSuccess)
        .catch(handleAuthError);
    } else {
      signInWithEmailAndPassword(auth, values.email, values.password)
        .then(handleAuthSuccess)
        .catch(handleAuthError);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{formType === "login" ? "Welcome Back" : "Create an Account"}</CardTitle>
          <CardDescription>
            {formType === "login"
              ? "Sign in to access your profile and progress."
              : "Join Visionary to start your journey to better eye health."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
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
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {formType === "login" ? "Sign In" : "Sign Up"}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            {formType === "login" ? "Don't have an account?" : "Already have an account?"}
            <Button
              variant="link"
              className="px-1"
              onClick={() => {
                setFormType(formType === "login" ? "signup" : "login");
                setError(null);
                form.reset();
              }}
            >
              {formType === "login" ? "Sign Up" : "Sign In"}
            </Button>
          </div>
        </CardContent>
      </Card>
  );
}
