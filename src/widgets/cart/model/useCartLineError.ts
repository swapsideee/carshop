import { useCallback, useState } from 'react';

type UseCartLineErrorOptions = {
  timeoutMs?: number;
};

type UseCartLineErrorResult = {
  errorItemId: string | null;
  errorText: string;
  showLineError: (id: string, message?: string) => void;
};

export function useCartLineError({
  timeoutMs = 3000,
}: UseCartLineErrorOptions = {}): UseCartLineErrorResult {
  const [errorItemId, setErrorItemId] = useState<string | null>(null);
  const [errorText, setErrorText] = useState('');

  const showLineError = useCallback(
    (id: string, message?: string): void => {
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
