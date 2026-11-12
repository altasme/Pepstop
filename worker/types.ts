/// <reference types="@cloudflare/workers-types" />
export interface Env {
  DB: D1Database;
  FILES: R2Bucket;
  ASSETS?: Fetcher;
  /** Worker secret. Provisions the first administrator when the admins table is empty. Never committed. */
  ADMIN_BOOTSTRAP_PASSWORD?: string;
  /** Worker secret. Enables the administrator reset process (held by the developer, not the client). */
  ADMIN_RESET_TOKEN?: string;
}
export type Admin = { id: string; username: string; must_change: number; role: string };
