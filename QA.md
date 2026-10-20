# Verification evidence

Date: 20 October 2026 (Asia/Manila). Production `dist/` served through Vite's static preview at `127.0.0.1:4173`. Browser interaction and screenshots used the available CUA/Playwright browser-control equivalent. Only fictional data was entered. No publication, deployment, Git changes, or clinic contact.

Statuses below distinguish **passed**, **failed**, **blocked**, and **not run**. A source inspection or deterministic test is identified separately from a browser check.

## Commands

| Command                          | Result                                                                                                                           |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `npm install`                    | Passed. Initial test-tool dependency advisories were resolved by updating to Vitest 5.0.5.                                       |
| `npm test`                       | Passed: 12 deterministic tests in one file.                                                                                      |
| `TZ=America/New_York npm test`   | Passed: same 12 tests with a timezone different from the clinic.                                                                 |
| `npm run typecheck`              | Passed: strict TypeScript, including copied beUI source.                                                                         |
| `npm run lint`                   | Passed: application, tests, and configuration; vendored beUI excluded.                                                           |
| `npm run format:check`           | Passed: all matched source and documentation files conform to Prettier.                                                          |
| `npm run build`                  | Passed: static HTML/CSS/JS, bundled font files, and local image/license assets.                                                  |
| `npm audit`                      | Passed after patching: zero vulnerabilities.                                                                                     |
| `npm run preview -- --port 4173` | Passed using local-server sandbox permission; initial sandbox-only attempt was blocked by EPERM, then permitted retry succeeded. |

## Navigation and content

| Check                         | Status / actual evidence                                                                                                                                                                                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Desktop and mobile navigation | Passed in browser: home/section navigation, booking and appointment pages. Mobile menu opens, closes on link selection, focuses its first link, and Escape returns focus to the trigger.                                                                                 |
| Service CTA preselection      | Passed in browser for Development session; all CTA implementations share the service-ID callback. Full three-CTA repetition is in final completion receipt.                                                                                                              |
| Homepage and booking CTAs     | Passed in browser: Book an Appointment, Book a visit, new/demo visit links, review-to-appointments link, home links, services anchor.                                                                                                                                    |
| FAQ                           | Passed in browser: Enter opens/closes an item and aria-expanded changes. Source inspected for aria-controls, labelled content, inert closed panels and reduced-motion support.                                                                                           |
| Filters/no-results            | Not run: no filter exists; three sample services do not warrant one.                                                                                                                                                                                                     |
| Social/contact links          | Passed URL inspection: both point to the verified canonical official Facebook page, open a new tab, and contain no booking fields. Full Facebook page rendering remained blocked/blank; metadata and logo were accessible. No phone, email, or map address was invented. |
| Branding                      | Passed for original page logo, name, city and office hours from official metadata. Remaining client copy and photographs are explicitly unverified.                                                                                                                      |

## Booking and scheduling

