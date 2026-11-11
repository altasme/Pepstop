import { Minus, Plus } from "lucide-react";
import { CART } from "../../content/site";

type Props = { value: number; onChange: (n: number) => void; label: string; min?: number; max?: number };

export function QuantityStepper({ value, onChange, label, min = 1, max = 99 }: Props) {
  const btn = "inline-flex h-11 w-11 items-center justify-center rounded-full border border-magenta/40 text-magenta hover:bg-blush disabled:opacity-40";
  return (
    <div role="group" aria-label={label} className="inline-flex items-center gap-2">
      <button type="button" className={btn} aria-label={CART.decrease} disabled={value <= min} onClick={() => onChange(value - 1)}>
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <span aria-live="polite" className="min-w-8 text-center text-base font-semibold tabular-nums">{value}</span>
      <button type="button" className={btn} aria-label={CART.increase} disabled={value >= max} onClick={() => onChange(value + 1)}>
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
