import { NextResponse } from "next/server";

export async function middleware(request) {
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
  const pathname = new URL(request.url).pathname;
  const extension = pathname.slice(((pathname.lastIndexOf(".") - 1) >>> 0) + 1);

  if (!isBot || (extension.length && IGNORE_EXTENSIONS.includes(extension))) {
    return NextResponse.next();
  } else {
    // Check if request is coming from a bot
    if (isBot) {
      console.log(request.url);
      const newURL = `https://prerender.genaiollms.com/render?url=https://home-xi-gold.vercel.app`;

      try {
        const res = await fetch(
          new Request(newURL, {
            redirect: "manual",
          })
        );

        // Create a ReadableStream from the response body
        const { readable, writable } = new TransformStream();
        res.body.pipeTo(writable);

        const response = new NextResponse(readable, {
          status: res.status,
          statusText: res.statusText,
        });

        return response;
      } catch (error) {
        return NextResponse.next();
      }
    } else {
      console.log("Not a bot, proceeding normally");
    }

    return NextResponse.next();
  }
}