| Check                                   | Status / actual evidence                                                                                                                                                                                                                                                                                                                 |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Valid completion                        | Passed in production browser: session, time, sample details, review, local loading and exact required confirmation message.                                                                                                                                                                                                              |
| Missing details / invalid email         | Passed in browser: required field messages, aria-invalid fields, error summary and focus on first invalid field. Invalid email stayed at details step.                                                                                                                                                                                   |
| Missing time                            | Passed in browser: Continue without time shows an actionable alert.                                                                                                                                                                                                                                                                      |
| Backward editing and compatible data    | Passed in browser: review → date/time → details retained a long fictional name, email and phone. Source shares one draft across internal navigation.                                                                                                                                                                                     |
| Changed date clears time                | Passed in browser: changing to another date clears the old time and announces why. Other details retained.                                                                                                                                                                                                                               |
| Changed service compatibility           | Passed source inspection and scheduling tests: the service control retains only a still-available time for the new duration. End-of-day compatibility verified through deterministic rules.                                                                                                                                              |
| No availability                         | Passed in browser: Saturday 24 October showed no slots and an explicit choose-another-weekday message.                                                                                                                                                                                                                                   |
| Native date and quick choices           | Passed in browser: keyboard ArrowUp changed the native date, re-evaluated slots, and produced no availability beyond the horizon. Quick date buttons work with Enter and pointer. The browser tool's direct `fill()` changed native date display without emitting the React change; keyboard/quick-choice verification was used instead. |
| Past dates / past starts / horizon      | Passed deterministic tests, including exact start-time rejection and invalid dates. Native date min/max and disabled time buttons are present. No real-time browser clock manipulation was available.                                                                                                                                    |
| Slot expires before commit              | Passed deterministic transition test with injected current time advanced past the start. Browser clock-expiry scenario not run.                                                                                                                                                                                                          |
| Duplicate confirmation clicks           | Passed in browser: double-click produced one `DEMO-0001` record; synchronous timer lock plus duplicate-ID rejection. Reschedule double-click also produced one replacement.                                                                                                                                                              |
| Closing boundary                        | Passed deterministic tests: 30-minute start at 16:30 and 60-minute start at 16:00 accepted; 45-minute start at 16:30 and start at 17:00 rejected.                                                                                                                                                                                        |
| Cross-service overlaps and back-to-back | Passed deterministic tests; browser also showed 09:00 and 09:30 disabled by an existing 45-minute visit. Back-to-back tested deterministically.                                                                                                                                                                                          |
| Provider eligibility / Any provider     | Not run: intentionally absent. One visibly disclosed simulated clinic resource serves all sample services; no verified clinician identities or eligibility exist.                                                                                                                                                                        |
| Browser timezone different from clinic  | Passed deterministic timezone run (`America/New_York`). Actual browser timezone override is blocked by available browser-control capabilities; not claimed as performed.                                                                                                                                                                 |

## Appointments and transitions

| Check                                 | Status / actual evidence                                                                                                                                                       |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Appointment details                   | Passed in browser: reference, sample service, resource, date/time/timezone, fictional guest/contact and optional fields. Long fictional name wraps.                            |
| Reschedule success                    | Passed in browser: original Thu 22 Oct 09:00 → reviewed 10:30, success notice, updated single record, rescheduled marker.                                                      |
| Abandoned reschedule                  | Passed in browser: selected a different time then Escape; original 09:00 remained. Focus returned to Reschedule.                                                               |
| Failed reschedule preserves original  | Passed deterministic tests: conflicting replacement and service changes rejected with caller state unchanged. Browser failure caused by a live clock change not run.           |
| Exclude original from conflict checks | Passed deterministic tests and browser dialog: original slot remains selectable for the same appointment, unchanged time cannot be saved.                                      |
| Cancellation confirmation             | Passed in browser: Keep appointment preserves it; Yes, cancel visit retains cancelled record and removes change actions.                                                       |
| Repeated cancellation                 | Passed deterministic test: idempotent, unchanged record count/status. UI no longer exposes cancel for cancelled records.                                                       |
| Released slots                        | Passed in browser after reschedule/cancel: both original 09:00 and replacement 10:30 became enabled for a new visit. Also tested deterministically.                            |
| Reset                                 | Passed in browser: confirmed reset restores initial draft and empties records. Reset immediately after Confirm clears the pending timer; no record reappeared after the delay. |
| Internal navigation keeps state       | Passed in browser for appointment navigation and fictional draft details.                                                                                                      |
| Refresh clears records                | Source inspection passed; final browser receipt below records a populated-to-empty reload.                                                                                     |
| Past/cancelled actions                | Passed source/deterministic tests for past records; browser verified cancelled record has no reschedule/cancel actions.                                                        |

## Accessibility and visual QA

