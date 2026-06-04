# Section 9 — Polish: Focus, Touch, Continuous

**Type:** coding

## Goal

Three additive enhancements that each reuse patterns from Sections 5–8 — no new IAPI primitives. The slider's finish line is here: it pauses for keyboard users, swipe navigates on touch devices, and continuous mode wraps prev/next around the ends.

This is our last coding section. Now that we know `state`, `actions`, `callbacks`, and the server-side filter, the three sub-stages below are variations on what we've already built:

- **Focus a11y** labels the carousel region and pauses autoplay while a keyboard user is interacting — one ARIA group, two new actions, two new directives.
- **Touch** is a variation on the same action pattern, with two events instead of one.
- **Continuous** doesn't add new directives at all — it modifies existing actions/getters in place to wrap around the ends.

## Sub-stage 9a — Focus a11y

Two small additions, both grounded in the ARIA Authoring Practices Guide (APG) Carousel pattern. Neither needs a new IAPI primitive — we're recombining `data-wp-on--*`, `actions`, and context. The Prev/Next buttons from Section 5 are already the keyboard interface (Tab to reach them, Enter/Space to activate); our job here is to make sure that interface is labelled, undisturbed, and visible.

### Step 1 — Label the carousel region

In `src/render.php`, on the outer wrapper, add:

```php
role="region"
aria-roledescription="carousel"
aria-label="Image gallery"
```

This is the APG-recommended labelling for a carousel. No `tabindex` — the region takes focus naturally when a user tabs onto the Prev/Next buttons inside it. Screen readers now announce "Image gallery, carousel, region" when focus enters, so users know what kind of widget they're in.

### Step 2 — Pause autoplay on focus

APG Carousel: *"Automatic slide rotation stops when any element in the carousel receives keyboard focus."* Without this, a keyboard user lands on the Next button, autoplay advances under them, and the button they meant to press is now pointing at a different slide.

We need to cancel the animation frame on focus and start a fresh loop on blur. First, lift the rAF id out of the closure and into context so new actions can reach it. The Section 8 loop kept `start` and `rafId` as locals — we'll promote both to context, and pull the loop body out into a small helper so `initSlideShow` and `resumeAutoplay` can share it. In `src/view.js`, **replace** the `callbacks.initSlideShow` block from Section 8 with this version, and add the `startAutoplayLoop` helper just above the `const { state, actions } = store(...)` line:

```js
// Module-level helper so initSlideShow and resumeAutoplay share one loop.
// state and actions are available because store() returns the same object
// we passed in — they're closed over by the time this is called.
const startAutoplayLoop = ( ctx ) => {
    ctx.rafStart = null;
    const update = withScope( ( timestamp ) => {
        if ( ! ctx.rafStart ) {
            ctx.rafStart = timestamp;
        }
        if ( timestamp - ctx.rafStart > state.transitionsSpeed ) {
            actions.nextImage();
            ctx.rafStart = null;
        }
        ctx.rafId = requestAnimationFrame( update );
    } );
    ctx.rafId = requestAnimationFrame( update );
};
```

```js
initSlideShow: () => {
    const ctx = getContext();
    if ( ! ctx.autoplay ) return;
    // Was: a local rafId in Section 8. Promoted onto ctx so
    // pauseAutoplay / resumeAutoplay below can reach it.
    startAutoplayLoop( ctx );
    return () => {
        if ( ctx.rafId ) cancelAnimationFrame( ctx.rafId );
    };
},
```

Then add two actions:

```js
pauseAutoplay: () => {
    const ctx = getContext();
    if ( ctx.rafId ) {
        cancelAnimationFrame( ctx.rafId );
        ctx.rafId = null;
    }
},
resumeAutoplay: () => {
    const ctx = getContext();
    if ( ! ctx.autoplay || ctx.rafId ) return;
    startAutoplayLoop( ctx );
},
```

`state` and `actions` are in scope inside `startAutoplayLoop` because the helper closes over the same module-level `const { state, actions } = store(...)` we set up in Section 8. The helper is only ever *called* after `store()` has returned, so the references are populated by the time the loop runs.

In `src/render.php`, on the same outer wrapper, add:

