export class ApiError extends Error {
  constructor(public status: number, public code: string, public data: Record<string, unknown>) {
    super(code);
  }
}

const listeners = new Set<() => void>();
export const onUnauthorized = (fn: () => void) => { listeners.add(fn); return () => listeners.delete(fn); };

export async function api<T = any>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api/admin${path}`, {
    method,
    credentials: "same-origin",
    headers: { "x-pepstop": "1", ...(body !== undefined && !(body instanceof FormData) ? { "content-type": "application/json" } : {}) },
    body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && path !== "/login") listeners.forEach((f) => f());
    throw new ApiError(res.status, data.error ?? "error", data);
  }
  return data as T;
}

export async function uploadFile(kind: "image" | "catalog" | "coa" | "proof", file: File) {
  const fd = new FormData();
  fd.append("file", file);
  return api<{ key: string; url: string | null; name: string; size: number }>("POST", `/uploads/${kind}`, fd);
}

const MESSAGES: Record<string, string> = {
  invalid_credentials: "Username or password is incorrect.",
  too_many_attempts: "Too many attempts. Please wait a few minutes.",
  locked: "This account is temporarily locked after repeated failed sign-ins. Try again in 15 minutes.",
  current_password_wrong: "Your current password is incorrect.",
  weak_password: "That password is too weak.",
  invalid_reset_token: "The reset token is not valid.",
  slug_in_use: "That web address (slug) is already in use.",
  name_required: "A name is required.",
  title_and_batch_required: "A title and a batch or lot number are required.",
  file_required: "Please choose a file.",
  file_too_large: "That file is too large.",
  unsupported_file_type: "That file type is not supported.",
  review_required: "Guidelines must be marked Reviewed before they can be published.",
  invalid_transition: "That change is not allowed for the account's current status.",
  password_change_required: "Please change your temporary password first.",
};
export const errorText = (e: unknown) => {
  if (e instanceof ApiError) return (e.data.message as string) || MESSAGES[e.code] || `Something went wrong (${e.code}).`;
  return "Something went wrong. Please try again.";
};

export const peso = (n: number | null | undefined) => (n === null || n === undefined ? "Not set" : `PHP ${n.toLocaleString("en-PH")}`);
export const when = (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" }) : "");
export const label = (s: string) => s.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
