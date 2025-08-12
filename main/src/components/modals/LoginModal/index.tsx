// main/src/components/modals/LoginModal/index.tsx
"use client";

import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, X } from "lucide-react";
import Image from "next/image"; // Import the Next.js Image component

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
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
import Logo from "@/assets/Logo.svg"; // Assuming you have this file at main/src/assets/Logo.svg
import GoogleIcon from "@/assets/Google.svg"; // Assuming you have this file
import EmailIcon from "@/assets/Email.svg"; // Assuming you have this file

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
 * A modal component for user login, styled according to the provided design.
 */
export function LoginModal({ isOpen, onOpenChange }: LoginModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
    },
    mode: "onChange", // Add mode to validate on change
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Phone number submitted:", values.phoneNumber);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden bg-[#1a1a1a] text-white border-0 p-0 flex flex-col items-center text-center w-screen h-screen rounded-none sm:w-full sm:h-auto sm:max-w-md sm:rounded-3xl [&>button[data-state=open]]:hidden">
        <div className="p-6 flex flex-col items-center text-center w-full h-full justify-center sm:justify-start">
          <DialogClose asChild>
            <button className="absolute top-4 left-4 w-9 h-9 bg-transparent border border-[#555] text-[#8e8e93] rounded-full flex items-center justify-center hover:bg-[#3a3a3f]">
              <X size={20} />
            </button>
          </DialogClose>

          <DialogHeader className="items-center text-center">
            {/* Use the Next.js Image component */}
            <Image src={Logo} alt="Logo" width={65} height={65} />
            <DialogTitle className="text-xl font-bold mb-3">
              پرسا ای‌آی
            </DialogTitle>
            <DialogDescription className="text-lg text-white max-w-[15.25rem] mx-auto mb-6 font-normal">
              پرسا همه کاراتو انجام میده
            </DialogDescription>
          </DialogHeader>

          <div className="w-full flex flex-col gap-4">
            {/* Social Login Buttons */}
            <Button className="w-full max-w-xs h-11 mx-auto flex items-center justify-center gap-2 bg-[#D9D9D9] text-black border-0 rounded-2xl text-base font-medium hover:bg-gray-300">
              ورود با گوگل{" "}
              <Image src={GoogleIcon} alt="Google" className="w-5 h-5" />
            </Button>
            <Button className="w-full max-w-xs h-11 mx-auto flex items-center justify-center gap-2 bg-[#D9D9D9] text-black border-0 rounded-2xl text-base font-medium hover:bg-gray-300">
              ورود با ایمیل{" "}
              <Image src={EmailIcon} alt="Email" className="w-5 h-5" />
            </Button>

            {/* Separator */}
            <div className="relative my-2 w-full max-w-xs mx-auto">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#444]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-[#1a1a1a] px-4 text-[#8e8e93]">
                  یا از طریق
                </span>
              </div>
            </div>

            {/* Phone Number Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full max-w-xs mx-auto"
              >
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="tel"
                            placeholder="ورود با شماره تلفن"
                            maxLength={11}
                            dir="rtl"
                            className="h-12 text-center text-base bg-[#40403E] border-[#555] rounded-xl focus:border-yellow-400"
                            {...field}
                          />
                          {/* Conditionally render the button only when the form is valid */}
                          {form.formState.isValid && (
                            <Button
                              type="submit"
                              size="icon"
                              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 bg-white text-black rounded-lg hover:bg-gray-200"
                            >
                              <ArrowRight className="h-5 w-5" />
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>

          {/* Footer */}
          <p className="text-xs text-[#8e8e93] leading-relaxed pt-6">
            با ورود به پرسا ای آی، شما
            <a
              href="/contactUs"
              className="text-[#f0f0f0] px-1 hover:underline"
            >
              قوانین و مقررات
            </a>
            استفاده را می‌پذیرید
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
