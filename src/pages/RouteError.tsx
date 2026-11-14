import { useEffect } from "react";
import { Link, useRouteError } from "react-router-dom";
import { isChunkError, pendingUrl, reloadOnce } from "../lib/chunkReload";

/** Shown if a page cannot load. After a site update this is usually a stale tab, so it reloads once on its own. */
export default function RouteError() {
  const error = useRouteError();
  useEffect(() => { if (isChunkError(error)) reloadOnce(pendingUrl()); }, [error]);
  return (
    <main className="mx-auto max-w-prose px-4 py-24 text-center sm:px-6">
      <h1 className="font-display text-h2 font-medium text-claret">We could not load this page.</h1>
      <p className="mt-4 text-lg text-ink/80">The site may have just been updated. Reload to get the latest version.</p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button type="button" onClick={() => window.location.reload()} className="inline-flex min-h-12 items-center rounded-full bg-raspberry px-6 text-base font-semibold text-white hover:bg-raspberry-deep">Reload</button>
        <Link to="/" className="inline-flex min-h-12 items-center rounded-full border border-edge px-6 text-base font-semibold text-ink hover:text-raspberry">Back to Home</Link>
      </div>
    </main>
  );
}
