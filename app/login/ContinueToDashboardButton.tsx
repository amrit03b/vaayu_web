"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@civic/auth/react";
import { getStoredWallet, createWallet, storeWallet } from "@/lib/aptos";

export default function ContinueToDashboardButton() {
  const [isAuthed, setIsAuthed] = useState(false);
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && user?.id) {
      // Log the full user object to see what identifiers are available
      console.log("Civic user object:", user);
      console.log("User ID:", user.id);
      console.log("User email:", user.email);
      
      // Use a more stable identifier - prefer email if available, fallback to ID
      const stableUserId = user.email || user.id;
      console.log("Using stable user ID:", stableUserId);
      
      // Check if wallet exists for this specific user
      const existingWallet = getStoredWallet(stableUserId);
      
      if (!existingWallet) {
        // Only create wallet if it doesn't exist for this user
        const newWallet = createWallet();
        storeWallet(newWallet, stableUserId);
        console.log("Created new wallet for user:", stableUserId, newWallet.address);
      } else {
        console.log("Using existing wallet for user:", stableUserId, existingWallet.address);
      }
      
      setIsAuthed(true);
    } else {
      setIsAuthed(false);
    }
  }, [user, isLoading]);

  if (!isAuthed) return null;

  return (
    <Link href="/dashboard/dashboard">
      <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
        Continue to Dashboard
      </button>
    </Link>
  );
} 