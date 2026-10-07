/**
 * Reads a server-side secret at request time.
 *
 * The key is passed in as a variable on purpose: a literal `process.env.NAME`
 * is tracked by the bundler, which stores the value in its build cache
 * (`.next/cache`). Hosting providers scan build output for secrets and would
 * (rightly) flag that. A dynamic lookup keeps secrets out of every build artifact.
 */
export const runtimeEnv = (key: string): string | undefined => process.env[key];
