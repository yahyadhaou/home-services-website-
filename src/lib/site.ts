// Public address of the site. Netlify sets URL to the primary domain, so this
// follows the custom domain automatically once it is the primary one.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.URL ??
  "https://homeservicewebsite.com"
).replace(/\/$/, "");
