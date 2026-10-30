/**
 * data.js - THE ONLY FILE YOU NEED TO EDIT TO UPDATE THE SITE.
 * =============================================================
 * Every piece of text, every link and every image path on the portfolio
 * comes from this file. Add a project, change a date, swap a photo:
 * edit here, save, refresh. No build step, no framework.
 *
 * IMAGES
 *   All images live in assets/images/. To swap a real photo in, drop the file
 *   into that folder and change ONLY the file name below. Keep the documented
 *   aspect ratio so the layout does not shift.
 *   Every image entry is { src, alt, w, h } and may add { srcset: [...] }
 *   where each srcset item is { src, width }. Missing srcset files are
 *   ignored by the browser as long as the base src exists.
 */

/* ---------------------------------------------------------------- *
 * 0. SITE / SEO
 * ---------------------------------------------------------------- */
export const meta = {
  name: "Divyapriyadharshini S",
  shortName: "Divyapriyadharshini",
  role: "AI Tutor | Data Analyst | ML Data Associate",
  description:
    "AI and Data Analytics professional in Bengaluru. Python, SQL, Power BI, machine learning and AI model training. Open to Data Analyst, BI, Data Science, GenAI and Python roles.",
  // Live production URL. Update here (and the canonical/og:url tags in
  // index.html) if a custom domain is attached later.
  url: "https://portfolio-divya-6411.vercel.app/",
  locale: "en_IN",
  // 1200 x 630 - Open Graph / Twitter preview card.
  ogImage: { src: "https://portfolio-divya-6411.vercel.app/assets/images/og-image.jpg", w: 1200, h: 630 },
  keywords: [
    "Data Analyst",
    "Business Intelligence",
    "Power BI Developer",
    "Data Science",
    "Generative AI",
    "Python Developer",
    "Bengaluru",
  ],
};

/* ---------------------------------------------------------------- *
 * 1. NAVIGATION (order = scroll order; id must match a <section id>)
 * ---------------------------------------------------------------- */
export const nav = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "publications", label: "Publications" },
  { id: "certificates", label: "Certificates" },
  { id: "contact", label: "Contact" },
];

/* ---------------------------------------------------------------- *
 * 2. HERO
 * ---------------------------------------------------------------- */
export const hero = {
  name: "Divyapriyadharshini S",
  title: "AI Tutor | Data Analyst | ML Data Associate",
  tagline:
    "I turn raw data into clear insights and help train reliable AI models.",
  badge: {
    label: "Open to work",
    roles: [
      "Data Analytics",
      "Business Intelligence",
      "Data Science",
      "GenAI",
      "Python",
      "Power BI",
    ],
  },
  location: "Bengaluru, Karnataka, India",
  // 640 x 640 square. Swap with a real headshot cropped to a square.
  photo: {
    src: "assets/images/profile.jpg",
    alt: "Portrait of Divyapriyadharshini S, AI and Data Analytics professional",
    w: 640,
    h: 640,
    srcset: [
      { src: "assets/images/profile.jpg", width: 640 },
      { src: "assets/images/profile@2x.jpg", width: 1280 },
    ],
  },
  actions: [
    { label: "View Projects", href: "#projects", style: "primary", icon: "grid" },
    {
      label: "Download Resume",
      href: "resume.pdf",
      style: "ghost",
      icon: "download",
      download: "Divyapriyadharshini-S-Resume.pdf",
    },
    { label: "Contact Me", href: "#contact", style: "ghost", icon: "mail" },
  ],
};

/* ---------------------------------------------------------------- *
 * 3. SOCIAL / CONTACT CHANNELS (used in hero, contact block and footer)
 * ---------------------------------------------------------------- */
export const socials = [
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "linkedin.com/in/divyapriyadharshini-s",
    href: "https://www.linkedin.com/in/divyapriyadharshini-s",
    icon: "linkedin",
  },
  {
    id: "github",
    label: "GitHub",
    handle: "github.com/DIVYAPRIYADHARSHINI-GIT",
    href: "https://github.com/DIVYAPRIYADHARSHINI-GIT",
    icon: "github",
  },
  {
    id: "email",
    label: "Email",
    handle: "divyapriyadharshinisathish@gmail.com",
    href: "mailto:divyapriyadharshinisathish@gmail.com",
    icon: "mail",
  },
];

