import { el, button } from './mountain-ui.js';
export function startBasecampStatus() {
  let status = 'checking', busy = false, attempts = 0, retryTimer, lastCheckedAt = 0;
  const bar = el('aside', undefined, 'mt-connection');
  bar.setAttribute('aria-label', 'Game server connection');
  const label = el('span'); label.setAttribute('role', 'status');
  const retry = button('Retry', () => { attempts = 0; void check(); }, 'mt-connection-retry');
  const details = el('a', 'Connection details', 'mt-connection-details');
  details.href = '/status/';
  bar.append(label, details, retry);
  function paint() {
    const lobby = document.querySelector('[aria-label="Basecamp lobby"]');
    bar.hidden = !lobby || status === 'online' || (status === 'checking' && attempts === 0);
    bar.dataset.state = status;
    const text = status === 'checking' ? 'Connecting to multiplayer. Solo riding is ready.' : status === 'starting' ? 'The multiplayer simulation is starting. Solo riding is ready.' : 'Multiplayer unavailable. Reconnecting automatically; solo riding still works.';
    if (label.textContent !== text) label.textContent = text;
    retry.disabled = busy;
    if (!bar.isConnected) document.body.append(bar);
    if (lobby && !lobby.querySelector('.mt-new-park')) {
      const ride = el('a', undefined, 'mt-new-park'); ride.href = '/?park=ridgeline&mode=solo';
      ride.addEventListener('click', event => { if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); event.stopPropagation(); location.assign(ride.href); });
      ride.append(el('small', 'NEW PARK · 0.5'), el('strong', 'RIDGELINE'), el('span', 'Five flow kickers. One side quest.  ↗'));
      const parent = lobby.querySelector('.rd-play');
      if (parent) parent.append(ride);
    }
  }
  function schedule() {
    clearTimeout(retryTimer);
    if (document.hidden || navigator.onLine === false) return;
    const delay = Math.min(30000, 1200 * 2 ** Math.min(attempts, 5));
    retryTimer = setTimeout(check, delay * (0.75 + Math.random() * 0.5));
  }
  async function check() {
    if (busy) return;
    clearTimeout(retryTimer);
    busy = true; status = 'checking'; paint();
    try {
      const response = await fetch('/api/health', { cache: 'no-store', signal: AbortSignal.timeout(12000) });
      const health = await response.json();
      if (!response.ok || !health.ok) throw Error('Unavailable');
      if (health.ready === false) {
        status = 'starting';
        attempts++;
        schedule();
      } else {
        status = 'online';
        attempts = 0;
      }
    } catch { status = 'offline'; attempts++; schedule(); }
    finally { lastCheckedAt = Date.now(); busy = false; paint(); }
  }
  let frame;
  const observer = new MutationObserver(() => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; paint(); }); });
  observer.observe(document.body, { subtree: true, childList: true });
  // Avoid recursive mutation: status text is updated only when it changes.
  window.addEventListener('online', () => { attempts = 0; void check(); });
  window.addEventListener('offline', () => { status = 'offline'; clearTimeout(retryTimer); paint(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && (status !== 'online' || Date.now() - lastCheckedAt > 30000)) void check(); });
  check();
}
