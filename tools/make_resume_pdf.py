#!/usr/bin/env python3
"""
make_resume_pdf.py - build a real, working resume.pdf from the same content
that is on the site, with no third-party dependencies.

Why this exists: the hero has a "Download Resume" button. A dead link is
worse than a plain resume, so this writes a clean, typeset A4 PDF using only
the PDF base-14 fonts (Helvetica). When Divyapriyadharshini has her own
designed resume, just drop it in as resume.pdf and this script is no longer
needed (re-running it would overwrite, so it refuses unless --force).

Run:  python3 tools/make_resume_pdf.py [--force]
"""

from __future__ import annotations

import argparse
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "resume.pdf")

# A4 in points
PW, PH = 595.28, 841.89
MARGIN = 54.0
ACCENT = (0.043, 0.447, 0.408)   # #0b7268
INK = (0.055, 0.102, 0.110)
SOFT = (0.239, 0.310, 0.322)
MUTE = (0.392, 0.451, 0.459)
RULE = (0.796, 0.827, 0.824)

# Approximate Helvetica advance widths (per 1000 units) for wrapping.
_W_NARROW = set("iljtfI.,:;'`|!()[]{}/\\ ")
_W_WIDE = set("mwMW@")


def text_width(s: str, size: float, bold: bool = False) -> float:
    total = 0.0
    for ch in s:
        if ch in _W_NARROW:
            u = 300
        elif ch in _W_WIDE:
            u = 860
        elif ch.isupper():
            u = 690
        elif ch.isdigit():
            u = 556
        else:
            u = 540
        total += u
    if bold:
        total *= 1.055
    return total * size / 1000.0


# WinAnsiEncoding code points for the few typographic characters we use that
# live outside latin-1. Without these the glyphs come out as "?".
_WINANSI = {
    "\u2022": "\\225",  # bullet
    "\u2014": "\\227",  # em dash
    "\u2013": "\\226",  # en dash
    "\u2018": "\\221",
    "\u2019": "\\222",
    "\u201c": "\\223",
    "\u201d": "\\224",
}


def esc(s: str) -> str:
    s = s.replace("\\", r"\\").replace("(", r"\(").replace(")", r"\)")
    for ch, code in _WINANSI.items():
        s = s.replace(ch, code)
    return s


def wrap(s: str, size: float, max_w: float, bold: bool = False) -> list[str]:
    words, lines, line = s.split(), [], ""
    for w in words:
        trial = f"{line} {w}".strip()
        if text_width(trial, size, bold) > max_w and line:
            lines.append(line)
            line = w
        else:
            line = trial
    if line:
        lines.append(line)
    return lines


class Page:
    def __init__(self) -> None:
        self.ops: list[str] = []
        self.y = PH - MARGIN

    def color(self, rgb) -> None:
        self.ops.append(f"{rgb[0]:.3f} {rgb[1]:.3f} {rgb[2]:.3f} rg")

    def text(self, x: float, y: float, s: str, size: float, bold=False, rgb=INK,
             spacing: float = 0.0) -> None:
        self.color(rgb)
        font = "/F2" if bold else "/F1"
        self.ops.append(
            f"BT {font} {size:.2f} Tf {spacing:.2f} Tc 1 0 0 1 {x:.2f} {y:.2f} Tm ({esc(s)}) Tj ET"
        )

    def rule(self, y: float, x0: float = MARGIN, x1: float = PW - MARGIN,
             w: float = 0.6, rgb=RULE) -> None:
        self.ops.append(
            f"{rgb[0]:.3f} {rgb[1]:.3f} {rgb[2]:.3f} RG {w:.2f} w "
            f"{x0:.2f} {y:.2f} m {x1:.2f} {y:.2f} l S"
        )

    def box(self, x, y, w, h, rgb) -> None:
        self.color(rgb)
        self.ops.append(f"{x:.2f} {y:.2f} {w:.2f} {h:.2f} re f")

    def stream(self) -> bytes:
        return "\n".join(self.ops).encode("latin-1", "replace")


