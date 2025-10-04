# MVP UI Spec — KeyCut Online (Australia-wide key-cutting bookings)

> **Goal:** Let anyone in Australia order a spare key (or book a mobile locksmith) in **under 60 seconds** on mobile. Zero friction, clear pricing, strong trust & safety.

---

## 1) Principles

* **Mobile-first**, minimal typing, **no account required**.
* **Two simple paths:**

  1. **Mail-in / Photo-verified Copy** (Australia-wide)
  2. **On-site Locksmith Visit** (metro coverage where available)
* **Up-front pricing** with GST, ETA, and shipping options.
* **Tap-to-pay (Apple Pay/Google Pay) + card**; receipts emailed.
* **Trust & legality front-and-center:** ownership verification where required; “No restricted keys without authority.”

---

## 2) Core user journeys (MVP)

1. **Get a spare key (Mail-in / Photo-verified)**

   * Select key type → upload photos (optional but encouraged) → choose delivery → contact → pay → confirmation with printable mailer or pickup instructions.
2. **Book a locksmith (On-site)**

   * Enter address → choose time window → select key type/qty → contact → pay (or authorise pre-hold) → confirmation.
3. **Manage order/booking (magic link)**

   * Track status, update address, reschedule, cancel, download invoice.
4. **When we can’t serve (restricted/unserviceable)**

   * Explain briefly, offer **waitlist** or **find a nearby partner**.

---

## 3) Information Architecture

* **Public**

  * **Home (choose path: Copy or On-site)** — `/`
  * **Order/Booking (single page per path)** — `/copy` and `/locksmith`
  * **Confirmation** — `/confirm/:id`
  * **Track/Manage** — `/o/:token`
  * **Help/FAQ** — `/help`
  * **T&Cs, Privacy** — footer
* **Back-office (minimal)**

  * **Admin login (magic link)** — `/admin`
  * **Orders & Jobs** — `/admin/orders/:id`
  * **Pricing & SKUs** — `/admin/pricing`

---

## 4) Screen Blueprints & UI Details

### A) Home (choose your path)

* **Hero:** “Spare keys, delivered fast. Or a locksmith to your door.”
* **Primary tiles (big, tappable):**

  * **Copy a Key (by post)** — “We duplicate & post it to you.”
  * **Book a Locksmith (on-site)** — “We come to you to cut/fit.”
* **Trust row:** ⭐ 4.9/5 (X,XXX orders) • **Fully insured** • **GST receipts** • **AU-wide**
* **Sticky CTA** (mobile): **Get started**

---

### B) Flow 1 — Copy a Key (Mail-in / Photo-verified)

**Single scroll page; sticky order summary + “Pay now”.**

1. **Step 1 — Key type & quantity**

   * **Key type tiles** (radio, with small icons):
     **House/Padlock**, **Mailbox**, **Garage/Screen**, **Restricted (Do Not Duplicate)**, **Car (non-transponder)** *(greyed, “Next release” if not supported)*.
   * **Qty counter** with multi-copy discount (auto-applies; show savings).

2. **Step 2 — Help us match your blank (optional but boosts success)**

   * **Upload photos** (front & back) with guides/overlays.
   * Helper chips: “Don’t know? Skip”.
   * **Live validation microcopy:** “Clear photo, flat on light background.”

3. **Step 3 — Delivery**

   * **Delivery method cards:**

     * **Standard Post (3–5 biz days)** — $X
     * **Express (1–2 biz days)** — $Y
     * **Local pickup** (if a partner hub in postcode) — $Z *(auto-hidden if none)*
   * **Address input** (AU autocomplete). For pickup: show map & hours.

4. **Step 4 — Contact & verification**

   * **Name**, **Mobile (AU format)**, **Email**.
   * **Ownership attestation checkbox**: “I own or am authorised to copy this key.”

     * If **Restricted** selected → **Authority upload** (letter/card/permit) required.
   * **Notes** (e.g., “Security screen key, brass preferred.”)

5. **Step 5 — Payment**

   * **Apple Pay / Google Pay** buttons; card fallback.
   * **Order summary**: key type(s), qty, unit price, shipping, **GST**, **Total inc. GST**.
   * **Legal line:** “We can’t duplicate restricted keys without proper authority.”

