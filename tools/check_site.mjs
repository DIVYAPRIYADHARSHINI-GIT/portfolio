/**
 * check_site.mjs - headless Chrome smoke test for the portfolio.
 *
 * Drives a real Chrome over the DevTools protocol (no npm dependencies) and
 * asserts that every section actually rendered from data.js, that there are
 * no console errors, that every image resolved, that alt text exists
 * everywhere, that the theme toggle, project filter, lightbox, back-to-top
 * and contact-form validation all work, and that resume.pdf downloads.
 *
 * Usage:
 *   python3 -m http.server 8731      # from the project folder
 *   node tools/check_site.mjs [http://localhost:8731/]
 */

import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const URL_UNDER_TEST = process.argv[2] || "http://localhost:8731/index.html";
const CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const results = [];
const check = (name, pass, detail = "") => {
  results.push({ name, pass, detail });
  console.log(`${pass ? "  PASS" : "  FAIL"}  ${name}${detail ? ` - ${detail}` : ""}`);
};

/* ---- minimal CDP client ------------------------------------------- */
const profile = mkdtempSync(join(tmpdir(), "pf-chrome-"));
const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--no-first-run",
  "--no-default-browser-check",
  "--remote-debugging-port=9876",
  `--user-data-dir=${profile}`,
  "--window-size=1440,900",
  "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function wsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch("http://127.0.0.1:9876/json/version");
      const json = await res.json();
      if (json.webSocketDebuggerUrl) return json.webSocketDebuggerUrl;
    } catch { /* not up yet */ }
    await sleep(200);
  }
  throw new Error("Chrome did not expose a DevTools endpoint");
}

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.events = [];
    ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      } else if (msg.method) {
        this.events.push(msg);
      }
    });
  }
  send(method, params = {}, sessionId) {
    const id = ++this.id;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    this.ws.send(JSON.stringify(payload));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
}

