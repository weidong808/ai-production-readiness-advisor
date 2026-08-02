import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function loadChromium() {
  try {
    const mod = await import("playwright");
    return mod.chromium;
  } catch {
    // Sibling apps may already have Playwright installed for review captures.
    const candidates = [
      path.resolve(__dirname, "../../HabitCheck/package.json"),
      path.resolve(__dirname, "../../sleepcheck/package.json"),
    ];
    for (const pkg of candidates) {
      if (!fs.existsSync(pkg)) continue;
      try {
        const require = createRequire(pkg);
        return require("playwright").chromium;
      } catch {
        /* try next */
      }
    }
    throw new Error(
      "Playwright not found. Install with: npm i -D playwright && npx playwright install chromium",
    );
  }
}

const out = path.join(__dirname, "..", "docs", "visual-parity", "review");
const base = process.env.REVIEW_BASE_URL ?? "http://localhost:3000";

fs.mkdirSync(out, { recursive: true });

const chromium = await loadChromium();
const browser = await chromium.launch();
const shots = [
  { name: "after-390-light.png", w: 390, h: 844, colorScheme: "light" },
  { name: "after-390-dark.png", w: 390, h: 844, colorScheme: "dark" },
  { name: "after-1440-light.png", w: 1440, h: 900, colorScheme: "light" },
  { name: "after-1440-dark.png", w: 1440, h: 900, colorScheme: "dark" },
];

for (const s of shots) {
  const context = await browser.newContext({
    viewport: { width: s.w, height: s.h },
    colorScheme: s.colorScheme,
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.evaluate((scheme) => {
    document.documentElement.classList.toggle("dark", scheme === "dark");
    document.documentElement.style.colorScheme = scheme;
    localStorage.setItem("theme", scheme);
  }, s.colorScheme);
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(out, s.name), fullPage: true });
  await context.close();
  console.log("wrote", s.name);
}

await browser.close();