| Check                                           | Status / actual evidence                                                                                                                                                                                                            |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Required widths                                 | Passed DOM overflow checks for Home, Booking date/time, and expanded Appointment details at 360, 390, 768, 1024 and 1440 CSS px. `scrollWidth === clientWidth` at every check. Representative mobile/desktop screenshots inspected. |
| Mobile decoration overlap                       | Failed initially: decorative star crowded the headline. Fixed by moving it above the heading on mobile; revised screenshot inspected.                                                                                               |
| Persistent demo notice                          | Failed initial source review: bar scrolled away. Fixed to sticky; browser measured its top at 0 after section navigation. Touch target increased to 44 px.                                                                          |
| Contrast                                        | Secondary text colors were darkened after a token contrast inspection. Main ink #20322b/white ≈13.53:1; green #255d42/white exceeds 7:1. This is a targeted token review, not a full automated contrast audit.                      |
| Keyboard journey                                | Passed relevant production controls via Enter: quick time, Continue, sample details, review; mobile menu and FAQ. Native radio/date inputs use browser keyboard behavior. A full assistive-technology audit was not run.            |
| Focus and errors                                | Passed in browser: step heading focus, first invalid field focus, role-alert errors, status confirmations. Main navigation uses preventScroll for focus so header is retained.                                                      |
| Dialog naming / trapping / restoration / Escape | Passed in browser: native named modal has inert background; Shift+Tab remained inside; Escape abandoned reschedule and restored opener focus.                                                                                       |
| Short screen                                    | Passed browser at 390×500: modal bounds top 20/bottom 480, clientHeight 460, scrollHeight 825; controls reachable by internal scrolling.                                                                                            |
| Long text                                       | Passed expanded details with “Alexandra Demonstration With A Longer Fictional Name”; no overflow at any width.                                                                                                                      |
| Reduced motion                                  | Source verified: MotionConfig reducedMotion="user", library useReducedMotion, and CSS prefers-reduced-motion. Runtime OS-preference toggle not run; available browser capability lacks motion emulation.                            |
| Assets and console                              | Passed: all homepage images loaded; production browser logs contained no error/warning entries in inspected session.                                                                                                                |
| Full WCAG / screen reader / other browsers      | Not run. Observed keyboard/layout behavior does not establish full accessibility compliance.                                                                                                                                        |

## Frontend-only boundary

- **Passed source inspection:** no application `fetch`, XHR, sendBeacon, storage/cookie writes, telemetry, log statements, backend routes, server actions, or application integrations. Only runtime external URL in source is the official click-initiated Facebook link.
- **Passed production resource inventory:** browser-observed resources include the local JS/CSS, original logo, generated illustration, and bundled DM Sans. All observed asset URLs have the local preview origin. See `output/playwright/browser-assets.json`.
- **Passed external-source blocking journey:** production HTML CSP denies external script/font/image/style/connect sources and all native form submissions. A complete booking was repeated with this policy present. Navigation and booking use in-memory state with no external request requirement.
- **Passed DOM URL inspection:** hashes contain navigation names only; no entered booking details are encoded into links or URLs. There are no native form submissions or third-party widgets.
- **Blocked independent network trace/offline emulation:** this browser tool exposes resource inventories and console logs, but no network interception, HAR export, offline mode, or timezone emulation. A full network-level capture, OS-disconnected-browser repeat, and direct browser storage-panel inspection were not performed. The resource inventory, CSP, source inspection, and successful core journey provide the actual evidence; they are not described as a HAR or disconnected-network test.

## Screenshots

All screenshots are from the production static preview and contain fictional details only.

- `output/playwright/home-1440.png`
- `output/playwright/home-390.png`
- `output/playwright/booking-1440.png`
- `output/playwright/booking-390.png`
- `output/playwright/appointments-1440.png`
- `output/playwright/appointments-390.png`

Final evidence uses viewport captures after cosmetic corrections. Full-page browser captures produced sticky-position stitching artifacts and were replaced with settled viewport screenshots; this did not affect the live layouts. Browser screenshots were inspected, including mobile image crops, service layouts, date controls and expanded long appointment details.

## Residual limits and walkthrough gate

No known unresolved defect in the implemented booking/management flows. Clearly disclosed sample services/durations/resource and illustrative imagery remain. Actual service catalogue, providers, street address, direct contact details, clinic photographs, and published logo-use authorization are missing. beUI is verified, integrated, and builds successfully. Ready for a labelled demo walkthrough; a fully verified client-specific public site and complete accessibility/network audit remain outside the evidence obtained here.

## Final completion receipt

- **Passed:** final `npm run build` (includes strict TypeScript), `npm run lint`, `npm test` (12/12), `TZ=America/New_York npm test` (12/12), and `npm run format:check`.
- **Passed:** all three homepage service CTAs individually preselected the matching session.
- **Passed:** final appointment widths 360, 390, 768, 1024 and 1440 each had equal document scroll and client widths. Expanded details contained a long fictional name.
- **Passed:** final populated-to-empty reload: **1 appointment before reload, 0 afterward**. Evidence in `output/playwright/final-browser-checks.json`; no browser warning/error entries in that fresh final run.
- **Passed:** all six final screenshots saved and inspected after the visual corrections.
- The static preview process had stopped across the interrupted turn. The already-loaded application still completed another booking and displayed its details before the attempted reload exposed a connection refusal. The preview was restarted and the full populated-to-empty refresh check then passed. This also demonstrates that loaded booking logic does not need the preview server; it is not a substitute for a network-interception test.
- Coding standards: PASS for the configured build/lint/format checks and manual source review. No project-specific overrides were present. Runtime reduced-motion preference, screen-reader use, independent network trace, direct storage-panel inspection, and actual browser-timezone emulation remain unverified as stated above.
- Browser-control selector timing occasionally required a fresh snapshot before the next action. These were test-driver synchronization issues; the resulting visible application states were verified before recording passes.

