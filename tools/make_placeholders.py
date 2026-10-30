#!/usr/bin/env python3
"""
make_placeholders.py - generate clean neutral placeholder images.

Every image referenced by assets/js/data.js is written at its exact final
pixel size and aspect ratio, so the layout is correct before the real
photos exist. Replace any file with a real one of the SAME NAME and SAME
aspect ratio and nothing in the code has to change.

Run:  python3 tools/make_placeholders.py
Re-run with --force to overwrite real images (normally it skips files
that already exist so your real photos are never clobbered).
"""

from __future__ import annotations

import argparse
import os
import sys

from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "images")

# Neutral palette that matches the site's light theme.
PAPER = (240, 243, 242)
PAPER_2 = (225, 231, 230)
LINE = (197, 207, 206)
TEXT = (122, 136, 135)
ACCENT = (11, 114, 104)

FONT_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
]


def font(size: int):
    for path in FONT_CANDIDATES:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except OSError:
                continue
    return ImageFont.load_default()


def centered(draw: ImageDraw.ImageDraw, xy, text, f, fill):
    box = draw.textbbox((0, 0), text, font=f)
    draw.text(
        (xy[0] - (box[2] - box[0]) / 2, xy[1] - (box[3] - box[1]) / 2),
        text,
        font=f,
        fill=fill,
    )


def base(w: int, h: int) -> Image.Image:
    """Soft diagonal gradient background."""
    img = Image.new("RGB", (w, h), PAPER)
    d = ImageDraw.Draw(img)
    steps = 60
    for i in range(steps):
        t = i / (steps - 1)
        c = tuple(round(PAPER[j] + (PAPER_2[j] - PAPER[j]) * t) for j in range(3))
        d.rectangle([0, round(h * t), w, round(h * (t + 1 / steps)) + 1], fill=c)
    return img


def person(w: int, h: int, label: str) -> Image.Image:
    """Avatar-style placeholder: head + shoulders line art."""
    img = base(w, h)
    d = ImageDraw.Draw(img)
    cx, cy = w / 2, h / 2
    r = min(w, h) * 0.17
    lw = max(2, round(min(w, h) * 0.012))
    d.ellipse([cx - r, cy - r * 1.55, cx + r, cy + r * 0.45], outline=LINE, width=lw)
    d.arc(
        [cx - r * 2.0, cy + r * 0.35, cx + r * 2.0, cy + r * 3.2],
        start=180, end=360, fill=LINE, width=lw,
    )
    centered(d, (cx, h * 0.88), label, font(max(11, round(min(w, h) * 0.045))), TEXT)
    return img


def screen(w: int, h: int, label: str, kind: str = "dashboard") -> Image.Image:
    """Dashboard-style placeholder: KPI cards + a chart skeleton."""
    img = base(w, h)
    d = ImageDraw.Draw(img)
    pad = round(w * 0.055)
    lw = max(2, round(w * 0.004))

    # header bar
    d.rounded_rectangle([pad, pad, w - pad, pad + h * 0.1], radius=round(w * 0.012),
                        outline=LINE, width=lw)
    d.rectangle([pad * 1.4, pad + h * 0.035, pad * 1.4 + w * 0.22, pad + h * 0.062], fill=LINE)

    # KPI cards
    top = pad + h * 0.14
    card_h = h * 0.17
    gap = w * 0.02
    cols = 3 if kind != "app" else 2
    card_w = (w - pad * 2 - gap * (cols - 1)) / cols
    for i in range(cols):
        x = pad + i * (card_w + gap)
        d.rounded_rectangle([x, top, x + card_w, top + card_h],
                            radius=round(w * 0.012), outline=LINE, width=lw)
        d.rectangle([x + card_w * 0.1, top + card_h * 0.28,
                     x + card_w * 0.55, top + card_h * 0.42], fill=LINE)
        d.rectangle([x + card_w * 0.1, top + card_h * 0.55,
                     x + card_w * 0.38, top + card_h * 0.72], fill=ACCENT)

    # chart area
    ctop = top + card_h + h * 0.05
    cbot = h - pad
    d.rounded_rectangle([pad, ctop, w - pad, cbot], radius=round(w * 0.012),
                        outline=LINE, width=lw)
    bars = 7
    inner_l = pad + w * 0.04
    inner_r = w - pad - w * 0.04
    bw = (inner_r - inner_l) / (bars * 1.6)
    heights = [0.35, 0.55, 0.42, 0.7, 0.5, 0.82, 0.62]
    for i, hh in enumerate(heights):
        x = inner_l + i * bw * 1.6
        bh = (cbot - ctop - h * 0.1) * hh
        d.rounded_rectangle([x, cbot - h * 0.05 - bh, x + bw, cbot - h * 0.05],
                            radius=round(w * 0.004),
                            fill=ACCENT if i % 3 == 2 else LINE)

    centered(d, (w / 2, pad + h * 0.075), label, font(max(12, round(h * 0.045))), TEXT)
    return img


