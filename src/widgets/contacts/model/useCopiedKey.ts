import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';

export type UseCopiedKeyResult = {
  copiedKey: string;
  setCopiedKey: Dispatch<SetStateAction<string>>;
};

export function useCopiedKey(resetMs = 1400): UseCopiedKeyResult {
  const [copiedKey, setCopiedKey] = useState('');

  useEffect(() => {
    if (!copiedKey) return;

    const timeoutId: ReturnType<typeof setTimeout> = setTimeout(() => setCopiedKey(''), resetMs);
    return () => clearTimeout(timeoutId);
  }, [copiedKey, resetMs]);

  return { copiedKey, setCopiedKey };
}
