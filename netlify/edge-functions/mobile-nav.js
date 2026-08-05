export default async (request, context) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("text/html")) {
    return response;
  }

  let html = await response.text();

  const mobileNavStyles = `
<style>
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
    '<script src="/scene-status-v3.js?v=03dc79decde6227fed5ab3d1867e11ca5deb5f9f" defer></script>',
    '<script src="/producer-scene-comments-v1.js?v=64350fe66ad014ab8eae33aecb5e35b341513254" defer></script>'
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
