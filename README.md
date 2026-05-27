# Building Interactive Blocks with the Interactivity API

### WCEU 2026

**Date:** 2026-06-06

- Ryan Welcher, Automattic

## Pre-Workshop Setup Checklist

To avoid wifi bottlenecks on the day, please complete this **before you arrive**:

1. **WordPress Studio** — Download and install [WordPress Studio](https://developer.wordpress.com/studio/).

2. **Create a site from the blueprint** — Download the [`blueprint.json`](https://github.com/ryanwelcher/iapi-gallery-slider/raw/trunk/blueprint.json) file from this repository. In Studio, click **Add site → Start from a blueprint → Choose blueprint file** and select the downloaded file.

   Set the WordPress version to **latest** in the **Advanced settings** of the Add a site dialog.

3. **Node.js v20+** — Recommended via [NVM](https://github.com/nvm-sh/nvm):

   ```bash
   nvm install 20 && nvm use 20
   ```

4. **Install JS dependencies** in the workshop plugin directory:

   ```bash
   cd /path/to/your/studio/site/wp-content/plugins/iapi-gallery-slider-trunk
   npm install
   ```

## Local development (facilitator / contributors)

Use `blueprint.local.json` to spin up an empty Studio site, then point Studio at this repo as the plugin source.

1. In Studio, **Add site → Start from a blueprint** and pick `blueprint.local.json`.
2. Install deps and start the build watcher:

   ```bash
   npm install
   npm run start
   ```

## Documentation & References

- [Interactivity API docs](https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/)
- [@wordpress/interactivity package](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-interactivity/)
- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [WordPress Studio](https://developer.wordpress.com/studio/)

---

## Welcome!

This is a self-guided walkthrough. Each section lives in [`workshop-outline/`](./workshop-outline/) and links to the next, so we can move at our own pace. Coding sections include an end-of-section snapshot under `code-reference/section-N/` — if we get stuck or fall behind, we can copy that snapshot over `src/` and pick up at the next section.

## What Are We Building?

A WordPress block called **Gallery Slider** that turns any group of inner blocks (Image, Cover, Media & Text) into an interactive slider — clickable prev/next buttons, an optional autoplay with a configurable speed, optional continuous looping, plus keyboard and touch navigation. By the end we'll have built it from a static starter into a fully interactive block using nothing but the Interactivity API.

## Structure

| Section | Title                                          | Type    | Code reference |
| ------- | ---------------------------------------------- | ------- | -------------- |
| 1       | Welcome & Setup                                | tour    | —              |
| 2       | Anatomy of the Starter                         | tour    | —              |
| 3       | Editor Controls                                | coding  | ✓              |
| 4       | Interactivity API Primer                       | reading | —              |
| 5       | Hello, Store                                   | coding  | ✓              |
| 6       | Sliding + Bounds                               | coding  | ✓              |
| 7       | Server-Side Directive Injection                | coding  | ✓              |
| 8       | Autoplay                                       | coding  | ✓              |
| 9       | Polish: Keyboard, Touch, Continuous            | coding  | ✓              |

Let's go! → [Section 1](./workshop-outline/section-1.md)
