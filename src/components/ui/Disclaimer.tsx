import { UI } from "../../content/site";

export function Disclaimer({ text = UI.disclaimer, className = "" }: { text?: string; className?: string }) {
  return <p className={`text-sm leading-relaxed text-charcoal/80 ${className}`}>{text}</p>;
}