export const contactDetails = [
  {
    label: "Email",
    value: "divyapriyadharshinisathish@gmail.com",
    href: "mailto:divyapriyadharshinisathish@gmail.com",
    icon: "mail",
  },
  { label: "Phone", value: "9578033875", href: "tel:+919578033875", icon: "phone" },
  {
    label: "Location",
    value: "Bengaluru, Karnataka, India",
    href: null,
    icon: "pin",
  },
];

/* ---------------------------------------------------------------- *
 * 4. ABOUT
 * ---------------------------------------------------------------- */
export const about = {
  kicker: "About",
  heading: "Data, made useful.",
  paragraphs: [
    "AI and Data Analytics professional with hands-on experience in Python, SQL, data analytics, machine learning, data processing, and AI model training and evaluation.",
    "Skilled in Pandas, NumPy, Matplotlib, Power BI and MySQL for data manipulation, analysis, visualization and reporting. Experienced in building Python workflows for data validation, automation and AI training.",
    "Strong analytical and problem-solving skills focused on reliable, data-driven, AI-enabled solutions.",
  ],
  // 960 x 720 (4:3). A second casual or at-work photo.
  photo: {
    src: "assets/images/about.jpg",
    alt: "Divyapriyadharshini S working on data analysis and dashboards",
    w: 960,
    h: 720,
    srcset: [
      { src: "assets/images/about.jpg", width: 960 },
      { src: "assets/images/about@2x.jpg", width: 1920 },
    ],
  },
  stats: [
    { value: "99.80%", label: "Annotation accuracy", note: "Amazon, at production scale" },
    { value: "10+", label: "Power BI dashboards", note: "Built and published with DAX" },
    { value: "15%", label: "ML accuracy gain", note: "Through parameter tuning" },
    { value: "3", label: "Published research papers", note: "Peer-reviewed journals" },
  ],
  languages: ["English", "Tamil"],
};

/* ---------------------------------------------------------------- *
 * 5. EXPERIENCE (vertical timeline, newest first)
 *    Logos: 128 x 128 square, transparent PNG works best.
 * ---------------------------------------------------------------- */
export const experience = [
  {
    role: "AI Tutor",
    company: "SoftAge",
    location: "Bangalore, India",
    start: "07/2026",
    end: "Present",
    current: true,
    logo: { src: "assets/images/logo-softage.png", alt: "SoftAge logo", w: 128, h: 128 },
    bullets: [
      "Use Python for AI training, evaluation and data processing workflows.",
      "Write scripts for data processing, automation, validation and analysis.",
      "Automate data extraction and validation to keep training sets consistent.",
      "Create and review AI training data, prompts and verification datasets.",
      "Run data quality checks and accuracy validation before data ships.",
      "Use Fusion 360 for basic model editing and verification.",
    ],
    tags: ["Python", "GenAI", "Prompt Engineering", "Data Validation", "Fusion 360"],
  },
  {
    role: "ML Associate",
    company: "Amazon",
    location: "Bangalore, India",
    start: "09/2025",
    end: "06/2026",
    logo: { src: "assets/images/logo-amazon.png", alt: "Amazon logo", w: 128, h: 128 },
    bullets: [
      "Performed video annotation and data labeling for AI/ML model training at scale with 99.80% accuracy.",
      "Reviewed and validated datasets to maintain labeling standards.",
      "Carried out quality checks and identified errors before delivery.",
      "Worked with cross-functional teams in a high-volume production environment.",
    ],
    tags: ["Data Labeling", "Quality Assurance", "ML Training Data"],
  },
  {
    role: "Data Analysis with Python Intern / Data Analyst",
    company: "QSpiders",
    location: "Bangalore, India",
    start: "03/2025",
    end: "09/2025",
    logo: { src: "assets/images/logo-qspiders.png", alt: "QSpiders logo", w: 128, h: 128 },
    bullets: [
      "Delivered analytics with Python, SQL and Power BI.",
      "Wrote 100+ SQL queries using joins, subqueries and group by for reporting.",
      "Built and published 10+ interactive Power BI dashboards with DAX measures and KPIs.",
    ],
    tags: ["Python", "SQL", "Power BI", "DAX"],
  },
  {
    role: "Machine Learning and Data Analytics Intern",
    company: "NoviTech R&D",
    location: "Coimbatore, India",
    start: "02/2025",
    end: "05/2025",
    logo: { src: "assets/images/logo-novitech.png", alt: "NoviTech R and D logo", w: 128, h: 128 },
    bullets: [
      "Handled data preprocessing and feature engineering for model-ready datasets.",
      "Built ML models including Logistic Regression, Decision Trees and KNN.",
      "Worked on NLP and regression tasks.",
      "Improved model accuracy by 15% through parameter tuning.",
    ],
    tags: ["scikit-learn", "NLP", "Regression", "Feature Engineering"],
  },
  {
    role: "Machine Learning and Data Analytics Intern",
    company: "Oasis Infobyte",
    location: "Online / New Delhi, India",
    start: "03/2024",
    end: "05/2024",
    logo: { src: "assets/images/logo-oasis.png", alt: "Oasis Infobyte logo", w: 128, h: 128 },
    bullets: [
      "Ran exploratory data analysis with Pandas and NumPy.",
      "Produced dashboards and visualizations for data storytelling.",
    ],
    tags: ["Pandas", "NumPy", "EDA", "Visualization"],
  },
];

