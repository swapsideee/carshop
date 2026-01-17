'use client';

import { useState } from 'react';

import { cx } from '@/lib/utils/cx';

export default function DescriptionBlock() {
  const [expanded, setExpanded] = useState(false);

  const text = `Підкрилки компанії Mega Locker виготовляються з поліетилену низького тиску спеціальної марки без домішок та відходів первинних матеріалів. Це забезпечує високі фізико-механічні властивості виробів: підкрилки залишаються еластичними у великому температурному діапазоні від 200 до -70 градусів за Цельсієм, мають високу міцність та витримують удари каміння й гравію.

Сучасні технології та професіоналізм дозволили створити матриці захисних арок для багатьох моделей автомобілів, завдяки чому підкрилки ідеально відповідають формі колісних арок. Вони кріпляться трьома-сімома саморізами по краю крила та двома в глибині ніші.

Перед запуском серійного виробництва кожна нова модель підкрилків проходить ретельні випробування та обов'язкову сертифікацію у Держспоживстандарті України.

У нашому інтернет-магазині ви можете придбати підкрилки від ТМ "Mega Locker" — якісні, доступні та практичні вироби, що стануть надійним захистом вашого авто.
`;

  return (
    <div className="relative rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Опис товару</h2>

      <div className="relative">
        <p
          className={cx(
            'text-sm leading-relaxed text-gray-700 transition-all duration-300 ease-in-out',
            expanded ? 'max-h-none' : 'max-h-28 overflow-hidden',
          )}
        >
          {text}
        </p>

        {!expanded && (
          <div className="pointer-events-none absolute bottom-0 left-0 h-16 w-full bg-linear-to-t from-white to-transparent" />
        )}
      </div>

      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="mt-3 cursor-pointer text-sm font-bold text-lime-700 transition-colors hover:text-lime-600 focus:outline-none"
      >
        {expanded ? 'Згорнути' : 'Розгорнути повнiстю'}
      </button>
    </div>
  );
}
