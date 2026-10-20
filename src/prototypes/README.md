# Recreo reference-layout prototype

Question: how does the supplied blue-and-white medical design translate to Recreo's development and therapy website?

**Primary artifact:** `recreo-reference.prototype.html`. This is a single standalone HTML file with embedded CSS, JavaScript, font, logo and images. Double-click it to open in a browser. No installation, build, internet, external asset requests, or React runtime is required.

For the local browser preview:

```sh
npm run prototype
```

Open http://127.0.0.1:4180/recreo-reference.prototype.html?variant=A.

## Layouts

- **A — Reference composition (default):** split white/cobalt hero, large black headline, overlapping portrait, floating labels, compact factual strip, centered introduction, lavender service mosaic, split visit section.
- **B — Centered story:** centered introductory hierarchy, panoramic blue stage, facts arranged beside the portrait, larger stacked services.
- **C — Editorial:** shorter hero with action on the left; introduction beside numbered service rows instead of a card mosaic.

Use the floating previous/next controls or left/right arrow keys. The URL's `variant` parameter makes the choice reload-stable; entered details never enter the URL. The switcher shows the full relevant design state: selected key, name, hero structure, and service structure. Arrow keys inside fields and open dialogs are left alone.

Append `&presentation=1` to hide the comparison controls. Comparison controls also hide on non-local hosted origins. This prototype is outside the production Vite entry points and is not emitted as a production page.

## Interaction scope

Local, in-memory booking: session → date/time → fictional details → review → confirmation. Includes sample details, required-field validation, commit-time availability checks, one shared scheduling resource, fixed weekday exclusions, conflict checks, duplicate-click protection, My appointments, rescheduling, cancellation and reset. Modal close/Escape cancels pending submissions. Reload discards all state. These interactions are exploratory prototype code, not a replacement for the tested React implementation.

The prototype follows the already documented Manila schedule assumptions and sample durations. The calendar and new portrait do not establish actual services, real availability, staff identity, credentials or outcomes. The brief booking disclosure and explicit no-real-appointment confirmation remain.

## Reference and assets

The user-supplied image is the visual reference, not an image embedded as the website. The design follows its composition, blue/lavender palette, rounded surfaces, typography hierarchy, cutout treatment and service mosaic. No invented statistics, credentials or testimonials were copied.

The authentic original Recreo logo is embedded unchanged. DM Sans and the Lucide SVG paths use their included local licenses. The previously generated wooden-block image is reused. A new generated fictional care portrait is visibly labelled “Illustrative portrait · not clinic staff.” Original asset: `public/assets/illustrative-care-portrait.png`. Generation used the built-in imagegen tool with transparency enabled, with this prompt:

> Use case: photorealistic-natural. Asset type: transparent portrait cutout for a healthcare website design prototype. A fictional friendly adult Filipina woman in her early thirties, shoulder-length dark brown hair, warm natural smile, looking directly toward camera, wearing a crisp white clinical coat over a pale sky blue blouse, arms comfortably folded, portrait from top of head to upper hips, entire head and elbows fully in frame. Refined natural studio photography, realistic proportions and skin texture, soft even light, clean careful hair edges. Centered straight-on stance. Fully transparent background, no environment, no cast shadow, no lettering, no badges, no name tag, no logos, no stethoscope, no medical equipment. She is an illustrative fictional person, not a portrait of any real clinician. Output portrait aspect ratio 2:3. The isolated cutout will overlap white and cobalt-blue website panels.

## Decision record

The user selected the supplied reference as the intended visual direction; A is the closest interpretation and default. B/C are comparison aids required by the prototype workflow. No new preference beyond that has been inferred. No changes were promoted into the React UI. The earlier instruction forbidding Git-state changes remains in effect, so the prototype is captured as this local file and documentation rather than committed to a throwaway branch. No implementation issue exists to update.

The latest standalone-HTML request intentionally overrides the React/beUI runtime requirement for this isolated visual prototype. The original React/beUI application remains intact. The prototype uses native HTML controls and has no third-party runtime. If promoted, its design should be implemented using the existing application components and tested scheduling module.

No automated tests were added for throwaway prototype code. Browser and syntax check results are recorded in the project QA.md. Do not treat the prototype's lighter verification as equivalent to the original implementation's test coverage.

## Promotion into the main website — 20 October 2026

After the planning session, the user requested implementation of variant A. That design is now implemented in the main React website through Home.tsx, components/SiteHeader.tsx, and reference-home.css. The application continues to use its existing tested scheduling module and session state. This standalone HTML is preserved unchanged as the portable reference; the earlier isolation statements describe the original prototype phase. This promotion is implementation authorization, not clinic-owner sign-off or permission to publish.