// Shown as a one-line footnote under the timeline.
export const experienceFootnote = {
  text: "Earlier: Web Developer (HTML, CSS, Bootstrap, JavaScript), NoviTech, June 2023.",
};

/* ---------------------------------------------------------------- *
 * 6. PROJECTS
 *    Screenshots: 1280 x 800 (16:10) so they sit cleanly in the
 *    browser mockup frame. category must be one of projectFilters.
 * ---------------------------------------------------------------- */
export const projectFilters = ["All", "Machine Learning", "Dashboards", "Python"];

export const projects = [
  {
    title: "Dr.Advice: AI-Powered Skin Disease Detection",
    category: "Machine Learning",
    summary:
      "ML-based mobile application for early identification of skin disease from images, reaching about 85% prediction accuracy on test data. Also published as a research paper.",
    highlight: "~85% test accuracy",
    tech: ["Python", "TensorFlow", "OpenCV", "Machine Learning", "Android"],
    image: {
      src: "assets/images/dr-advice.png",
      alt: "Dr.Advice app screen showing a skin image upload and the predicted condition with a confidence score",
      w: 1280,
      h: 800,
      srcset: [
        { src: "assets/images/dr-advice.png", width: 1280 },
        { src: "assets/images/dr-advice@2x.png", width: 2560 },
      ],
    },
    links: [
      { label: "GitHub", href: "https://github.com/DIVYAPRIYADHARSHINI-GIT", icon: "github" },
      { label: "Read paper", href: "#publications", icon: "paper" },
    ],
  },
  {
    title: "Customer Churn Prediction and Retention Strategy",
    category: "Machine Learning",
    summary:
      "Machine learning model that predicts customer churn with over 80% accuracy, supported by data cleaning, feature engineering, EDA and Power BI churn dashboards for retention planning.",
    highlight: "80%+ accuracy",
    tech: ["Python", "Pandas", "NumPy", "Scikit-learn", "Power BI", "Excel"],
    image: {
      src: "assets/images/churn-prediction.png",
      alt: "Customer churn dashboard with churn rate KPIs, risk segments and a feature importance chart",
      w: 1280,
      h: 800,
      srcset: [
        { src: "assets/images/churn-prediction.png", width: 1280 },
        { src: "assets/images/churn-prediction@2x.png", width: 2560 },
      ],
    },
    links: [
      { label: "GitHub", href: "https://github.com/DIVYAPRIYADHARSHINI-GIT", icon: "github" },
    ],
  },
  {
    title: "Student Performance Dashboard",
    category: "Dashboards",
    summary:
      "Academic performance analytics with search by student name and roll number, plus automated reporting that improved tracking efficiency by 70%.",
    highlight: "70% faster tracking",
    tech: ["Power BI", "SQL", "Excel", "DAX"],
    image: {
      src: "assets/images/student-dashboard.png",
      alt: "Student performance Power BI dashboard with subject-wise scores, pass rate KPIs and a student search box",
      w: 1280,
      h: 800,
      srcset: [
        { src: "assets/images/student-dashboard.png", width: 1280 },
        { src: "assets/images/student-dashboard@2x.png", width: 2560 },
      ],
    },
    links: [
      { label: "GitHub", href: "https://github.com/DIVYAPRIYADHARSHINI-GIT", icon: "github" },
    ],
  },
  {
    title: "Investment Profit Dashboard",
    category: "Python",
    summary:
      "Interactive investment profit tracker built with Python and Streamlit, turning transaction data into profit and return views.",
    highlight: "Python + Streamlit",
    tech: ["Python", "Streamlit", "Pandas"],
    image: {
      src: "assets/images/investment-dashboard.png",
      alt: "Streamlit investment profit dashboard with portfolio value, profit trend and per-asset returns",
      w: 1280,
      h: 800,
      srcset: [
        { src: "assets/images/investment-dashboard.png", width: 1280 },
        { src: "assets/images/investment-dashboard@2x.png", width: 2560 },
      ],
    },
    links: [
      { label: "GitHub", href: "https://github.com/DIVYAPRIYADHARSHINI-GIT", icon: "github" },
    ],
  },
];

