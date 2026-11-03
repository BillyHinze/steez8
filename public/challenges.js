import { t as clientFactory } from "./_next/static/chunks/supabase-BEhtaJUq.js";
const client = clientFactory();
function element(tag, text, className) {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;
  if (className) e.className = className;
  return e;
}
function styles() {
  if (document.querySelector("#ind-goals-style")) return;
  const style = element("style");
  style.id = "ind-goals-style";
  style.textContent =
    '.ind-goals-backdrop{position:fixed;inset:0;background:#081524b8;z-index:2500;display:grid;place-items:center;padding:20px}.ind-goals-panel{position:relative;background:#f6f4eb;color:#15283b;border:1px solid #fff8;border-radius:22px;box-shadow:0 24px 90px #0008;padding:28px;width:min(540px,95vw);max-height:88vh;overflow:auto;font:14px "DM Sans",sans-serif}.ind-goals-panel h2{font:30px Knewave,sans-serif;margin:0 35px 8px 0}.ind-goals-close{position:absolute;right:16px;top:16px;border:0;background:transparent;color:#15283b;font-size:24px;cursor:pointer}.ind-goals-root{font-family:"DM Sans",sans-serif}.ind-goals-meta{color:#536577;font-size:12px;line-height:1.7}.ind-goal-card{background:#fff;border:1px solid #dce4e6;border-radius:13px;padding:16px;margin:12px 0;display:grid;grid-template-columns:1fr auto;gap:8px 16px;align-items:center}.ind-goal-card h3{font-size:16px;margin:0;color:#14283d}.ind-goal-card p{margin:5px 0;font-size:13px;color:#536577;line-height:1.5}.ind-goal-card small{font-size:12px;color:#536577}.ind-goal-card button,.ind-goals-refresh{border:0;border-radius:8px;padding:10px 13px;background:#185746;color:#fff;font:700 12px "DM Sans",sans-serif;cursor:pointer}.ind-goal-card button:disabled{background:#e6ece9;color:#4a655a;cursor:default}.ind-goal-card progress{grid-column:1/-1;accent-color:#2d8c70;height:9px;width:100%}.ind-goals-refresh{background:#20384f}.ind-goals-error{color:#9b3d32;font-size:13px;line-height:1.5}';
  document.head.append(style);
}
async function api(path, body) {
  const {
    data: { session },
  } = await client.auth.getSession();
  if (!session) throw Error("Sign in at Basecamp to track your daily goals.");
  const response = await fetch(path, {
    method: body ? "POST" : "GET",
    headers: {
      authorization: "Bearer " + session.access_token,
      ...(body ? { "content-type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const result = await response.json();
  if (!response.ok) throw Error(result.error || "Please try again.");
  return result;
}
export function mountGoals(root) {
  styles();
  root.classList.add("ind-goals-root");
  let busy = false, period = "Daily";
  const status = element("p", "Loading your goals…", "ind-goals-meta");
  status.setAttribute("role", "status");
  root.replaceChildren(status);
  async function load() {
    if (busy) return;
    busy = true;
    try {
      render(await api("/api/challenges"));
    } catch (error) {
      status.textContent = error.message;
      status.className = "ind-goals-error";
      root.replaceChildren(status);
    } finally {
      busy = false;
    }
  }
  function render(data) {
    const meta = element(
      "p",
      data.balance.toLocaleString() +
        " POW · Resets " +
        new Date(data.resets_at).toLocaleString(),
      "ind-goals-meta",
    );
    root.replaceChildren(meta);
    const filters=element("div"); filters.style.cssText="display:flex;gap:10px;margin:14px 0";
    for(const label of ["Daily","Weekly"]){const b=element("button",label+" goals","ind-goals-refresh");b.type="button";b.setAttribute("aria-pressed",String(period===label));b.style.opacity=period===label?"1":".55";b.onclick=()=>{period=label;render(data)};filters.append(b)}
    root.append(filters);
    if(period==="Weekly") meta.textContent=data.balance.toLocaleString()+" POW · Weekly goals reset Monday, "+new Date(data.weekly_resets_at).toLocaleString();
    for (const goal of period === "Weekly" ? data.weekly_goals : data.goals) {
      const card = element("section", undefined, "ind-goal-card"),
        copy = element("div"),
        title = element("h3", goal.title),
        description = element("p", goal.description),
        detail = element(
          "small",
          goal.progress.toLocaleString() +
            " / " +
            goal.target.toLocaleString() +
            " · " +
            goal.reward +
            " POW",
        ),
        button = element(
          "button",
          goal.claimed
            ? "Earned"
            : goal.ready
              ? "Claim " + goal.reward + " POW"
              : "In progress",
        );
      button.disabled = goal.claimed || !goal.ready;
      button.type = "button";
      button.setAttribute(
        "aria-label",
        goal.claimed
          ? goal.title + ", reward earned"
          : goal.ready
            ? "Claim " + goal.title + " reward"
            : goal.title + ", in progress",
      );
      button.addEventListener("click", async () => {
        button.disabled = true;
        try {
          render(await api("/api/challenges/claim", { goal: goal.id }));
          window.dispatchEvent(new Event("independent-account-refresh"));
        } catch (error) {
          const message = element("p", error.message, "ind-goals-error");
          message.setAttribute("role", "alert");
          card.append(message);
          button.disabled = false;
        }
      });
      copy.append(title, description, detail);
      const progress = element("progress");
      progress.max = goal.target;
      progress.value = goal.progress;
      progress.setAttribute("aria-label", goal.title + " progress");
      card.append(copy, button, progress);
      root.append(card);
    }
    const refresh = element("button", "Refresh progress", "ind-goals-refresh");
    refresh.type = "button";
    refresh.addEventListener("click", load);
    root.append(refresh);
  }
  load();
  return { refresh: load };
}
export function openGoals() {
  if (document.querySelector(".ind-goals-backdrop")) return;
  document.querySelector('button[aria-label="Open menu"]')?.click();
  styles();
  const backdrop = element("div", undefined, "ind-goals-backdrop"),
    panel = element("section", undefined, "ind-goals-panel"),
    heading = element("h2", "Mountain goals"),
    description = element(
      "p",
      "Ride, finish your goals and claim your POW.",
      "ind-goals-meta",
    ),
    close = element("button", "×", "ind-goals-close"),
    root = element("div"),
    previous = document.activeElement;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-label", "Mountain goals");
  close.type = "button";
  close.setAttribute("aria-label", "Close daily goals");
  function dismiss() {
    backdrop.remove();
    window.removeEventListener("keydown", escape, true);
    previous?.focus?.();
  }
  function escape(event) {
    if (event.code === "Tab") {
      const buttons = [
        ...panel.querySelectorAll(
          "button:not(:disabled),a[href],input,select,textarea",
        ),
      ];
      const first = buttons[0],
        last = buttons.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    if (event.code === "Escape") {
      event.preventDefault();
      event.stopImmediatePropagation();
      dismiss();
    }
  }
  close.addEventListener("click", dismiss);
  backdrop.addEventListener("pointerdown", (e) => {
    if (e.target === backdrop) dismiss();
  });
  window.addEventListener("keydown", escape, true);
  panel.append(close, heading, description, root);
  backdrop.append(panel);
  document.body.append(backdrop);
  mountGoals(root);
  close.focus();
}
if (document.querySelector("#daily-goals"))
  mountGoals(document.querySelector("#daily-goals"));
