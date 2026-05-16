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
- [@wordpress/interactivity-router package](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-interactivity-router/)
- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [WordPress Studio](https://developer.wordpress.com/studio/)

---

## Welcome!

<!-- TODO: short welcome paragraph — duration, structure, pace. -->

## What Are We Building?

<!-- TODO: describe the end product the audience will have built. -->

## Structure

<!-- TODO: declare your sections, then update this table.
     Section types: tour / coding / demo / hackathon.
     Only `coding` sections get a `code-reference/section-N/` snapshot. -->

**Sections 1–6 are the core workshop.** Section 7 is bonus material — covered only if time permits.

| Section | Title                                              | Type           | Code reference |
| ------- | -------------------------------------------------- | -------------- | -------------- |
| 1       | Welcome & Setup                                    | tour           | —              |
| 2       | Anatomy of the Starter                             | tour           | —              |
| 3       | Interactivity API Primer                           | demo           | —              |
| 4       | Wiring Up Navigation                               | coding         | ✓              |
| 5       | Server-Side: Injecting Directives                  | coding         | ✓              |
| 6       | Enhancements: Autoplay, Keyboard, Touch, Continuous| coding         | ✓              |
| 7       | Deep-Linkable Slides with the Interactivity Router | coding · bonus | ✓              |

Let's go! → [Section 1](./workshop-outline/section-1.md)
