"use client";

import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import GoogleIcon from "@/assets/Google.svg";
import EmailIcon from "@/assets/Email.svg";

const formSchema = z.object({
  phoneNumber: z.string().regex(/^09\d{9}$/, {
    message: "Phone number must be a valid 11-digit number starting with 09.",
  }),
});

interface PhoneNumberFormProps {
  onSubmit: (phoneNumber: string) => void;
}

export function PhoneNumberForm({ onSubmit }: PhoneNumberFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { phoneNumber: "" },
    mode: "onChange",
  });

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values.phoneNumber);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <Button className="w-full max-w-xs h-11 mx-auto flex items-center justify-center gap-2 bg-[#D9D9D9] text-black border-0 rounded-2xl text-base font-medium hover:bg-gray-300">
        ورود با گوگل <Image src={GoogleIcon} alt="Google" className="w-5 h-5" />
      </Button>
      <Button className="w-full max-w-xs h-11 mx-auto flex items-center justify-center gap-2 bg-[#D9D9D9] text-black border-0 rounded-2xl text-base font-medium hover:bg-gray-300">
        ورود با ایمیل <Image src={EmailIcon} alt="Email" className="w-5 h-5" />
      </Button>

      <div className="relative my-2 w-full max-w-xs mx-auto">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#444]" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-[#1a1a1a] px-4 text-[#8e8e93]">یا از طریق</span>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
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
  );
}
