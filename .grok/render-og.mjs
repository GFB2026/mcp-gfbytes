import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const htmlPath = join(root, "og-card.html");
const outPng = join(root, "og-card-raw.png");
const fav16 = join(root, "favicon-16.png");
const fav32 = join(root, "favicon-32.png");
const favicon = join(root, "favicon.svg.tmp");

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 2,
  });
  await page.goto(`file://${htmlPath}`, { waitUntil: "load" });
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await page.waitForTimeout(250);
  await page.screenshot({ path: outPng, type: "png", fullPage: false });

  for (const [size, dest] of [
    [16, fav16],
    [32, fav32],
  ]) {
    const icon = await browser.newPage({
      viewport: { width: size, height: size },
      deviceScaleFactor: 1,
    });
    await icon.setContent(
      `<!DOCTYPE html><html><head><style>
        html,body{margin:0;padding:0;width:${size}px;height:${size}px;background:transparent;overflow:hidden}
        img,svg{display:block;width:${size}px;height:${size}px}
      </style></head><body>
        <img src="file://${favicon}" width="${size}" height="${size}" alt="" />
      </body></html>`,
      { waitUntil: "load" },
    );
    await icon.waitForTimeout(80);
    await icon.screenshot({ path: dest, type: "png", omitBackground: true });
    await icon.close();
  }

  console.log(JSON.stringify({ ok: true, outPng, fav16, fav32 }));
} finally {
  await browser.close();
}