## Presentation copy revision — 20 October 2026

The user requested realistic clinic-facing copy with less emphasis on the demonstration. This request supersedes the earlier sitewide demo-indicator and repeated demo-label requirements. The location/hours bar, navigation, homepage narrative, service descriptions, FAQs and footer now use natural clinic-facing language. Unverified sessions retain a restrained illustrative-options footnote. The decorative building-block image has an accessible provenance caption rather than a visible badge. Booking screens retain an explicit preview/session notice, fictional-input warning and the exact no-real-appointment confirmation.

- **Passed:** production build (including TypeScript), lint and format check after the copy changes.
- **Passed:** browser homepage inspection at 390 and 1440 px; mobile scroll width equals viewport width (390 px). No “demo” wording in homepage/header/utility-bar text.
- **Passed:** rewritten FAQ expands; service CTA preselects Development session; booking completes under the renamed controls; My appointments opens; Clear session confirmation empties the list.
- **Passed:** inspected production browser console has no warnings/errors.
- **Passed:** revised screenshots saved and visually inspected as `output/playwright/realistic-home-390.png` and `output/playwright/realistic-home-1440.png`. Earlier screenshots above represent the original copy.
- **Not rerun:** scheduling tests and the full earlier accessibility/network/viewport matrix; this revision changes presentation copy and utility-bar content, not scheduling or persistence rules. Earlier test results remain applicable to unchanged logic.

## Standalone reference-design prototype — 20 October 2026

The user explicitly requested the attached blue-and-white design through the prototype skill as standalone HTML. `src/prototypes/recreo-reference.prototype.html` is the deliverable; it is an isolated visual prototype, not a replacement for the React implementation. The newer request supersedes React/beUI as a runtime requirement for this artifact only. The skill's throwaway-branch capture was not performed because the user's no-Git-state instruction remains in force; the file and `src/prototypes/README.md` provide a local primary-source capture and decision record.

- **Passed:** the HTML embeds its font, authentic logo, generated portrait, and building-block illustration; no unresolved asset placeholders, remote script/style/image/font URLs, application fetch calls, or persistence dependencies. CSP disallows network connections and form submissions. It contains inline CSS/JS and data URL assets; no compilation required to run the file.
- **Passed:** extracted inline JavaScript syntax with `node --check /tmp/recreo-prototype-script.js`; project `npm run lint`; original application `npm run build` after adding the prototype. Existing React source was not replaced. No automated tests added, per prototype scope.
- **Passed:** browser loading through the static `npm run prototype` server at port 4180. All embedded images reported complete with nonzero natural widths; inspected console had zero warning/error entries.
- **Passed:** A/B/C controls changed the URL variant and rendered state labels. Presentation mode (`presentation=1`) hides the comparison bar. Layout A is the user-selected reference interpretation; B/C are alternatives, not an inferred new design choice.
- **Passed:** A overflow inspection at 360, 390, 768, 1024, 1440 CSS px; B and C at 390 and 1440. Document scroll width equalled viewport width in each check. Full B/C intermediate-width visual coverage not run.
- **Passed:** inspected desktop and mobile A screenshots, services mosaic, portrait crops and labels. The initial hero CTA/facts overlap and mobile portrait/CTA crowding were corrected. Final desktop CTA bottom 542 px / facts top 557 px; mobile portrait starts below the CTA.
- **Passed:** mobile menu opens and Escape closes; reset and modal Escape operate. Missing-time validation, sample details, review, double-click booking (one record), successful reschedule, confirmed cancellation (retained status), and confirmed reset (zero records) were exercised in the real browser.
- **Passed:** metadata and service copy preserve verified Recreo identity/location/hours; sample services carry a restrained disclosure. Generated portrait is explicitly labelled as not clinic staff. No numerical outcomes, patient statistics, credentials, names or testimonials were invented.
- **Not run:** native direct-file/double-click verification. The attempt was interrupted by user activity in Chrome, so no further native actions were sent. Self-containment was verified by source inspection and local static browser loading, not claimed as an observed `file://` run.
- **Not run:** full regression suite for the separate prototype scheduling implementation, independent network interception, screen-reader audit or cross-browser coverage. The lighter prototype checks do not inherit the React scheduling tests.

