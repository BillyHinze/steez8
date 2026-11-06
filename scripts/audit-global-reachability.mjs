// Worldwide reachability audit for STEEZ8 using public probes (no account required).
// This does not bypass network policy and never handles player data or secrets.
import dns from "node:dns/promises";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const domain = "steez8.me";
const expectedIPv4 = [
  "185.199.108.153", "185.199.109.153", "185.199.110.153", "185.199.111.153",
];
const expectedIPv6 = [
  "2606:50c0:8000::153", "2606:50c0:8001::153",
  "2606:50c0:8002::153", "2606:50c0:8003::153",
];
const continents = ["NA", "SA", "EU", "AF", "AS", "OC"];

function value(value) {
  return String(value ?? "").replace(/[\r\n|]/g, " ").slice(0, 140);
}

export function summarizeProbes(results) {
  const rows = [];
  for (const item of Array.isArray(results) ? results : []) {
    const probe = item?.probe || {};
    const result = item?.result || {};
    const country = value(probe.country || probe.countryName || "Unknown");
    const city = value(probe.city || "");
    const status = value(result.status || "unknown");
    const code = result.statusCode ?? null;
    const elapsed = result.timings?.total ?? null;
    const ok = status === "finished" && code === 200;
    rows.push({ country, city, status, code, elapsed, ok });
  }
  return {
    rows,
    checked: rows.length,
    passed: rows.filter(row => row.ok).length,
    failed: rows.filter(row => !row.ok).length,
  };
}

async function getDnsReport() {
  const report = { ipv4: [], ipv6: [], nameservers: [], warnings: [] };
  for (const [key, resolve] of [
    ["ipv4", () => dns.resolve4(domain)],
    ["ipv6", () => dns.resolve6(domain)],
    ["nameservers", () => dns.resolveNs(domain)],
  ]) {
    try {
      report[key] = await resolve();
    } catch (error) {
      const missing = ["ENODATA", "ENOTFOUND"].includes(error?.code);
      if (!missing || key !== "ipv6")
        report.warnings.push(`${key} query failed: ${value(error?.code || error?.message)}`);
    }
  }
  const actual = new Set(report.ipv4);
  if (actual.size !== expectedIPv4.length || expectedIPv4.some(ip => !actual.has(ip)))
    report.warnings.push("The apex A records differ from the four official GitHub Pages addresses.");
  const actualIPv6 = new Set(report.ipv6.map(x => x.toLowerCase()));
  const normalize = ip => ip.toLowerCase();
  if (actualIPv6.size === 0)
    report.warnings.push("IPv6 is not published. Add the four official GitHub Pages AAAA records at the DNS provider.");
  else if (actualIPv6.size !== expectedIPv6.length || expectedIPv6.some(ip => !actualIPv6.has(normalize(ip))))
    report.warnings.push("The AAAA records differ from the four official GitHub Pages IPv6 addresses.");
  return report;
}

async function globalpingRequest() {
  const body = {
    type: "http",
    target: domain,
    locations: continents.map(continent => ({ continent, limit: 2 })),
    timeout: 20,
    measurementOptions: {
      protocol: "HTTPS",
      request: { method: "HEAD", path: "/" },
      ipVersion: 4,
    },
  };
  const response = await fetch("https://api.globalping.io/v1/measurements", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "accept": "application/json",
      "user-agent": "steez8-reachability-check/1.0 (+https://steez8.me)",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
  const created = await response.json().catch(() => null);
  if (response.status !== 202 || !created?.id)
    throw Error(`Globalping create returned HTTP ${response.status}: ${value(JSON.stringify(created))}`);
  const id = created.id;
  for (let attempt = 0; attempt < 50; attempt++) {
    await new Promise(resolve => setTimeout(resolve, 900));
    const result = await fetch("https://api.globalping.io/v1/measurements/" + encodeURIComponent(id), {
      headers: {
        "accept": "application/json",
        "user-agent": "steez8-reachability-check/1.0 (+https://steez8.me)",
      },
      signal: AbortSignal.timeout(10000),
    });
    if (result.status === 429) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      continue;
    }
    if (!result.ok) throw Error("Globalping results returned HTTP " + result.status);
    const details = await result.json();
    if (details.status !== "in-progress") return { id, details, summary: summarizeProbes(details.results) };
  }
  throw Error("Worldwide probe results did not finish within the allotted time");
}

async function run() {
  const dnsReport = await getDnsReport();
  console.log("NS:", dnsReport.nameservers.join(", ") || "unavailable");
  console.log("IPv4:", dnsReport.ipv4.join(", ") || "unavailable");
  console.log("IPv6:", dnsReport.ipv6.join(", ") || "none");
  dnsReport.warnings.forEach(message => console.log("::warning::DNS " + message));

  let measurement = null;
  let remoteError = null;
  try {
    measurement = await globalpingRequest();
    console.log("Globalping measurement:", measurement.id);
    console.log("Worldwide HTTPS probes:", measurement.summary.passed, "passed /", measurement.summary.checked, "total");
    for (const row of measurement.summary.rows)
      console.log(`${row.ok ? "PASS" : "FAIL"} ${row.country} ${row.city}: ${row.status} HTTP ${row.code ?? "-"} ${row.elapsed ?? "-"}ms`);
  } catch (error) {
    remoteError = value(error.message);
    console.error("::warning::Worldwide measurement unavailable: " + remoteError);
  }

  const lines = [
    "## STEEZ8 worldwide reachability",
    "",
    "Checked: " + new Date().toISOString(),
    "",
    "### Public DNS",
    "- NS: " + (dnsReport.nameservers.join(", ") || "unavailable"),
    "- IPv4: " + (dnsReport.ipv4.join(", ") || "unavailable"),
    "- IPv6: " + (dnsReport.ipv6.join(", ") || "not published"),
    ...(dnsReport.warnings.length ? ["", ...dnsReport.warnings.map(w => "- ⚠️ " + w)] : []),
    "",
    "### Worldwide HTTPS tests",
  ];
  if (measurement) {
    lines.push(
      `Measurement: https://globalping.io/?measurement=${encodeURIComponent(measurement.id)}`,
      "",
      "| Country | City | Status | HTTP | Time |",
      "|---|---|---|---|---|",
      ...measurement.summary.rows.map(r =>
        `| ${r.country} | ${r.city} | ${r.ok ? "PASS" : r.status} | ${r.code ?? "—"} | ${r.elapsed ?? "—"} ms |`),
    );
  } else {
    lines.push("Globalping did not complete: " + (remoteError || "unknown error"));
  }
  lines.push("", "These independent tests cannot predict access on every managed network.");
  if (process.env.GITHUB_STEP_SUMMARY)
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join("\n") + "\n");
  if (!measurement || measurement.summary.checked < 3)
    throw Error("Insufficient global measurements; cannot claim worldwide success");
  if (measurement.summary.failed > 0)
    console.log("::warning::Some independent networks could not reach the domain; inspect the per-region results.");
  if (measurement.summary.failed >= Math.ceil(measurement.summary.checked * 0.5))
    throw Error("At least half the external HTTPS probes failed");
  console.log("World reachability check finished; successful probes do not override local network policies.");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  run().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
