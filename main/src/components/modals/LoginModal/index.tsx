// main/src/components/modals/LoginModal/index.tsx
"use client";

import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, Mail, Chrome } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

/**
 * Defines the props for the LoginModal component.
 */
interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

/**
 * Defines the validation schema for the phone number form.
 * It requires a string that starts with "09" and is followed by 9 digits.
 */
const formSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, { message: "Phone number is required." })
    .regex(/^09\d{9}$/, {
      message: "Phone number must be a valid 11-digit number starting with 09.",
    }),
});

/**
 * A modal component for user login.
 * This initial version only supports the phone number login view.
 */
export function LoginModal({ isOpen, onOpenChange }: LoginModalProps) {
  // 1. Set up the form using react-hook-form and Zod.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // For now, we'll just log the values.
    // Later, this will trigger the OTP view.
    console.log("Phone number submitted:", values.phoneNumber);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-2xl">Login</DialogTitle>
          <DialogDescription>
            Enter your phone number to continue.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Placeholder buttons for other login methods */}
          <Button variant="outline">
            <Chrome className="mr-2 h-4 w-4" /> Login with Google
          </Button>
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" /> Login with Email
          </Button>

          {/* Separator */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Phone Number Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="tel"
                          placeholder="09123456789"
                          maxLength={11}
                          {...field}
                        />
                        <Button
                          type="submit"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                          disabled={!form.formState.isValid}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          {/* Footer */}
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <a
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
