'use client';

import { useCallback, useState } from 'react';

export function useCartLineError({ timeoutMs = 3000 } = {}) {
  const [errorItemId, setErrorItemId] = useState(null);
  const [errorText, setErrorText] = useState('');

  const showLineError = useCallback(
    (id, message) => {
      setErrorItemId(id);
      setErrorText(message || 'Помилка');

      window.setTimeout(() => {
        setErrorItemId(null);
        setErrorText('');
      }, timeoutMs);
    },
    [timeoutMs],
  );

  return { errorItemId, errorText, showLineError };
}
