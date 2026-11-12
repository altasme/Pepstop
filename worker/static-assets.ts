import type { Env } from "./types";

/** Normal deploys: static files come from the Workers assets binding. */
export const serveStatic = (req: Request, env: Env): Promise<Response> => env.ASSETS!.fetch(req);
