"use client";

import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const formSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

interface OtpFormProps {
  onBack: () => void;
  onComplete: () => void;
}

export function OtpForm({ onBack, onComplete }: OtpFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: "" },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("OTP Submitted:", data.otp);
    onComplete();
  }

  return (
    <div className="w-full flex flex-col gap-4 items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-xs mx-auto space-y-6"
        >
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    {...field}
                    onComplete={form.handleSubmit(onSubmit)}
                    containerClassName="flex justify-center"
                  >
                    <InputOTPGroup className="gap-2">
                      {[...Array(6)].map((_, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="w-11 h-12 text-center text-lg font-semibold rounded-lg border-[#555] bg-[#3a3a3c] text-white focus:border-[#fec33a] focus:ring-2 focus:ring-[#fec33a]/30"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <div className="text-center text-sm text-[#8e8e93]">
            ارسال مجدد کد تا ۱:۲۳ دیگر
          </div>
        </form>
      </Form>
      <Button variant="link" onClick={onBack} className="text-white">
        تغییر شمارۀ موبایل
      </Button>
    </div>
  );
}
