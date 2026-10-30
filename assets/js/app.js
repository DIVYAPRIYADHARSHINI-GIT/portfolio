/**
 * app.js - renders every section from data.js and wires up behaviour.
 * ---------------------------------------------------------------------
 * Structure:
 *   A. small helpers (DOM, escaping, image markup)
 *   B. section renderers (one function per section, in page order)
 *   C. behaviour (theme, nav, reveal, filters, lightbox, form, to-top)
 *
 * Nothing here needs editing for a content change - edit data.js instead.
 */

import {
  meta, nav, hero, socials, contactDetails, about, experience,
  experienceFootnote, projectFilters, projects, dashboardGallery, skills,
  publications, publicationsNote, education, certificates, contact, footer,
} from "./data.js";
import { icon } from "./icons.js";

/* ================================================================ *
 * A. HELPERS
 * ================================================================ */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** Escape text that goes into HTML so content stays data, not markup. */
const esc = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/**
 * Build a responsive <img>. Width/height attributes are always set so the
 * browser reserves space (no layout shift), and everything below the fold
 * is lazy loaded and async-decoded.
 */
function img(image, { lazy = true, sizes = "", className = "" } = {}) {
  if (!image) return "";
  const srcset = Array.isArray(image.srcset)
    ? image.srcset.map((s) => `${esc(s.src)} ${s.width}w`).join(", ")
    : "";
  return [
    "<img",
    className ? ` class="${esc(className)}"` : "",
    ` src="${esc(image.src)}"`,
    srcset ? ` srcset="${srcset}"` : "",
    srcset && sizes ? ` sizes="${esc(sizes)}"` : "",
    ` alt="${esc(image.alt || "")}"`,
    image.w ? ` width="${image.w}"` : "",
    image.h ? ` height="${image.h}"` : "",
    lazy ? ' loading="lazy" decoding="async"' : ' decoding="async" fetchpriority="high"',
    " />",
  ].join("");
}

/** External links get rel/target; in-page anchors and mailto do not. */
const linkAttrs = (href) =>
  /^https?:/i.test(href) ? ' target="_blank" rel="noopener noreferrer"' : "";

const mount = (sel, html) => {
  const el = $(sel);
  if (el) el.innerHTML = html;
  return el;
};

/* ================================================================ *
 * B. RENDERERS
 * ================================================================ */

function renderHead() {
  // Keep the document title/meta in sync with data.js so there is one source
  // of truth even though index.html ships static tags for crawlers.
  document.title = `${meta.name} - ${meta.role.replace(/\s*\|\s*/g, ", ")}`;
}

function renderNav() {
  mount(
    "#navList",
    nav
      .map(
        (item) =>
          `<li><a href="#${esc(item.id)}" data-nav="${esc(item.id)}">${esc(item.label)}</a></li>`
      )
      .join("")
  );
}

function renderHero() {
  const [first, ...rest] = hero.name.split(" ");
  mount(
    "#heroBadge",
    `<span class="dot" aria-hidden="true"></span>${esc(hero.badge.label)}`
  );
  $("#heroName").innerHTML = `${esc(first)} <span class="accent">${esc(rest.join(" "))}</span>`;
  $("#heroTitle").textContent = hero.title;
  $("#heroTagline").textContent = hero.tagline;

  mount(
    "#heroRoles",
    hero.badge.roles.map((r) => `<li><span class="tag">${esc(r)}</span></li>`).join("")
  );

  mount(
    "#heroActions",
    hero.actions
      .map((a) => {
        const cls = a.style === "primary" ? "btn btn-primary" : "btn btn-ghost";
        const dl = a.download ? ` download="${esc(a.download)}"` : "";
        return `<a class="${cls}" href="${esc(a.href)}"${dl}${linkAttrs(a.href)}>${icon(a.icon)}<span>${esc(a.label)}</span></a>`;
      })
      .join("")
  );

  mount("#heroLocation", `${icon("pin")}<span>${esc(hero.location)}</span>`);
  const socialMarkup = socials
    .map(
      (s) =>
        `<li><a href="${esc(s.href)}"${linkAttrs(s.href)} aria-label="${esc(s.label)}" title="${esc(s.label)}">${icon(s.icon)}</a></li>`
    )
    .join("");
  mount("#heroSocials", socialMarkup);
  mount("#contactSocials", socialMarkup);
  mount("#footerSocials", socialMarkup);

  // Hero image is above the fold: eager load, high priority.
  mount(
    "#heroPortrait",
    `<div class="portrait-frame">
       ${img(hero.photo, { lazy: false, sizes: "(max-width: 900px) 17rem, 24rem" })}
     </div>
     <p class="portrait-chip"><b>99.80%</b> annotation accuracy</p>`
  );
}

