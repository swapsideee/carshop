'use client';

import { Building, Check, Clock, Copy, ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cx } from '@/shared/lib';

const CONTACTS = {
  email: 'example@gmail.com',
  emailHref: 'mailto:example@gmail.com',
  phoneDisplay: '+380 123 456 7899',
  phoneHref: 'tel:+3801234567899',
  address: 'вул. Приблизна, 10',
  city: 'Харків',
  schedule: 'Пн–Нд, 9:00–13:00',
  mapEmbedSrc:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d41044.94908353241!2d36.25218043736826!3d49.98681002010195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4127a09f63ab0f8b%3A0x2d4c18681aa4be0a!2z0KXQsNGA0YzQutC-0LIsINCl0LDRgNGM0LrQvtCy0YHQutCw0Y8g0L7QsdC70LDRgdGC0YwsINCj0LrRgNCw0LjQvdCw!5e0!3m2!1sru!2sde!4v1768246895936!5m2!1sru!2sde',
};

function isOpenNow() {
  const now = new Date();
  const time = now.getHours() * 60 + now.getMinutes();
  return time >= 9 * 60 && time <= 13 * 60;
}

const StatusBadge = ({ open, title }) => {
  return (
    <div
      className={cx(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm',
        open
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-rose-200 bg-rose-50 text-rose-800',
      )}
      title={title}
      aria-label={open ? 'Відкрито зараз' : 'Зачинено зараз'}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span
          className={cx(
            'absolute inline-flex h-full w-full rounded-full',
            open ? 'bg-emerald-500/50 animate-ping' : 'bg-rose-500/35',
          )}
        />
        <span
          className={cx(
            'relative inline-flex h-2.5 w-2.5 rounded-full',
            open ? 'bg-emerald-600' : 'bg-rose-600',
          )}
        />
      </span>
      {open ? 'Відкрито зараз' : 'Зачинено зараз'}
    </div>
  );
};

const Row = ({ icon: Icon, label, value, href, trailing }) => {
  const base = cx(
    'group rounded-xl border border-gray-200/80 bg-white/70 p-4 shadow-sm transition',
    'hover:-translate-y-0.5 hover:shadow-md hover:bg-white',
  );

  const inner = (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm">
        <Icon className="h-5 w-5 text-gray-700" />
      </div>

      <div className="flex-1">
        <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</div>
        <div className="text-base font-semibold text-gray-900">{value}</div>
      </div>

      {trailing}
    </div>
  );

  return href ? (
    <a href={href} className={base}>
      {inner}
    </a>
  ) : (
    <div className={base}>{inner}</div>
  );
};

export default function ContactsPage() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [copiedKey, setCopiedKey] = useState('');

  const [openNow, setOpenNow] = useState(isOpenNow());

  useEffect(() => {
    const update = () => setOpenNow(isOpenNow());
    update();

    const now = new Date();
    const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

    let intervalId;
    const timeoutId = setTimeout(() => {
      update();
      intervalId = setInterval(update, 60_000);
    }, msToNextMinute);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!copiedKey) return;
    const t = setTimeout(() => setCopiedKey(''), 1400);
    return () => clearTimeout(t);
  }, [copiedKey]);

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
    } catch {}
  };

  const fullAddress = `${CONTACTS.city}, ${CONTACTS.address}`;
  const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}`;

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-gray-50 via-white to-gray-50" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gray-200/35 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-gray-200/25 blur-3xl" />

      <div className="relative mx-auto w-full max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Контакти</h1>

          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600">
            Напишіть або зателефонуйте — підкажемо по наявності та підбору підкрилків особисто для
            вашого авто.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200/80 bg-white/60 p-6 shadow-xl backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-gray-600">Магазин підкрилків</div>
                <div className="text-xl font-bold text-gray-900">PLAST-AVTO</div>
              </div>

              <StatusBadge open={openNow} title={CONTACTS.schedule} />
            </div>

            <div className="mt-5 grid gap-3">
              <Row icon={Mail} label="Email" value={CONTACTS.email} href={CONTACTS.emailHref} />
              <Row
                icon={Phone}
                label="Телефон"
                value={CONTACTS.phoneDisplay}
                href={CONTACTS.phoneHref}
              />
              <Row icon={MapPin} label="Адреса" value={CONTACTS.address} />
              <Row icon={Building} label="Місто" value={CONTACTS.city} />
              <Row icon={Clock} label="Графік" value={CONTACTS.schedule} />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-white/60 p-6 shadow-xl backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-gray-600">Адреса на мапі</div>
                <div className="text-lg font-bold text-gray-900">{CONTACTS.city}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard(fullAddress, 'mapAddress')}
                  className="relative inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
                  aria-label="Copy address"
                >
                  <span className="relative flex items-center gap-2">
                    <Copy
                      className={cx(
                        'h-4 w-4 transition',
                        copiedKey === 'mapAddress' ? 'scale-0 opacity-0' : 'scale-100 opacity-100',
                      )}
                    />
                    <Check
                      className={cx(
                        'absolute left-0 h-4 w-4 transition',
                        copiedKey === 'mapAddress' ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
                      )}
                    />
                    <span className="relative">
                      <span
                        className={cx(
                          'transition',
                          copiedKey === 'mapAddress' ? 'opacity-0' : 'opacity-100',
                        )}
                      >
                        Скопіювати
                      </span>
                      <span
                        className={cx(
                          'absolute left-0 top-0 transition',
                          copiedKey === 'mapAddress' ? 'opacity-100' : 'opacity-0',
                        )}
                      >
                        Скопійовано
                      </span>
                    </span>
                  </span>
                </button>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
                  aria-label="Open in Google Maps"
                >
                  <ExternalLink className="h-4 w-4" />
                  На мапі
                </a>
              </div>
            </div>

            <div className="mt-4 relative h-72 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 sm:h-80">
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[85%] animate-pulse space-y-3">
                    <div className="h-4 w-2/3 rounded bg-gray-200" />
                    <div className="h-3 w-1/2 rounded bg-gray-200" />
                    <div className="h-40 w-full rounded bg-gray-200" />
                  </div>
                </div>
              )}

              <iframe
                title="Google Map"
                src={CONTACTS.mapEmbedSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                className="h-full w-full"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setMapLoaded(true)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
