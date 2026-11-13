import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { addDays, isSameDay, startOfDay } from 'date-fns';

/**
 * Bugünün tarihi. Uygulama öne geldiğinde ve gece yarısı geçtiğinde güncellenir,
 * böylece kalan gün uygulama açık kalsa bile doğru kalır.
 */
export function useToday(): Date {
  const [today, setToday] = useState(() => new Date());

  useEffect(() => {
    const refresh = () =>
      setToday((prev) => {
        const now = new Date();
        return isSameDay(prev, now) ? prev : now;
      });

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });

    const msToMidnight = startOfDay(addDays(today, 1)).getTime() - Date.now() + 1000;
    const timer = setTimeout(refresh, Math.max(1000, msToMidnight));

    return () => {
      sub.remove();
      clearTimeout(timer);
    };
  }, [today]);

  return today;
}