```php
data-wp-on--focusin="actions.pauseAutoplay"
data-wp-on--focusout="actions.resumeAutoplay"
```

We use `focusin` / `focusout` (not `focus` / `blur`) because they bubble — focus landing on Prev/Next inside the wrapper still triggers the pause. The second half of the `resumeAutoplay` guard (`|| ctx.rafId`) prevents starting a second loop on top of an already-running one when focus moves between children.

One subtle thing about `resumeAutoplay`: it doesn't fire `nextImage()` immediately, it just starts a fresh loop with `rafStart` reset to `null`. So if a keyboard user tabs out 1.9s into a 2s cycle, they'll wait a full 2s after blur before the next advance. That's intentional — restarting the cycle on blur is more predictable than catching it up.

By the end of 9a, your wrapper opening tag in `src/render.php` should look like this:

```php
<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
    data-wp-interactive='iapi-gallery'
    data-wp-init="callbacks.initSlideShow"
    role="region"
    aria-roledescription="carousel"
    aria-label="Image gallery"
    data-wp-on--focusin="actions.pauseAutoplay"
    data-wp-on--focusout="actions.resumeAutoplay"
>
```

### Step 3 — Visible focus indicator

A focus ring is the only cue keyboard users get that they've arrived somewhere. If your theme doesn't already provide a strong one on the Prev/Next buttons, add a rule to `src/style.scss`:

```scss
.wp-block-iapi-gallery-slider .buttons button:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
}
```

**Verify:**

- Tab into the slider — focus lands on the Prev button with a visible ring.
- If autoplay was running, it pauses the moment focus enters the carousel.
- Tab through Prev → counter → Next; autoplay stays paused.
- Tab away from the slider entirely — autoplay resumes (if it was on).
- With a screen reader, focusing into the carousel announces "Image gallery, carousel, region."
- Two sliders on one page: each only pauses while *its own* children have focus.

## Sub-stage 9b — Touch

1. In `src/view.js`, add to the `actions` block:
   ```js
   onTouchStart: ( e ) => {
       const ctx = getContext();
       ctx.swipe = e.changedTouches[ 0 ].clientX;
   },
   onTouchEnd: ( e ) => {
       const { swipe } = getContext();
       if ( e.changedTouches[ 0 ].clientX < swipe ) {
           if ( ! state.noNextSlide ) actions.nextImage();
       } else if ( ! state.noPrevSlide ) {
           actions.prevImage();
       }
   },
   ```
   Note that `ctx.swipe` is *ephemeral* per-instance state — it lives in context because that's where per-instance scratch data goes; we never seed it from the server. No need to declare it anywhere ahead of time either: the first `ctx.swipe = …` write on touchstart creates the field, and onTouchEnd reads it back from the same context.
2. In `src/render.php`, on the `.slider-container` opening tag, add the two touch directives:

   ```html
   data-wp-on--touchstart="actions.onTouchStart"
   data-wp-on--touchend="actions.onTouchEnd"
   ```

   The `.slider-container` opening tag should now look like (the `data-wp-style--transform` came from Section 6):

   ```html
   <div
       class="slider-container"
       data-wp-style--transform="state.currentPos"
       data-wp-on--touchstart="actions.onTouchStart"
       data-wp-on--touchend="actions.onTouchEnd"
   >
   ```

**Verify:** in Chrome devtools touch emulation (toggle with `Cmd-Shift-M` / `Ctrl-Shift-M` inside DevTools), swiping left/right changes slides.

## Sub-stage 9c — Continuous

