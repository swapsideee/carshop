"use client";

export default function PriceSelector({
  pricePair,
  priceSet,
  selected,
  onSelect,
}) {
  const options = [
    {
      label: `Пара (${pricePair ?? "—"} грн)`,
      value: "pair",
      disabled: pricePair === null,
    },
    {
      label: `Комплект (${priceSet ?? "—"} грн)`,
      value: "set",
      disabled: priceSet === null,
    },
  ];

  return (
    <div className="mb-6">
      <p className="text-sm text-gray-600 font-medium mb-2">Оберіть варіант:</p>
      <div className="flex gap-4">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="button"
            aria-pressed={selected === option.value}
            onClick={() => !option.disabled && onSelect(option.value)}
            disabled={option.disabled}
            className={`flex-1 px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ease-in-out
              ${
                selected === option.value
                  ? "bg-gray-900 text-white border-gray-800 shadow-md"
                  : "bg-white text-gray-800 border-gray-300 hover:border-gray-800 shadow-md"
              }
              ${
                option.disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer active:scale-95"
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