/* ---------------------------------------------------------------- *
 * 7. DASHBOARD GALLERY (lightbox - click to enlarge)
 *    Screenshots: 1280 x 800 (16:10).
 * ---------------------------------------------------------------- */
export const dashboardGallery = {
  kicker: "Power BI",
  heading: "Dashboard gallery",
  intro:
    "A selection from 10+ dashboards built and published with DAX measures, Power Query and KPI cards. Click any tile to enlarge.",
  items: [
    {
      title: "Student Performance Overview",
      caption: "Subject-wise scores, pass rate and class comparison",
      image: {
        src: "assets/images/dashboard-student-overview.png",
        alt: "Power BI report page with student pass rate KPI cards and subject-wise score bars",
        w: 1280,
        h: 800,
      },
    },
    {
      title: "Student Report Drilldown",
      caption: "Search by student name or roll number",
      image: {
        src: "assets/images/dashboard-student-drilldown.png",
        alt: "Power BI drillthrough page showing a single student report with marks history",
        w: 1280,
        h: 800,
      },
    },
    {
      title: "Customer Churn Analysis",
      caption: "Churn rate, risk segments and retention levers",
      image: {
        src: "assets/images/dashboard-churn.png",
        alt: "Power BI churn analysis page with churn rate gauge and customer segment table",
        w: 1280,
        h: 800,
      },
    },
    {
      title: "Investment Profit Tracker",
      caption: "Streamlit profit and return views",
      image: {
        src: "assets/images/dashboard-investment.png",
        alt: "Streamlit dashboard page showing cumulative investment profit over time",
        w: 1280,
        h: 800,
      },
    },
  ],
};

/* ---------------------------------------------------------------- *
 * 8. SKILLS
 * ---------------------------------------------------------------- */
export const skills = [
  { group: "Programming", icon: "code", items: ["Python"] },
  {
    group: "Data Analysis",
    icon: "chart",
    items: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Data Cleaning", "EDA"],
  },
  { group: "Database", icon: "database", items: ["SQL", "MySQL"] },
  {
    group: "Visualization",
    icon: "bar",
    items: ["Power BI (DAX, Power Query)", "Excel"],
  },
  {
    group: "AI / ML",
    icon: "spark",
    items: [
      "Machine Learning",
      "scikit-learn",
      "Generative AI",
      "AI Model Training and Evaluation",
      "Prompt Engineering",
    ],
  },
  {
    group: "Tools",
    icon: "tool",
    items: ["Jupyter Notebook", "VS Code", "Git", "GitHub", "Streamlit"],
  },
  {
    group: "Other",
    icon: "check",
    items: ["Data Validation", "Automation", "Quality Assurance"],
  },
];

/* ---------------------------------------------------------------- *
 * 9. PUBLICATIONS
 *    Covers: 600 x 800 (3:4) portrait thumbnails.
 * ---------------------------------------------------------------- */
