# Recreo — browser-only booking demo

A React 19 + TypeScript + Vite website for Recreo Development and Therapy Center, using variant A of the supplied blue-and-white reference design. No backend or accounts. The active design is a single scrolling page, with current refinements focused on desktop.

## Run locally

Node.js 24.21.0 (pinned in `.node-version`) and npm are required.

```sh
npm ci
npm run dev
```

Open the local address Vite prints. For a production build and static preview:

```sh
npm run build
npm run preview -- --port 4173
```

The preview serves `dist/` at http://127.0.0.1:4173/. It is a local static file server, not an application backend. Stop it with Ctrl+C.

```sh
npm test
TZ=America/New_York npm test
npm run typecheck
npm run lint
npm run format:check
```

`npm run format` formats application source and documentation. Vendored beUI files are excluded from lint because they preserve the library’s source conventions; they are included in strict TypeScript compilation.

## Render deployment

Source: [Joshclxx/Clinical-Website](https://github.com/Joshclxx/Clinical-Website), branch `main`.

Deploy the repository as a **Static Site** in **My Workspace**. The connected Render plugin manages service configuration directly; this single static frontend does not require a Blueprint.

| Setting           | Value                                                                      |
| ----------------- | -------------------------------------------------------------------------- |
| Root directory    | Repository root                                                            |
| Build command     | `npm ci --include=dev && npm run build`                                    |
| Publish directory | `dist`                                                                     |
| Build environment | `SKIP_INSTALL_DEPS=true` (dependency installation is in the build command) |
| Node version      | `24.21.0` from `.node-version`                                             |
| Auto deploy       | On commit to `main`                                                        |

No start command, port binding, database, application environment variables, or secrets are needed. Render serves the compiled assets over HTTPS. Navigation uses hash anchors such as `/#book` and `/#ticket`, so no path rewrite is required. A refreshed `/#ticket` shows the empty-ticket state because demo records exist only in browser memory.

`dist/`, dependencies, local screenshots, scratch files, environment files, and credentials are excluded from Git. The archived prototypes remain source references and are not included in the production build.

## Experiences

The implemented site is a single scrolling page: Home → About → Services → Your visit → Visit planner → Contact → Footer.

- Navigation stays in its original hero position at the top. Once the header leaves the viewport, the same navigation becomes a centered floating bar. Returning to the top restores its original position.
- Three service cards select a sample session and scroll to the embedded visit planner immediately above Contact.
- `#book` points to that planner: session → date/time → fictional details → review → generate a booking reference ticket.
- `#ticket` displays the most recent demo ticket in the same section. The rest of the homepage remains present. **Plan another visit** returns to the inline planner. **Save or print ticket** opens the browser print dialog; choose **Save as PDF** to keep a copy. Print styles show only the ticket.

“My appointments” and its management page are removed. There is no appointment history, rescheduling, cancellation, or reset screen. Refresh clears all records, drafts, and tickets; a refreshed `#ticket` anchor offers the visit planner. Legacy `#appointments` URLs retain the homepage.

Hash anchors work on ordinary static hosting without a route fallback. The build uses relative assets and can be served from a subdirectory. Serve over HTTP; opening `dist/index.html` as a `file://` URL is not supported by browser module security.

The standalone prototypes in `src/prototypes/` are archived local references only. The active implementation is the React application. The current visual improvements use its existing assets and component library.

## Simulation contract

| Setting                  | Value and basis                                                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Clinic identity and city | Recreo Development and Therapy Center, Cabanatuan City; official Facebook metadata                                                   |
| Office hours             | Mon–Fri 09:00–17:00, by appointment only; official Facebook metadata                                                                 |
| Timezone                 | Asia/Manila, UTC+08:00; derived from verified Cabanatuan City location, not browser timezone                                         |
| Service options          | Introductory consultation 45 min, Development session 60 min, Follow-up conversation 30 min; all **sample offerings and durations**  |
| Slot interval            | 30 minutes; demo assumption                                                                                                          |
| Horizon                  | Today plus the next 27 clinic calendar dates (28 days inclusive); demo assumption                                                    |
| Conflicts                | Every sample service shares one internal `demo-clinic-resource`; no real provider assigned                                           |
| Unavailable starts       | 12:00, 12:30, and Tuesday 10:00; fixed demo start-time exclusions, not verified breaks                                               |
| Ticket-generation delay  | 650 ms, local timer only                                                                                                             |
| Persistence              | React state and refs only. Refresh clears all records, drafts, and tickets; navigating to another section cancels pending generation |

Past starts and sessions extending beyond 17:00 are rejected. Tickets generated during the same page session reserve their simulated time, so later bookings cannot overlap across services. Back-to-back visits are allowed. Current time is checked again before a ticket is generated. The scheduling module retains its tested reschedule/cancel operations, but the application no longer exposes those management actions.

The pure scheduling module accepts `now` explicitly. Its small interface centralizes availability, validation, and transitions for both booking and rescheduling. There is no provider picker because no provider identities or eligibility rules were verified. The single-resource assumption is visible in the UI.

## Maintain and review

- `src/content.ts`: verified business copy, sample services, FAQs.
- `src/scheduling.ts`: clinic time conversion, availability and atomic transitions.
- `src/App.tsx`: in-memory booking records, latest-ticket state, navigation, synchronous submission lock, and cancellable timers.
- `src/Booking.tsx`, `src/BookingTicket.tsx`: visit planner and printable reference ticket.
- `src/components/beui/`, `src/lib/`: source copied from the official beUI registry. Buttons, fields, cards, and FAQ are beUI; native HTML dialog supplies the modal focus/inert behavior.
- `src/styles.css`: shared blue theme, visit planner, printable booking ticket, and dialog styles.
- `src/reference-home.css`: original implemented homepage styling.
- `src/one-page.css`: current hero, floating navigation, service cards, visit guide, inline booking, responsive refinements, and ticket-only print styling.
- `src/components/SiteHeader.tsx`: original-position / floating navigation, mobile menu, and latest-ticket shortcut.
- `tests/scheduling.test.ts`: deterministic behavior tests.
- `ASSETS.md`: references, licenses, original image-generation prompt, and missing branding information.
- `QA.md`: actual verification and screenshots.

There was no existing app, manifest, ancestor PROJECT_RULES.md, or local coding-standard guide. Existing `improved-medical-website-prompt.md` was preserved. Strict TypeScript and the installed universal TypeScript skill baseline govern new application code. Large view functions remain cohesive screen renderings; scheduling, content, modal behavior, and slot selection are separated where shared behavior warrants it.

## Frontend and data boundary

All runtime resources are local. No fetch calls, APIs, databases, storage, analytics, messaging, payments, or form submission exist in application source. The production HTML has a Content Security Policy allowing only same-origin scripts/styles/fonts/images/connections, with `form-action 'none'`. It blocks external embedded resources and submissions. Inline style attributes are allowed for beUI/Motion. Ordinary Facebook links open only on user action and contain no entered values.

The demo must use fictional data only. Refresh clears state rather than restoring it. Do not use this as a real appointment intake system.

## Remaining client information

Actual service catalogue and descriptions, service durations, provider identities/eligibility, street address, phone/email, background/care approach, authentic clinic/team photographs, current operational confirmation, and permission to use the downloaded logo in a published site. The existing authentic logo is preserved without recoloring or redesign. There is **no unresolved beUI dependency**: its public React library was verified and integrated. This is ready for a clearly disclosed **demo walkthrough**, pending the verification limitations in QA.md; it is not approved as a finished clinic-specific public site.

## Earlier implementation notes

The dated notes below record earlier iterations. Current routing and ticket behavior are described above.

### Presentation copy update — 20 October 2026

At the user’s request, the marketing pages now use clinic-facing copy and no sitewide demo banner. The utility bar shows verified location and office hours, navigation says “My appointments,” and FAQs cover appointment enquiries, hours, location, and service selection. Unverified session options retain one restrained disclosure below the cards. Generated building-block artwork is decorative; its provenance is recorded in ASSETS.md rather than a visible image badge. Booking and appointment screens retain a short preview/session notice, the fictional-input warning, and the explicit no-real-appointment confirmation. All scheduling and data-handling behavior remains unchanged.

## Standalone reference design

The requested blue-and-white design is available separately as [`src/prototypes/recreo-reference.prototype.html`](src/prototypes/recreo-reference.prototype.html). Double-click the file; all fonts, styles, scripts and images are embedded. Or run `npm run prototype` and open `http://127.0.0.1:4180/recreo-reference.prototype.html?variant=A`. Layout A follows the supplied visual reference; use the small comparison control for B/C or `&presentation=1` for a clean presentation. The original React implementation is preserved. See `src/prototypes/README.md` for scope, source assets, and the decision record.

## Variant A implemented — 20 October 2026

The main React website now follows prototype A. Its homepage uses the same split hero, portrait, introduction, service mosaic, visit guide, contact section, and footer. Existing service data, session state, scheduling module, booking steps, rescheduling, cancellation, and reset remain in use; the prototype's separate booking code was not copied. Shared UI colors now follow the blue/lavender design. Comparison controls are confined to the unchanged prototype.

The standalone HTML remains a portable design reference. The main application's production output is `dist/`, served over HTTP as described above. This implementation request does not establish clinic-owner approval of visuals/content or authorize deployment. Current services and imagery retain their existing provenance and disclosure limits. See the latest QA.md section and `output/variant-a/` for implementation evidence.
