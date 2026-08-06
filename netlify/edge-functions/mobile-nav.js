export default async (request, context) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("text/html")) {
    return response;
  }

  let html = await response.text();

  const portalBoot = `
<script>
  document.documentElement.classList.add('sev-booting');
  window.setTimeout(() => {
    if (document.documentElement.classList.contains('sev-booting')) {
      document.documentElement.classList.remove('sev-booting');
      document.documentElement.classList.add('sev-ready');
    }
  }, 6000);
</script>`;

  const portalStyles = `
<style>
  html.sev-booting nav.tabs,
  html.sev-booting .weather-shortcut,
  html.sev-booting main {
    opacity: 0;
    pointer-events: none;
  }

  html.sev-ready nav.tabs,
  html.sev-ready .weather-shortcut,
  html.sev-ready main {
    opacity: 1;
    transition: opacity 140ms ease;
  }

  #panel-next-scenes .next-scenes-page-grid > .shoot-calendar-card .next-shoot-list,
  #panel-next-scenes .next-scenes-page-grid > .shoot-calendar-card .calendar-undated,
  #panel-next-scenes .next-scenes-page-grid > .shoot-calendar-card .calendar-filmed {
    display: none;
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
    '<script src="/home-plan-default-v1.js?v=af6c5d23efcd3eade324b3bba5ba469a2a25d232" defer></script>',
    '<script src="/sev-portal-stable-v1.js?v=cc45112b14ae1aa825e27e0f191fc0500608bf94" defer></script>',
    '<script src="/scene-location-updates-v2.js?v=3e0ef28fe5965a4fa0c47f8b84cc355067e3e99f" defer></script>',
    '<script src="/scene-links-v1.js?v=c6bfbd35afd9d5029a3c82113e05f972106bc3f6" defer></script>',
    '<script src="/skala-final-lock-v1.js?v=010103c49ce01e5025ec9b103f3f8a31eb820118" defer></script>',
    '<script src="/runi-team-v1.js?v=30a55097edc4a86fc3e832a45a14adc41938cf28" defer></script>',
    '<script src="/personal-schedule-guide-v1.js?v=9996d4f77642c390b30125065cbaea216dfe485b" defer></script>',
    '<script src="/scene-5a-filmed-v1.js?v=1f882c065b5a15c3bc6997be64ba8e37ca821103" defer></script>',
    '<script src="/calendar-shoot-links-v1.js?v=8c8cbfc899c4848f2d1abd0d5f5f25a1bf08e127" defer></script>',
    '<script src="/portal-v2-priority.js?v=bdbe4400f82710743b3303c727abae67bfceec34" defer></script>',
    '<script src="/frontpage-production-status-v1.js?v=e07b6c379fac865513a2d9729dc610f519d256c6" defer></script>',
    '<script src="/skala-task-correction-v1.js?v=59d527e341832551a4137822507e0e4838ef97db" defer></script>',
    '<script src="/scene-4a-responsibilities-v1.js?v=0bcf1e32f9e23a0c224d3fe5f117954f91242f73" defer></script>'
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