export const publications = [
  {
    title: "Skin Disease Analysis: Dr.Advice",
    journal: "IJSRCSEIT",
    date: "May 2025",
    note: "Machine learning approach to early skin disease identification from images.",
    href: null,
    cover: {
      src: "assets/images/pub-dr-advice.png",
      alt: "Cover thumbnail of the Dr.Advice skin disease analysis paper in IJSRCSEIT",
      w: 600,
      h: 800,
    },
  },
  {
    title: "Forensic Face Sketch Construction and Recognition",
    journal: "Bulletin for Technology and History",
    date: "Dec 2024",
    note: "Sketch-to-face construction and recognition pipeline for forensic use.",
    href: null,
    cover: {
      src: "assets/images/pub-forensic-sketch.png",
      alt: "Cover thumbnail of the forensic face sketch construction and recognition paper",
      w: 600,
      h: 800,
    },
  },
  {
    title: "Face Recognition Bot using IoT",
    journal: "IJCRT",
    date: "Feb 2024",
    note: "IoT-connected face recognition bot for access and monitoring.",
    href: null,
    cover: {
      src: "assets/images/pub-face-bot.png",
      alt: "Cover thumbnail of the face recognition bot using IoT paper in IJCRT",
      w: 600,
      h: 800,
    },
  },
];

export const publicationsNote = {
  text:
    "Also presented at an international conference on IoT Technologies and Smart Systems.",
};

/* ---------------------------------------------------------------- *
 * 10. EDUCATION + CERTIFICATES
 *     Certificate images: 1200 x 850 landscape, lightbox preview.
 * ---------------------------------------------------------------- */
export const education = [
  {
    degree: "B.E. Computer Science",
    institution: "Sree Sakthi Engineering College",
    location: "Coimbatore, India",
    period: "2021 - 2025",
  },
  {
    degree: "Data Analysis and Python training",
    institution: "QSpiders",
    location: "Bangalore, India",
    period: "2025",
  },
];

export const certificates = [
  {
    title: "Power BI Dashboard Development and Data Visualization",
    issuer: "LinkedIn Learning",
    image: {
      src: "assets/images/cert-powerbi.png",
      alt: "Power BI Dashboard Development and Data Visualization certificate from LinkedIn Learning",
      w: 1200,
      h: 850,
    },
  },
  {
    title: "Microsoft Copilot for Data Analysis",
    issuer: "LinkedIn Learning",
    image: {
      src: "assets/images/cert-copilot-data.png",
      alt: "Microsoft Copilot for Data Analysis certificate",
      w: 1200,
      h: 850,
    },
  },
  {
    title: "Generative AI and Prompt Engineering",
    issuer: "LinkedIn Learning",
    image: {
      src: "assets/images/cert-genai-prompt.png",
      alt: "Generative AI and Prompt Engineering certificate",
      w: 1200,
      h: 850,
    },
  },
  {
    title: "Introduction to Prompt Engineering for Generative AI",
    issuer: "LinkedIn Learning",
    image: {
      src: "assets/images/cert-prompt-intro.png",
      alt: "Introduction to Prompt Engineering for Generative AI certificate",
      w: 1200,
      h: 850,
    },
  },
  {
    title: "Excel with Copilot",
    issuer: "LinkedIn Learning",
    image: {
      src: "assets/images/cert-excel-copilot.png",
      alt: "Excel with Copilot certificate",
      w: 1200,
      h: 850,
    },
  },
  {
    title: "The Joy of Computing Using Python",
    issuer: "NPTEL",
    image: {
      src: "assets/images/cert-nptel-python.png",
      alt: "The Joy of Computing Using Python certificate from NPTEL",
      w: 1200,
      h: 850,
    },
  },
  {
    title: "Python",
    issuer: "HackerRank",
    image: {
      src: "assets/images/cert-hackerrank-python.png",
      alt: "Python certificate from HackerRank",
      w: 1200,
      h: 850,
    },
  },
];

/* ---------------------------------------------------------------- *
 * 11. CONTACT
 *     formEndpoint: leave null to use the built-in mailto fallback.
 *     Paste a Formspree / Getform / Netlify Forms endpoint to make the
 *     form post directly (e.g. "https://formspree.io/f/xxxxxxx").
 * ---------------------------------------------------------------- */
export const contact = {
  kicker: "Contact",
  heading: "Let's talk about data.",
  message:
    "Open to full-time roles in Data Analytics, BI, Data Science, GenAI and Python.",
  formEndpoint: null,
  successMessage:
    "Thank you. Your message is on its way - I will reply within a day or two.",
  mailtoFallbackNote: "Your email app will open with the message ready to send.",
};

export const footer = {
  copyright: `\u00a9 ${new Date().getFullYear()} Divyapriyadharshini S. All rights reserved.`,
  builtWith: "Hand-built with HTML, CSS and vanilla JavaScript.",
};
