import { CONTACTS } from '@/shared/config/contacts';

const toMinutes = (hhmm) => {
  const [h, m] = String(hhmm).split(':').map(Number);
  return h * 60 + m;
};

const getZonedHM = (timeZone, date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const get = (type) => parts.find((p) => p.type === type)?.value;

  return {
    hour: Number(get('hour')),
    minute: Number(get('minute')),
  };
};

export function isOpenNow() {
  const timeZone = CONTACTS.timeZone ?? 'Europe/Kyiv';
  const from = CONTACTS.workHours?.from ?? '09:00';
  const to = CONTACTS.workHours?.to ?? '13:00';

  const { hour, minute } = getZonedHM(timeZone);
  const now = hour * 60 + minute;

  const start = toMinutes(from);
  const end = toMinutes(to);

  return now >= start && now < end;
}