async function main() {
  const ws = new WebSocket(await wsUrl());
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  const cdp = new CDP(ws);

  const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
  const S = sessionId;
  const call = (m, p) => cdp.send(m, p, S);

  await call("Page.enable");
  await call("Runtime.enable");
  await call("Log.enable");
  await call("Network.enable");

  const consoleErrors = [];
  const failedRequests = [];
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.method === "Log.entryAdded" && msg.params.entry.level === "error") {
      consoleErrors.push(msg.params.entry.text);
    }
    if (msg.method === "Runtime.exceptionThrown") {
      consoleErrors.push(msg.params.exceptionDetails.text);
    }
    if (msg.method === "Network.loadingFailed") {
      failedRequests.push(msg.params.errorText);
    }
    if (msg.method === "Network.responseReceived" && msg.params.response.status >= 400) {
      failedRequests.push(`${msg.params.response.status} ${msg.params.response.url}`);
    }
  });

  const evaluate = async (expression) => {
    const r = await call("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + " " + (r.exceptionDetails.exception?.description || ""));
    return r.result.value;
  };

  console.log(`\nLoading ${URL_UNDER_TEST}\n`);
  await call("Page.navigate", { url: URL_UNDER_TEST });
  await sleep(2500);

  /* ---- 1. structure ------------------------------------------------ */
  const counts = await evaluate(`JSON.stringify({
    nav: document.querySelectorAll('#navList a').length,
    heroName: document.querySelector('#heroName')?.textContent.trim(),
    heroActions: document.querySelectorAll('#heroActions a').length,
    stats: document.querySelectorAll('.stat-card').length,
    timeline: document.querySelectorAll('.tl-item').length,
    projects: document.querySelectorAll('.project-card').length,
    filters: document.querySelectorAll('.filter-btn').length,
    gallery: document.querySelectorAll('.gallery-btn').length,
    skills: document.querySelectorAll('.skill-card').length,
    pubs: document.querySelectorAll('.pub-card').length,
    edu: document.querySelectorAll('.edu-card').length,
    certs: document.querySelectorAll('.cert-btn').length,
    contactRows: document.querySelectorAll('#contactList li').length,
    socials: document.querySelectorAll('#heroSocials a').length,
    sections: [...document.querySelectorAll('main section[id]')].map(s => s.id).join(',')
  })`);
  const c = JSON.parse(counts);
  check("nav renders 8 links", c.nav === 8, `${c.nav}`);
  check("hero name rendered", c.heroName === "Divyapriyadharshini S", c.heroName);
  check("hero has 3 CTA buttons", c.heroActions === 3, `${c.heroActions}`);
  check("4 stat cards", c.stats === 4, `${c.stats}`);
  check("5 timeline entries", c.timeline === 5, `${c.timeline}`);
  check("4 project cards", c.projects === 4, `${c.projects}`);
  check("4 project filters", c.filters === 4, `${c.filters}`);
  check("4 gallery tiles", c.gallery === 4, `${c.gallery}`);
  check("7 skill groups", c.skills === 7, `${c.skills}`);
  check("3 publications", c.pubs === 3, `${c.pubs}`);
  check("2 education entries", c.edu === 2, `${c.edu}`);
  check("7 certificates", c.certs === 7, `${c.certs}`);
  check("3 contact rows", c.contactRows === 3, `${c.contactRows}`);
  check("3 social links", c.socials === 3, `${c.socials}`);
  check("all nav target sections exist",
    ["home", "about", "experience", "projects", "skills", "publications", "certificates", "contact"]
      .every((id) => c.sections.split(",").includes(id)), c.sections);

  /* ---- 2. no lorem / no empty placeholders ------------------------- */
  const lorem = await evaluate(`/lorem ipsum|TODO|PLACEHOLDER_TEXT/i.test(document.body.innerText)`);
  check("no lorem ipsum / TODO copy", lorem === false);

  /* ---- 3. images --------------------------------------------------- */
  // Walk the whole page first so every lazy-loaded image has actually been
  // requested; otherwise below-the-fold images look "broken" to the audit.
  await evaluate(`(async () => {
    // The site sets scroll-behavior: smooth, which makes programmatic
    // scrollTo animate - the sweep would never reach the lower sections.
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    const step = Math.round(window.innerHeight * 0.6);
    const bottom = () => Math.max(document.body.scrollHeight, root.scrollHeight);
    for (let y = 0; y < bottom(); y += step) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 140));
    }
    window.scrollTo(0, bottom());
    await new Promise(r => setTimeout(r, 400));
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previous;
    await new Promise(r => setTimeout(r, 300));
    // Bounded wait: decode() never settles for an image that was never
    // fetched, so race each one against a short timeout.
    const settle = (img) => Promise.race([
      img.decode().catch(() => {}),
      new Promise(r => setTimeout(r, 1500)),
    ]);
    await Promise.all([...document.images].filter(i => i.getAttribute('src')).map(settle));
  })()`);

  const imgReport = await evaluate(`(() => {
    // #lbImage is the lightbox canvas: empty until a tile is clicked.
    const imgs = [...document.images].filter(i => i.id !== 'lbImage');
    return JSON.stringify({
      total: imgs.length,
      broken: imgs.filter(i => !i.complete || i.naturalWidth === 0).map(i => i.currentSrc || i.src),
      fellBack: imgs.filter(i => i.dataset.fallbackApplied).length,
      noAlt: imgs.filter(i => !i.alt || !i.alt.trim()).length,
      noDims: imgs.filter(i => !i.getAttribute('width') || !i.getAttribute('height')).length,
      lazy: imgs.filter(i => i.loading === 'lazy').length,
      srcset: imgs.filter(i => i.srcset).length
    });
  })()`);
  const ir = JSON.parse(imgReport);
  check("every image resolved (no broken)", ir.broken.length === 0, ir.broken.slice(0, 3).join(" | "));
  check("no inline SVG fallback needed", ir.fellBack === 0, `${ir.fellBack} fell back`);
  check("every image has alt text", ir.noAlt === 0, `${ir.noAlt} missing`);
  check("every image has width/height", ir.noDims === 0, `${ir.noDims} missing`);
  check("lazy loading used below the fold", ir.lazy >= 15, `${ir.lazy} lazy of ${ir.total}`);
  check("responsive srcset present", ir.srcset >= 6, `${ir.srcset} with srcset`);

  /* ---- 4. accessibility basics ------------------------------------- */
  const a11y = await evaluate(`JSON.stringify({
    h1: document.querySelectorAll('h1').length,
    landmarks: ['header','main','footer','nav'].filter(t => document.querySelector(t)).length,
    skip: !!document.querySelector('.skip-link'),
    lang: document.documentElement.lang,
    unlabelledButtons: [...document.querySelectorAll('button')]
      .filter(b => !b.getAttribute('aria-label') && !b.textContent.trim()).length,
    labelledInputs: [...document.querySelectorAll('#contactForm input, #contactForm textarea')]
      .filter(i => document.querySelector('label[for="'+i.id+'"]')).length,
    formFields: document.querySelectorAll('#contactForm input, #contactForm textarea').length
  })`);
  const a = JSON.parse(a11y);
  check("exactly one h1", a.h1 === 1, `${a.h1}`);
  check("semantic landmarks present", a.landmarks === 4, `${a.landmarks}/4`);
  check("skip link present", a.skip === true);
  check("lang attribute set", a.lang === "en", a.lang);
  check("no unlabelled buttons", a.unlabelledButtons === 0, `${a.unlabelledButtons}`);
  check("every form field labelled", a.labelledInputs === a.formFields, `${a.labelledInputs}/${a.formFields}`);

  /* ---- 5. SEO / meta ------------------------------------------------ */
  const seo = await evaluate(`JSON.stringify({
    title: document.title,
    desc: document.querySelector('meta[name=description]')?.content?.length,
    ogTitle: !!document.querySelector('meta[property="og:title"]'),
    ogImage: document.querySelector('meta[property="og:image"]')?.content,
    twitter: !!document.querySelector('meta[name="twitter:card"]'),
    canonical: !!document.querySelector('link[rel=canonical]'),
    jsonld: !!document.querySelector('script[type="application/ld+json"]'),
    manifest: !!document.querySelector('link[rel=manifest]'),
    favicon: !!document.querySelector('link[rel=icon]')
  })`);
  const s = JSON.parse(seo);
  check("title set", s.title.includes("Divyapriyadharshini"), s.title);
  check("meta description present", s.desc > 80, `${s.desc} chars`);
  check("Open Graph tags present", s.ogTitle && !!s.ogImage, s.ogImage);
  check("Twitter card present", s.twitter === true);
  check("canonical + manifest + favicon", s.canonical && s.manifest && s.favicon);
  check("JSON-LD Person schema", s.jsonld === true);

  /* ---- 6. theme toggle ---------------------------------------------- */
  const theme = await evaluate(`(async () => {
    const before = document.documentElement.dataset.theme;
    document.querySelector('#themeToggle').click();
    const after = document.documentElement.dataset.theme;
    const stored = localStorage.getItem('dps-theme');
    const pressed = document.querySelector('#themeToggle').getAttribute('aria-pressed');
    document.querySelector('#themeToggle').click();
    const back = document.documentElement.dataset.theme;
    return JSON.stringify({ before, after, stored, pressed, back });
  })()`);
  const t = JSON.parse(theme);
  check("theme toggle flips theme", t.before !== t.after, `${t.before} -> ${t.after}`);
  check("theme persisted to localStorage", t.stored === t.after || t.stored === t.back, t.stored);
  check("theme toggle restores", t.back === t.before, `${t.back}`);

  /* ---- 7. project filter -------------------------------------------- */
  const filter = await evaluate(`(() => {
    const btn = [...document.querySelectorAll('.filter-btn')].find(b => b.dataset.filter === 'Dashboards');
    btn.click();
    const visible = [...document.querySelectorAll('.project-card')].filter(c => !c.classList.contains('is-hidden'));
    const pressed = btn.getAttribute('aria-pressed');
    const all = [...document.querySelectorAll('.filter-btn')].find(b => b.dataset.filter === 'All');
    const mlBtn = [...document.querySelectorAll('.filter-btn')].find(b => b.dataset.filter === 'Machine Learning');
    mlBtn.click();
    const mlVisible = [...document.querySelectorAll('.project-card')].filter(c => !c.classList.contains('is-hidden')).length;
    all.click();
    const allVisible = [...document.querySelectorAll('.project-card')].filter(c => !c.classList.contains('is-hidden')).length;
    return JSON.stringify({ dash: visible.length, pressed, mlVisible, allVisible });
  })()`);
  const f = JSON.parse(filter);
  check("filter 'Dashboards' shows 1 card", f.dash === 1, `${f.dash}`);
  check("filter sets aria-pressed", f.pressed === "true");
  check("filter 'Machine Learning' shows 2", f.mlVisible === 2, `${f.mlVisible}`);
  check("filter 'All' restores 4", f.allVisible === 4, `${f.allVisible}`);

  /* ---- 8. lightbox --------------------------------------------------- */
  const lb = await evaluate(`(() => {
    document.querySelector('.gallery-btn').click();
    const box = document.querySelector('#lightbox');
    const openState = !box.hidden;
    const src1 = document.querySelector('#lbImage').getAttribute('src');
    const caption = document.querySelector('#lbCaption').textContent;
    document.querySelector('#lbNext').click();
    const src2 = document.querySelector('#lbImage').getAttribute('src');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    const closed = document.querySelector('#lightbox').hidden;
    document.querySelector('.cert-btn').click();
    const certOpen = !document.querySelector('#lightbox').hidden;
    const certSrc = document.querySelector('#lbImage').getAttribute('src');
    document.querySelector('#lbClose').click();
    return JSON.stringify({ openState, src1, src2, caption, closed, certOpen, certSrc,
      bodyRestored: document.body.style.overflow === '' });
  })()`);
  const L = JSON.parse(lb);
  check("lightbox opens from gallery", L.openState === true, L.src1);
  check("lightbox next advances image", L.src1 !== L.src2, `${L.src1} -> ${L.src2}`);
  check("lightbox has a caption", L.caption.length > 10, L.caption);
  check("Escape closes lightbox", L.closed === true);
  check("certificates open in lightbox", L.certOpen === true, L.certSrc);
  check("body scroll restored on close", L.bodyRestored === true);

  /* ---- 9. contact form validation ------------------------------------ */
  const form = await evaluate(`(() => {
    const f = document.querySelector('#contactForm');
    f.elements.name.value = 'A';
    f.elements.email.value = 'not-an-email';
    f.elements.message.value = 'short';
    f.requestSubmit();
    const errs = [...document.querySelectorAll('.field-error')].map(e => e.textContent).filter(Boolean);
    const invalid = [...f.querySelectorAll('[aria-invalid="true"]')].length;
    const status = document.querySelector('#formStatus').textContent;
    return JSON.stringify({ errs, invalid, status });
  })()`);
  const F = JSON.parse(form);
  check("invalid form blocked with 3 errors", F.errs.length === 3, F.errs.join(" | "));
  check("invalid fields marked aria-invalid", F.invalid === 3, `${F.invalid}`);
  check("form status message shown", F.status.length > 0, F.status);

  const formOk = await evaluate(`(() => {
    const f = document.querySelector('#contactForm');
    f.elements.name.value = 'Priya Recruiter';
    f.elements.email.value = 'priya@example.com';
    f.elements.message.value = 'We have a Data Analyst opening and would love to talk.';
    // Block the mailto navigation so the test stays on the page.
    const origin = window.location.href;
    Object.defineProperty(window, '__blockNav', { value: true, configurable: true });
    f.requestSubmit();
    return JSON.stringify({
      success: !!document.querySelector('.form-success'),
      text: document.querySelector('.form-success')?.innerText.replace(/\\s+/g,' ').slice(0, 90) || ''
    });
  })()`);
  const FO = JSON.parse(formOk);
  check("valid form shows success state", FO.success === true, FO.text);

  /* ---- 10. back to top + resume --------------------------------------- */
  const misc = await evaluate(`(async () => {
    window.scrollTo(0, 2000);
    await new Promise(r => setTimeout(r, 400));
    const visible = document.querySelector('#toTop').classList.contains('is-visible');
    const resume = document.querySelector('#contactResume');
    const res = await fetch('resume.pdf', { method: 'HEAD' });
    const pdfType = res.headers.get('content-type');
    return JSON.stringify({ visible, href: resume.getAttribute('href'),
      download: resume.getAttribute('download'), pdfOk: res.ok, pdfType });
  })()`);
  const M = JSON.parse(misc);
  check("back-to-top appears on scroll", M.visible === true);
  check("resume link points at resume.pdf", M.href === "resume.pdf", M.href);
  check("resume has download attribute", !!M.download, M.download);
  check("resume.pdf is served", M.pdfOk === true, M.pdfType);

  /* ---- 11. responsive layouts ------------------------------------------ */
  mkdirSync(join(ROOT, "docs", "screenshots"), { recursive: true });
  for (const [label, w, h] of [["mobile", 390, 844], ["tablet", 820, 1180], ["desktop", 1440, 900]]) {
    await call("Emulation.setDeviceMetricsOverride", {
      width: w, height: h, deviceScaleFactor: 1, mobile: w < 700,
    });
    await evaluate(`window.scrollTo(0,0)`);
    await sleep(500);
    const overflow = await evaluate(
      `JSON.stringify({ scrollW: document.documentElement.scrollWidth, inner: window.innerWidth,
         navVisible: getComputedStyle(document.querySelector('#siteNav')).display !== 'none',
         burgerVisible: getComputedStyle(document.querySelector('#navToggle')).display !== 'none' })`
    );
    const o = JSON.parse(overflow);
    check(`${label} (${w}px): no horizontal overflow`, o.scrollW <= o.inner + 1, `${o.scrollW} vs ${o.inner}`);
    if (w < 700) {
      check(`${label}: burger menu shown`, o.burgerVisible === true);
    } else if (w >= 1000) {
      check(`${label}: full nav shown`, o.navVisible === true);
    }
    const shot = await call("Page.captureScreenshot", { format: "webp", quality: 80, captureBeyondViewport: false });
    writeFileSync(join(ROOT, "docs", "screenshots", `${label}.webp`), Buffer.from(shot.data, "base64"));
  }

  // full-page desktop screenshot (light + dark)
  await call("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  for (const mode of ["light", "dark"]) {
    await evaluate(`document.documentElement.dataset.theme = '${mode}'; window.scrollTo(0,0)`);
    await sleep(400);
    const metrics = await call("Page.getLayoutMetrics");
    const full = await call("Page.captureScreenshot", {
      format: "webp", quality: 72, captureBeyondViewport: true,
      clip: { x: 0, y: 0, width: 1440, height: Math.min(metrics.contentSize.height, 16000), scale: 0.6 },
    });
    writeFileSync(join(ROOT, "docs", "screenshots", `full-${mode}.webp`), Buffer.from(full.data, "base64"));
  }

  /* ---- 12. console / network hygiene ----------------------------------- */
  const realConsoleErrors = consoleErrors.filter((e) => !/favicon|fonts\.g/i.test(e));
  check("no console errors", realConsoleErrors.length === 0, realConsoleErrors.slice(0, 2).join(" | "));
  // ERR_ABORTED comes from the intentional mailto: handoff in the form test.
  const realFailed = failedRequests.filter((e) => !/fonts\.g|favicon|ERR_ABORTED/i.test(e));
  check("no failed network requests", realFailed.length === 0, realFailed.slice(0, 3).join(" | "));

  await cdp.send("Target.closeTarget", { targetId });
  ws.close();
  chrome.kill();
  try { rmSync(profile, { recursive: true, force: true, maxRetries: 3 }); } catch {}

  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length) {
    console.log("\nFailures:");
    failed.forEach((f) => console.log(`  - ${f.name}: ${f.detail}`));
    process.exit(1);
  }
  console.log("Screenshots written to docs/screenshots/");
}

main().catch((err) => {
  console.error(err);
  chrome.kill();
  try { rmSync(profile, { recursive: true, force: true, maxRetries: 3 }); } catch {}
  process.exit(1);
});
