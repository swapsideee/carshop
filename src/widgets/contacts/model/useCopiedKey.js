'use client';

import { useEffect, useState } from 'react';

export function useCopiedKey(resetMs = 1400) {
  const [copiedKey, setCopiedKey] = useState('');

  useEffect(() => {
    if (!copiedKey) return;
    const t = setTimeout(() => setCopiedKey(''), resetMs);
    return () => clearTimeout(t);
  }, [copiedKey, resetMs]);

  return { copiedKey, setCopiedKey };
}
