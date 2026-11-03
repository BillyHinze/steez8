// Use explicit public origins behind TLS proxies; never trust forwarded headers.
export function originPolicy({ publicOrigin = process.env.PUBLIC_ORIGIN || "", allowedOrigins = process.env.ALLOWED_ORIGINS || "" } = {}) {
  const configured = new Set([publicOrigin, ...allowedOrigins.split(",")].filter(Boolean).map(value => {
    const url = new URL(value.trim());
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw Error('Configure origins as http(s)://host without a path');
    return url.origin;
  }));
  return req => {
    if (!req.headers.origin) return true;
    const origin = req.headers.origin;
    return configured.has(origin) || origin === `${req.socket.encrypted ? 'https' : 'http'}://${req.headers.host}`;
  };
}
