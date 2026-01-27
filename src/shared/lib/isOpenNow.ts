import { CONTACTS } from '@/shared/config/contacts';

type HHMM = `${number}${number}:${number}${number}`;

const toMinutes = (hhmm: HHMM | string): number => {
  const [hRaw = '0', mRaw = '0'] = String(hhmm).split(':');

  const h = Number(hRaw);
  const m = Number(mRaw);

  if (!Number.isFinite(h) || !Number.isFinite(m)) return 0;

  return h * 60 + m;
};

const getZonedHM = (
  timeZone: string,
  date: Date = new Date(),
): { hour: number; minute: number } => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const get = (type: 'hour' | 'minute') => parts.find((p) => p.type === type)?.value;

  return {
    hour: Number(get('hour')),
    minute: Number(get('minute')),
  };
};

export function isOpenNow(): boolean {
  const timeZone = CONTACTS.timeZone ?? 'Europe/Kyiv';
  const from = (CONTACTS.workHours?.from ?? '09:00') as HHMM;
  const to = (CONTACTS.workHours?.to ?? '13:00') as HHMM;

  const { hour, minute } = getZonedHM(timeZone);
  const now = hour * 60 + minute;

  const start = toMinutes(from);
  const end = toMinutes(to);

  return now >= start && now < end;
}
