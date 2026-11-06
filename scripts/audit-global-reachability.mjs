// Worldwide reachability audit for STEEZ8 using public probes (no account required).
// This does not bypass network policy and never handles player data or secrets.
import dns from "node:dns/promises";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const canonicalSite = new URL(process.env.PUBLIC_SITE_ORIGIN || "https://steez8.me");
if (canonicalSite.protocol !== "https:" || canonicalSite.username || canonicalSite.password ||
    canonicalSite.pathname !== "/" || canonicalSite.search || canonicalSite.hash)
  throw Error("PUBLIC_SITE_ORIGIN must be an HTTPS origin without a path");
const domain = canonicalSite.hostname;
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
  const report = { ipv4: [], ipv6: [], nameservers: [], www: [], warnings: [] };
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
  try {
    report.www = await dns.resolveCname("www." + domain);
  } catch (error) {
    if (!["ENODATA", "ENOTFOUND"].includes(error?.code))
      report.warnings.push("www CNAME lookup failed: " + value(error?.message));
  }
  if (report.www.length === 0)
    report.warnings.push("Optional www." + domain + " alias is not configured. GitHub Pages recommends www CNAME to billyhinze.github.io.");
  else if (!report.www.some(x => x.toLowerCase().replace(/\.$/, "") === "billyhinze.github.io"))
    report.warnings.push("The www CNAME does not point directly to billyhinze.github.io.");
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

