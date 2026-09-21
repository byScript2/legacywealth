I hate unnecessary comments on my code.
Update this file with straight forward concise information as we build.
This is a one page promotional website.

# Legacy Wealth Academy: Free Community Landing Page

One-page static promo site for a free online business community (property and online business education). Goal: capture a lead, then send them to the WhatsApp community. Hosted on Cloudflare Pages.

## Non-negotiables
- No code comments. Explain wiring in chat.
- Must not read as AI-generated. Editorial, hand-crafted, specific to this brand.
- UK audience: British English (monetise, programme), GBP, `lang="en-GB"`.
- No invented facts: no fake testimonials, member counts, income figures or dates.
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
- `config.ts`: single source for `WHATSAPP_GROUP_LINK`, `WEB_LINK`, `TUTOR_NAME`, `EMAIL`, `TEL`, `TEL_2`, `BRAND_NAME`, `WEB3FORM_KEY`. Never hardcode these elsewhere.
- `vite.config.ts`: plugin replaces `{{TOKEN}}` placeholders in `index.html` from `config.ts` (BRAND_NAME, TUTOR_NAME, EMAIL, TEL, TEL_HREF, TEL_2, TEL_2_HREF, WEB_LINK, WHATSAPP_LINK). New config values used in HTML need a token added there.
- `index.html`: all markup, including the SVG icon sprite and card illustrations.
- `src/main.ts` wires `reveal.ts` (scroll reveals), `nav.ts` (header state, mobile menu, active link), `video.ts` (intro video), `form.ts` (registration).
- `src/styles/`: `base.css` (tokens, buttons, header, footer), `sections.css`, `form.css`, `motion.css`.
- `source/`: originals and working files, not deployed. Uncropped host photos, original logo, downloaded stock JPEGs, `JosefinSans.ttf`.
- `public/img/`: optimised WebP for the site. `public/logo.png` is the edited logo. Favicons and `apple-touch-icon.png` are cut from the logo icon. `public/img/og.jpg` is the 1200x630 share image.

## Assets
- Host photos: watermark cropped out (bottom 120px removed). `host.webp` is the hero, `host-2.webp` is the host section.
- Logo: tagline changed from PROPERTY to ACADEMY (Josefin Sans Light, sampled gold, same width). Raster 600x174, dark purple text, so only use on light backgrounds. An SVG would be better.
- `public/intro.mp4`: 51s portrait, has burned-in captions and a black end frame. It talks about the webinar. Poster is the frame at 0.9s (`intro-poster.webp`). Never autoplay.
- Stock photos are from Pexels (free commercial use, no attribution required). IDs: keys 29871187, parcel 7857523, creator 7480532, laptop 7552568, property 20703514, workspace 4240505, street 35402056, skyline 2561281.
- No ffmpeg on this machine by default. `npm i ffmpeg-static` in a scratch folder works.

## Design
- Palette from the logo and photos: aubergine (`--plum`, `--plum-deep`), bronze gold (`--gold`, `--gold-bright`, `--gold-ink` for text on light), ivory and paper backgrounds, slate from the photo backdrop.
- The logo's purple to gold gradient stays in the logo only. Rectangular buttons with small radius, uppercase tracked labels, hairline rules, arch-shaped hero photo.
- Avoid: gradient text, glassmorphism, blobs, emoji as icons, generic icon-grid cards, stock handshake photos.
- Icons are one custom line-icon set (stroke 1.5) in an SVG sprite. Client copy used emoji; they are replaced by icons.

## Page structure
1. Header: logo, nav (What You'll Learn, Why Join, How It Works, Your Host), "Join Free" button to `#join`.
2. Hero: "LEARN. BUILD. MONETISE." with host photo in an arch, primary CTA to `#join`, plain link to WhatsApp.
3. `#learn`: four photo cards (Airbnb Rent-to-Rent, eBay Dropshipping, TikTok Marketing, Affiliate Marketing) with animated SVG badges.
4. `#paths`: two large photo panels, Property Investment and Online Business & E-commerce, listing everything from the webinar brief.
5. `#why`: dark section, five reasons (training, resources, community, beginner-friendly, practical strategies) plus a street photo.
6. `#how`: Register, Answer a few questions, Join WhatsApp, with a drawn connector.
7. `#host`: `TUTOR_NAME`, second photo, intro video.
8. `#join`: registration form.
9. Final CTA over the skyline photo.
10. Footer: logo, email, both phone numbers, links, privacy notice and disclaimer (details elements), Pexels credit.

## WhatsApp is not gated
The invite link is available without the form: hero text link, "skip the form" link beside the form, final CTA button, and the form's error fallback. The form is for lead capture, not access control.

## Registration form
Posts JSON from the browser to `https://api.web3forms.com/submit` with `WEB3FORM_KEY`. No backend. Has a `botcheck` honeypot, subject, from_name and a consent checkbox linking to the privacy notice.
- Step 1: Name, Email, WhatsApp Number (country code required), Location.
- Step 2: three radio-card questions (interest, experience, main goal) plus consent. Q1 and Q2 double as the client's "what they want to learn" and "experience level" fields.
- Step 3 (after Web3Forms returns success): "You're all set!" and a "Join the WhatsApp Community" button.
- On failure or timeout (15s): inline notice with a WhatsApp button, answers kept, Submit still available for retry.
- Test with Playwright route-mocking of `api.web3forms.com`; never submit real data while testing.

## Animation
CSS, SVG stroke drawing (`pathLength="1"`), IntersectionObserver. `prefers-reduced-motion` disables all of it.
- Hero: headline lines rise in, skyline and rising trend line draw in.
- Photos reveal with a clip-path wipe on a child element. Never put the clip-path on the observed element itself: Chrome then never sees it as visible.
- Cards: each SVG badge draws when the card scrolls in.
- How It Works: connector line draws across.
- Form success: growth chart line draws.

## Testing
Playwright with system Chrome (`channel: "chrome"`); bundled Chromium does not run on this Mac. Checked at 1440 and 390 wide: no horizontal overflow, no console errors.

## Open items (need client input)
- Confirm the privacy notice and disclaimer wording (drafted, not legally reviewed).
- Webinar date and time, if the page should mention the webinar. The intro video refers to "my free webinar".
- Social links, if wanted.
- SVG version of the logo.
- Domain: `https://legacywealthacademy.online` is used for canonical and share tags.
