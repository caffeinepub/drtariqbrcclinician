import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useActor } from "./useActor";

/**
 * Custom hook to keep the application alive and prevent canister hibernation
 * Performs periodic lightweight backend calls to maintain session activity
 */
export function useKeepAlive() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!actor) return;

    // Perform keep-alive ping every 5 minutes (300000ms)
    // This is frequent enough to prevent hibernation but not excessive
    const KEEP_ALIVE_INTERVAL = 5 * 60 * 1000;

    const performKeepAlivePing = async () => {
      try {
        // Use a lightweight query call to ping the backend
        // getHomePage is a simple query that doesn't modify state
        await actor.getHomePage();

        // Optionally refresh critical queries to keep data fresh
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
        queryClient.invalidateQueries({ queryKey: ["newAppointmentsCount"] });

        console.log(
          "[Keep-Alive] Session renewed at",
          new Date().toLocaleTimeString(),
        );
      } catch (error) {
        console.error("[Keep-Alive] Ping failed:", error);
        // Don't throw - we'll retry on next interval
      }
    };

    // Perform initial ping after 1 minute
    const initialTimeout = setTimeout(() => {
      performKeepAlivePing();
    }, 60000);

    // Set up recurring interval
    intervalRef.current = setInterval(() => {
      performKeepAlivePing();
    }, KEEP_ALIVE_INTERVAL);

    // Cleanup on unmount
    return () => {
      if (initialTimeout) clearTimeout(initialTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [actor, queryClient]);

  // Also perform keep-alive on user activity
  useEffect(() => {
    if (!actor) return;

    const handleUserActivity = () => {
      // Debounce: only ping if last ping was more than 2 minutes ago
      const lastPing = sessionStorage.getItem("lastKeepAlivePing");
      const now = Date.now();

      if (!lastPing || now - Number.parseInt(lastPing) > 2 * 60 * 1000) {
        actor.getHomePage().catch(() => {
          // Silently fail - interval will retry
        });
        sessionStorage.setItem("lastKeepAlivePing", now.toString());
      }
    };

    // Listen for user interactions
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    for (const event of events) {
      window.addEventListener(event, handleUserActivity, { passive: true });
    }

    return () => {
      for (const event of events) {
        window.removeEventListener(event, handleUserActivity);
      }
    };
  }, [actor]);
}
