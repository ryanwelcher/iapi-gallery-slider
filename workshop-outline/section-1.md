# Section 1 — Welcome & Setup

**Type:** tour

## Goal

Get our dev environment ready and a test post in place so we can start building.

## Steps

1. **Create the Studio site.** If you haven't already, create a new Studio site from the provided `blueprint.json` (Studio → **Add site → Build a new site → Upload Blueprint**).
2. **Confirm the site is running and the plugin is active.** In the Studio app, your new site should show a green **Running** indicator. Click **WP Admin** to open `wp-admin`, log in (Studio fills the credentials for you), and go to **Plugins**. The **IAPI Gallery Slider** plugin should be listed as **Active**. If it isn't, click **Activate**.

    > **Aside — Studio CLI.** If you've enabled the Studio CLI (Studio → **Settings → Studio CLI for terminal**), you can do the same checks from your terminal: `studio site status` prints the URL and admin login, and `studio wp plugin list --status=active` lists active plugins. The CLI is optional for this workshop — every check has a click-through equivalent in the Studio app or `wp-admin`.
3. **Confirm Node 20+ and install JS deps.** In a terminal, from the plugin directory:
    ```bash
    cd /path/to/your/studio/site/wp-content/plugins/iapi-gallery-slider
    node -v                  # should print v20.x or newer
    npm install              # safe to re-run; idempotent
    npm run start            # starts the @wordpress/scripts watcher
    ```
    Leave `npm run start` running in this terminal for the rest of the workshop — it rebuilds `build/` whenever we edit a `src/` file.
4. **Open the test post.** Open `wp-admin` and go to **Posts**. The blueprint has already published a post titled **Hello, IAPI!** containing an empty **Gallery Slider** block — open it in the editor. You don't need to add inner blocks yet; sections 3, 5, 6, and 7 will walk you through inserting Image / Cover / Media & Text slides at the right moments. We'll keep coming back to this same post throughout the workshop.

    > **Not using Studio + the blueprint?** If you're running on your own WordPress install (or you didn't load `blueprint.json`), the **Hello, IAPI!** post won't exist. Create a new post yourself, give it any title you like, and insert the **Gallery Slider** block into the empty post. Leave the block empty for now — later sections will tell you when to add inner blocks.

## What's Next

→ [Section 2 — Anatomy of the Starter](./section-2.md)
