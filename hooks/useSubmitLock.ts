import { useRef, useCallback } from "react";

export function useSubmitLock() {
  const isLocked = useRef(false);

  const guard = useCallback(async (fn: () => Promise<void>) => {
    if (isLocked.current) return;
    isLocked.current = true;
    try {
      await fn();
    } finally {
      isLocked.current = false;
    }
  }, []);

  return guard;
}
