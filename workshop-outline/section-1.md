# Section 1 — Welcome & Setup

**Type:** tour

## Goal

Get our dev environment ready and a test post in place so we can start building.

## Steps

1. **Create the Studio site.** If you haven't already, create a new Studio site from the provided `blueprint.json` (Studio → **Add site → Build a new site → Upload Blueprint**).
2. **Confirm the site is running and the plugin is active.** From the plugin directory:
    ```bash
    studio site status                              # URL, admin login, PHP/WP versions
    studio wp plugin list --status=active           # iapi-gallery-slider should appear
    ```
    If the site isn't running: `studio site start --skip-browser`. If the plugin isn't active: `studio wp plugin activate iapi-gallery-slider`.
3. **Confirm Node 20+ and install JS deps.** In a terminal, from the plugin directory:
    ```bash
    cd /path/to/your/studio/site/wp-content/plugins/iapi-gallery-slider
    node -v                  # should print v20.x or newer
    npm install              # safe to re-run; idempotent
    npm run start            # starts the @wordpress/scripts watcher
    ```
    Leave `npm run start` running in this terminal for the rest of the workshop — it rebuilds `build/` whenever we edit a `src/` file.
4. **Create a test post.** Open `wp-admin` (the URL and login are in `studio site status`), create a new post, and insert the **Gallery Slider** block. Add at least three inner blocks inside it (Image, Cover, or Media & Text). Save as a draft. Sections 3, 5, 6, and 7 all assume this post exists with at least three slides — we'll keep coming back to it.

## What's Next

→ [Section 2 — Anatomy of the Starter](./section-2.md)