function renderAbout() {
  $("#aboutKicker").textContent = about.kicker;
  $("#aboutHeading").textContent = about.heading;
  mount(
    "#aboutFigure",
    img(about.photo, { sizes: "(max-width: 820px) 100vw, 40vw" })
  );
  mount("#aboutCopy", about.paragraphs.map((p) => `<p>${esc(p)}</p>`).join(""));
  mount(
    "#statGrid",
    about.stats
      .map(
        (s, i) =>
          `<li class="stat-card reveal" style="--reveal-delay:${i * 80}ms">
             <span class="stat-value">${esc(s.value)}</span>
             <span class="stat-label">${esc(s.label)}</span>
             <span class="stat-note">${esc(s.note)}</span>
           </li>`
      )
      .join("")
  );
}

function renderExperience() {
  mount(
    "#timeline",
    experience
      .map(
        (job) => `
      <li class="tl-item reveal">
        <span class="tl-logo">${img(job.logo, { sizes: "48px" })}</span>
        <article class="tl-card">
          <div class="tl-top">
            <h3 class="tl-role">${esc(job.role)}</h3>
            <span class="tl-period">${esc(job.start)} &ndash; ${esc(job.end)}</span>
          </div>
          <p class="tl-company">
            ${esc(job.company)}
            <span class="sep">&middot;</span> <span class="loc">${esc(job.location)}</span>
            ${job.current ? '<span class="badge-now">Current</span>' : ""}
          </p>
          <ul class="tl-bullets">
            ${job.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}
          </ul>
          <ul class="tl-tags">
            ${job.tags.map((t) => `<li><span class="tag">${esc(t)}</span></li>`).join("")}
          </ul>
        </article>
      </li>`
      )
      .join("")
  );
  $("#experienceFootnote").textContent = experienceFootnote.text;
}

function renderProjects() {
  mount(
    "#projectFilters",
    projectFilters
      .map(
        (f, i) =>
          `<button class="filter-btn" type="button" data-filter="${esc(f)}" aria-pressed="${i === 0}">${esc(f)}</button>`
      )
      .join("")
  );

  mount(
    "#projectGrid",
    projects
      .map(
        (p, i) => `
      <article class="project-card reveal" data-category="${esc(p.category)}" style="--reveal-delay:${(i % 2) * 90}ms">
        <div class="mockup">
          <div class="mockup-bar" aria-hidden="true">
            <i></i><i></i><i></i><span>${esc(p.title)}</span>
          </div>
          <div class="mockup-screen">
            ${img(p.image, { sizes: "(max-width: 900px) 100vw, 40vw" })}
          </div>
        </div>
        <div class="project-body">
          <div class="project-top">
            <h3 class="project-title">${esc(p.title)}</h3>
            <span class="tag tag-accent">${esc(p.highlight)}</span>
          </div>
          <p class="project-summary">${esc(p.summary)}</p>
          <ul class="project-tech">
            ${p.tech.map((t) => `<li><span class="tag">${esc(t)}</span></li>`).join("")}
          </ul>
          <div class="project-links">
            ${p.links
              .map(
                (l) =>
                  `<a class="btn btn-ghost btn-sm" href="${esc(l.href)}"${linkAttrs(l.href)}>${icon(l.icon)}<span>${esc(l.label)}</span></a>`
              )
              .join("")}
          </div>
        </div>
      </article>`
      )
      .join("")
  );
}

function renderGallery() {
  $("#galleryKicker").textContent = dashboardGallery.kicker;
  $("#dashboardsHeading").textContent = dashboardGallery.heading;
  $("#galleryIntro").textContent = dashboardGallery.intro;

  mount(
    "#galleryGrid",
    dashboardGallery.items
      .map(
        (d, i) => `
      <li class="gallery-item reveal" style="--reveal-delay:${(i % 3) * 80}ms">
        <button class="gallery-btn" type="button"
                data-lightbox="gallery" data-index="${i}"
                aria-label="Enlarge: ${esc(d.title)}">
          ${img(d.image, { sizes: "(max-width: 900px) 100vw, 30vw" })}
          <span class="gallery-cap">
            <strong>${esc(d.title)}</strong>
            <span>${esc(d.caption)}</span>
          </span>
        </button>
        <span class="zoom-hint" aria-hidden="true">${icon("zoom")}</span>
      </li>`
      )
      .join("")
  );
}