async function globalpingRequest({ target = domain, requestPath = "/", method = "HEAD", ipVersion = 4, probesPerContinent = 2 } = {}) {
  const body = {
    type: "http",
    target,
    locations: continents.map(continent => ({ continent, limit: probesPerContinent })),
    timeout: 20,
    measurementOptions: {
      protocol: "HTTPS",
      request: { method, path: requestPath },
      ipVersion,
    },
  };
  const response = await fetch("https://api.globalping.io/v1/measurements", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "accept": "application/json",
      "user-agent": "steez8-reachability-check/1.0 (+" + canonicalSite.origin + ")",
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
        "user-agent": "steez8-reachability-check/1.0 (+" + canonicalSite.origin + ")",
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


export async function checkWwwRedirect(fetchImpl = fetch, siteOrigin = canonicalSite.origin) {
  // Check the public www HTTPS endpoint as well as its DNS alias. Do not
  // follow the redirect; the target must be the chosen canonical site.
  const site = new URL(siteOrigin);
  if (site.protocol !== "https:" || site.pathname !== "/" || site.search || site.hash)
    throw Error("The redirect check requires a bare HTTPS site origin");
  const wwwUrl = "https://www." + site.hostname + "/";
  try {
    const response = await fetchImpl(wwwUrl, {
      method: "HEAD",
      redirect: "manual",
      signal: AbortSignal.timeout(15000),
    });
    const location = response.headers.get("location") || "";
    let target = null;
    try { target = new URL(location, wwwUrl); } catch {}
    const ok = response.status >= 300 && response.status < 400 &&
      target?.protocol === "https:" && target?.hostname === site.hostname;
    return { ok, status: response.status, location: value(location), error: "" };
  } catch (error) {
    return { ok: false, status: null, location: "", error: value(error?.message) };
  }
}

async function run() {
  console.log("Checking canonical STEEZ8 site:", canonicalSite.origin);
  const dnsReport = await getDnsReport();
  console.log("NS:", dnsReport.nameservers.join(", ") || "unavailable");
  console.log("IPv4:", dnsReport.ipv4.join(", ") || "unavailable");
  console.log("IPv6:", dnsReport.ipv6.join(", ") || "none");
  console.log("www CNAME:", dnsReport.www.join(", ") || "none");
  dnsReport.warnings.forEach(message => console.log("::warning::DNS " + message));
  const wwwReport = await checkWwwRedirect();
  console.log("www HTTPS redirect:", wwwReport.ok ? "PASS" : "UNVERIFIED",
    "HTTP", wwwReport.status ?? "-", wwwReport.location || wwwReport.error || "no location");
  if (!wwwReport.ok)
    console.log("::warning::www." + domain + " did not demonstrate a valid HTTPS redirect to the canonical domain.");

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


  // The existing IPv4 probes cannot validate newly published AAAA records.
  // Check one IPv6-capable public probe per continent when IPv6 is advertised.
  // A provider with no IPv6 probes or a temporary probe quota must not
  // incorrectly mark the working IPv4 site as offline.
  let ipv6Measurement = null;
  let ipv6Error = null;
  if (dnsReport.ipv6.length) {
    try {
      ipv6Measurement = await globalpingRequest({ ipVersion: 6, probesPerContinent: 1 });
      console.log("Worldwide IPv6 HTTPS probes:", ipv6Measurement.summary.passed,
        "passed /", ipv6Measurement.summary.checked, "total");
      for (const row of ipv6Measurement.summary.rows)
        console.log(`IPV6 ${row.ok ? "PASS" : "FAIL"} ${row.country} ${row.city}: ${row.status} HTTP ${row.code ?? "-"} ${row.elapsed ?? "-"}ms`);
      if (ipv6Measurement.summary.failed > 0)
        console.log("::warning::Some IPv6 probes failed; investigate IPv6 routing, TLS or probe availability.");
    } catch (error) {
      ipv6Error = value(error?.message);
      console.log("::warning::Worldwide IPv6 measurement unavailable: " + ipv6Error);
    }
  } else {
    ipv6Error = "No AAAA records visible to this runner";
    console.log("::warning::IPv6 probe skipped: " + ipv6Error);
  }

  let backendMeasurement = null;
  let backendError = null;
  try {
    backendMeasurement = await globalpingRequest({
      target: "steez8-api.onrender.com",
      requestPath: "/api/health",
      method: "GET",
    });
    console.log("Worldwide backend health probes:",
      backendMeasurement.summary.passed, "passed /", backendMeasurement.summary.checked, "total");
    for (const row of backendMeasurement.summary.rows)
      console.log(`BACKEND ${row.ok ? "PASS" : "FAIL"} ${row.country} ${row.city}: ${row.status} HTTP ${row.code ?? "-"} ${row.elapsed ?? "-"}ms`);
  } catch (error) {
    backendError = value(error.message);
    console.error("::warning::Backend worldwide measurement unavailable: " + backendError);
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
    "- www: " + (dnsReport.www.join(", ") || "not configured"),
    "- www HTTPS redirect: " + (wwwReport.ok ? "PASS" : "UNVERIFIED") +
      " (HTTP " + (wwwReport.status ?? "—") + ", " + (wwwReport.location || wwwReport.error || "no location") + ")",
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

  lines.push("", "### Worldwide IPv6 HTTPS tests");
  if (ipv6Measurement) {
    lines.push(
      `Measurement: https://globalping.io/?measurement=${encodeURIComponent(ipv6Measurement.id)}`,
      "",
      "| Country | City | Status | HTTP | Time |",
      "|---|---|---|---|---|",
      ...ipv6Measurement.summary.rows.map(r =>
        `| ${r.country} | ${r.city} | ${r.ok ? "PASS" : r.status} | ${r.code ?? "—"} | ${r.elapsed ?? "—"} ms |`),
    );
  } else {
    lines.push("IPv6 tests unavailable: " + (ipv6Error || "unknown"));
  }
  lines.push("", "### Backend API across continents");
  if (backendMeasurement) {
    lines.push(
      `Measurement: https://globalping.io/?measurement=${encodeURIComponent(backendMeasurement.id)}`,
      "",
      "| Country | City | Status | HTTP | Time |",
      "|---|---|---|---|---|",
      ...backendMeasurement.summary.rows.map(r =>
        `| ${r.country} | ${r.city} | ${r.ok ? "PASS" : r.status} | ${r.code ?? "—"} | ${r.elapsed ?? "—"} ms |`),
    );
  } else lines.push("Backend measurements unavailable: " + (backendError || "unknown"));
  lines.push("", "These independent tests cannot predict access on every managed network.");
  if (process.env.GITHUB_STEP_SUMMARY)
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join("\n") + "\n");
  if (!measurement || measurement.summary.checked < 3)
    throw Error("Insufficient global measurements; cannot claim worldwide success");
  if (backendMeasurement && backendMeasurement.summary.failed > 0)
    console.log("::warning::Some independent networks could not reach the Render API; inspect the per-region results.");
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
