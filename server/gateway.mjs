import http from "node:http";
import net from "node:net";
import { fork } from "node:child_process";
import { fileURLToPath } from "node:url";
import { originPolicy } from "./origins.mjs";

// This gateway binds the public Render port BEFORE the application opens its
// Turso/libSQL replica. Slow or failed database sync must never leave visitors
// waiting for an HTTP socket that does not exist.
export function createGateway({
  targetPort,
  ready = () => false,
  originAllowed = originPolicy(),
} = {}) {
  const json = (req, res, status, body) => {
    if (req.headers.origin) {
      if (!originAllowed(req)) {
        res.writeHead(403, { "content-type": "application/json", "cache-control": "no-store" });
        return res.end(JSON.stringify({ error: "Origin not allowed" }));
      }
      res.setHeader("access-control-allow-origin", req.headers.origin);
      res.setHeader("vary", "Origin");
    }
    res.writeHead(status, {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...(status === 503 ? { "retry-after": "3" } : {}),
    });
    res.end(req.method === "HEAD" ? "" : JSON.stringify(body));
  };

  const gateway = http.createServer((req, res) => {
    const pathname = new URL(req.url || "/", "http://localhost").pathname;
    if (pathname === "/api/live") {
      return json(req, res, 200, { ok: true, gateway: true });
    }
    if (!ready()) {
      if (pathname === "/api/health") {
        return json(req, res, 200, {
          ok: true, ready: false, status: "starting", brand: "STEEZ8", online: 0,
        });
      }
      return json(req, res, 503, {
        error: "The multiplayer server is starting. Solo riding remains available.",
        ready: false,
      });
    }
    const headers = { ...req.headers };
    delete headers.connection;
    // Do not let a browser send a private gateway identification header.
    delete headers["x-steez8-gateway"];
    const upstream = http.request({
      hostname: "127.0.0.1",
      port: targetPort,
      method: req.method,
      path: req.url,
      headers,
      agent: false,
    }, (response) => {
      res.writeHead(response.statusCode || 502, response.headers);
      response.pipe(res);
    });
    upstream.on("error", () => {
      if (res.headersSent) res.destroy();
      else json(req, res, 503, {
        error: "The multiplayer server is reconnecting. Please retry.",
        ready: false,
      });
    });
    req.on("aborted", () => upstream.destroy());
    req.pipe(upstream);
  });

  gateway.on("upgrade", (req, socket, head) => {
    if (!ready()) {
      socket.end("HTTP/1.1 503 Service Unavailable\r\nConnection: close\r\nRetry-After: 3\r\nContent-Length: 0\r\n\r\n");
      return;
    }
    const upstream = net.connect({ port: targetPort, host: "127.0.0.1" });
    upstream.setTimeout(10000, () => upstream.destroy());
    upstream.on("connect", () => {
      upstream.setTimeout(0);
      let handshake = `${req.method} ${req.url} HTTP/${req.httpVersion}\r\n`;
      for (let i = 0; i < req.rawHeaders.length; i += 2)
        handshake += `${req.rawHeaders[i]}: ${req.rawHeaders[i + 1]}\r\n`;
      upstream.write(handshake + "\r\n");
      if (head.length) upstream.write(head);
      socket.pipe(upstream);
      upstream.pipe(socket);
    });
    upstream.on("error", () => socket.destroy());
    socket.on("error", () => upstream.destroy());
    socket.on("close", () => upstream.destroy());
  });

  return gateway;
}

export function startGateway({
  port = Number(process.env.PORT || 4173),
  host = process.env.HOST || (process.env.RENDER ? "0.0.0.0" : "127.0.0.1"),
} = {}) {
  if (!Number.isInteger(port) || port < 1 || port >= 65535)
    throw Error("PORT must be between 1 and 65534");
  const targetPort = port + 1;
  let backendReady = false, stopping = false, child = null, failures = 0, timer = null;
  const gateway = createGateway({
    targetPort,
    ready: () => backendReady,
    originAllowed: originPolicy({
      publicOrigin: process.env.PUBLIC_ORIGIN || "",
      allowedOrigins: process.env.ALLOWED_ORIGINS || "",
    }),
  });
  const childFile = fileURLToPath(new URL("./index.mjs", import.meta.url));

  function startChild() {
    if (stopping) return;
    backendReady = false;
    const current = fork(childFile, [], {
      env: {
        ...process.env,
        PORT: String(targetPort),
        HOST: "127.0.0.1",
        STEEZ8_CHILD: "1",
      },
      stdio: ["ignore", "inherit", "inherit", "ipc"],
    });
    child = current;
    const bootLimit = setTimeout(() => {
      if (child !== current || backendReady || stopping) return;
      console.error("STEEZ8 backend initialization exceeded 180 seconds; restarting child.");
      current.kill("SIGKILL");
    }, 180000);
    bootLimit.unref();
    current.on("message", (message) => {
      if (child !== current || message?.type !== "steez8-ready") return;
      clearTimeout(bootLimit);
      backendReady = true;
      failures = 0;
      console.info("STEEZ8 gateway: backend connected and accepting riders.");
    });
    current.on("error", (error) => {
      console.error("STEEZ8 gateway: backend process error:", error.message);
    });
    current.on("exit", (code, signal) => {
      clearTimeout(bootLimit);
      if (child !== current) return;
      backendReady = false;
      child = null;
      if (stopping) return;
      const delay = Math.min(30000, 1000 * 2 ** Math.min(failures++, 5));
      console.error(`STEEZ8 backend exited (${code ?? signal}); retrying in ${delay}ms.`);
      timer = setTimeout(startChild, delay);
      timer.unref();
    });
  }

  gateway.listen(port, host, () => {
    console.info(`STEEZ8 gateway listening on http://${host}:${port}`);
    startChild();
  });

  function stop() {
    stopping = true;
    backendReady = false;
    clearTimeout(timer);
    if (child) child.kill("SIGTERM");
    gateway.close();
    // The platform will finish stopping any child that remains stuck in DB I/O.
  }
  process.once("SIGTERM", stop);
  process.once("SIGINT", stop);
  return { server: gateway, stop };
}
