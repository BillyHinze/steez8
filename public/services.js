(() => {
  const config = window.CORK7_CONFIG || {};
  const backend = new URL(config.apiOrigin || location.origin);
  if (!['http:', 'https:'].includes(backend.protocol) || backend.username || backend.password || (location.protocol === 'https:' && backend.protocol !== 'https:')) throw Error('The game server must use HTTPS.');
  const apiOrigin = backend.origin;
  const originalFetch = window.fetch.bind(window);
  const isService = url => /^\/(api|auth\/v1|rest\/v1|functions\/v1|storage\/v1|parties|moderation)(\/|$)/.test(url.pathname) || /^\/(populations|cup-results)(\/|$)/.test(url.pathname) || url.pathname === '/leaderboard' && url.searchParams.has('season');
  // The recovered client has several service adapters. Route only their known
  // endpoint families; assets, navigation and third-party requests stay untouched.
  window.fetch = async function(input, init) {
    const url = new URL(input instanceof Request ? input.url : input, location.href);
    const service = (url.origin === location.origin || url.origin === apiOrigin) && isService(url);
    if (!service) return originalFetch(input, init);
    const target = apiOrigin + url.pathname + url.search;
    const request = input instanceof Request ? new Request(target, input) : target;
    try {
      const response = await originalFetch(request, { ...init, signal: AbortSignal.any([AbortSignal.timeout(65000), ...(init?.signal ? [init.signal] : input instanceof Request ? [input.signal] : [])]) });
      if ((response.headers.get('content-type') || '').includes('text/html')) throw Error('The account server is not connected yet. Solo riding is still available.');
      return response;
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      if (error.message.includes('account server')) throw error;
      throw Error('Cannot reach the game server. Check your connection and try again. Solo riding is still available.');
    }
  };
  window.CORK7_SERVICES = Object.freeze({ apiOrigin, wsOrigin: apiOrigin.replace(/^http/, 'ws') });
})();