1. In `iapi-gallery-slider.php`, two in-place edits to the filter from Section 8. These are the most fragile edits in the workshop because they sit inside multi-line PHP that already exists — go slow.

   **a.** Add `'continuous'` to the attribute-driven half of the `array_merge`. Before/after:

   ```php
   // Before (end of Section 8):
   $context = array_merge(
       array(
           'autoplay' => $block['attrs']['autoplay'] ?? false,
           'speed'    => $block['attrs']['speed'] ?? '3',
       ),
       array(
           'currentSlide' => 1,
           'totalSlides'  => $total_slides,
       )
   );

   // After:
   $context = array_merge(
       array(
           'autoplay'   => $block['attrs']['autoplay'] ?? false,
           'continuous' => $block['attrs']['continuous'] ?? false,
           'speed'      => $block['attrs']['speed'] ?? '3',
       ),
       array(
           'currentSlide' => 1,
           'totalSlides'  => $total_slides,
       )
   );
   ```

   **b.** Update the `wp_interactivity_state()` call we added in Section 7. When continuous is on, the prev button should be enabled from first paint — so seed `noPrevSlide` as the inverse of continuous. Before/after:

   ```php
   // Before (end of Section 7, unchanged through Section 8):
   wp_interactivity_state(
       'iapi-gallery',
       array(
           'noPrevSlide' => true,
           'imageIndex'  => "{$context['currentSlide']}/{$context['totalSlides']}",
       )
   );

   // After:
   wp_interactivity_state(
       'iapi-gallery',
       array(
           'noPrevSlide' => ! $context['continuous'],
           'imageIndex'  => "{$context['currentSlide']}/{$context['totalSlides']}",
       )
   );
   ```
2. In `src/view.js`, three edits — two getters in the `state` block and two actions in the `actions` block. All four exist already; you're modifying them in place.

   **a. `state.noPrevSlide`** — replace the existing getter with this version. The added line is the first one inside the function; when continuous is on, the prev button is never disabled.

   ```js
   get noPrevSlide() {
       const ctx = getContext();
       if ( ctx.continuous ) return false;
       return ctx.currentSlide === 1;
   },
   ```

   **b. `state.noNextSlide`** — same pattern for the next button:

   ```js
   get noNextSlide() {
       const ctx = getContext();
       if ( ctx.continuous ) return false;
       return ctx.currentSlide === ctx.totalSlides;
   },
   ```

   **c. `actions.prevImage`** — wrap to the last slide when continuous is on and we're at slide 1. Replace the existing function:

   ```js
   prevImage: () => {
       const ctx = getContext();
       if ( ctx.continuous && ctx.currentSlide === 1 ) {
           ctx.currentSlide = ctx.totalSlides;
           return;
       }
       ctx.currentSlide--;
   },
   ```

   **d. `actions.nextImage`** — broaden the wrap condition from `ctx.autoplay` to `( ctx.continuous || ctx.autoplay )`. Replace the existing function:

   ```js
   nextImage: () => {
       const ctx = getContext();
       // Both autoplay and continuous wrap from the last slide to the
       // first. Manual clicks in non-continuous mode stop at the end
       // because state.noNextSlide keeps the button disabled.
       if (
           ( ctx.continuous || ctx.autoplay ) &&
           ctx.currentSlide === ctx.totalSlides
       ) {
           ctx.currentSlide = 1;
           return;
       }
       ctx.currentSlide++;
   },
   ```

   The end-of-section `code-reference/section-9/src/view.js` snapshot is the source of truth if you want to compare a full file.

**Verify:** toggle Continuous on, click prev from slide 1 → jumps to the last slide; click next from the last → jumps to 1. Buttons stay enabled. Autoplay still works alongside continuous.

## Bonus — Editor: reveal inner blocks only when the block is selected

Everything so far in Section 9 has been front-end polish driven by the Interactivity API. This bonus is the one editor-side flourish, and it deliberately uses a *different* toolset: the block editor's `@wordpress/data` store, not the IAPI. The slides never participate in IAPI directives inside the editor — they're just inner blocks — so this is a pure Block API trick.

**The problem:** in the editor our inner blocks render as a tall stack of slides (the IAPI sliding only runs on the front end). That's visually noisy and makes the block hard to place. We'd rather show only the slider chrome — the prev/next buttons and counter — and reveal the slide list *only* when someone is actually working inside the gallery. "Working inside" means the Gallery Slider block itself is selected, **or** any of its slides (or a block nested inside one of those slides) is selected.

**The tools.** The `core/block-editor` store exposes exactly the two selectors we need, and `Edit` already receives the block's `clientId`:

- `isBlockSelected( clientId )` — is *this* block the selected one.
- `hasSelectedInnerBlock( clientId, true )` — is any descendant selected. The `true` second argument makes the check **deep**, so a block nested inside a Cover slide counts, not just the direct children.

We read both with `useSelect`, OR them together, and use the result to decide whether to render the inner-blocks element.