6. **Post-pay instruction panel (above the fold on Confirmation)**

   * If **Mail-in**: “Print your prepaid label” + **Download Label** button; “Place your original in a padded mailer” checklist.
   * If **Pickup**: QR code + pickup location details.

---

### C) Flow 2 — Book a Locksmith (On-site)

**Single page; address → time → key type → contact → pay/hold.**

1. **Step 1 — Where & when**

   * **Address autocomplete** with instant coverage result: “Yes, we service **Preston 3072**. Next: **Today 2–4pm**.”
   * **Time slots**: 2-hour windows (chips grid). Default to **Soonest**.

2. **Step 2 — Service details**

   * **Need type** (radio): **Cut spare key**, **Rekey/Change lock**, **Locked out (urgent)** *(optional MVP: show phone support CTA)*.
   * **Key type** (same tiles as Copy flow). If **Restricted**, show “Authority required” inline.
   * **Qty** (for “Cut spare key”).
   * **Add-ons** (checkbox chips): Extra copies, Key tag, Bluetooth tracker.

3. **Step 3 — Access & notes**

   * **Presence toggle:** “I’ll be present” / “Not present” (contact on arrival).
   * **Access notes** (gate codes, unit/level, pet notice).

4. **Step 4 — Contact & pay**

   * **Name**, **Mobile (AU)**, **Email**.
   * **Payment**: tap-to-pay. Copy: “We place a small pre-authorisation. You’re charged after completion.”
   * **Price panel**: call-out fee + per-key rate + add-ons + **GST** → Total.

     * If pricing varies (“From $X”): show clear range, and “Tech confirms before starting.”

---

### D) Confirmation (both flows)

* **Success card** with big tick, summary facts (what, where, when/ETA, price, order/booking ID).
* **Action buttons:**

  * **Track/Manage** (magic link)
  * **Download invoice** (GST)
  * **Support** (call/chat)
* **Mail-in extras:** label download + packing tips with illustrations.
* **On-site extras:** “What to expect” checklist + reschedule link.

---

### E) Track / Manage (magic link)

* **Status pill:** Received → In lab → Cut → Dispatched (for copy)
  Scheduled → En-route → On site → Complete (for locksmith)
* **Actions:** Change address (before dispatch), reschedule/cancel (with fair-go policy), add copies, contact support.
* **Receipts:** Download PDF invoice.

---

## 5) Form Field Spec (validation & copy)

* **Address:** Required. AU autocomplete; show map pin preview. Error: “Please pick a valid Australian address.”
* **Time window (on-site):** Required. Disable past/full. Tooltip when full.
* **Key type:** Required. If **Restricted** → require **Authority file** (jpeg/pdf).
* **Photos (copy flow):** Optional; JPG/PNG/HEIC up to 10MB each; show progress and retake.
* **Qty:** Default 1. Apply multi-copy discount automatically; update summary.
* **Name:** Required (min 2 chars).
* **Mobile:** Required; AU format (+61 or 04xx xxx xxx).
* **Email:** Optional but recommended (warn if empty: “Without email, no invoice copy.”).
* **Payment consent checkbox:** Required. Copy: “I agree to Terms and Privacy.”

---

## 6) Pricing & Transparency UI

* **Sticky summary** (mobile bottom bar): **Total inc. GST** + next step CTA.
* **Breakdown modal:** Base (key/visit) + per-copy + add-ons + shipping + GST.
* **Fair-go policy tooltip:** Free reschedule up to 2h before; mail-in handling times.

---

## 7) Conversion Boosters

* **Default selections:** Today’s soonest slot (on-site) / Standard Post (copy).
* **Inline reassurance:** “Most keys dispatched in 24–48h.” / “Average visit 30–60 min.”
* **Social proof:** 2–3 rotating short reviews with suburb & date.
* **Scarcity (truthful):** “Only 3 on-site slots left today in **Richmond 3121**.”
* **Trust badges:** “Police-checked”, “Fully insured”, “Authorised locksmith partners”.

