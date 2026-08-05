export default async (request, context) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("text/html")) {
    return response;
  }

  let html = await response.text();

  const mobileNavStyles = `
<style>
  html:not([data-schedule-ready="true"]) #plan-summary {
    visibility: hidden;
  }

  #plan-summary {
    min-height: 38px;
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

  const authoritativeScripts = [
    '<script src="/team-portal-v3.js?v=325e553ac78dcaeb4dee0782e91669d83c05117a" defer></script>',
    '<script src="/scene-status-v4.js?v=e8d3483f81edc0161a7e46956111965456b57c17" defer></script>',
    '<script src="/producer-scene-comments-v2.js?v=f4c9994b7ec8dbea6162283703c24c6fe74e36c2" defer></script>',
    '<script src="/next-scenes-calendar-v1.js?v=a69caf14c0bd3fc3d0c0eabd12d8849d9398eccb" defer></script>',
    '<script src="/schedule-portal-v1.js?v=a8b51bf30294bb164955f7356bffa67c293c04aa" defer></script>'
  ].join('');

  html = html
    .replace(/Crew &amp; Contributors/g, "TEAM")
    .replace(/Crew & Contributors/g, "TEAM")
    .replace(/>Crew</g, ">TEAM<")
    .replace("</head>", `${mobileNavStyles}</head>`)
    .replace("</body>", `${authoritativeScripts}</body>`);

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