function renderSkills() {
  mount(
    "#skillGrid",
    skills
      .map(
        (group, i) => `
      <li class="skill-card reveal" style="--reveal-delay:${(i % 3) * 80}ms">
        <div class="skill-head">
          <span class="skill-ico" aria-hidden="true">${icon(group.icon)}</span>
          <h3>${esc(group.group)}</h3>
        </div>
        <ul class="skill-items">
          ${group.items.map((s) => `<li><span class="tag">${esc(s)}</span></li>`).join("")}
        </ul>
      </li>`
      )
      .join("")
  );
}

function renderPublications() {
  mount(
    "#pubGrid",
    publications
      .map(
        (p, i) => `
      <li class="pub-card reveal" style="--reveal-delay:${(i % 3) * 80}ms">
        ${img(p.cover, { sizes: "104px" })}
        <div class="pub-meta">
          <h3 class="pub-title">${
            p.href
              ? `<a href="${esc(p.href)}"${linkAttrs(p.href)}>${esc(p.title)}</a>`
              : esc(p.title)
          }</h3>
          <span class="pub-journal">${esc(p.journal)}</span>
          <span class="pub-date">${esc(p.date)}</span>
          <p class="pub-note">${esc(p.note)}</p>
        </div>
      </li>`
      )
      .join("")
  );
  $("#publicationsNote").textContent = publicationsNote.text;
}

function renderEducation() {
  mount(
    "#eduList",
    education
      .map(
        (e, i) => `
      <li class="edu-card reveal" style="--reveal-delay:${i * 80}ms">
        <h3 class="edu-degree">${esc(e.degree)}</h3>
        <p class="edu-inst">${esc(e.institution)} &middot; ${esc(e.location)}</p>
        <p class="edu-period">${esc(e.period)}</p>
      </li>`
      )
      .join("")
  );

  mount(
    "#langCard",
    `<h3>Languages</h3>
     <ul class="skill-items">
       ${about.languages.map((l) => `<li><span class="tag">${esc(l)}</span></li>`).join("")}
     </ul>`
  );

  mount(
    "#certGrid",
    certificates
      .map(
        (c, i) => `
      <li class="cert-item reveal" style="--reveal-delay:${(i % 4) * 70}ms">
        <button class="cert-btn" type="button"
                data-lightbox="cert" data-index="${i}"
                aria-label="Enlarge certificate: ${esc(c.title)}">
          ${img(c.image, { sizes: "(max-width: 900px) 100vw, 25vw" })}
          <span class="cert-cap">
            <strong>${esc(c.title)}</strong>
            <span>${esc(c.issuer)}</span>
          </span>
        </button>
        <span class="zoom-hint" aria-hidden="true">${icon("zoom")}</span>
      </li>`
      )
      .join("")
  );
}

function renderContact() {
  $("#contactKicker").textContent = contact.kicker;
  $("#contactHeading").textContent = contact.heading;
  $("#contactMessage").textContent = contact.message;

  mount(
    "#contactList",
    contactDetails
      .map(
        (c) => `
      <li>
        <span class="skill-ico" aria-hidden="true">${icon(c.icon)}</span>
        <span>
          <span class="c-label">${esc(c.label)}</span>
          ${
            c.href
              ? `<a class="c-value" href="${esc(c.href)}"${linkAttrs(c.href)}>${esc(c.value)}</a>`
              : `<span class="c-value">${esc(c.value)}</span>`
          }
        </span>
      </li>`
      )
      .join("")
  );

  mount("#contactResume", `${icon("download")}<span>Download Resume (PDF)</span>`);
}

function renderFooter() {
  $("#footerCopy").textContent = footer.copyright;
  $("#footerBuilt").textContent = footer.builtWith;
}

/* ================================================================ *
 * C. BEHAVIOUR
 * ================================================================ */

/* --- Theme toggle ------------------------------------------------ */
function initTheme() {
  const btn = $("#themeToggle");
  const sync = () => {
    const dark = document.documentElement.dataset.theme === "dark";
    btn.setAttribute("aria-pressed", String(dark));
    btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  };
  sync();
  btn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("dps-theme", next); } catch (e) { /* private mode */ }
    sync();
  });
}

