/**
 * icons.js - inline SVG icon set.
 * All icons are 24x24, stroke-based (except the brand glyphs which are
 * filled paths). Returning strings keeps the whole site dependency-free.
 * Icons are decorative, so they carry aria-hidden="true"; the surrounding
 * link/button always has a text label or aria-label.
 */

const stroke = (body) =>
  `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;

const filled = (body) =>
  `<svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">${body}</svg>`;

export const icons = {
  mail: stroke('<rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3 7 8.2 5.6a1.4 1.4 0 0 0 1.6 0L21 7"/>'),
  phone: stroke('<path d="M6.3 3.5h3l1.6 4-2 1.4a12 12 0 0 0 5.8 5.8l1.4-2 4 1.6v3a1.8 1.8 0 0 1-2 1.8A16.5 16.5 0 0 1 4.5 5.5a1.8 1.8 0 0 1 1.8-2Z"/>'),
  pin: stroke('<path d="M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>'),
  download: stroke('<path d="M12 3.5v11"/><path d="m7.5 10.5 4.5 4.5 4.5-4.5"/><path d="M4.5 19.5h15"/>'),
  grid: stroke('<rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6"/>'),
  external: stroke('<path d="M14 4.5h5.5V10"/><path d="M19.5 4.5 11 13"/><path d="M18 14.5v4a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6h4"/>'),
  paper: stroke('<path d="M6.5 3.5h7L19 9v11.5a1 1 0 0 1-1 1H6.5a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z"/><path d="M13.5 3.5V9H19"/><path d="M8.5 13h7M8.5 16.5h5"/>'),
  zoom: stroke('<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/><path d="M11 8.5v5M8.5 11h5"/>'),

  // Brand glyphs (simple filled marks, not official logos)
  github: filled('<path d="M12 2.2a9.8 9.8 0 0 0-3.1 19.1c.5.1.68-.21.68-.47v-1.8c-2.77.6-3.35-1.18-3.35-1.18-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.9.83.1-.65.35-1.08.63-1.33-2.21-.25-4.54-1.11-4.54-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.56 4.93.36.31.68.92.68 1.86v2.75c0 .26.18.58.69.47A9.8 9.8 0 0 0 12 2.2Z"/>'),
  linkedin: filled('<path d="M5.2 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3.5 9.2h3.4v11.3H3.5V9.2Zm6 0h3.26v1.55h.05c.45-.84 1.56-1.73 3.21-1.73 3.43 0 4.06 2.2 4.06 5.06v6.42h-3.39v-5.7c0-1.36-.03-3.11-1.94-3.11-1.94 0-2.24 1.48-2.24 3.01v5.8H9.5V9.2Z"/>'),

  // Skill-group icons
  code: stroke('<path d="m8.5 8-4 4 4 4"/><path d="m15.5 8 4 4-4 4"/><path d="m13.5 5-3 14"/>'),
  chart: stroke('<path d="M4 4v15.5h16"/><path d="m7 15 3.5-4.5 3 2.5L20 6"/>'),
  database: stroke('<ellipse cx="12" cy="6" rx="7.5" ry="3"/><path d="M4.5 6v12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6"/><path d="M4.5 12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3"/>'),
  bar: stroke('<rect x="4" y="12" width="4" height="8" rx="1"/><rect x="10" y="7.5" width="4" height="12.5" rx="1"/><rect x="16" y="4" width="4" height="16" rx="1"/>'),
  spark: stroke('<path d="M12 3.5 13.6 9 19 10.6 13.6 12.2 12 17.7 10.4 12.2 5 10.6 10.4 9 12 3.5Z"/><path d="M18 17.5 18.7 19.4 20.5 20 18.7 20.6 18 22.5 17.3 20.6 15.5 20 17.3 19.4Z"/>'),
  tool: stroke('<path d="M14.5 6.5a4 4 0 0 0 5.1 5.1l-7.4 7.4a2.3 2.3 0 0 1-3.2-3.2Z"/><path d="M17.8 3.2 14.5 6.5"/><path d="M6.5 6.5 4 9l3 3 2.5-2.5Z"/>'),
  check: stroke('<circle cx="12" cy="12" r="8.5"/><path d="m8.5 12.2 2.4 2.4 4.6-5"/>'),
};

/** Return icon markup by name; unknown names render nothing. */
export const icon = (name) => icons[name] || "";
