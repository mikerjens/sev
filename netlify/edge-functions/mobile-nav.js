export default async (request, context) => {
  const requestUrl = new URL(request.url);

  if (requestUrl.pathname === "/production-team-correction.js") {
    return new Response("// Disabled by SEV Produktionsportal 3.0: legacy TEAM/storyboard correction.\n", {
      status: 200,
      headers: {
        "content-type": "application/javascript; charset=utf-8",
        "cache-control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  }

  if (requestUrl.pathname === "/storyboard.pdf") {
    const source = "https://drive.google.com/uc?export=download&id=1tb161Lvzr8Y5R7OdyTiWflT76jwbmgEN&confirm=t";
    const upstreamHeaders = new Headers();
    const range = request.headers.get("range");
    if (range) upstreamHeaders.set("range", range);

    const upstream = await fetch(source, { headers: upstreamHeaders, redirect: "follow" });
    if (!upstream.ok && upstream.status !== 206) {
      return new Response("Storyboard kunne ikke indlæses", { status: 502 });
    }

    const headers = new Headers(upstream.headers);
    headers.set("content-type", "application/pdf");
    headers.set("content-disposition", 'inline; filename="SEV26_storyboard_vers_1.pdf"');
    headers.set("cache-control", "public, max-age=3600");
    headers.delete("x-frame-options");
    headers.delete("content-security-policy");

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers,
    });
  }

  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  let html = await response.text();

  const portalBoot = `
<script>
  document.documentElement.classList.remove('sev-booting');
  document.documentElement.classList.add('sev-ready');
  document.documentElement.dataset.sevPortalVersion = '3.0';
</script>`;

  const portalStyles = `
<style>
  .status-banner { display: none !important; }
  #panel-schedule .ap3-head > p { display: none !important; }
  html:not(.sev-current-plan-ready) #panel-schedule,
  html:not(.sev-current-plan-ready) #panel-my-schedule { visibility: hidden !important; }

  .ap3-kicker {
    display: inline-flex !important;
    align-items: center;
    padding: 6px 10px !important;
    color: var(--signal) !important;
    background: rgba(246,176,66,.14) !important;
    border: 1px solid rgba(246,176,66,.55) !important;
    border-radius: 6px;
    font-size: 13px !important;
    font-weight: 900 !important;
    letter-spacing: .08em !important;
    line-height: 1.2;
  }

  html.sev-booting nav.tabs,
  html.sev-booting .weather-shortcut,
  html.sev-booting main,
  html.sev-ready nav.tabs,
  html.sev-ready .weather-shortcut,
  html.sev-ready main {
    opacity: 1 !important;
    pointer-events: auto !important;
  }

  @media (max-width: 700px) {
    nav.tabs {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0 10px;
      overflow: visible;
      padding: 0 20px;
    }
    nav.tabs button {
      width: 100%;
      margin-right: 0;
      padding: 10px 4px;
      white-space: normal;
      text-align: left;
      font-size: 11px;
      line-height: 1.25;
    }
    .ap3-kicker { font-size: 12px !important; padding: 6px 9px !important; }
  }
</style>`;

  // Only one current production authority is loaded. Superseded Aug 19/Aug 22/date
  // overlays have been removed to prevent old schedule data from flashing or returning.
  const portalScripts = [
    '<script src="/portal-loading-safety-v1.js?v=dd04919e3c91f5947bbd7e3de7bf2f41535b8c0e" defer></script>',
    '<script src="/portal-approved-core-v3.js?v=1e78b5b238e0e24b4fc7df5324f23fe138a27fb3" defer></script>',
    '<script src="/scene-links-light-v2.js?v=4d10dd8e9212eed5a03cdad6592e6a632ef8e2b2" defer></script>',
    '<script src="/filmed-scenes-authoritative-v2.js?v=b0a70ac19d2d8e92f3408a0db8421378774e10ff" defer></script>',
    '<script src="/team-contacts-doc-aug10-v1.js?v=1473a85e6ffe43784eb9c7993b13aefd1a199b57" defer></script>',
    '<script src="/storyboard-single-page-v4.js?v=baacecde95d422bc11cc13136983ea8ce631057e" defer></script>',
    '<script src="/portal-release-3.0.js?v=aebdea47448a583dca9aaa474c246ccba856ef97" defer></script>',
    '<script src="/location-skalabudin-link-v1.js?v=cab50fb49dfd9247b274725fd5d44adfe3edd1ed" defer></script>',
    '<script src="/hide-filmed-from-schedule-v1.js?v=f0567ab70af6937a78486e47ef03b3e87085ed3d" defer></script>',
    '<script src="/production-current-authoritative-v1.js?v=653fa1188ffa8ac5ea93d138bdb192eedb6180e8" defer></script>'
  ].join('');

  html = html
    .replace(/Crew &amp; Contributors/g, "TEAM")
    .replace(/Crew & Contributors/g, "TEAM")
    .replace(/>Crew</g, ">TEAM<")
    .replace("</head>", `${portalBoot}${portalStyles}</head>`)
    .replace("</body>", `${portalScripts}</body>`);

  const headers = new Headers(response.headers);
  headers.delete("content-length");
  headers.set("cache-control", "no-store, no-cache, must-revalidate, max-age=0");
  headers.set("pragma", "no-cache");
  headers.set("expires", "0");
  headers.set("x-sev-portal-version", "3.0");

  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
