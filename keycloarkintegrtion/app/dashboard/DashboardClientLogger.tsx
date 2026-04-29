"use client";

import { useEffect } from "react";

interface DashboardClientLoggerProps {
  session: any;
}

export default function DashboardClientLogger({
  session,
}: DashboardClientLoggerProps) {
  useEffect(() => {
    console.log("[AUTH CLIENT] Dashboard mounted successfully");
    console.log("[AUTH CLIENT] Client-side session data:", session);
    console.log("[AUTH CLIENT] User authenticated:", session?.user);
    console.log(
      "[AUTH CLIENT] Grouped user roles:",
      (session?.user as any)?.roles,
    );

    // Log each group separately for clarity
    const roles = (session?.user as any)?.roles;
    if (roles && typeof roles === "object") {
      Object.keys(roles).forEach((clientId) => {
        console.log(`[AUTH CLIENT] ${clientId} roles:`, roles[clientId]);
      });
    }

    console.log("[AUTH CLIENT] Timestamp:", new Date().toISOString());
  }, [session]);

  return null;
}
