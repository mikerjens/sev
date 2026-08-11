export default async (request, context) => {
  const requestUrl = new URL(request.url);

  // Portal 3.0 owns TEAM and storyboard navigation. The old correction script
  // dynamically loaded by weather-faroe.js used to overwrite TEAM with only five people.
  if (requestUrl.pathname === "/production-team-correction.js") {
    return new Response("// Disabled by SEV Produktionsportal 3.0: legacy TEAM/storyboard correction.\n", {
      status: 200,
      headers: {
        "content-type": "application/javascript; charset=utf-8",
        "cache-control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  }

  // Same-origin storyboard PDF proxy for the single-page renderer.
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

  if (!contentType.includes("text/html")) {
    return response;
  }

  let html = await response.text();

  const portalBoot = `
<script>
  document.documentElement.classList.remove('sev-booting');
  document.documentElement.classList.add('sev-ready');
  document.documentElement.dataset.sevPortalVersion = '3.0';
</script>`;

  const portalStyles = `
<style>
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
  }
</style>`;

  const portalScripts = [
    '<script src="/portal-loading-safety-v1.js?v=dd04919e3c91f5947bbd7e3de7bf2f41535b8c0e" defer></script>',
    '<script src="/portal-approved-core-v3.js?v=1e78b5b238e0e24b4fc7df5324f23fe138a27fb3" defer></script>',
    '<script src="/scene-links-light-v2.js?v=4d10dd8e9212eed5a03cdad6592e6a632ef8e2b2" defer></script>',
    '<script src="/filmed-scenes-authoritative-v2.js?v=6fbd588d01f34c927faa182c4251449e4f973d54" defer></script>',
    '<script src="/team-contacts-doc-aug10-v1.js?v=7f46a7f7f0310cf092bbf6e05991d69e637c655b" defer></script>',
    '<script src="/storyboard-single-page-v4.js?v=dd44d38648954002e3040c2b97e22c9b857d4003" defer></script>',
    '<script src="/portal-release-3.0.js?v=aebdea47448a583dca9aaa474c246ccba856ef97" defer></script>',
    '<script src="/location-skalabudin-link-v1.js?v=cab50fb49dfd9247b274725fd5d44adfe3edd1ed" defer></script>',
    '<script src="/production-update-aug11-v1.js?v=06dea4d9d4cef050e0df1e7a5047064350a6c63f" defer></script>',
    '<script src="/hide-filmed-from-schedule-v1.js?v=b309adb22c6bdf916f98d1c4c0fc4b822c6b05f1" defer></script>'
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
