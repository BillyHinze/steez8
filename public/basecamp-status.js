import { el, button } from './mountain-ui.js';
export function startBasecampStatus() {
  let status = 'checking', busy = false;
  const bar = el('aside', undefined, 'mt-connection');
  bar.setAttribute('aria-label', 'Game server connection');
  const label = el('span'); label.setAttribute('role', 'status');
  const retry = button('Retry', check, 'mt-connection-retry');
  bar.append(label, retry);
  function paint() {
    const lobby = document.querySelector('[aria-label="Basecamp lobby"]');
    bar.hidden = !lobby || status === 'online';
    bar.dataset.state = status;
    const text = status === 'checking' ? 'Connecting to the mountain… The server may need a minute to wake up.' : 'Server unavailable. You can still ride solo. Retry to connect accounts and multiplayer.';
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
  async function check() {
    if (busy) return;
    busy = true; status = 'checking'; paint();
    try {
      const response = await fetch('/api/health', { signal: AbortSignal.timeout(65000) });
      if (!response.ok || !(await response.json()).ok) throw Error('Unavailable');
      status = 'online';
    } catch { status = 'offline'; }
    finally { busy = false; paint(); }
  }
  let frame;
  const observer = new MutationObserver(() => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; paint(); }); });
  observer.observe(document.body, { subtree: true, childList: true });
  // Avoid recursive mutation: status text is updated only when it changes.
  window.addEventListener('online', check);
  window.addEventListener('offline', () => { status = 'offline'; paint(); });
  check();
}
