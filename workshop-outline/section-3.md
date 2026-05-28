# Section 3 — Editor Controls

**Type:** coding

## Goal

Build `src/edit.js` from scratch so the block has a sensible editor preview and the three Inspector controls that drive its attributes (`continuous`, `autoplay`, `speed`). By the end of this section, inserting the Gallery Slider in a post shows the slider's editor preview, restricts the allowed inner blocks to Image / Cover / Media & Text, and exposes a "Slider Controls" panel in the Inspector sidebar.

This section is pure block editor — no Interactivity API yet. We're setting up the editor side so the IAPI work in Sections 5–9 has attributes to read from.

## Concepts introduced

- `useBlockProps` — wires the wrapper `<div>` to WordPress so the editor recognizes it as a block.
- `useInnerBlocksProps` with `allowedBlocks` — embeds an inner-block area and constrains what can go inside.
- `InspectorControls` + `PanelBody` — the sidebar slot and grouping for block settings.
- `ToggleControl` — boolean attribute UI.
- `__experimentalNumberControl as NumberControl` — numeric attribute UI; the experimental import is the current public path for this control.
- Conditional rendering of controls based on other attribute values (Slide Duration only when Autoplay is on).
- `attributes` and `setAttributes` — how the edit function reads and writes block attributes declared in `block.json`.

## Steps

1. Open `src/edit.js`. We're starting from a near-empty stub; replace its contents.
2. Add the imports we'll need:
   ```js
   import {
       useBlockProps,
       useInnerBlocksProps,
       InspectorControls,
   } from '@wordpress/block-editor';
   import {
       PanelBody,
       ToggleControl,
       __experimentalNumberControl as NumberControl,
   } from '@wordpress/components';
   import { __ } from '@wordpress/i18n';
   ```
3. Export the `Edit` component, destructuring `attributes` and `setAttributes`:
   ```js
   export default function Edit( {
       attributes: { continuous, autoplay, speed },
       setAttributes,
   } ) {
       const blockProps = useBlockProps();
       const innerBlockProps = useInnerBlocksProps(
           { className: 'slider-container' },
           { allowedBlocks: [ 'core/cover', 'core/image', 'core/media-text' ] }
       );
       return (
           <div { ...blockProps }>
               <div { ...innerBlockProps }></div>
               <div className="buttons">
                   <button aria-label="go to previous slide">&lt;</button>
                   <p data-wp-text="state.imageIndex">1/3</p>
                   <button aria-label="go to next slide">&gt;</button>
               </div>
           </div>
       );
   }
   ```
   The `data-wp-text` on the counter is the first Interactivity directive we're seeing in the workshop — a special HTML attribute (always prefixed `data-wp-*`) that binds a piece of the DOM to a JavaScript store at runtime. It doesn't execute in the editor (IAPI only runs on the front end), so the literal "1/3" is what we see here. We mirror the front-end markup in the editor preview for visual parity. Section 4 covers directives in depth; here we're just placing one we'll need later.

   Note the `aria-label` on each button. Icon-only buttons (`<` and `>`) have no readable name for screen readers without it. We're adding the labels here as we build the markup; Section 9 comes back to accessibility more broadly (labelling the carousel region, pausing autoplay on focus, a visible focus ring).
4. Add the `InspectorControls` block inside the wrapper, just before the closing `</div>`:
   ```jsx
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
                   help={ __( 'The duration of each slide in seconds.' ) }
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
   ```
5. If we haven't already, run `npm run start`. Reload the editor.

## Verification

- Inserting the **Gallery Slider** block shows a small editor preview with the prev/next buttons and a "1/3" counter.
- Inside the slider, the inserter only offers Image, Cover, and Media & Text — nothing else.
- The Inspector sidebar shows a "Slider Controls" panel with **Continuous** and **Autoplay** toggles.
- Toggling **Autoplay** on reveals a **Slide Duration** number control; toggling it off hides it again.
- Saving and reopening the post preserves all three attribute values.

## Code reference

End-of-section snapshot lives in `code-reference/section-3/`.

## What's Next

→ [Section 4 — Interactivity API Primer](./section-4.md)
