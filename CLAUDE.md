I hate unnecessary comments on my code.
Update this file with straight forward concise information as we build.
This is a one page promotional website.

# Legacy Wealth Academy: Free Community Landing Page

One-page static promo site for a free online business community (property and online business education). Goal: capture a lead, then send them to the WhatsApp community. Hosted on Cloudflare Pages.

## Non-negotiables
- No code comments. Explain wiring in chat.
- Must not read as AI-generated. Editorial, hand-crafted, specific to this brand.
- UK audience: British English (monetise, programme), GBP, `lang="en-GB"`.
- No invented facts: no fake testimonials, member counts, income figures or dates. Real testimonials and the host's own credentials/income figures are fine once the client supplies them, but nothing is invented on our side.
- No income guarantees. Disclaimer stays in the footer.
- Brand name is "Legacy Wealth Academy" everywhere. Never mention "Legacy Wealth Property" or a parent company on the site (background context only; the logo was edited to say ACADEMY).
- Full UX by default: validation, loading, error and success states, keyboard and screen-reader support, mobile first.

## Stack
- Vite + vanilla TypeScript + plain CSS. No framework, no animation library.
- Fonts via fontsource, Latin only: Cormorant Garamond (display, 500/600/600 italic) and Hanken Grotesk Variable (body).
- Commands: `npm run dev`, `npm run build` (typecheck + build to `dist`), `npm run preview`.
- Cloudflare Pages: build command `npm run build`, output directory `dist`.
- `public/_headers` sets security headers and caching.
- Not its own git repo yet. The enclosing git root is `/Users/user`, so run `git init` here before any commit.

## Files
- `config.ts`: single source for `WHATSAPP_GROUP_LINK`, `WEB_LINK`, `TUTOR_NAME`, `EMAIL`, `TEL`, `TEL_2`, `INSTAGRAM_LINK`, `BRAND_NAME`, `WEB3FORM_KEY`, `VIDEO_VERSION`. Never hardcode these elsewhere.
- `vite.config.ts`: plugin replaces `{{TOKEN}}` placeholders in `index.html` from `config.ts` (BRAND_NAME, TUTOR_NAME, EMAIL, TEL, TEL_HREF, TEL_2, TEL_2_HREF, WEB_LINK, WHATSAPP_LINK, INSTAGRAM_LINK, INTRO_SRC, POSTER_SRC). New config values used in HTML need a token added there.
- `index.html`: all markup, including the SVG icon sprite and card illustrations.
- `src/main.ts` wires `reveal.ts` (scroll reveals), `nav.ts` (header state, mobile menu, active link), `video.ts` (intro video), `form.ts` (registration).
- `src/styles/`: `base.css` (tokens, buttons, header, footer), `sections.css`, `form.css`, `motion.css`.
- `source/`: originals and working files, not deployed. Uncropped host photos, original logo, downloaded stock JPEGs, `JosefinSans.ttf`.
- `public/img/`: optimised WebP for the site. `public/logo.png` is the edited logo. Favicons and `apple-touch-icon.png` are cut from the logo icon. `public/img/og.jpg` is the 1200x630 share image.

