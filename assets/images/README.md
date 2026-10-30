# Images - how to swap in the real ones

Every file here is currently a **generated neutral placeholder** at the exact
final pixel size. To use a real image, save it with the **same file name** and
the **same aspect ratio** and drop it in this folder. Nothing in the HTML, CSS
or JS has to change.

If you want a different file name, change it in **one** place:
`assets/js/data.js`.

## Required sizes

| File | Size (px) | Ratio | Used for |
| --- | --- | --- | --- |
| `profile.jpg` | 640 x 640 | 1:1 | Hero portrait (circular, accent ring) |
| `profile@2x.jpg` | 1280 x 1280 | 1:1 | Retina hero portrait |
| `about.jpg` | 960 x 720 | 4:3 | About-section photo |
| `about@2x.jpg` | 1920 x 1440 | 4:3 | Retina about photo |
| `dr-advice.png` | 1280 x 800 | 16:10 | Project screenshot |
| `churn-prediction.png` | 1280 x 800 | 16:10 | Project screenshot |
| `student-dashboard.png` | 1280 x 800 | 16:10 | Project screenshot |
| `investment-dashboard.png` | 1280 x 800 | 16:10 | Project screenshot |
| `*@2x.png` (projects) | 2560 x 1600 | 16:10 | Retina project screenshots |
| `dashboard-*.png` (4 files) | 1280 x 800 | 16:10 | Power BI gallery (lightbox) |
| `pub-*.png` (3 files) | 600 x 800 | 3:4 | Publication cover thumbnails |
| `cert-*.png` (7 files) | 1200 x 850 | ~7:5 | Certificate images (lightbox) |
| `logo-*.png` (5 files) | 128 x 128 | 1:1 | Company logos in the timeline |
| `og-image.jpg` | 1200 x 630 | 1.91:1 | Link preview when the site is shared |
| `apple-touch-icon.png` | 180 x 180 | 1:1 | iOS home-screen icon |
| `favicon.svg` | vector | 1:1 | Browser tab icon (hand-written SVG) |

## Tips

- **Format**: JPG for photographs, PNG for screenshots and logos. WebP works
  too - if you convert, rename the entry in `data.js` to match.
- **Retina `@2x`**: optional. If you do not provide one, the browser simply
  uses the base image; the layout is unaffected.
- **Logos**: transparent PNG looks best against the white logo tile.
- **Alt text** lives in `data.js` next to each image. Update it when you swap a
  photo - it is what screen readers and image search read.
- **Compression**: keep photos under ~250 KB and screenshots under ~400 KB.
  [Squoosh](https://squoosh.app) is a good free tool.

## Regenerating placeholders

```bash
python3 tools/make_placeholders.py          # only fills in missing files
python3 tools/make_placeholders.py --force  # overwrites everything
```

The default run **skips files that already exist**, so your real photos are
never overwritten by accident.
