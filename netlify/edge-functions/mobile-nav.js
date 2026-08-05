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
    '<script src="/sev-portal-stable-v1.js?v=cc45112b14ae1aa825e27e0f191fc0500608bf94" defer></script>',
    '<script src="/scene-4a-elduvik-v1.js?v=03dd6468a630ca2c27ddcf2fb6d5a7b8ac69206c" defer></script>',
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
