import { Link } from "react-router-dom";
import { ACCOUNT } from "../../content/site";
import { logoutCustomer, useRemote } from "../../lib/remote";

/** Log in for visitors, log out for signed-in customers. */
export function AccountLink({ className, onNavigate }: { className: string; onNavigate?: () => void }) {
  const { customer, status } = useRemote();
  if (status === "loading") return null;
  if (customer) return <button type="button" className={className} onClick={() => { onNavigate?.(); logoutCustomer(); }}>{ACCOUNT.logout}</button>;
  return <Link to="/account" className={className} onClick={onNavigate}>{ACCOUNT.login}</Link>;
}
