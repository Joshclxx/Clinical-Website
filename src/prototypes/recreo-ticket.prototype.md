# Recreo visit-to-ticket prototype

Question: how should the supplied official Recreo design guide a visitor from the homepage to a booking reference ticket, replacing “My appointments”?

Open **recreo-ticket.prototype.html** directly in a browser. It is a single self-contained HTML file with embedded font, reference imagery, CSS, and JavaScript. It needs no internet, installation, or build. Alternatively, run `npm run prototype` and open:

http://127.0.0.1:4180/recreo-ticket.prototype.html?variant=A

## Compare the layouts

- **A — Calm glass:** closest to the supplied calm homepage and planner. Split hero, calendar alongside a visit preview, and a large reference ticket.
- **B — Clear & focused:** white surfaces, an inset hero, a wide calendar followed by a horizontal summary, and a centered ticket.
- **C — Guided journey:** centered introductory hero, stacked information links, a vertical booking step rail on desktop, and ticket download actions in a sidebar.

The bottom comparison control and left/right arrow keys switch layouts and update `?variant=A|B|C`. Input fields retain their arrow-key behavior. “View state” exposes the current draft, screen, layout, and generated ticket. Add `&presentation=1` to hide the prototype controls. They are also hidden on hosted non-local origins. This file is outside the production Vite entry points.

## Walkthrough

1. Select **Book a visit** and continue with the illustrative demo consultation.
2. Pick a weekday and time. The sample calendar starts in October 2026 with October 21, 10:00 AM selected, matching the references. Earlier dates and weekends are disabled. This is a fixed design fixture, not live availability.
3. Use fictional names, or select **Use fictional sample details**, and acknowledge the demo notice.
4. Review or edit the details, then select **Generate ticket**.
5. Download a real single-page PDF or open the browser’s print dialog. The PDF is a simple text layout; the print stylesheet preserves the visual HTML ticket. The PDF uses Helvetica and transliterates names to ASCII; use Print / Save as PDF for full Unicode spelling.
6. **Back to Home** returns to the homepage. **Your ticket** reopens the last ticket during this page session. There is no appointment history, account, reschedule, or cancellation screen. Refresh clears all entered details and the ticket.

## Reference use and scope

The five user-supplied images guide the homepage, glass surfaces, calendar, progress indicator, reference number, ticket fields, contact block, demo status, and save actions. They are used only as visual references. No attached screenshot or screenshot crop is embedded in the prototype. Headings, navigation, facts, forms, calendar, ticket, and actions are actual HTML elements.

The hero and About section use newly generated room photographs, embedded for offline use. Original PNG assets and exact generation prompts are in `output/imagegen/recreo-room-assets.md`. The original project asset `public/assets/recreo-original-logo.jpg` supplies the logo mark. Layout A uses a gradient across the full hero surface, and the visible image captions have been removed. The factual strip below the hero appears once.

The contact details follow the supplied references and have not been independently verified in this task. DM Sans is embedded from the existing project package; its license is in `public/assets/dm-sans-LICENSE.txt`. Inline icons follow the project's existing Lucide style.

This is throwaway design code. No changes were made to the React application, Git state, or external systems. No winning variant has been selected or promoted. The local HTML and this guide capture the design question; no issue or authorized throwaway Git branch was supplied.
