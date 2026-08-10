export default async (request, context) => {
  const requestUrl = new URL(request.url);

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
    '<script src="/filmed-scenes-authoritative-v2.js?v=3e74ac1de472df822dd06a22fc62798bd2847164" defer></script>',
    '<script src="/team-contacts-doc-aug10-v1.js?v=ab8a94a497bf5705672d30839ac82c13ad626d29" defer></script>',
    '<script src="/storyboard-single-page-v4.js?v=cad987d2839425f24d550b2da190599600a6db86" defer></script>'
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

  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
