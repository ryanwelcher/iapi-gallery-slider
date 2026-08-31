# Slideshows

Presentation decks for this workshop, one folder per duration. Each deck is a single
self-contained HTML file — open `index.html` in a browser (double-click works; no build,
no server) and present from the tab. Fonts load from Google Fonts on first open and are
cached after that; everything else (images, QR code, code samples) is embedded.

## Decks

| Folder | Duration | Covers | Run sheet |
|--------|----------|--------|-----------|
| [`90-minutes/`](./90-minutes/index.html) | 90 min | Sections 1–8 in the room; Section 9 as take-home | `../facilitator-notes.md` |

A deck and its run sheet travel together: `facilitator-notes.md` carries the timing
table, the minute-50 checkpoint, and the cut lines that this deck's pause slides and
timeboxes are built around, and `slides-outline.md` is the slide-by-slide content
outline. **A new duration is a new run sheet, not this deck minus slides** — shorter
versions change the lab timeboxes, the checkpoint gates, and which sections survive,
so start a variant by writing its timing table, then copy the nearest deck folder and
cut to fit.

## Presenting

- **← / → / space / click** — navigate; slides with build steps reveal one piece per press
- **Type a slide number + Enter** — jump straight to a slide (Esc cancels)
- **N** — toggle speaker notes overlay
- **T** — start/stop the elapsed timer (start it at 0:00 of the session; the run
  sheet's checkpoint gates are measured against it)
- **Home / End** — first / last slide; the URL hash (`#27`) deep-links and survives reload
- **▶ Playground buttons** (opening + take-home slides) — boot the finished slider in an
  embedded WordPress Playground, built from the `demo` branch's `demo-blueprint.json`;
  needs network, and the "open in new tab" link is the fallback

Slide types: purple = talk track, **orange = the room is coding** (from
`workshop-outline/section-N.md`), green-edged = checkpoint. Green corner chips mark the
moments to switch to the local Studio window for a live demo.

## Per-event swap points

- **Feedback QR** (last slide): one `<img>` behind a `FEEDBACK QR` comment in the HTML —
  replace the `src` data URI (`base64 -i your-qr.png`) or point it at an image file.
- **Event name** (title slide + eyebrow) and the **repo URL / handles** (setup + thanks
  slides) are plain text near the top and bottom of the file.

## Theme

Colors and type come from the personal brand theme
(`animated-graphics/src/lib/theme.ts`): `#2D2B55` ground, `#E76F51` highlight,
Jost + JetBrains Mono, Shades of Purple syntax colors. Change brand colors in the
`:root` token block at the top of each deck's `<style>`.