---

## 8) States & Messaging

* **Loading:** skeletons for price panel, time slots, and summary.
* **Network error:** toast “We saved your selections — please retry.”
* **Payment fail:** inline field errors; preserve inputs; retry button.
* **Restricted key attempt without authority:** inline block with clear guidance and **Learn more** link.

---

## 9) Notifications (MVP)

* **SMS** (primary): order placed (magic link), item received, dispatched with tracking; on-site booking confirmed, day-of reminder, “Tech on the way,” job complete.
* **Email:** invoice, shipping label (copy flow), updates mirroring SMS.

*(Tone: short, clear AU English.)*

---

## 10) Admin (bare minimum)

* **Orders/Jobs list:** filter by date, status, type (copy/locksmith).
* **Order detail:** customer info, items, shipping label generation, status updates (push SMS/email).
* **Pricing:** key types, per-copy rates, shipping fees, on-site call-out fees.
* **Exports:** CSV invoices; daily manifest for Australia Post.

---

## 11) Visual Style (guide)

* **Look:** clean white canvas, charcoal text, bold accent (electric blue/teal) for CTAs.
* **Components:** large tiles, chip selectors, card breakdowns, bottom sticky bars.
* **Icons:** key shapes, envelope/van, shield (verification), clock (ETA), map pin.
* **Accessibility:** WCAG 2.1 AA, focus outlines, ARIA labels, error text & hints.

---

## 12) Analytics & Success Metrics

* **Events:** path_selected (copy/locksmith), key_type_selected, qty_changed, photo_uploaded, delivery_selected, address_entered, time_selected, payment_started, payment_success, manage_opened, cancel_or_reschedule.
* **KPIs:**

  * Landing → Payment start: **≥40%**
  * Payment start → Success: **≥70%**
  * Median completion time: **≤60s** (returning users) / **≤90s** (new)
  * Photo attach rate (copy flow): **≥60%**
  * Restricted-without-authority drop-off: **↓ over time**

---

## 13) Legal, Safety & AU-Specific

* Show **ABN** and **GST** on invoices.
* **Ownership attestation** required for all copies; **authority proof** for restricted keys.
* **Privacy:** Australian Privacy Principles; payment handled by PCI-compliant PSP.
* **Disclaimers:** We may refuse service if legality/authority cannot be verified; original key return policy; lost-mail liability terms.

---

## 14) MVP Cut Line

**Included now:**

* Mail-in copy flow with printable label & tracking.
* On-site booking with 2-hour windows (limited coverage toggled by postcode).
* Apple/Google Pay + card, SMS updates, magic-link management, GST invoices.

**Deferred (Next):**

* Car transponder keys & programming, safe keys, master key systems.
* Live courier pickup, lockers network, subscription key plans for property managers.
* Partner portal for third-party locksmiths; user accounts & saved addresses.
* Photo-to-blank auto-detection.

---

## 15) Sample Copy (ready to paste)

* **Hero H1:** “Spare keys, sorted.”
* **Sub:** “Post us your key or book a locksmith. Australia-wide, up-front pricing.”
* **CTA:** “Get a spare key”
* **Ownership checkbox:** “I’m the owner or have permission to copy this key.”
* **Restricted helper:** “Keys marked ‘Do Not Duplicate’ or system keys require written authority.”

---

## 16) Acceptance Criteria (“Done”)

* Complete a **copy** order on a typical 4G phone in **≤90s**, ≤12 taps.
* Complete an **on-site** booking in **≤60s**, ≤10 taps.
* Address autocomplete works for all AU postcodes/suburbs.
* Time slots correctly disable past/full states.
* Photos upload reliably; show success/retake states.
* Pricing updates live (qty, delivery, add-ons); **GST** shown.
* Payment via Apple/Google Pay where supported; card fallback works.
* Confirmation renders label (copy flow) or visit details (on-site); SMS/email sent within **30s**.
* Magic-link page allows track/reschedule/cancel and shows current status.

---

If you want, I can adapt this into low-fi wireframes for **keycut.online**, including exact copy and the sticky mobile bars for both flows.
