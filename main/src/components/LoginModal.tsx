"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowRight, X } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Logo from "@/assets/Logo.svg";
import GoogleIcon from "@/assets/Google.svg";
import EmailIcon from "@/assets/Email.svg";
import EmailSentIcon from "@/assets/EmailSent.svg";

// 1. Define the shape of our state for the reducer
type State = {
  view: "phone" | "otp" | "email" | "emailConfirmation";
  phoneNumber: string;
  submittedEmail: string;
};

// 2. Define all possible actions that can change the state
type Action =
  | { type: "SUBMIT_PHONE"; payload: string }
  | { type: "SUBMIT_EMAIL"; payload: string }
  | { type: "COMPLETE_OTP" }
  | { type: "GO_TO_EMAIL_VIEW" }
  | { type: "GO_BACK_TO_PHONE" }
  | { type: "GO_BACK_TO_EMAIL" }
  | { type: "RESET" };

// 3. Define the initial state when the modal first opens
const initialState: State = {
  view: "phone",
  phoneNumber: "",
  submittedEmail: "",
};

/**
 * The reducer function is a central place to handle all state transitions.
 * It takes the current state and an action, and returns the new state.
 */
function loginReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SUBMIT_PHONE":
      return { ...state, view: "otp", phoneNumber: action.payload };
    case "SUBMIT_EMAIL":
      return {
        ...state,
        view: "emailConfirmation",
        submittedEmail: action.payload,
      };
    case "GO_TO_EMAIL_VIEW":
      return { ...state, view: "email" };
    case "GO_BACK_TO_PHONE":
      return { ...state, view: "phone", phoneNumber: "" };
    case "GO_BACK_TO_EMAIL":
      return { ...state, view: "email" };
    case "COMPLETE_OTP":
      // In a real app, you might navigate the user or fetch user data here.
      // For this example, we'll just reset the modal state.
      return initialState;
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

