import { useActor as useCoreActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";
import type { BackendActor } from "../types";

export function useActor() {
  const result = useCoreActor(createActor);
  return {
    actor: result.actor as unknown as BackendActor | null,
    isFetching: result.isFetching,
  };
}