def document(w: int, h: int, title: str, subtitle: str) -> Image.Image:
    """Paper/certificate style placeholder."""
    img = base(w, h)
    d = ImageDraw.Draw(img)
    pad = round(min(w, h) * 0.08)
    lw = max(2, round(min(w, h) * 0.006))
    d.rectangle([pad, pad, w - pad, h - pad], outline=LINE, width=lw)
    d.rectangle([pad * 1.6, pad * 1.6, w - pad * 1.6, h - pad * 1.6], outline=LINE, width=max(1, lw // 2))

    f_title = font(max(12, round(min(w, h) * 0.075)))
    f_sub = font(max(10, round(min(w, h) * 0.05)))

    # wrap the title to the frame width
    words, lines, line = title.split(), [], ""
    maxw = w - pad * 4
    for word in words:
        trial = f"{line} {word}".strip()
        if d.textbbox((0, 0), trial, font=f_title)[2] > maxw and line:
            lines.append(line)
            line = word
        else:
            line = trial
    lines.append(line)

    y = h * 0.38 - len(lines) * min(w, h) * 0.045
    for ln in lines:
        centered(d, (w / 2, y), ln, f_title, (60, 79, 82))
        y += min(w, h) * 0.095

    centered(d, (w / 2, h * 0.68), subtitle, f_sub, TEXT)
    d.line([w * 0.34, h * 0.8, w * 0.66, h * 0.8], fill=ACCENT, width=lw)
    return img


def logo(size: int, text: str) -> Image.Image:
    """Square transparent-background company logo placeholder."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    pad = size * 0.08
    d.rounded_rectangle([pad, pad, size - pad, size - pad], radius=size * 0.22,
                        fill=(255, 255, 255, 235), outline=LINE + (255,),
                        width=max(2, round(size * 0.02)))
    centered(d, (size / 2, size / 2), text, font(round(size * 0.4)), ACCENT + (255,))
    return img


def og(w: int, h: int) -> Image.Image:
    """Open Graph preview card."""
    img = Image.new("RGB", (w, h), (12, 26, 28))
    d = ImageDraw.Draw(img)
    for i in range(h):
        t = i / h
        d.line([0, i, w, i], fill=(round(10 + 8 * t), round(26 + 30 * t), round(28 + 28 * t)))
    d.ellipse([w * 0.62, -h * 0.25, w * 1.15, h * 0.85], outline=(16, 92, 85), width=3)
    d.ellipse([w * 0.70, -h * 0.1, w * 1.05, h * 0.7], outline=(13, 70, 65), width=2)

    centered(d, (w * 0.40, h * 0.37), "Divyapriyadharshini S", font(round(h * 0.105)), (238, 244, 243))
    centered(d, (w * 0.40, h * 0.52), "AI Tutor | Data Analyst | ML Data Associate",
             font(round(h * 0.050)), (120, 214, 200))
    centered(d, (w * 0.40, h * 0.645),
             "I turn raw data into clear insights and help train reliable AI models.",
             font(round(h * 0.040)), (165, 182, 182))
    centered(d, (w * 0.40, h * 0.78), "Bengaluru, India", font(round(h * 0.036)), (130, 150, 150))
    return img


# (filename, builder) ------------------------------------------------
JOBS: list[tuple[str, callable]] = [
    # Hero + about photos
    ("profile.jpg", lambda: person(640, 640, "profile.jpg")),
    ("profile@2x.jpg", lambda: person(1280, 1280, "profile@2x.jpg")),
    ("about.jpg", lambda: person(960, 720, "about.jpg")),
    ("about@2x.jpg", lambda: person(1920, 1440, "about@2x.jpg")),

    # Project screenshots (16:10)
    ("dr-advice.png", lambda: screen(1280, 800, "Dr.Advice - skin disease detection", "app")),
    ("dr-advice@2x.png", lambda: screen(2560, 1600, "Dr.Advice - skin disease detection", "app")),
    ("churn-prediction.png", lambda: screen(1280, 800, "Customer churn prediction")),
    ("churn-prediction@2x.png", lambda: screen(2560, 1600, "Customer churn prediction")),
    ("student-dashboard.png", lambda: screen(1280, 800, "Student performance dashboard")),
    ("student-dashboard@2x.png", lambda: screen(2560, 1600, "Student performance dashboard")),
    ("investment-dashboard.png", lambda: screen(1280, 800, "Investment profit dashboard")),
    ("investment-dashboard@2x.png", lambda: screen(2560, 1600, "Investment profit dashboard")),

    # Power BI gallery (16:10)
    ("dashboard-student-overview.png", lambda: screen(1280, 800, "Student performance overview")),
    ("dashboard-student-drilldown.png", lambda: screen(1280, 800, "Student report drilldown")),
    ("dashboard-churn.png", lambda: screen(1280, 800, "Customer churn analysis")),
    ("dashboard-investment.png", lambda: screen(1280, 800, "Investment profit tracker")),

    # Publication covers (3:4)
    ("pub-dr-advice.png", lambda: document(600, 800, "Skin Disease Analysis: Dr.Advice", "IJSRCSEIT - May 2025")),
    ("pub-forensic-sketch.png", lambda: document(600, 800, "Forensic Face Sketch Construction and Recognition", "Bulletin for Technology and History - Dec 2024")),
    ("pub-face-bot.png", lambda: document(600, 800, "Face Recognition Bot using IoT", "IJCRT - Feb 2024")),

    # Certificates (1200x850)
    ("cert-powerbi.png", lambda: document(1200, 850, "Power BI Dashboard Development and Data Visualization", "LinkedIn Learning")),
    ("cert-copilot-data.png", lambda: document(1200, 850, "Microsoft Copilot for Data Analysis", "LinkedIn Learning")),
    ("cert-genai-prompt.png", lambda: document(1200, 850, "Generative AI and Prompt Engineering", "LinkedIn Learning")),
    ("cert-prompt-intro.png", lambda: document(1200, 850, "Introduction to Prompt Engineering for Generative AI", "LinkedIn Learning")),
    ("cert-excel-copilot.png", lambda: document(1200, 850, "Excel with Copilot", "LinkedIn Learning")),
    ("cert-nptel-python.png", lambda: document(1200, 850, "The Joy of Computing Using Python", "NPTEL")),
    ("cert-hackerrank-python.png", lambda: document(1200, 850, "Python", "HackerRank")),

    # Company logos (128 square, transparent)
    ("logo-softage.png", lambda: logo(128, "SA")),
    ("logo-amazon.png", lambda: logo(128, "AZ")),
    ("logo-qspiders.png", lambda: logo(128, "QS")),
    ("logo-novitech.png", lambda: logo(128, "NT")),
    ("logo-oasis.png", lambda: logo(128, "OI")),

    # Social / app icons
    ("og-image.jpg", lambda: og(1200, 630)),
    ("apple-touch-icon.png", lambda: logo(180, "DS")),
]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true",
                    help="overwrite files that already exist")
    args = ap.parse_args()

    os.makedirs(OUT, exist_ok=True)
    made = skipped = 0
    for name, build in JOBS:
        path = os.path.join(OUT, name)
        if os.path.exists(path) and not args.force:
            skipped += 1
            continue
        image = build()
        if name.lower().endswith((".jpg", ".jpeg")):
            image.convert("RGB").save(path, "JPEG", quality=86, optimize=True, progressive=True)
        else:
            image.save(path, "PNG", optimize=True)
        made += 1
        print(f"  wrote {name} ({image.width}x{image.height})")

    print(f"\n{made} written, {skipped} skipped (already present). Output: {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
