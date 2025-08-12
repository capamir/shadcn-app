"use client";

import * as React from "react";
import Image from "next/image";
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Logo from "@/assets/Logo.svg";
import { PhoneNumberForm } from "@/components/forms/PhoneNumberForm";
import { OtpForm } from "@/components/forms/OtpForm";

type ModalView = "phone" | "otp";

interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function LoginModal({ isOpen, onOpenChange }: LoginModalProps) {
  const [view, setView] = React.useState<ModalView>("phone");
  const [phoneNumber, setPhoneNumber] = React.useState("");

  React.useEffect(() => {
    if (isOpen) {
      setView("phone");
    }
  }, [isOpen]);

  const handlePhoneSubmit = (phone: string) => {
    setPhoneNumber(phone);
    setView("otp");
  };

  const handleBackToPhone = () => {
    setView("phone");
  };

  const handleOtpComplete = () => {
    onOpenChange(false);
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

          <DialogHeader className="items-center text-center">
            <Image src={Logo} alt="Logo" width={65} height={65} />
            <DialogTitle className="text-xl font-bold mb-3">
              پرسا ای‌آی
            </DialogTitle>
            <DialogDescription className="text-lg text-white max-w-[15.25rem] mx-auto mb-6 font-normal">
              {view === "otp"
                ? `کد تایید ارسال شده به شمارۀ ${phoneNumber} را وارد کنید`
                : "پرسا همه کاراتو انجام میده"}
            </DialogDescription>
          </DialogHeader>

          {view === "phone" && <PhoneNumberForm onSubmit={handlePhoneSubmit} />}
          {view === "otp" && (
            <OtpForm
              onBack={handleBackToPhone}
              onComplete={handleOtpComplete}
            />
          )}

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