In `src/edit.js`, add the two imports — `store as blockEditorStore` from `@wordpress/block-editor` and `useSelect` from `@wordpress/data` — accept `clientId` in the props, derive the flag, and gate the inner-blocks `<div>` on it. The full file:

```js
/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Properties passed to the function.
 *
 * @return {Element} Element to render.
 */
export default function Edit( {
	attributes: { continuous, autoplay, speed },
	setAttributes,
	clientId,
} ) {
	// True when the gallery block itself is selected, or any of its
	// descendants (deep) are selected. The `true` makes hasSelectedInnerBlock
	// reach blocks nested inside the slides, not just the direct children.
	const showInnerBlocks = useSelect(
		( select ) => {
			const { isBlockSelected, hasSelectedInnerBlock } =
				select( blockEditorStore );
			return (
				isBlockSelected( clientId ) ||
				hasSelectedInnerBlock( clientId, true )
			);
		},
		[ clientId ]
	);

	const blockProps = useBlockProps();
	const innerBlockProps = useInnerBlocksProps(
		{ className: 'slider-container' },
		{ allowedBlocks: [ 'core/cover', 'core/image', 'core/media-text' ] }
	);
	return (
		<div { ...blockProps }>
			{ showInnerBlocks && <div { ...innerBlockProps }></div> }
			<div className="buttons">
				<button aria-label="go to previous slide">&lt;</button>
				<p data-wp-text="state.imageIndex">1/10</p>
				<button aria-label="go to next slide">&gt;</button>
			</div>
			<InspectorControls>
				<PanelBody title={ __( 'Slider Controls' ) }>
					<ToggleControl
						label={ __( 'Continuous' ) }
						help={ __(
							'If enabled, the slider will loop back to the first slide after the last slide.'
						) }
						checked={ continuous }
						onChange={ () =>
							setAttributes( { continuous: ! continuous } )
						}
					/>
					<ToggleControl
						label={ __( 'Autoplay' ) }
						help={ __( 'Set the slideshow to play automatically.' ) }
						checked={ autoplay }
						onChange={ () =>
							setAttributes( { autoplay: ! autoplay } )
						}
					/>
					{ autoplay && (
						<NumberControl
							label={ __( 'Slide Duration' ) }
							help={ __(
								'The duration of each slide in seconds.'
							) }
							min={ 1 }
							max={ 10 }
							value={ speed }
							onChange={ ( newSpeed ) =>
								setAttributes( { speed: newSpeed } )
							}
						/>
					) }
				</PanelBody>
			</InspectorControls>
		</div>
	);
}
```

Two things worth calling out:

- **`useInnerBlocksProps` is still called unconditionally.** Only the *element* it returns is gated behind `showInnerBlocks`. Hooks must run on every render, so never move the hook call itself inside a condition — gate the JSX, not the hook.
- **This unmounts the slides when nothing is selected.** The block *data* is untouched (it lives in the editor store, not the rendered tree), so nothing is lost — the slides just aren't in the DOM while hidden. If you'd rather keep them mounted and only hide them visually (so layout stays stable), swap the gated render for `<div { ...innerBlockProps } hidden={ ! showInnerBlocks }></div>` instead.

**Verify:**

- Click somewhere else on the canvas so the gallery is deselected → only the prev/counter/next chrome shows; the slide stack is gone.
- Click the Gallery Slider block → the slides reappear.
- Click into a single slide (or a block nested inside a Cover slide) → the slides stay visible because the descendant is selected.
- Click fully outside the block → the slides collapse away again.

Rebuild (`npm run start` should pick it up automatically) and the front end is completely unaffected — this only changes the editor canvas.

## Code reference

End-of-section snapshot lives in `code-reference/section-9/`. The `src/edit.js` in that snapshot includes the editor bonus above — if you skipped the bonus, ignore the `showInnerBlocks`/`useSelect` additions there.

## Wrap-up

This is the finish line. The slider is complete: server-rendered with directives, navigable by buttons, keyboard, touch, and screen reader, optionally autoplaying (and pausing politely for keyboard users), optionally continuous. The interactive layer is roughly 120 lines of `view.js` and a ~50-line render filter — small for what it does.

→ Return to [README](../README.md).
