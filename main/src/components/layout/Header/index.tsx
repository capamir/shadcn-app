// main/src/components/layout/Header/index.tsx
"use client";

import * as React from "react";
import { LoginModal } from "@/components/modals/LoginModal";
import { Button } from "@/components/ui/button";

/**
 * The main header component for the application.
 * Contains the app title and the login modal trigger.
 */
export function Header() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <header className="border-b">
        <div className="px-5 flex h-16 items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Finance Tracker</h1>
          <Button onClick={() => setIsModalOpen(true)}>Login</Button>
        </div>
      </header>
      <LoginModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
