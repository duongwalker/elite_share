import { useCallback, useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Initializer<T> = T extends any ? T | ((prev: T) => T) : never;

export default function usePersistantState<T>(
  key: string,
  initialValue: T,
): [T, (value: Initializer<T>) => void] {
  const [state, setInternalState] = useState<T>(initialValue);

  useEffect(() => {
    const value = localStorage.getItem(key);

    if (!value) return;

    setInternalState(JSON.parse(value));
  }, [key]);

  useEffect(() => {
    const updateInternalState = () => {
      setInternalState(JSON.parse(localStorage.getItem(key) ?? "en"));
    };
    window.addEventListener("storage", updateInternalState);
    return () => {
      
    };
  }, [key]);

  const setState = useCallback(
    (value: Initializer<T>) => {
      let parsedValue;
      if (typeof value === "function") {
        parsedValue = value(state);
      } else {
        parsedValue = value;
      }
      localStorage.setItem(key, JSON.stringify(parsedValue));
      setInternalState(value);
    },
    [key, state],
  );

  return [state, setState];
}