/* --- Mobile nav, sticky state, scroll progress, active link ------- */
function initNav() {
  const header = $("#siteHeader");
  const navEl = $("#siteNav");
  const toggle = $("#navToggle");
  const progress = $("#scrollProgress i");
  const links = $$("#navList a");

  const closeMenu = () => {
    navEl.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  };

  toggle.addEventListener("click", () => {
    const open = navEl.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  links.forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      header.classList.toggle("is-stuck", y > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.setProperty("--progress", `${max > 0 ? (y / max) * 100 : 0}%`);
      const toTop = $("#toTop");
      const show = y > 600;
      toTop.hidden = !show;
      toTop.classList.toggle("is-visible", show);
      ticking = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Active-section highlighting. The section whose top is nearest above the
  // 40% viewport line wins, which behaves well with unequal section heights.
  const sections = nav
    .map((n) => document.getElementById(n.id))
    .filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        links.forEach((a) => a.classList.toggle("is-active", a.dataset.nav === id));
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((s) => spy.observe(s));
}

/* --- Section reveal on scroll ------------------------------------ */
function initReveal() {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  items.forEach((el) => io.observe(el));
}

/* --- Project category filter -------------------------------------- */
function initFilters() {
  const bar = $("#projectFilters");
  const cards = $$(".project-card");
  const empty = $("#projectEmpty");
  if (!bar) return;

  bar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    const value = btn.dataset.filter;

    $$(".filter-btn", bar).forEach((b) =>
      b.setAttribute("aria-pressed", String(b === btn))
    );

    let shown = 0;
    cards.forEach((card) => {
      const match = value === "All" || card.dataset.category === value;
      card.classList.toggle("is-hidden", !match);
      if (match) {
        shown += 1;
        // Re-trigger the reveal so filtered-in cards animate back.
        card.classList.remove("is-visible");
        requestAnimationFrame(() => card.classList.add("is-visible"));
      }
    });
    empty.hidden = shown > 0;
  });
}

/* --- Lightbox (dashboard gallery + certificates) ------------------- */
function initLightbox() {
  const box = $("#lightbox");
  const imgEl = $("#lbImage");
  const cap = $("#lbCaption");
  const btnClose = $("#lbClose");
  const btnPrev = $("#lbPrev");
  const btnNext = $("#lbNext");

  const sets = {
    gallery: dashboardGallery.items.map((d) => ({
      src: d.image.src,
      alt: d.image.alt,
      caption: `${d.title} - ${d.caption}`,
    })),
    cert: certificates.map((c) => ({
      src: c.image.src,
      alt: c.image.alt,
      caption: `${c.title} - ${c.issuer}`,
    })),
  };

  let current = { set: "gallery", index: 0 };
  let lastFocus = null;

  const show = () => {
    const item = sets[current.set][current.index];
    if (!item) return;
    imgEl.src = item.src;
    imgEl.alt = item.alt;
    cap.textContent = item.caption;
    const multiple = sets[current.set].length > 1;
    btnPrev.hidden = !multiple;
    btnNext.hidden = !multiple;
  };

  const open = (set, index, trigger) => {
    current = { set, index };
    lastFocus = trigger || document.activeElement;
    box.hidden = false;
    document.body.style.overflow = "hidden";
    show();
    btnClose.focus();
  };

  const close = () => {
    box.hidden = true;
    document.body.style.overflow = "";
    imgEl.src = "";
    if (lastFocus) lastFocus.focus();
  };

  const step = (delta) => {
    const list = sets[current.set];
    current.index = (current.index + delta + list.length) % list.length;
    show();
  };

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-lightbox]");
    if (!trigger) return;
    open(trigger.dataset.lightbox, Number(trigger.dataset.index), trigger);
  });

  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", () => step(-1));
  btnNext.addEventListener("click", () => step(1));
  box.addEventListener("click", (e) => {
    if (e.target === box || e.target.classList.contains("lightbox-figure")) close();
  });

  document.addEventListener("keydown", (e) => {
    if (box.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
    if (e.key === "Tab") {
      // Simple focus trap across the dialog's three controls.
      const focusables = [btnClose, btnPrev, btnNext].filter((b) => !b.hidden);
      const i = focusables.indexOf(document.activeElement);
      e.preventDefault();
      const next = e.shiftKey ? i - 1 : i + 1;
      focusables[(next + focusables.length) % focusables.length].focus();
    }
  });
}

