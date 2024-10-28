"use client";

import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function AuthStatus() {
  return (
    <div className="flex items-center gap-4">
      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-10 h-10",
              userButtonPopoverCard: "bg-background/95 backdrop-blur-sm border-2",
              userButtonPopoverFooter: "hidden"
            }
          }}
        />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}