// --- Main Component ---
interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function LoginModal({ isOpen, onOpenChange }: LoginModalProps) {
  // 4. Initialize the reducer. `state` holds the current state, and `dispatch` is used to send actions.
  const [state, dispatch] = React.useReducer(loginReducer, initialState);

  // Reset the modal's state whenever it's opened.
  React.useEffect(() => {
    if (isOpen) {
      dispatch({ type: "RESET" });
    }
  }, [isOpen]);

  const handleOtpComplete = () => {
    dispatch({ type: "COMPLETE_OTP" });
    onOpenChange(false); // Close the modal on successful OTP completion
  };

  // Helper functions to get dynamic text based on the current view
  const getTitle = () => {
    if (state.view === "emailConfirmation") return "!ایمیلتو چک کن تا وارد بشی";
    return "پرسا ای‌آی";
  };

  const getDescription = () => {
    switch (state.view) {
      case "otp":
        return `کد تایید ارسال شده به شمارۀ ${state.phoneNumber} را وارد کنید`;
      case "email":
        return "آدرس ایمیل خودتون رو وارد کنید";
      case "phone":
      default:
        return "پرسا همه کاراتو انجام میده";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden bg-[#1a1a1a] text-white border-0 p-0 flex flex-col items-center text-center w-screen h-screen rounded-none sm:w-full sm:h-auto sm:max-w-md sm:rounded-3xl [&>button[data-state=open]]:hidden">
        <div className="p-6 flex flex-col items-center text-center w-full h-full justify-center sm:justify-start">
          <DialogClose asChild>
            <button className="absolute top-4 left-4 w-9 h-9 bg-transparent border border-[#555] text-[#8e8e93] rounded-full flex items-center justify-center hover:bg-[#3a3a3f]">
              <X size={20} />
            </button>
          </DialogClose>

          {state.view !== "emailConfirmation" && (
            <DialogHeader className="items-center text-center">
              <Image src={Logo} alt="Logo" width={73} height={65} />
              <DialogTitle className="text-xl font-bold mb-3">
                {getTitle()}
              </DialogTitle>
              <DialogDescription className="text-lg text-white max-w-[15.25rem] mx-auto mb-6 font-normal">
                {getDescription()}
              </DialogDescription>
            </DialogHeader>
          )}

          {/* Conditionally render the correct form component based on the current view state */}
          {state.view === "phone" && <PhoneNumberForm dispatch={dispatch} />}
          {state.view === "otp" && (
            <OtpForm dispatch={dispatch} onComplete={handleOtpComplete} />
          )}
          {state.view === "email" && <EmailForm dispatch={dispatch} />}
          {state.view === "emailConfirmation" && (
            <EmailConfirmation
              dispatch={dispatch}
              submittedEmail={state.submittedEmail}
            />
          )}

          {state.view !== "emailConfirmation" && (
            <p className="text-xs text-[#8e8e93] leading-relaxed ">
              با ورود به پرسا ای آی، شما
              <a
                href="/contactUs"
                className="text-[#f0f0f0] px-1 hover:underline"
              >
                قوانین و مقررات
              </a>
              استفاده را می‌پذیرید
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- Co-located Sub-Components ---
// These components are defined in the same file as they are only used by LoginModal.
// They receive the `dispatch` function via props to send actions up to the reducer.

const phoneFormSchema = z.object({
  phoneNumber: z.string().regex(/^09\d{9}$/, {
    message: "Phone number must be a valid 11-digit number starting with 09.",
  }),
});

function PhoneNumberForm({ dispatch }: { dispatch: React.Dispatch<Action> }) {
  const form = useForm<z.infer<typeof phoneFormSchema>>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: { phoneNumber: "" },
    mode: "onChange",
  });

  return (
    <div className="w-full flex flex-col gap-4 mb-5">
      <Button className="w-full max-w-xs h-11 mx-auto flex items-center justify-center gap-2 bg-[#D9D9D9] text-black border-0 rounded-2xl text-base font-medium hover:bg-gray-300">
        ورود با گوگل <Image src={GoogleIcon} alt="Google" className="w-5 h-5" />
      </Button>
      <Button
        onClick={() => dispatch({ type: "GO_TO_EMAIL_VIEW" })}
        className="w-full max-w-xs h-11 mx-auto flex items-center justify-center gap-2 bg-[#D9D9D9] text-black border-0 rounded-2xl text-base font-medium hover:bg-gray-300"
      >
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
          onSubmit={form.handleSubmit((values) =>
            dispatch({ type: "SUBMIT_PHONE", payload: values.phoneNumber })
          )}
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

const otpFormSchema = z.object({
  otp: z
    .string()
    .min(6, { message: "Your one-time password must be 6 characters." }),
});

function OtpForm({
  dispatch,
  onComplete,
}: {
  dispatch: React.Dispatch<Action>;
  onComplete: () => void;
}) {
  const form = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: { otp: "" },
  });

  return (
    <div className="w-full flex flex-col gap-4 items-center mb-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onComplete)}
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
                    onComplete={form.handleSubmit(onComplete)}
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
      <Button
        variant="link"
        onClick={() => dispatch({ type: "GO_BACK_TO_PHONE" })}
        className="text-white cursor-pointer hover:underline mb-3"
      >
        تغییر شمارۀ موبایل
      </Button>
    </div>
  );
}

const emailFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

function EmailForm({ dispatch }: { dispatch: React.Dispatch<Action> }) {
  const form = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  return (
    <div className="w-full flex flex-col gap-4 items-center mb-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) =>
            dispatch({ type: "SUBMIT_EMAIL", payload: values.email })
          )}
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
      <Button
        variant="link"
        onClick={() => dispatch({ type: "GO_BACK_TO_PHONE" })}
        className="text-white"
      >
        ورود با شماره تلفن
      </Button>
    </div>
  );
}

function EmailConfirmation({
  dispatch,
  submittedEmail,
}: {
  dispatch: React.Dispatch<Action>;
  submittedEmail: string;
}) {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 border border-[#444] rounded-xl p-4 mt-16">
      <h2 className="text-lg font-bold text-white">
        !ایمیلتو چک کن تا وارد بشی
      </h2>
      <div className="w-full border border-[#444] rounded-2xl p-4 flex flex-col items-center gap-2 bg-[#1F1E1C]">
        <div className="flex flex-col items-center text-right">
          <p className="text-sm text-[#8e8e93]">ارسال شده به:</p>
          <strong className="text-base font-medium">{submittedEmail}</strong>
        </div>
        <Image src={EmailSentIcon} alt="Email Sent" className="w-20" />
      </div>
      <button
        onClick={() => dispatch({ type: "GO_BACK_TO_EMAIL" })}
        className="text-[#3A80C5] text-lg font-semibold cursor-pointer"
      >
        تغییر آدرس ایمیل
      </button>
    </div>
  );
}
