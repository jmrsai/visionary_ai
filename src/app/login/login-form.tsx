
"use client";

import "react-phone-input-2/lib/style.css";
import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth, useStorage } from "@/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  UserCredential,
  updateProfile,
  sendPasswordResetEmail,
  Auth,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import PhoneInput from "react-phone-input-2";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, Phone, User as UserIcon, Camera, Sparkles, Eye, Shield, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getOrCreateUser } from "@/services/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";

declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier;
        confirmationResult?: ConfirmationResult;
        grecaptcha?: any;
    }
}

const interests = [
  { id: 'strain_reduction', label: 'Digital Eye Strain', icon: Eye },
  { id: 'vision_improvement', label: 'Vision Improvement', icon: Sparkles },
  { id: 'preventative_care', label: 'Preventative Care', icon: Shield },
  { id: 'kids_health', label: 'Kids\' Eye Health', icon: Heart },
] as const;

const emailFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  displayName: z.string().optional(),
  interests: z.array(z.string()).optional(),
});

const phoneFormSchema = z.object({
  phoneNumber: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
});

const otpFormSchema = z.object({
  otp: z.string().length(6, {
    message: "Please enter the 6-digit code.",
  }),
});

const forgotPasswordSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
});

type FormType = "login" | "signup-step1" | "signup-step2" | "phone" | "otp" | "forgot-password";

