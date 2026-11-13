import type { ComponentType } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ACCOUNT } from "../../content/site";
import { useRemote } from "../../lib/remote";

/**
 * Wraps a private page. Visitors without an approved account are sent to the account page. This is only the
 * friendly layer: the Worker refuses every product, image and document request that lacks an approved session.
 * The prerendered HTML contains no private content, so the loading state is identical on server and client.
 */
export function requireCustomer(Page: ComponentType): ComponentType {
  return function PrivatePage() {
    const { status, customer } = useRemote();
    const { pathname, search } = useLocation();
    if (status === "loading") return <section aria-busy="true" className="mx-auto max-w-page px-4 py-24 text-center text-mute">{ACCOUNT.checking}</section>;
    if (!customer) return <Navigate to={`/account?next=${encodeURIComponent(pathname + search)}`} replace />;
    return <Page />;
  };
}
