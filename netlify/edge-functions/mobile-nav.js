export default async (request, context) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("text/html")) {
    return response;
  }

  let html = await response.text();

  // Never hide the portal while enhancement scripts are loading.
  // The base page must remain usable even if one later script is slow or fails.
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

  // Stable base + one approved production-plan data layer.
  const portalScripts = [
    '<script src="/portal-loading-safety-v1.js?v=dd04919e3c91f5947bbd7e3de7bf2f41535b8c0e" defer></script>',
    '<script src="/home-plan-default-v1.js?v=af6c5d23efcd3eade324b3bba5ba469a2a25d232" defer></script>',
    '<script src="/sev-portal-stable-v1.js?v=cc45112b14ae1aa825e27e0f191fc0500608bf94" defer></script>',
    '<script src="/approved-production-plan-v1.js?v=6af81a1f26c43ac61244f0b71c9826d4858ee271" defer></script>',
    '<script src="/approved-plan-cleanup-v1.js?v=ed4d0706b17937de7d2de601550864f012c2b09b" defer></script>',
    '<script src="/scene-links-v1.js?v=c6bfbd35afd9d5029a3c82113e05f972106bc3f6" defer></script>',
    '<script src="/portal-v2-priority.js?v=bdbe4400f82710743b3303c727abae67bfceec34" defer></script>',
    '<script src="/my-tasks-v1.js?v=f8f37d92ac8af7b55f15bd9cf94d007c535b868b" defer></script>'
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
