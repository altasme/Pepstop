import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { CART } from "../../content/site";
import { useCart } from "../../lib/cart";
import { useRemote } from "../../lib/remote";

export function CartButton() {
  const { count } = useCart();
  const { customer } = useRemote();
  if (!customer) return null; // the cart belongs to the private catalog
  return (
    <Link to="/cart" aria-label={CART.openCart(count)} className="relative inline-flex h-12 w-12 items-center justify-center rounded-full text-ink hover:bg-petal">
      <ShoppingBag className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
      {count > 0 && (
        <span aria-hidden="true" className="absolute right-1 top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-raspberry px-1 text-xs font-semibold text-white">{count}</span>
      )}
    </Link>
  );
}