export function LoginForm() {
  const [formType, setFormType] = useState<FormType>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const auth = useAuth();
  const storage = useStorage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (formType === 'phone' && auth && !window.recaptchaVerifier) {
      // Use an invisible reCAPTCHA
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, you can now send the phone number.
        },
        'expired-callback': () => {
          // Reset reCAPTCHA
          window.recaptchaVerifier?.clear();
        }
      });
    }

    // Cleanup on component unmount or when formType changes
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    };
  }, [formType, auth]);


  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAuthSuccess = async (userCredential: UserCredential, extraData?: { displayName?: string, interests?: string[] }) => {
    let photoURL = userCredential.user.photoURL;

    if (profilePic && storage) {
      setIsLoading(true);
      setError("Creating profile...");
      const storageRef = ref(storage, `profile-pictures/${userCredential.user.uid}`);
      await uploadBytes(storageRef, profilePic);
      photoURL = await getDownloadURL(storageRef);
    }
    
    if (extraData?.displayName || photoURL) {
       await updateProfile(userCredential.user, { displayName: extraData?.displayName, photoURL });
    }
    
    await getOrCreateUser(userCredential.user, extraData?.interests);

    if (formType.startsWith("signup")) {
      toast({
        title: "Account created!",
        description: "Welcome to Visionary.",
      });
    }
  };

  const handleAuthError = (e: any) => {
    let message = "An unexpected error occurred. Please try again.";
    switch (e.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
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
      case "auth/invalid-phone-number":
        message = "Invalid phone number provided.";
        break;
      case "auth/too-many-requests":
        message = "Too many requests. Please try again later.";
        break;
      case "auth/code-expired":
        message =
          "The verification code has expired. Please request a new one.";
        break;
      case "auth/invalid-verification-code":
        message = "Invalid verification code. Please try again.";
        break;
      case "auth/captcha-check-failed":
        message = "reCAPTCHA check failed. Please try again.";
        break;
    }
    setError(message);
    setIsLoading(false);
  };

  const handleGoogleSignIn = () => {
    if (!auth) return;
    setIsLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((cred) => handleAuthSuccess(cred))
      .catch(handleAuthError);
  };
  
  const handlePhoneSignIn = (values: z.infer<typeof phoneFormSchema>) => {
    if (!auth || !window.recaptchaVerifier) {
      setError("Authentication service not ready. Please try again.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    const appVerifier = window.recaptchaVerifier;
    const phoneNumber = `+${values.phoneNumber}`;
    
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
            setConfirmationResult(confirmationResult);
            setFormType("otp");
            setIsLoading(false);
        })
        .catch((error) => {
            let message = "SMS not sent. Please try again.";
             if (error.code === 'auth/too-many-requests') {
                message = "Too many requests. Please try again later.";
            } else if (error.code === 'auth/invalid-phone-number') {
                message = "The phone number is not valid.";
            } else if (error.code === 'auth/billing-not-enabled') {
                message = "Phone sign-in is not enabled for this project. Please contact support.";
            }
            console.error("Phone sign-in error:", error);
            setError(message);
            setIsLoading(false);
        });
  };

  const handleForgotPassword = async (values: z.infer<typeof forgotPasswordSchema>) => {
    if (!auth) return;
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
        await sendPasswordResetEmail(auth, values.email);
        setSuccessMessage("Password reset email sent! Please check your inbox.");
    } catch (e: any) {
        let message = "Failed to send reset email. Please try again.";
        if (e.code === 'auth/user-not-found') {
            message = "No account found with this email address."
        }
        setError(message);
    } finally {
        setIsLoading(false);
    }
  };


  const handleOtpSubmit = async (values: z.infer<typeof otpFormSchema>) => {
    setIsLoading(true);
    setError(null);
    if (!confirmationResult) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
      return;
    }
    try {
      const result = await confirmationResult.confirm(values.otp);
      await handleAuthSuccess(result);
    } catch (e) {
      handleAuthError(e);
    }
  };

  const onEmailSubmit = (values: z.infer<typeof emailFormSchema>) => {
    if (!auth) return;
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (formType === "signup-step1") {
        if (!values.displayName) {
            emailForm.setError("displayName", { message: "Display name is required."});
            setIsLoading(false);
            return;
        }
        setFormType("signup-step2");
        setIsLoading(false);
    } else if (formType === "signup-step2") {
        createUserWithEmailAndPassword(auth, values.email, values.password)
            .then((cred) => handleAuthSuccess(cred, { displayName: values.displayName, interests: values.interests }))
            .catch(handleAuthError);
    } else {
      signInWithEmailAndPassword(auth, values.email, values.password)
        .then((cred) => handleAuthSuccess(cred))
        .catch(handleAuthError);
    }
  };
  
    const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { email: "", password: "", displayName: "", interests: [] },
  });

  const phoneForm = useForm<z.infer<typeof phoneFormSchema>>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: { phoneNumber: "" },
  });

  const otpForm = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: { otp: "" },
  });
  
  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
      resolver: zodResolver(forgotPasswordSchema),
      defaultValues: { email: "" },
  });


  const renderEmailForm = () => (
    <>
      <FormField
        control={emailForm.control}
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
        control={emailForm.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <div className="flex justify-between items-center">
                 <FormLabel>Password</FormLabel>
                 {formType === 'login' && (
                     <Button type="button" variant="link" className="h-auto p-0 text-xs" onClick={() => setFormType('forgot-password')}>
                         Forgot Password?
                     </Button>
                 )}
            </div>
            <FormControl>
              <Input type="password" placeholder="••••••••" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );

   const renderSignupStep1 = () => (
     <div className="space-y-6">
        <FormItem>
            <FormLabel>Profile Picture</FormLabel>
            <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                    {previewUrl && <AvatarImage src={previewUrl} />}
                    <AvatarFallback><UserIcon className="h-8 w-8 text-muted-foreground"/></AvatarFallback>
                </Avatar>
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Camera className="mr-2 h-4 w-4" /> Upload
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleProfilePicChange} accept="image/*" className="hidden" />
            </div>
        </FormItem>
        <FormField
            control={emailForm.control}
            name="displayName"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                <Input type="text" placeholder="Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        {renderEmailForm()}
        <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue
        </Button>
    </div>
  );

  const renderSignupStep2 = () => (
    <div className="space-y-6">
        <FormField
            control={emailForm.control}
            name="interests"
            render={() => (
                <FormItem>
                    <div className="mb-4">
                        <FormLabel className="text-base">What are your interests?</FormLabel>
                        <FormDescription>Select a few areas you'd like to focus on.</FormDescription>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {interests.map((item) => (
                        <FormField
                        key={item.id}
                        control={emailForm.control}
                        name="interests"
                        render={({ field }) => {
                            const Icon = item.icon;
                            return (
                            <FormItem key={item.id} className="flex flex-row items-center space-x-3 space-y-0 p-4 border rounded-lg has-[:checked]:border-primary has-[:checked]:bg-primary/10 transition-colors">
                                <FormControl>
                                <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                    return checked
                                        ? field.onChange([...(field.value || []), item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                            (value) => value !== item.id
                                            )
                                        )
                                    }}
                                />
                                </FormControl>
                                <FormLabel className="font-normal flex items-center gap-2 cursor-pointer">
                                   <Icon className="h-5 w-5 text-primary" /> {item.label}
                                </FormLabel>
                            </FormItem>
                            )
                        }}
                        />
                    ))}
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Finish Sign Up
        </Button>
    </div>
  );
  
  const renderForgotPasswordForm = () => (
    <Form {...forgotPasswordForm}>
        <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-6">
            <FormField
                control={forgotPasswordForm.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormDescription>We'll send a password reset link to this email.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Link
            </Button>
        </form>
    </Form>
  );

  const renderPhoneForm = () => (
    <Form {...phoneForm}>
      <form
        onSubmit={phoneForm.handleSubmit(handlePhoneSignIn)}
        className="space-y-6"
      >
        <FormField
          control={phoneForm.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Controller
                    name="phoneNumber"
                    control={phoneForm.control}
                    render={({ field: { onChange, value } }) => (
                        <PhoneInput
                            country={"in"}
                            value={value}
                            onChange={onChange}
                            inputClass="!w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 !pl-12"
                        />
                    )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button id="send-code-button" type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send Verification Code
        </Button>
      </form>
    </Form>
  );

  const renderOtpForm = () => (
    <Form {...otpForm}>
      <form
        onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
        className="space-y-6"
      >
        <FormField
          control={otpForm.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="123456"
                  {...field}
                  maxLength={6}
                />
              </FormControl>
              <FormDescription>
                Enter the 6-digit code sent to your phone.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Verify & Sign In
        </Button>
      </form>
    </Form>
  );

  const renderInitialLogin = () => (
    <Form {...emailForm}>
      <form
        onSubmit={emailForm.handleSubmit(onEmailSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full"
            type="button"
            disabled={isLoading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.641-3.203-11.127-7.562l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C44.592 35.931 48 29.696 48 24c0-1.341-.138-2.65-.389-3.917z"
              ></path>
            </svg>
            Google
          </Button>
          <Button
            onClick={() => setFormType("phone")}
            variant="outline"
            className="w-full"
            type="button"
            disabled={isLoading}
          >
            <Phone className="mr-2 h-4 w-4" />
            Phone
          </Button>
        </div>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>
        {renderEmailForm()}
        <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
        </Button>
        <div className="mt-4 text-center text-sm">
          Don't have an account?
          <Button
            variant="link"
            type="button"
            className="px-1"
            onClick={() => setFormType("signup-step1")}
          >
            Sign Up
          </Button>
        </div>
      </form>
    </Form>
  );
  
  const getTitleAndDescription = () => {
      switch (formType) {
          case 'login': return { title: 'Welcome Back', description: 'Sign in to access your profile and progress.'};
          case 'signup-step1': return { title: 'Create an Account', description: 'Join Visionary to start your journey to better eye health.'};
          case 'signup-step2': return { title: 'Personalize Your Experience', description: "Help us tailor the app to your needs."};
          case 'phone': return { title: 'Sign In with Phone', description: 'Enter your phone number to receive a verification code.'};
          case 'otp': return { title: 'Enter Verification Code', description: 'We sent a code to your phone. Enter it below.'};
          case 'forgot-password': return { title: 'Reset Password', description: "Enter your email to receive a password reset link."};
          default: return { title: '', description: '' };
      }
  }
  
  const { title, description } = getTitleAndDescription();

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div id="recaptcha-container"></div>
        {error && (
          <p className="text-sm font-medium text-destructive mb-4">{error}</p>
        )}
        {successMessage && (
          <p className="text-sm font-medium text-green-600 mb-4">{successMessage}</p>
        )}

        {formType === "login" && renderInitialLogin()}
        {formType === "signup-step1" && (
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
              {renderSignupStep1()}
              <div className="mt-6 text-center text-sm">
                Already have an account?
                <Button
                  variant="link"
                  type="button"
                  className="px-1"
                  onClick={() => setFormType("login")}
                >
                  Sign In
                </Button>
              </div>
            </form>
          </Form>
        )}
        {formType === "signup-step2" && (
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
              {renderSignupStep2()}
              <div className="mt-6 text-center text-sm">
                <Button
                  variant="link"
                  type="button"
                  className="px-1"
                  onClick={() => setFormType("signup-step1")}
                >
                  &larr; Back
                </Button>
              </div>
            </form>
          </Form>
        )}
        {formType === "phone" && renderPhoneForm()}
        {formType === "otp" && renderOtpForm()}
        {formType === 'forgot-password' && renderForgotPasswordForm()}

        {(formType === "phone" || formType === "otp" || formType === 'forgot-password') && (
          <div className="mt-6 text-center text-sm">
            <Button
              variant="link"
              type="button"
              className="px-1"
              onClick={() => {
                  setFormType("login");
                  setError(null);
                  setSuccessMessage(null);
              }}
            >
              &larr; Back to Sign In
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
