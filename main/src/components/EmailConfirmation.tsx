"use client";

import Image from "next/image";
import EmailSentIcon from "@/assets/EmailSent.svg";

interface EmailConfirmationProps {
  submittedEmail: string;
  onBack: () => void;
}

export function EmailConfirmation({
  submittedEmail,
  onBack,
}: EmailConfirmationProps) {
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
        onClick={onBack}
        className="text-[#3A80C5] text-lg font-semibold cursor-pointer"
      >
        تغییر آدرس ایمیل
      </button>
    </div>
  );
}
