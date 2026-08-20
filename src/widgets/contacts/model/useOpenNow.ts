import { useEffect, useState } from 'react';

import { isOpenNow } from '@/shared/lib';

export function useOpenNow(): boolean {
  const [openNow, setOpenNow] = useState(isOpenNow());

  useEffect(() => {
    const update = () => setOpenNow(isOpenNow());
    update();

    const now = new Date();
    const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

    let intervalId: ReturnType<typeof setInterval> | undefined;
    const timeoutId: ReturnType<typeof setTimeout> = setTimeout(() => {
      update();
      intervalId = setInterval(update, 60_000);
    }, msToNextMinute);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return openNow;
}
