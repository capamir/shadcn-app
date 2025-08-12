"use client";

import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

interface EmailFormProps {
  onSubmit: (email: string) => void;
  onBack: () => void;
}

export function EmailForm({ onSubmit, onBack }: EmailFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values.email);
  };

  return (
    <div className="w-full flex flex-col gap-4 items-center mb-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="w-full max-w-xs mx-auto"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="ورود با ایمیل"
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
      <Button variant="link" onClick={onBack} className="text-white">
        ورود با شماره تلفن
      </Button>
    </div>
  );
}
