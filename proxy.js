import { NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export async function proxy(request) {
  const pathname = new URL(request.url).pathname;

  // Skip API routes - never prerender them (check this FIRST before anything else)
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const userAgent = request.headers.get("user-agent");

  const bots = [
    "googlebot",
    "yahoo! slurp",
    "bingbot",
    "yandex",
    "baiduspider",
    "facebookexternalhit",
    "twitterbot",
    "rogerbot",
    "linkedinbot",
    "embedly",
    "quora link preview",
    "showyoubot",
    "outbrain",
    "pinterest/0.",
    "developers.google.com/+/web/snippet",
    "slackbot",
    "vkshare",
    "w3c_validator",
    "redditbot",
    "applebot",
    "whatsapp",
    "flipboard",
    "tumblr",
    "bitlybot",
    "skypeuripreview",
    "nuzzel",
    "discordbot",
    "google page speed",
    "qwantify",
    "pinterestbot",
    "bitrix link preview",
    "xing-contenttabreceiver",
    "chrome-lighthouse",
    "telegrambot",
    "oai-searchbot",
    "chatgpt",
    "gptbot",
    "perplexity",
    "claudeBot",
    "amazonbot",
    "analyzerbot",
    "yeti",
    "integration-test", // Integration testing
  ];

  const IGNORE_EXTENSIONS = [
    ".js",
    ".css",
    ".xml",
    ".less",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".pdf",
    ".doc",
    ".txt",
    ".ico",
    ".rss",
    ".zip",
    ".mp3",
    ".rar",
    ".exe",
    ".wmv",
    ".doc",
    ".avi",
    ".ppt",
    ".mpg",
    ".mpeg",
    ".tif",
    ".wav",
    ".mov",
    ".psd",
    ".ai",
    ".xls",
    ".mp4",
    ".m4a",
    ".swf",
    ".dat",
    ".dmg",
    ".iso",
    ".flv",
    ".m4v",
    ".torrent",
    ".woff",
    ".ttf",
    ".svg",
    ".webmanifest",
  ];
  const isBot =
    userAgent && bots.some((bot) => userAgent.toLowerCase().includes(bot));
  const extension = pathname.slice(((pathname.lastIndexOf(".") - 1) >>> 0) + 1);

  if (!isBot || (extension.length && IGNORE_EXTENSIONS.includes(`.${extension}`))) {
    return NextResponse.next();
  }

  // Bot detected - prerender the requested URL
  const url = new URL(request.url);
  const fullPath = url.pathname + url.search;
  const targetURL = `https://myunsyeya.com${fullPath}`;
  const prerenderURL = `https://prerender.genaiollms.com/render?url=${encodeURIComponent(targetURL)}`;

  console.log(`Bot detected: ${userAgent} - Prerendering: ${targetURL}`);

  try {
    const res = await fetch(
      new Request(prerenderURL, {
        redirect: "manual",
      })
    );

    // Create a ReadableStream from the response body
    const { readable, writable } = new TransformStream();
    res.body.pipeTo(writable);

    return new NextResponse(readable, {
      status: res.status,
      statusText: res.statusText,
    });
  } catch (error) {
    console.error("Prerender failed:", error);
    return NextResponse.next();
  }
}
