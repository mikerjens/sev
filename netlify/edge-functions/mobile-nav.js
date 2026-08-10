export default async (request, context) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("text/html")) {
    return response;
  }

  let html = await response.text();

  // The portal is always visible. No loading gate is allowed to hide the plan.
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

  // One standalone authoritative portal layer. The detailed Plan & optagelser
  // page is always HJEM and repairs itself if an older script rewrites the panel.
  const portalScripts = [
    '<script src="/portal-loading-safety-v1.js?v=dd04919e3c91f5947bbd7e3de7bf2f41535b8c0e" defer></script>',
    '<script src="/portal-approved-core-v3.js?v=1e78b5b238e0e24b4fc7df5324f23fe138a27fb3" defer></script>',
    '<script src="/scene-links-v1.js?v=c6bfbd35afd9d5029a3c82113e05f972106bc3f6" defer></script>'
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