Evidence: `output/prototype/reference-desktop.png`, `reference-mobile.png`, `reference-services.png`, and `reference-presentation.png`. Design question, variants, artifact provenance, generation prompt, scope deviations, and decision record: `src/prototypes/README.md`.

## Variant A implemented in the React website — 20 October 2026

The user requested implementation after the planning-only session. Home.tsx now follows the default reference composition; SiteHeader.tsx owns the shared navigation/menu; reference-home.css scopes the homepage layout. The shared palette is blue/lavender. Existing booking and appointment components, service fixtures, and scheduling logic remain in use. No prototype scheduling code was promoted. No dependency, deployment, or Git-state changes were made.

- **Passed:** production build, including strict TypeScript; ESLint; Prettier check; existing scheduling tests (12/12). An initial build/lint check caught two unused icon imports while SVG references were being converted; replacing those remaining references with Lucide components resolved both failures.
- **Passed:** production browser inspection of the desktop/mobile hero, introduction, service mosaic, visit guide, contact section, and footer. All loaded images have nonzero natural dimensions; no warnings/errors in the inspected browser session.
- **Passed:** Home, booking date/time, and a populated appointment list at 360, 390, 768, 1024, and 1440 CSS pixels: document scroll width equals client width. Desktop/mobile full-page screenshots were saved and visually inspected.
- **Passed:** desktop hero CTA bottom approximately 544 px, facts top approximately 557 px; they remain separate. Mobile portrait begins below the hero CTA.
- **Passed:** mobile navigation opens, focuses its first link, and Escape closes it. The appointment shortcut is available on mobile. An inherited mobile selector initially hid the calendar link; the scoped display rule corrected it. Desktop hides the duplicate mobile-only appointment link.
- **Passed:** service cards retain their matching booking preselection; the Development session journey was completed with fictional sample details. Double-click confirmation resulted in one record, DEMO-0001.
- **Passed:** My appointments displays that record; rescheduling changed 9:00 AM to 10:30 AM; cancellation retained a cancelled record; confirmed Clear session emptied the list. Named native dialogs and the existing booking disclosures remain.
- **Passed source review:** no prototype variant switcher or data-variant selectors enter the main UI; no new network, storage, intake, or third-party integration behavior was introduced. Scheduling and personal-data handling were not changed.
- **Not rerun:** separate browser-timezone emulation, independent offline/network interception, full screen-reader audit, cross-browser coverage, and the complete historic edge-case browser suite. Existing deterministic scheduling tests passed; prior limitations remain. No new tests were added for presentation-only changes.

Coding standards: PASS for strict compiler, configured lint/format checks, and manual source review. No project-specific coding-standard guide was present. The existing strict compiler and linter remain the effective tool profile; vendored beUI source was left untouched. Home remains a cohesive declarative page; shared navigation was extracted to SiteHeader instead of expanding App.

Evidence: `output/variant-a/desktop.png`, `output/variant-a/mobile.png`, and `output/variant-a/hero.png`. The unchanged standalone HTML remains available for comparison. Visual/content approval by the clinic owner and final delivery packaging remain separate decisions.

## Implemented site: booking tickets replace My appointments — 20 October 2026

The React application is the active implementation. Standalone prototypes are retained only as earlier references; their layouts and room images were not promoted.

Changes: removed the appointment-management route, component, navigation links, counts, reschedule/cancel/reset UI, and obsolete page styles. The existing visit planner now creates a reference ticket at `#ticket`. The most recent ticket can be reopened during the page session. It includes the selected service, date, Philippine time, fictional patient contact details, unique reference, and an explicit unconfirmed demo status. Save or print ticket opens the browser print dialog, which supports Save as PDF. Print styles hide site navigation and supporting actions.

Checks:

- Existing 12 scheduling tests passed; the shared scheduling module was unchanged.
- Production build, TypeScript compilation, ESLint, and formatting checks passed.
- Browser walkthrough completed: current homepage → session → October 21, 2026 at 10:00 AM → sample patient → review → reference `RCR-DEMO-261021-001`.
- Ticket content matched the selected details. Desktop and 390px mobile layouts were inspected; no horizontal overflow was found.
- Returning home and choosing Your ticket from the mobile navigation reopened the same ticket.
- Refresh cleared the ticket and displayed the planner entry state. Legacy `#appointments` displayed the homepage, with no appointment-management links.
- Screenshots: `output/implemented-ticket/ticket-desktop.png`, `output/implemented-ticket/ticket-mobile.png`, and `output/implemented-ticket/home-desktop.png`.

No physical print job or PDF save was submitted during browser verification; the native print action and print stylesheet were inspected in source. No external data, account state, deployment, or Git state was changed.

## One-page desktop improvements — 20 October 2026

Implemented the annotated feedback in the current React website. Homepage navigation keeps its original position at the top, then becomes one centered floating bar after the header leaves the viewport. The floating bar uses a body portal so the hero cannot clip it. Section anchors and booking-step focus leave room below the bar.

The hero has a layered blue background, repositioned supporting copy, and a clearer icon-led office-information strip. Removed its decorative arrow and bottom-right portrait caption; the portrait's descriptive alt text remains. Services are now three consistent cards with a clear session selection action. The visit artwork card and three-step guide replace the previous duplicate portrait and scattered information grid.

Booking is embedded immediately before Contact. Service selection scrolls to and preselects the planner. Generating a ticket replaces the planner in that section, with the rest of the homepage still present. Plan another visit returns to the inline planner. Print styling hides the rest of the one-page site and floating bar when a ticket is printed.

Desktop verification at 1380 × 900:

- At the top: navigation is in its original header slot; scrolling to Services or Your visit produces one floating navigation bar, centered at x=690 in the 1380px viewport, 16px from the top. Returning to the top restores the original slot.
- Requested hero arrow and caption elements are absent.
- Three updated service cards render; selecting Development session preselected it in the planner at `#book`, positioned below the floating bar.
- Completed the inline flow using October 21, 2026, 10:00 AM and fictional sample details. Ticket `RCR-DEMO-261021-001` showed Development session and the selected schedule.
- Hero, Services, and Contact remained mounted after ticket generation. Booking precedes Contact. The document contains one h1 and no appointment-history link.
- No horizontal page overflow or browser errors/warnings were observed.
- Production build and TypeScript compilation, ESLint, formatting, and all 12 existing scheduling tests passed. Scheduling rules were unchanged.

Desktop screenshots are in `output/one-page/`: `home-desktop.png`, `services-desktop.png`, `visit-desktop.png`, `booking-desktop.png`, and `ticket-desktop.png`.

The user requested desktop focus during this work. Further mobile refinement is deferred. No physical print job or PDF save was submitted; the ticket-only print rules were inspected. No external systems, deployment, or Git state were changed.

## Desktop booking annotations — 20 October 2026

Implemented the three latest annotations in the React site: equal 40px circular header controls, the original logo immediately right of the footer wordmark, and a refined booking section. The planner now uses icon-led session choices, clearer selected and keyboard-focus states, a connected progress indicator, and a sticky desktop visit preview with separate date, time, and duration rows.

Browser verification at 1142 × 718 and 1380 × 1000 confirmed the circular control, footer logo placement, and booking presentation. Found and fixed an existing header-button callback issue that passed the click event as a service ID. Opening the planner through that button now preserves one selected session.

- Selected Development session; the preview updated to 60 minutes. Continuing without a time displayed the expected validation message.
- Completed October 21, 2026 at 10:00 AM using fictional sample details. Review and generated ticket `RCR-DEMO-261021-001` matched the choices.
- Plan another visit restored the initial selected session. One navigation bar remained mounted and no desktop horizontal overflow or browser errors/warnings were observed.
- Production build, TypeScript compilation, ESLint, formatting, and all 12 scheduling tests passed. No scheduling rules changed.
- Evidence: `output/booking-refinement/header-desktop.png`, `footer-desktop.png`, and `booking-desktop.png`.

Mobile refinement and native print/PDF submission were not performed in this pass.