/* --- Contact form: validation + submit ----------------------------- */
function initForm() {
  const form = $("#contactForm");
  const status = $("#formStatus");
  const submit = $("#cf-submit");
  if (!form) return;

  const rules = {
    name: (v) => (v.trim().length < 2 ? "Please enter your name." : ""),
    email: (v) =>
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
        ? "Please enter a valid email address."
        : "",
    message: (v) =>
      v.trim().length < 10 ? "Please write at least 10 characters." : "",
  };

  const validateField = (field) => {
    const error = rules[field.name] ? rules[field.name](field.value) : "";
    const errorEl = $(`#cf-${field.name}-error`);
    if (errorEl) errorEl.textContent = error;
    field.setAttribute("aria-invalid", String(Boolean(error)));
    return !error;
  };

  ["name", "email", "message"].forEach((name) => {
    const field = form.elements[name];
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") validateField(field);
    });
  });

  const showSuccess = () => {
    form.innerHTML = `
      <div class="form-success">
        <span class="check" aria-hidden="true">&#10003;</span>
        <h3>Message sent</h3>
        <p>${esc(contact.successMessage)}</p>
      </div>`;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    status.classList.remove("is-error");

    // Honeypot: a filled "company" field means a bot. Pretend success.
    if (form.elements.company.value) {
      showSuccess();
      return;
    }

    const fields = ["name", "email", "message"].map((n) => form.elements[n]);
    const ok = fields.map(validateField).every(Boolean);
    if (!ok) {
      status.textContent = "Please fix the highlighted fields.";
      status.classList.add("is-error");
      fields.find((f) => f.getAttribute("aria-invalid") === "true")?.focus();
      return;
    }

    const payload = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      message: form.elements.message.value.trim(),
    };

    // With an endpoint configured in data.js the form posts directly.
    if (contact.formEndpoint) {
      submit.disabled = true;
      status.textContent = "Sending...";
      try {
        const res = await fetch(contact.formEndpoint, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        showSuccess();
      } catch (err) {
        submit.disabled = false;
        status.textContent =
          "Sending failed. Please email divyapriyadharshinisathish@gmail.com directly.";
        status.classList.add("is-error");
      }
      return;
    }

    // No endpoint: hand the message to the visitor's mail client, then
    // confirm in-page so the interaction still completes successfully.
    const subject = encodeURIComponent(`Portfolio enquiry from ${payload.name}`);
    const body = encodeURIComponent(
      `${payload.message}\n\n---\nFrom: ${payload.name}\nEmail: ${payload.email}`
    );
    window.location.href = `mailto:divyapriyadharshinisathish@gmail.com?subject=${subject}&body=${body}`;
    showSuccess();
  });
}

/* --- Back to top --------------------------------------------------- */
function initToTop() {
  $("#toTop").addEventListener("click", () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    $("#siteHeader").querySelector(".brand").focus({ preventScroll: true });
  });
}

/* --- Graceful image fallback ---------------------------------------
 * Until the real photos land in assets/images/, any missing file is
 * replaced by a neutral placeholder generated inline at the exact
 * aspect ratio, so the layout is final from day one.
 * ------------------------------------------------------------------- */
function initImageFallback() {
  const placeholder = (w, h, label) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#e8edec"/><stop offset="1" stop-color="#d6dedd"/>
      </linearGradient></defs>
      <rect width="${w}" height="${h}" fill="url(#g)"/>
      <g fill="none" stroke="#b9c4c3" stroke-width="${Math.max(2, w / 320)}">
        <circle cx="${w / 2}" cy="${h / 2 - h * 0.05}" r="${Math.min(w, h) * 0.12}"/>
        <path d="M${w * 0.3} ${h * 0.72}h${w * 0.4}"/>
      </g>
      <text x="50%" y="${h * 0.86}" text-anchor="middle" font-family="system-ui, sans-serif"
            font-size="${Math.max(11, Math.min(w, h) * 0.055)}" fill="#8a9897">${label}</text>
    </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };

  document.addEventListener(
    "error",
    (e) => {
      const el = e.target;
      if (!(el instanceof HTMLImageElement) || el.dataset.fallbackApplied) return;
      el.dataset.fallbackApplied = "1";
      const w = el.getAttribute("width") || el.naturalWidth || 800;
      const h = el.getAttribute("height") || el.naturalHeight || 600;
      const name = (el.getAttribute("src") || "").split("/").pop() || "image";
      el.removeAttribute("srcset");
      el.src = placeholder(Number(w), Number(h), name);
    },
    true // capture: image error events do not bubble
  );
}

/* ================================================================ *
 * BOOT
 * ================================================================ */
function init() {
  initImageFallback(); // register before images start failing
  renderHead();
  renderNav();
  renderHero();
  renderAbout();
  renderExperience();
  renderProjects();
  renderGallery();
  renderSkills();
  renderPublications();
  renderEducation();
  renderContact();
  renderFooter();

  initTheme();
  initNav();
  initFilters();
  initLightbox();
  initForm();
  initToTop();
  initReveal(); // last: observes every .reveal the renderers created
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
