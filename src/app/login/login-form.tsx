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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);
    try {
      if (formType === "signup") {
        initiateEmailSignUp(auth, values.email, values.password);
        toast({
          title: "Check your email!",
          description: "A verification link has been sent to your email address.",
        });
      } else {
        initiateEmailSignIn(auth, values.email, values.password);
      }
      // No need to redirect here, the useUser hook will handle the UI change
    } catch (e: any) {
      setError(e.message);
      setIsLoading(false);
    }
    // No need for finally block to set isLoading to false, as we want to wait for auth state change
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
              onClick={() => setFormType(formType === "login" ? "signup" : "login")}
            >
              {formType === "login" ? "Sign Up" : "Sign In"}
            </Button>
          </div>
        </CardContent>
      </Card>
  );
}