class Doc:
    def __init__(self) -> None:
        self.pages = [Page()]

    @property
    def p(self) -> Page:
        return self.pages[-1]

    def space(self, amount: float) -> None:
        if self.p.y - amount < MARGIN + 30:
            self.pages.append(Page())
        else:
            self.p.y -= amount

    def need(self, amount: float) -> None:
        if self.p.y - amount < MARGIN + 30:
            self.pages.append(Page())

    def heading(self, title: str) -> None:
        self.need(46)
        self.space(14)
        self.p.text(MARGIN, self.p.y, title.upper(), 9.5, bold=True, rgb=ACCENT, spacing=1.4)
        self.space(7)
        self.p.rule(self.p.y)
        self.space(13)

    def body(self, s: str, size: float = 9.3, rgb=SOFT, indent: float = 0.0,
             leading: float = 12.4) -> None:
        width = PW - MARGIN * 2 - indent
        for line in wrap(s, size, width):
            self.need(leading)
            self.p.text(MARGIN + indent, self.p.y, line, size, rgb=rgb)
            self.space(leading)

    def bullet(self, s: str) -> None:
        self.need(12.4)
        self.p.text(MARGIN + 4, self.p.y, "\u2022", 9.3, rgb=ACCENT)
        first = True
        for line in wrap(s, 9.3, PW - MARGIN * 2 - 14):
            if not first:
                self.need(12.4)
            self.p.text(MARGIN + 14, self.p.y, line, 9.3, rgb=SOFT)
            self.space(12.4)
            first = False

    def job(self, role: str, company: str, period: str, bullets: list[str]) -> None:
        self.need(60)
        self.p.text(MARGIN, self.p.y, role, 10.6, bold=True, rgb=INK)
        pw = text_width(period, 8.8)
        self.p.text(PW - MARGIN - pw, self.p.y, period, 8.8, rgb=MUTE)
        self.space(13)
        self.p.text(MARGIN, self.p.y, company, 9.4, bold=True, rgb=ACCENT)
        self.space(13)
        for b in bullets:
            self.bullet(b)
        self.space(5)

    def build(self) -> bytes:
        objs: list[bytes] = []

        def add(b: bytes) -> int:
            objs.append(b)
            return len(objs)

        font_r = add(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>")
        font_b = add(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>")

        page_ids, content_ids = [], []
        for page in self.pages:
            data = page.stream()
            content_ids.append(add(b"<< /Length %d >>\nstream\n" % len(data) + data + b"\nendstream"))
            page_ids.append(None)

        pages_id = len(objs) + len(self.pages) + 1
        for i, _ in enumerate(self.pages):
            page_ids[i] = add(
                b"<< /Type /Page /Parent %d 0 R /MediaBox [0 0 %.2f %.2f] "
                b"/Resources << /Font << /F1 %d 0 R /F2 %d 0 R >> >> /Contents %d 0 R >>"
                % (pages_id, PW, PH, font_r, font_b, content_ids[i])
            )

        kids = b" ".join(b"%d 0 R" % pid for pid in page_ids)
        pages_obj = add(b"<< /Type /Pages /Count %d /Kids [%s] >>" % (len(page_ids), kids))
        assert pages_obj == pages_id, (pages_obj, pages_id)

        info = add(
            b"<< /Title (Divyapriyadharshini S - Resume) /Author (Divyapriyadharshini S) "
            b"/Subject (AI Tutor, Data Analyst, ML Data Associate) /Creator (portfolio build script) >>"
        )
        catalog = add(b"<< /Type /Catalog /Pages %d 0 R >>" % pages_obj)

        out = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
        offsets = [0]
        for i, body in enumerate(objs, start=1):
            offsets.append(len(out))
            out += b"%d 0 obj\n" % i + body + b"\nendobj\n"

        xref = len(out)
        out += b"xref\n0 %d\n" % (len(objs) + 1)
        out += b"0000000000 65535 f \n"
        for off in offsets[1:]:
            out += b"%010d 00000 n \n" % off
        out += (
            b"trailer\n<< /Size %d /Root %d 0 R /Info %d 0 R >>\nstartxref\n%d\n%%%%EOF\n"
            % (len(objs) + 1, catalog, info, xref)
        )
        return bytes(out)


def compose() -> Doc:
    d = Doc()
    p = d.p

    # --- header -----------------------------------------------------
    p.box(0, PH - 4, PW, 4, ACCENT)
    p.text(MARGIN, p.y - 12, "Divyapriyadharshini S", 23, bold=True, rgb=INK)
    d.space(30)
    p.text(MARGIN, d.p.y, "AI Tutor  |  Data Analyst  |  ML Data Associate", 11, bold=True, rgb=ACCENT)
    d.space(16)
    p.text(MARGIN, d.p.y,
           "Bengaluru, Karnataka, India  \u00b7  9578033875  \u00b7  divyapriyadharshinisathish@gmail.com",
           8.8, rgb=MUTE)
    d.space(11.5)
    p.text(MARGIN, d.p.y,
           "linkedin.com/in/divyapriyadharshini-s  \u00b7  github.com/DIVYAPRIYADHARSHINI-GIT",
           8.8, rgb=MUTE)
    d.space(12)
    d.p.rule(d.p.y, w=0.8)
    d.space(14)

    # --- summary ----------------------------------------------------
    d.body(
        "AI and Data Analytics professional with hands-on experience in Python, SQL, data analytics, "
        "machine learning, data processing, and AI model training and evaluation. Skilled in Pandas, "
        "NumPy, Matplotlib, Power BI and MySQL for data manipulation, analysis, visualization and "
        "reporting. Experienced in building Python workflows for data validation, automation and AI "
        "training. Strong analytical and problem-solving skills focused on reliable, data-driven, "
        "AI-enabled solutions."
    )

    # --- highlights -------------------------------------------------
    d.heading("Key results")
    for s in [
        "99.80% annotation accuracy on AI/ML training data at Amazon production scale.",
        "10+ interactive Power BI dashboards built and published with DAX measures and KPIs.",
        "15% machine learning accuracy improvement through parameter tuning.",
        "3 published research papers in peer-reviewed journals.",
    ]:
        d.bullet(s)

    # --- experience -------------------------------------------------
    d.heading("Experience")
    d.job("AI Tutor", "SoftAge \u00b7 Bangalore, India", "07/2026 - Present", [
        "Use Python for AI training, evaluation and data processing workflows.",
        "Write scripts for data processing, automation, validation and analysis.",
        "Automate data extraction and validation to keep training sets consistent.",
        "Create and review AI training data, prompts and verification datasets.",
        "Run data quality checks and accuracy validation before data ships.",
        "Use Fusion 360 for basic model editing and verification.",
    ])
    d.job("ML Associate", "Amazon \u00b7 Bangalore, India", "09/2025 - 06/2026", [
        "Performed video annotation and data labeling for AI/ML model training at scale with 99.80% accuracy.",
        "Reviewed and validated datasets to maintain labeling standards.",
        "Carried out quality checks and identified errors before delivery.",
        "Worked with cross-functional teams in a high-volume production environment.",
    ])
    d.job("Data Analysis with Python Intern / Data Analyst", "QSpiders \u00b7 Bangalore, India",
          "03/2025 - 09/2025", [
        "Delivered analytics with Python, SQL and Power BI.",
        "Wrote 100+ SQL queries using joins, subqueries and group by for reporting.",
        "Built and published 10+ interactive Power BI dashboards with DAX measures and KPIs.",
    ])
    d.job("Machine Learning and Data Analytics Intern", "NoviTech R&D \u00b7 Coimbatore, India",
          "02/2025 - 05/2025", [
        "Handled data preprocessing and feature engineering for model-ready datasets.",
        "Built ML models including Logistic Regression, Decision Trees and KNN.",
        "Worked on NLP and regression tasks; improved accuracy by 15% through parameter tuning.",
    ])
    d.job("Machine Learning and Data Analytics Intern", "Oasis Infobyte \u00b7 Online / New Delhi, India",
          "03/2024 - 05/2024", [
        "Ran exploratory data analysis with Pandas and NumPy.",
        "Produced dashboards and visualizations for data storytelling.",
    ])
    d.job("Web Developer", "NoviTech \u00b7 Coimbatore, India", "06/2023", [
        "Built responsive web pages with HTML, CSS, Bootstrap and JavaScript.",
    ])

    # --- projects ---------------------------------------------------
    d.heading("Projects")
    for title, tech, desc in [
        ("Dr.Advice: AI-Powered Skin Disease Detection",
         "Python, TensorFlow, OpenCV, Machine Learning, Android",
         "ML-based mobile application for early identification of skin disease from images, reaching "
         "about 85% prediction accuracy on test data. Also published as a research paper."),
        ("Customer Churn Prediction and Retention Strategy",
         "Python, Pandas, NumPy, Scikit-learn, Power BI, Excel",
         "Machine learning model predicting customer churn with over 80% accuracy, with data cleaning, "
         "feature engineering, EDA and Power BI churn dashboards."),
        ("Student Performance Dashboard",
         "Power BI, SQL, Excel, DAX",
         "Academic performance analytics with search by student name and roll number, plus automated "
         "reporting that improved tracking efficiency by 70%."),
        ("Investment Profit Dashboard",
         "Python, Streamlit, Pandas",
         "Interactive investment profit tracker turning transaction data into profit and return views."),
    ]:
        d.need(44)
        d.p.text(MARGIN, d.p.y, title, 10, bold=True, rgb=INK)
        d.space(12.5)
        d.p.text(MARGIN, d.p.y, tech, 8.6, rgb=ACCENT)
        d.space(12)
        d.body(desc)
        d.space(5)

    # --- skills -----------------------------------------------------
    d.heading("Skills")
    for label, items in [
        ("Programming", "Python"),
        ("Data Analysis", "Pandas, NumPy, Matplotlib, Seaborn, Data Cleaning, EDA"),
        ("Database", "SQL, MySQL"),
        ("Visualization", "Power BI (DAX, Power Query), Excel"),
        ("AI / ML", "Machine Learning, scikit-learn, Generative AI, AI Model Training and Evaluation, Prompt Engineering"),
        ("Tools", "Jupyter Notebook, VS Code, Git, GitHub, Streamlit"),
        ("Other", "Data Validation, Automation, Quality Assurance"),
    ]:
        d.need(13)
        d.p.text(MARGIN, d.p.y, f"{label}:", 9.3, bold=True, rgb=INK)
        off = text_width(f"{label}:", 9.3, True) + 6
        lines = wrap(items, 9.3, PW - MARGIN * 2 - off)
        d.p.text(MARGIN + off, d.p.y, lines[0], 9.3, rgb=SOFT)
        d.space(12.4)
        for extra in lines[1:]:
            d.need(12.4)
            d.p.text(MARGIN + off, d.p.y, extra, 9.3, rgb=SOFT)
            d.space(12.4)

    # --- publications -----------------------------------------------
    d.heading("Publications")
    for title, where in [
        ("Skin Disease Analysis: Dr.Advice", "IJSRCSEIT, May 2025"),
        ("Forensic Face Sketch Construction and Recognition", "Bulletin for Technology and History, Dec 2024"),
        ("Face Recognition Bot using IoT", "IJCRT, Feb 2024"),
    ]:
        d.bullet(f"{title} \u2014 {where}")
    d.bullet("Presented at an international conference on IoT Technologies and Smart Systems.")

    # --- education / certificates -----------------------------------
    d.heading("Education and certificates")
    d.need(26)
    d.p.text(MARGIN, d.p.y, "B.E. Computer Science", 10, bold=True, rgb=INK)
    per = "2021 - 2025"
    d.p.text(PW - MARGIN - text_width(per, 8.8), d.p.y, per, 8.8, rgb=MUTE)
    d.space(12.5)
    d.p.text(MARGIN, d.p.y, "Sree Sakthi Engineering College \u00b7 Coimbatore, India", 9.3, rgb=SOFT)
    d.space(14)
    d.p.text(MARGIN, d.p.y, "Data Analysis and Python training \u00b7 QSpiders, Bangalore", 9.3, bold=True, rgb=INK)
    d.space(14)
    d.body(
        "Certificates: Power BI Dashboard Development and Data Visualization (LinkedIn Learning); "
        "Microsoft Copilot for Data Analysis; Generative AI and Prompt Engineering; Introduction to "
        "Prompt Engineering for Generative AI; Excel with Copilot; The Joy of Computing Using Python "
        "(NPTEL); Python (HackerRank)."
    )
    d.space(3)
    d.body("Languages: English, Tamil.")
    return d


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="overwrite an existing resume.pdf")
    args = ap.parse_args()

    if os.path.exists(OUT) and not args.force:
        print(f"resume.pdf already exists - keeping it. Use --force to overwrite.\n  {OUT}")
        return 0

    data = compose().build()
    with open(OUT, "wb") as fh:
        fh.write(data)
    print(f"wrote {OUT} ({len(data):,} bytes)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