## Assets
- Host photos: watermark cropped out (bottom 120px removed). `host.webp` (white blazer) is used in both the hero arch's poster frame and `#host`. `host-2.webp` (black pleated outfit) is unused since the `#host` photo swapped to `host.webp` &mdash; still in `public/img/`, safe to delete if it stays unused.
- Logo: tagline changed from PROPERTY to ACADEMY (Josefin Sans Light, sampled gold, same width). Raster 600x174, dark purple text, so only use on light backgrounds. An SVG would be better.
- `public/intro.mp4`: portrait, ~74s. Source footage (~70s, client-provided, has its own burned-in TikTok-style captions) is bookended with a generated brand bumper (1.3s, logo on plum) and a brand outro card (3s, logo, gold hairline, "Join the Free Community"). Built with ffmpeg-static: `scale=720:1280`, `libx264 -crf 27 -preset slow`, `+faststart`; bumper/outro text rendered via a throwaway Playwright screenshot of styled HTML (site fonts/colours) since the static ffmpeg build has no `drawtext`. Never autoplay. Poster is a frame from partway through the source content (`intro-poster.webp`, picked for a clean smile with minimal caption overlap) &mdash; re-pick it if the source video changes again, since the bumper shifts the timeline.
- `/intro.mp4` and `/img/intro-poster.webp` are cached 30 days at the edge (`public/_headers`) and both live at a fixed, unhashed path, so overwriting the file leaves some visitors on the old cached copy until their cache (or Cloudflare's) expires. The HTML never points at those raw paths &mdash; it uses `{{INTRO_SRC}}`/`{{POSTER_SRC}}`, which append `?v={{VIDEO_VERSION}}` from `config.ts`. **Bump `VIDEO_VERSION` every time `intro.mp4` or `intro-poster.webp` changes** so the new build ships a new URL and every visitor gets the new file immediately &mdash; no cache purge needed.
- Stock photos are from Pexels (free commercial use, no attribution required). IDs: keys 29871187, parcel 7857523, creator 7480532, laptop 7552568, property 20703514, workspace 4240505, street 35402056, skyline 2561281.
- No ffmpeg on this machine by default. `npm i ffmpeg-static` in a scratch folder works.

## Analytics
Google Tag Manager `GTM-NHN56NNS` is installed: the loader script is the first thing in `<head>`, the `<noscript>` fallback iframe is the first thing in `<body>`. Standard GTM placement, hardcoded (not a config token, since it's a fixed container id, not brand data).

## Design
- Palette from the logo and photos: aubergine (`--plum`, `--plum-deep`), bronze gold (`--gold`, `--gold-bright`, `--gold-ink` for text on light), ivory and paper backgrounds, slate from the photo backdrop.
- The logo's purple to gold gradient stays in the logo only. Rectangular buttons with small radius, uppercase tracked labels, hairline rules, arch-shaped hero photo.
- Avoid: gradient text, glassmorphism, blobs, emoji as icons, generic icon-grid cards, stock handshake photos.
- Icons are one custom line-icon set (stroke 1.5) in an SVG sprite. Client copy used emoji; they are replaced by icons.

## Page structure
1. Header: logo, nav (What You'll Learn, Why Join, How It Works, Your Host), "Join Free" button to `#join`.
2. Hero: "EXPLORE. BUILD. GROW." (all three lines uppercase — the gold italic line inherits `.hero__title`'s uppercase; it has its own taller `line-height` since uppercase italic caps in Cormorant Garamond clip against the tight reveal-animation `overflow:hidden` box that the mixed-case original fit inside), single CTA to `#join`, a stats row (10+ Properties, 800+ Students, £100K+ Generated). No WhatsApp link here, WhatsApp is gated (see below). Vertical spacing is tuned so the stats row stays above the fold on a ~800px-tall desktop viewport; `hero__inner`'s `padding-bottom` (290px) is deliberately taller than the skyline graphic (240px) so the two never overlap. On mobile the whole copy block (eyebrow, headline, lead, button, stats) is centred, not left-aligned, to balance against the centred arch below it. The arch that used to hold a static host photo now holds the playable intro video itself (poster + play button, `.arch--photo .video` overrides the video component's own aspect-ratio/shadow/play-button position so it fills the arch frame and the play button doesn't sit under the "Your host" caption card) — there's no separate video section any more, this is the first thing visitors see.
3. `#learn`: four photo cards (Airbnb Rent-to-Rent, eBay Dropshipping, TikTok Marketing, Affiliate Marketing) with animated SVG badges.
4. `#paths`: two large photo panels, Property Investment and Online Business & E-commerce, listing everything from the webinar brief.
5. `#why`: dark section, five reasons (training, resources, community, beginner-friendly, practical strategies) plus a street photo.
6. `#how`: Register, Answer a few questions, Join WhatsApp, with a drawn connector.
7. `#host`: `TUTOR_NAME`, `host.webp` photo, real credentials list (law degree, Barrister/Solicitor, property portfolio, digital marketing and student results), Instagram link. Two-column layout (photo + copy) since the video lives in the hero, not here.
8. `#proof`: four real member testimonials (name + last initial, quote, which model they used), pulled from client-supplied screenshots of the community Facebook group. Includes a "results vary" note under the grid.
9. `#join`: registration form.
10. Final CTA over the skyline photo, single button to `#join`.
11. Footer: logo, email, both phone numbers, Instagram, links, privacy notice and disclaimer (details elements), Pexels credit.

## WhatsApp is gated
The invite link only appears in the form's step 3 success state, after Web3Forms confirms the submission. It is not available anywhere else on the page (no hero link, no "skip the form" link, no final CTA button, no error-state fallback, no noscript link). The form is the only way in; if it fails, the user retries the form rather than being handed the link.

## Registration form
Posts JSON from the browser to `https://api.web3forms.com/submit` with `WEB3FORM_KEY`. No backend. Has a `botcheck` honeypot, subject, from_name and a consent checkbox linking to the privacy notice.
- Step 1: Name, Email, WhatsApp Number (country code required), Location.
- Step 2: three radio-card questions (interest, experience, main goal) plus consent. Q1 and Q2 double as the client's "what they want to learn" and "experience level" fields.
- Step 3 (after Web3Forms returns success): "You're all set!" and a "Join the WhatsApp Community" button. This is the only place the WhatsApp link appears.
- On failure or timeout (15s): inline notice, no WhatsApp fallback, answers kept, Submit still available for retry.
- Test with Playwright route-mocking of `api.web3forms.com`; never submit real data while testing.

## Animation
CSS, SVG stroke drawing (`pathLength="1"`), IntersectionObserver. `prefers-reduced-motion` disables all of it.
- Hero: headline lines rise in, skyline and rising trend line draw in.
- Photos reveal with a clip-path wipe on a child element. Never put the clip-path on the observed element itself: Chrome then never sees it as visible.
- Cards: each SVG badge draws when the card scrolls in.
- How It Works: connector line draws across.
- Form success: growth chart line draws.
- Hero video: the "Your host" caption card sits over the arch and would otherwise cover the video, so `video.ts` toggles `.is-playing` on `.hero__portrait` on the video's native `play`/`pause`/`ended` events, and `motion.css` fades the caption out while playing (own fast transition, not the slow entrance one, and specific enough to beat the entrance reveal's `.is-in` opacity rule).

## Testing
Playwright with system Chrome (`channel: "chrome"`); bundled Chromium does not run on this Mac. Checked at 1440 and 390 wide: no horizontal overflow, no console errors.

## Open items (need client input)
- Confirm the privacy notice and disclaimer wording (drafted, not legally reviewed).
- Webinar date and time, if the page should mention the webinar. The intro video refers to "my free webinar".
- SVG version of the logo.
- Domain: `https://legacywealthacademy.online` is used for canonical and share tags.
