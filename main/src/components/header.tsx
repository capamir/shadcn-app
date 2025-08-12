// src/components/header.tsx
import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * The main header component for the application.
 * Contains the app title and theme toggle.
 */
export function Header() {
  return (
    <header className="border-b">
      <div className="w-full flex h-16 items-center justify-between px-5">
        <h1 className="text-2xl font-bold tracking-tight">Finance Tracker</h1>
        <ThemeToggle />
      </div>
    </header>
  );
}
