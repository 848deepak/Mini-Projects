# 🗂️ Mini Projects Repository Plan
**Chandigarh University — BE-CSE/IT 3rd Year | Jan–June 2026**
**Subjects: System Design · Full Stack Dev II · Cloud Computing**

---

## 📋 DEDUPLICATION ANALYSIS

After cross-referencing all 3 PDFs (108 raw entries), duplicates removed:
- LMS, Library, Exam, Voting, Job Portal, Inventory, Task Mgmt, Payroll, Hospital, Food, Banking, Complaint, Attendance, Restaurant — kept as single best-of-breed entry

**Final unique project count: 91 projects**

---

## 🗂️ REPOSITORY STRUCTURE

```
mini-projects/
│
├── README.md                        ← Master index of all projects
├── .gitignore
│
├── system-design/                   ← 30 projects
│   ├── movie-ticket-booking/
│   │   ├── README.md
│   │   ├── prompt.md
│   │   └── src/
│   ├── ride-booking-system/
│   ├── real-time-chat-app/
│   ├── ecommerce-order-management/
│   ├── url-shortener/
│   ├── food-delivery-system/
│   ├── online-banking-system/
│   ├── digital-wallet/
│   ├── hospital-management/
│   ├── smart-parking-system/
│   ├── hotel-booking-system/
│   ├── cab-fleet-management/
│   ├── smart-notification-system/
│   ├── event-booking-system/
│   ├── social-media-feed/
│   ├── file-storage-drive-mini/
│   ├── courier-tracking-system/
│   ├── traffic-monitoring-system/
│   ├── online-auction-system/
│   ├── subscription-billing-system/
│   ├── crm-system/
│   ├── stock-trading-simulator/
│   ├── online-insurance-system/
│   ├── smart-home-automation/
│   └── cab-fleet-management/
│
├── full-stack/                      ← 36 projects
│   ├── college-management-portal/
│   ├── online-examination-system/
│   ├── multi-vendor-ecommerce/
│   ├── hospital-appointment-system/
│   ├── employee-attendance-payroll/
│   ├── learning-management-system/
│   ├── digital-expense-tracker/
│   ├── library-management-system/
│   ├── online-event-registration/
│   ├── complaint-grievance-system/
│   ├── task-project-collaboration/
│   ├── inventory-stock-management/
│   ├── online-food-ordering/
│   ├── student-feedback-rating/
│   ├── job-portal/
│   ├── vehicle-service-booking/
│   ├── online-quiz-platform/
│   ├── real-time-notification-system/
│   ├── customer-support-ticketing/
│   ├── smart-banking-system/
│   ├── product-review-rating/
│   ├── online-voting-system/
│   ├── hr-recruitment-scheduling/
│   ├── course-certification-platform/
│   ├── travel-booking-itinerary/
│   ├── elearning-doubt-resolution/
│   ├── subscription-content-platform/
│   ├── asset-resource-management/
│   ├── online-doctor-consultation/
│   ├── smart-city-issue-reporting/
│   ├── warehouse-logistics/
│   ├── freelancer-marketplace/
│   ├── secure-file-sharing/
│   ├── restaurant-table-reservation/
│   └── cicd-fullstack-app/
│
├── cloud-computing/                 ← 25 projects
│   ├── portfolio-on-ec2/
│   ├── photo-gallery-s3/
│   ├── multi-region-backup/
│   ├── ec2-auto-stop-scheduler/
│   ├── vpc-public-private-arch/
│   ├── load-balanced-webapp/
│   ├── containerized-blog/
│   ├── serverless-image-resizer/
│   ├── s3-lifecycle-optimizer/
│   ├── iam-user-management/
│   ├── static-site-cloudfront/
│   ├── ec2-health-dashboard/
│   ├── serverless-contact-form/
│   ├── file-versioning-system/
│   ├── lambda-calculator-api/
│   ├── s3-event-notifications/
│   ├── ec2-scheduled-backup/
│   ├── secure-file-upload-portal/
│   ├── containerized-wordpress/
│   ├── cross-region-replication/
│   ├── auto-scaling-webapp/
│   ├── serverless-todo-api/
│   ├── lambda-function-scheduler/
│   ├── multi-az-database/
│   └── s3-bucket-policy-manager/
│
└── ai-ml/                           ← 2 projects
    ├── recommendation-system/
    └── sports-analytics-dashboard/
```

---

## 📁 STANDARD FOLDER TEMPLATE (per project)

```
project-name/
├── README.md          ← Project description, setup, screenshots
├── prompt.md          ← AI generation prompt (this document)
├── src/
│   ├── index.html
│   ├── style.css
│   └── app.js         ← or App.jsx for React projects
└── assets/
    └── (icons, images if needed)
```

---

# 🚀 SYSTEM DESIGN — AI PROMPTS

---

## SD-01: Movie Ticket Booking System

```
PROJECT CONTEXT:
Build a browser-based Movie Ticket Booking MVP. Users browse movies, pick
a showtime, select seats on an interactive seat map, and see a booking
confirmation. No backend — all state in localStorage.

TECH STACK:
- HTML5 + CSS3 (CSS custom properties, grid, flexbox)
- Vanilla JavaScript (ES6+)
- No framework, no backend, no DB

FEATURES (MVP):
1. Movie listings grid with poster, genre, rating, showtimes
2. Interactive seat map (rows A–H, 8 seats each) — green/red/selected states
3. Ticket counter + price calculator (updates live as seats are clicked)
4. Booking summary modal with confirmation number (Math.random)
5. localStorage persistence for booked seats per showtime

UI/UX AESTHETIC:
Dark cinema theme. Background: #0a0a0f with a subtle film-grain CSS noise
texture. Movie cards with a warm amber glow on hover (box-shadow: 0 0 30px
#f59e0b44). Seat map uses a CSS grid that curves slightly (transform
perspective). Typography: "Playfair Display" for titles, "DM Sans" for body.
Accent color: amber #f59e0b. Booking modal uses a frosted glass effect
(backdrop-filter: blur(20px)). Every interactive element has a satisfying
micro-animation (seat flip, button pulse).

FILE STRUCTURE:
movie-ticket-booking/
├── index.html        ← movie listings page
├── seats.html        ← seat selection page
├── style.css         ← shared styles + CSS variables
├── movies.js         ← mock data array (5 movies, 3 showtimes each)
├── seat-map.js       ← seat rendering + selection logic
└── booking.js        ← localStorage + confirmation modal

IMPLEMENTATION STEPS:
1. Define movies.js with 5 movie objects: { id, title, genre, rating,
   poster (use picsum.photos), duration, showtimes[], price }
2. In index.html: render movie cards with CSS grid, pass movieId+showtime
   as URL params to seats.html
3. In seat-map.js: generate 64-seat grid dynamically, load booked seats
   from localStorage[`booked_${movieId}_${showtime}`], toggle 'selected'
   class on click, prevent booking already-booked seats
4. Live price ticker: selectedSeats.length × movie.price
5. On "Confirm Booking": save to localStorage, show modal with booking ID,
   movie name, seats, total — include a "Download Ticket" button (just
   triggers window.print() with a styled print CSS)
6. Back button returns to listings without losing state
```

---

## SD-02: Ride Booking System

```
PROJECT CONTEXT:
A Uber-like ride booking UI MVP. User enters pickup/drop, sees available
drivers on a simulated map, picks a ride type, and tracks the ride through
states: searching → driver found → en route → arrived.

TECH STACK:
- HTML + CSS + Vanilla JS
- Leaflet.js (free map, CDN) for the visual map
- No backend — simulate driver matching with setTimeout

FEATURES (MVP):
1. Pickup/drop location input with autocomplete suggestions (hardcoded city
   locations array)
2. Leaflet map with animated marker for "driver" position
3. Ride type selector: Economy / Premium / XL (with price multipliers)
4. Live ride status ticker with 4 states and animated transitions
5. Estimated fare calculator + ETA display
6. Ride history in localStorage (last 5 rides)

UI/UX AESTHETIC:
Deep navy + electric blue. Background: #060d1e. Map container has a
blue-tinted overlay (mix-blend-mode: multiply). Status bar at bottom uses
a pill-shaped floating card with glassmorphism. Pickup/drop inputs styled
like Uber — clean white cards with a vertical dotted line connector
between them. Driver marker is a custom CSS circle with a pulsing ring
animation. Font: "Sora" for everything. Accent: #3b82f6 electric blue.

FILE STRUCTURE:
ride-booking/
├── index.html
├── style.css
├── map.js        ← Leaflet init + marker management
├── booking.js    ← fare calculation, state machine
└── data.js       ← mock drivers array, city locations

IMPLEMENTATION STEPS:
1. Set up Leaflet map centered on a major city (Delhi: 28.6, 77.2)
2. Create location suggestions dropdown (hardcoded 10 city locations with
   coords), clicking a suggestion sets map marker + stores coords
3. Fare formula: base_fare + (distance_km × rate_per_km × type_multiplier)
   Simulate distance as random(3,15) km
4. "Book Ride" triggers state machine: searching(2s) → driver_found(1s) →
   en_route → arrived; each state updates the bottom status card
5. Animate driver marker: use setInterval to move marker coords slightly
   toward pickup point each 500ms
6. Ride history: push completed rides to localStorage array, render as
   collapsible list in a sidebar panel
```

---

## SD-03: Real-Time Chat Application

```
PROJECT CONTEXT:
A WhatsApp-inspired chat UI MVP. Supports multiple mock conversations,
1-on-1 messaging, and a group chat — all simulated with auto-replies. No
actual real-time backend; simulate with setTimeout auto-responder.

TECH STACK:
- HTML + CSS + Vanilla JS
- No backend (all in-memory + localStorage)
- Optional: use BroadcastChannel API for simulated multi-tab "real-time"

FEATURES (MVP):
1. Contact list sidebar with avatar, last message preview, unread badge
2. Active chat window with bubble UI (sent right, received left)
3. Message input with send on Enter or button click
4. Typing indicator animation (3-dot bounce) before auto-reply
5. Message timestamps + read receipts (✓✓)
6. localStorage persistence across page refreshes

UI/UX AESTHETIC:
WhatsApp-meets-Linear dark theme. Left sidebar: #111418. Chat area:
#0d1117. Message bubbles: sent = #2563eb (blue), received = #1e2530
(dark slate). Subtle chat background pattern (CSS repeating-gradient
of tiny dots). Avatar initials generated from contact name with unique
hue per contact (HSL color from name hash). Font: "Inter" — but size
ratios are precise: 14px messages, 12px timestamps, 11px previews.
Unread badges: vivid green #22c55e. Micro-animation: bubbles slide in
from bottom with a 150ms ease-out.

FILE STRUCTURE:
real-time-chat/
├── index.html
├── style.css
├── contacts.js   ← mock contacts + conversation history data
├── chat.js       ← message rendering, send logic, auto-reply
└── ui.js         ← sidebar rendering, active state, badges

IMPLEMENTATION STEPS:
1. Define contacts.js: array of 5 contacts + 1 group, each with id, name,
   avatar_color, messages[]
2. Render sidebar: contact cards with last message + relative timestamp
   (just now / 2m ago / Yesterday)
3. Chat window: map messages array to bubble divs, scroll to bottom on
   render; use CSS :last-child to not show timestamp on consecutive msgs
4. Send handler: push {text, timestamp, sender:'me'} to messages[active],
   re-render, trigger typing indicator after 800ms, then push auto-reply
   after 1500ms (pick from predefined replies array per contact)
5. BroadcastChannel: post message event to channel, other tabs receive and
   update their UI — demonstrates real-time concept
6. Persist all conversations to localStorage on every message
```

---

## SD-04: URL Shortener System

```
PROJECT CONTEXT:
A Bitly-like URL shortener with analytics. User pastes a long URL, gets a
short code, can copy it, and see a simple analytics dashboard showing
click counts and a basic chart — all in localStorage.

TECH STACK:
- HTML + CSS + Vanilla JS
- Chart.js (CDN) for analytics visualization

FEATURES (MVP):
1. URL input with validation (must start with http/https)
2. Short code generation (random 6-char alphanumeric)
3. Copy-to-clipboard with toast notification
4. Click simulation: each time the short URL "card" is clicked, increment
   counter in localStorage
5. Analytics dashboard: table of all shortened URLs + Chart.js bar chart
   of click counts
6. Delete short URL

UI/UX AESTHETIC:
Minimal tech product aesthetic. White/off-white background (#fafaf9).
Single prominent input bar with a gradient border on focus. Generated
short URL card appears with a smooth height animation. Card design:
white with a subtle shadow, left border accent in #6366f1 indigo.
Analytics section uses a clean data table with alternating row shading.
Chart uses indigo-to-violet gradient bars. Font: "JetBrains Mono" for
the short codes, "Outfit" for everything else. Very generous whitespace.

FILE STRUCTURE:
url-shortener/
├── index.html      ← input + URL cards
├── analytics.html  ← dashboard with chart
├── style.css
├── shortener.js    ← code generation, localStorage CRUD
└── analytics.js    ← chart rendering, stats

IMPLEMENTATION STEPS:
1. URL validation regex: /^https?:\/\/.+\..+/
2. Code generation: generate 6 chars from base62 charset, check for
   collisions against existing codes in localStorage
3. Store in localStorage: { [code]: { original_url, created_at,
   clicks, last_clicked } }
4. Short URL format: display as "shr.ly/{code}" (just visual, no real
   redirect) — clicking "Visit" opens original URL in new tab
5. Analytics page: read all localStorage entries, sort by clicks desc,
   render table + Chart.js bar chart (labels = codes, data = clicks)
6. Add search/filter input on analytics page to find URLs
```

---

## SD-05: Food Delivery System

```
PROJECT CONTEXT:
A Swiggy/Zomato-like food ordering UI. User browses restaurants, views
menus, adds items to cart, and places an order with a live order tracking
simulation.

TECH STACK:
- HTML + CSS + Vanilla JS
- No backend

FEATURES (MVP):
1. Restaurant listing with filters (cuisine, rating, delivery time)
2. Restaurant detail page with categorized menu (Starters / Mains / Drinks)
3. Cart sidebar with item quantities, subtotal, delivery fee, total
4. Checkout form (name, address — no real payment)
5. Live order tracking: 5 stages with animated progress bar
   (Placed → Confirmed → Preparing → Out for Delivery → Delivered)
6. Order history in localStorage

UI/UX AESTHETIC:
Warm, appetizing palette. Background: #fffbf5 (warm white). Restaurant
cards use large food photography (picsum.photos with food seeds).
Category filter pills: rounded, filled with #f97316 orange when active.
Cart slides in from the right as a fixed panel. Progress tracker is a
horizontal stepper with connecting line that fills left-to-right.
Font: "Nunito" — round and friendly. Star ratings in golden #eab308.
Each menu item card has a + button that bounces on click.

FILE STRUCTURE:
food-delivery/
├── index.html       ← restaurant listing
├── restaurant.html  ← menu page
├── tracking.html    ← order tracking
├── style.css
├── data.js          ← 5 restaurants, menus, mock items
├── cart.js          ← cart state, sidebar rendering
└── tracking.js      ← order state machine with timers

IMPLEMENTATION STEPS:
1. data.js: 5 restaurants × 10 menu items each with price, category,
   description, image
2. Filter logic: filter restaurants array by active cuisine tag + sort by
   rating/time; use URL params for restaurant page navigation
3. Cart: singleton object with items Map, quantity logic, localStorage
   sync; render on every change; "sticky" add-to-cart UX
4. Checkout: minimal form → on submit, save order to localStorage, redirect
   to tracking page with orderId param
5. Tracking state machine: setInterval every 3s advances stage, updates
   stepper fill + status text + estimated time countdown
6. Order history page: list past orders from localStorage with re-order
   button
```

---

## SD-06: Online Banking System

```
PROJECT CONTEXT:
A personal banking dashboard simulation. Shows account balances, recent
transactions, fund transfer between accounts, and a mini statement — all
in localStorage. Designed to look like a premium banking app.

TECH STACK:
- HTML + CSS + Vanilla JS
- Chart.js for spending breakdown donut chart

FEATURES (MVP):
1. Login screen with PIN (hardcoded: 1234) with shake animation on wrong
2. Dashboard: balance cards for Savings, Current, FD accounts
3. Transaction history with debit/credit color coding + search/filter
4. Fund transfer form: from/to account, amount, note — validates balance
5. Spending breakdown donut chart by category (Food, Travel, Shopping, etc.)
6. Download statement as CSV (generate and download via Blob API)

UI/UX AESTHETIC:
Premium banking aesthetic. Dark navy sidebar (#0f1729) with white content
area. Balance cards use a subtle gradient (deep blue to teal). Debit
transactions: red #ef4444, credits: green #22c55e. Account number masked
(XXXX XXXX XXXX 4721). Security icon next to balance with "Tap to reveal"
toggle. Font: "IBM Plex Sans" — trustworthy and technical. Grid layout
with a left sidebar navigation. Transfer form uses a clean card with
an arrow animation between from/to account dropdowns.

FILE STRUCTURE:
online-banking/
├── login.html
├── dashboard.html
├── transactions.html
├── transfer.html
├── style.css
├── auth.js          ← PIN auth, session in sessionStorage
├── data.js          ← seed transactions data
├── banking.js       ← transfer logic, balance updates
└── chart.js         ← spending donut chart

IMPLEMENTATION STEPS:
1. On first load, seed localStorage with accounts and 20 mock transactions
   across categories using a data.js init function
2. Login: compare PIN input to "1234", store { loggedIn: true } in
   sessionStorage; all pages check session on load, redirect to login
3. Dashboard: read accounts from localStorage, render balance cards;
   last 5 transactions as mini list
4. Transfer: validate amount ≤ from-account balance, debit source,
   credit destination, push new transaction to both histories
5. Statement CSV: build CSV string from transactions array, create Blob,
   trigger download via <a> with href=URL.createObjectURL(blob)
6. Chart: aggregate transactions by category, pass to Chart.js doughnut
```

---

## SD-07: Digital Wallet

```
PROJECT CONTEXT:
A PhonePe/Google Pay-style digital wallet. Users add money, send to
contacts, pay via UPI-style codes, and see transaction history. All
simulated in localStorage.

TECH STACK:
- HTML + CSS + Vanilla JS

FEATURES (MVP):
1. Wallet balance display with "Add Money" modal (just increases balance)
2. Send money to contact: pick from contact list, enter amount, confirm
3. Pay via code: simulate "scanning" by entering a merchant code
4. Transaction timeline with icons per transaction type
5. Quick stats: total sent this week, total received
6. UPI ID display (user@wallet)

UI/UX AESTHETIC:
Vibrant fintech gradient UI. Header: diagonal gradient from #7c3aed
(purple) to #2563eb (blue). Circular balance display with a glowing
ring. Quick action buttons: circular with icons, floating above a white
card surface. Transaction list items have left-border color coding.
Contact avatars: colored circles with initials. Amount display uses a
large, bold mono font. Success animations: green checkmark with a
confetti burst (CSS keyframes). Font: "Space Grotesk" for amounts,
"Plus Jakarta Sans" for labels.

FILE STRUCTURE:
digital-wallet/
├── index.html
├── style.css
├── wallet.js    ← balance management, transaction CRUD
├── contacts.js  ← mock contacts + send logic
└── ui.js        ← modal management, animations

IMPLEMENTATION STEPS:
1. Init wallet in localStorage: { balance: 5000, upiId: "deepak@wallet",
   transactions: [] }
2. Add Money modal: input amount → add to balance → push credit transaction
3. Send money: contact picker → amount input → PIN confirm (any 4 digits)
   → debit balance → push transaction → show success animation
4. Pay via code: input merchant code (any non-empty string accepted) →
   amount → confirm → simulate payment
5. Transaction timeline: sort by timestamp desc, group by date (Today /
   Yesterday / date string), render with icon per type
6. Stats: filter transactions by current week, sum debits/credits
```

---

## SD-08: Smart Parking System

```
PROJECT CONTEXT:
A smart parking lot management UI. Shows a visual grid of parking slots,
allows vehicle entry/exit, calculates fees, and shows occupancy stats.

TECH STACK:
- HTML + CSS + Vanilla JS

FEATURES (MVP):
1. Visual parking grid: 40 slots across 4 zones (A/B/C/D), color-coded
   by status (available/occupied/reserved)
2. Vehicle entry: enter plate number → assign nearest available slot
3. Vehicle exit: enter plate number → calculate fee (₹20/hr, min 1hr)
4. Occupancy bar showing % full per zone
5. Search slot by plate number
6. localStorage persistence

UI/UX AESTHETIC:
Industrial/technical aesthetic. Dark slate background (#0f1623).
Parking grid rendered as a CSS grid with slot rectangles. Available
slots: #22c55e (green), Occupied: #ef4444 (red), Reserved: #f59e0b
(amber). Top-down parking lot feel with lane separators as CSS borders.
Slot cards show slot ID + plate number (if occupied). Entry/exit forms
in a right panel. Stats shown as horizontal progress bars. Font:
"Space Mono" for slot IDs and plates, "Inter" for UI text.

FILE STRUCTURE:
smart-parking/
├── index.html
├── style.css
├── parking.js   ← slot management, entry/exit logic, fee calculation
└── ui.js        ← grid rendering, stats update

IMPLEMENTATION STEPS:
1. Init 40 slots: { id: 'A1'...'D10', zone: 'A'|'B'|'C'|'D',
   status: 'available', plate: null, entry_time: null }
2. Render grid: forEach slot → create div with class based on status;
   clicking occupied slot shows vehicle info tooltip
3. Entry flow: input plate → find first available slot by zone order →
   mark occupied + set entry_time = Date.now()
4. Exit flow: input plate → find slot by plate → calculate hours elapsed
   (Math.ceil((now - entry_time) / 3600000)) × 20 → show fee receipt →
   mark slot available
5. Zone occupancy: count occupied/total per zone, update progress bars
6. Persist entire slots array to localStorage on every change
```

---

## SD-09: Hotel Booking System

```
PROJECT CONTEXT:
An Airbnb/Booking.com-lite. Users search for hotel rooms by date range
and guest count, view room details, and make a booking with confirmation.

TECH STACK:
- HTML + CSS + Vanilla JS

FEATURES (MVP):
1. Search bar: check-in date, check-out date, guests count
2. Room listing grid with photos, amenities, price per night
3. Room detail page: image gallery, description, amenities list
4. Availability check (hardcoded unavailable dates per room)
5. Booking form: personal details + simulated card fields
6. Booking confirmation with details + PDF-style printable receipt

UI/UX AESTHETIC:
Luxury hospitality aesthetic. Warm beige-to-white background. Hero
section with a large room photo and search form overlay (white card
with shadow). Room cards: clean white with hover lift (translateY(-4px)
+ shadow increase). Price displayed prominently: "₹4,500 / night".
Amenity icons as small colored chips. Gallery: CSS grid masonry layout.
Font: "Cormorant Garamond" for headings (elegant serif), "Lato" for body.
Accent: deep teal #0f766e. Booking confirmation card has a decorative
border and is print-optimized.

FILE STRUCTURE:
hotel-booking/
├── index.html       ← search + listings
├── room.html        ← room detail
├── booking.html     ← booking form
├── confirmation.html
├── style.css
├── data.js          ← 5 rooms with details, pricing, unavailable dates
├── search.js        ← filter + availability logic
└── booking.js       ← form + confirmation + localStorage

IMPLEMENTATION STEPS:
1. data.js: 5 rooms with fields: id, name, type, price, capacity, images[],
   amenities[], unavailable_dates[], description
2. Search: compare date range against each room's unavailable_dates; filter
   by capacity ≥ guests; pass results as URL state or sessionStorage
3. Room detail: parse room id from URL param, render full details; image
   gallery with thumbnail nav
4. Booking form: validate all fields; calculate total = nights × price;
   on submit, save to localStorage + redirect to confirmation
5. Confirmation: render booking details from localStorage; include
   print button (window.print()) with @media print CSS
```

---

## SD-10: Social Media Feed System

```
PROJECT CONTEXT:
A Twitter/Instagram-hybrid feed. Users can create posts, like, comment,
and see a simulated algorithmic feed. All in-memory + localStorage.

TECH STACK:
- HTML + CSS + Vanilla JS

FEATURES (MVP):
1. Create post with text + optional image URL
2. Feed with chronological posts (own + simulated others)
3. Like toggle with count + heart animation
4. Comments section (expand/collapse per post)
5. User profile sidebar (avatar, bio, post count, followers)
6. Trending tags sidebar (hardcoded + counted from post hashtags)

UI/UX AESTHETIC:
Clean editorial social aesthetic. Two-column layout: feed (center) +
sidebars. Post cards: clean white with subtle separator lines (no box
shadows — think Twitter). Like button: grey by default, fills to #ef4444
red with a pop scale animation on click. Profile avatar: circular with
gradient ring. Create post area: at top of feed with expandable textarea.
Font: "Manrope" — modern and readable at feed density. Trending tags
as small pill badges in brand purple #7c3aed.

FILE STRUCTURE:
social-feed/
├── index.html
├── style.css
├── data.js     ← seed posts + users
├── feed.js     ← post creation, rendering, infinite-scroll simulation
└── actions.js  ← like, comment logic

IMPLEMENTATION STEPS:
1. Seed 10 posts in localStorage with: id, user, avatar_color, text,
   image_url(optional), likes_count, liked_by_me, comments[], timestamp
2. Feed render: sort by timestamp desc, map to post card HTML; insert into
   #feed-container
3. Create post: on submit, prepend new post to array, re-render top of feed
   with slide-down animation
4. Like: toggle liked_by_me, ±1 on likes_count, save, re-render button
   with CSS class toggle for color + scale animation
5. Comments: click "N comments" expands comment section; input to add
   comment pushed to post.comments array
6. Hashtag detection: scan post.text for #words, aggregate counts, render
   top 5 in trending sidebar
```

---

## SD-11: Online Auction System

```
PROJECT CONTEXT:
An eBay-lite auction platform. Items are listed with a start bid and
end time. Users can place bids and watch the countdown. Highest bid
at end wins.

TECH STACK:
- HTML + CSS + Vanilla JS

FEATURES (MVP):
1. Auction item listings with image, current bid, time remaining
2. Live countdown timer per item (updates every second)
3. Place bid: must be > current bid; shows outbid alert if someone else
   bids (simulated via auto-bidder)
4. Bid history per item (list of bids with amounts + timestamps)
5. Won items list (items whose timer expired with your bid highest)
6. Search + filter by category

UI/UX AESTHETIC:
High-energy marketplace aesthetic. Warm white background with gold
accents. Item cards: clean white with a yellow "LIVE" badge pulsing
for active auctions. Countdown timer: red bold numbers when < 60s,
with a fast pulse animation. Current bid displayed large with a
"🔥 Hot item" tag if >5 bids. Bid input button: solid #d97706 amber.
Font: "Barlow Condensed" for prices and countdown (wide, bold),
"Barlow" for body text.

FILE STRUCTURE:
auction-system/
├── index.html
├── item.html     ← auction item detail
├── style.css
├── data.js       ← mock auction items
├── auction.js    ← timer management, bid logic, auto-bidder
└── ui.js         ← rendering, filter logic

IMPLEMENTATION STEPS:
1. data.js: 8 auction items: { id, title, image, start_bid, current_bid,
   end_time (Date.now() + random hours), bids[], category, seller }
2. Countdown: setInterval(1000), compute diff = end_time - Date.now(),
   format as HH:MM:SS; add 'ending-soon' class when < 60s
3. Place bid: validate input > current_bid; push { amount, bidder:'You',
   timestamp } to bids[]; update current_bid in localStorage
4. Auto-bidder: 30% chance every 10s that a "Bot" places a bid 5-15%
   above current bid — creates competition tension
5. Won items: items where end_time < Date.now() and last bid is 'You'
6. Item detail page: full description, image, bid history table
```

---

## SD-12: Stock Trading Simulator

```
PROJECT CONTEXT:
A virtual stock market simulator. Users start with ₹1,00,000 virtual
cash, buy/sell NSE stocks with simulated real-time price movements,
and track portfolio performance.

TECH STACK:
- HTML + CSS + Vanilla JS
- Chart.js for price charts

FEATURES (MVP):
1. Stock market table: 10 mock stocks with live simulated price changes
2. Buy/sell modal with quantity input and live total calculation
3. Portfolio view: holdings with P&L (profit/loss) per stock
4. Price history sparkline charts per stock (Chart.js line)
5. Portfolio total value + overall P&L display
6. Transaction log

UI/UX AESTHETIC:
Bloomberg Terminal-inspired dark UI. Black (#0a0a0a) background.
Dense data layout — monospace numbers everywhere. Stock table: red
for negative change, green for positive with colored percentage badges.
Price changes animate with a flash (green flash on up tick, red on
down tick) using CSS keyframe background-flash. Portfolio P&L: large
number display with an upward/downward arrow. Font: "Roboto Mono"
for numbers, "IBM Plex Sans" for labels. Accent: terminal green
#00ff88 for gains.

FILE STRUCTURE:
stock-trading/
├── index.html      ← market + portfolio view
├── style.css
├── stocks.js       ← mock stock data + price simulation engine
├── portfolio.js    ← buy/sell logic, holdings management
└── charts.js       ← Chart.js sparkline initialization

IMPLEMENTATION STEPS:
1. Define 10 stocks: { symbol, company, price, change_pct, history: [30
   prices for chart] } — mix of tech, pharma, FMCG sectors
2. Price simulation: setInterval(2000) — each stock price changes by
   random(-2%, +2%); update display with flash animation class
3. Add/remove flash class: element.classList.add('flash-green'); then
   setTimeout(300ms, () => remove) — CSS handles the animation
4. Buy modal: quantity × current_price = total; validate cash ≥ total;
   deduct from cash; add to holdings { symbol, qty, avg_price }
5. Portfolio P&L: current_value = holdings.reduce(qty × current_price);
   profit = current_value - total_invested
6. Chart sparklines: tiny Chart.js line charts (50px height, no axes)
   showing 30-point price history per stock
```

---

## SD-13: CRM System

```
PROJECT CONTEXT:
A simple Customer Relationship Management tool for a small sales team.
Manage contacts, deals, and follow-up tasks with a Kanban board.

TECH STACK:
- HTML + CSS + Vanilla JS

FEATURES (MVP):
1. Contacts list with add/edit/delete (name, company, email, phone, stage)
2. Deals Kanban board: 4 columns (Lead → Contacted → Proposal → Closed)
   with drag-and-drop (HTML5 drag API)
3. Deal cards: contact name, deal value, probability %
4. Activity log per contact (notes + timestamps)
5. Dashboard: total pipeline value, deals by stage, this week's tasks
6. Search contacts

UI/UX AESTHETIC:
Clean SaaS product aesthetic. White + light grey (#f8fafc) layout.
Left sidebar navigation with subtle icon labels. Kanban columns with
a soft grey (#f1f5f9) background, white deal cards with a subtle
shadow. Deal value prominently shown in green. Drag-over state: column
highlights with a blue dashed border. Dashboard stat cards: clean white
with a color-coded left border. Font: "Inter" with careful size
hierarchy. Accent: #6366f1 indigo for CTAs.

FILE STRUCTURE:
crm-system/
├── index.html      ← dashboard
├── contacts.html
├── deals.html      ← kanban board
├── style.css
├── data.js         ← seed contacts + deals
├── contacts.js     ← CRUD operations
├── kanban.js       ← drag-and-drop Kanban logic
└── dashboard.js    ← stats aggregation

IMPLEMENTATION STEPS:
1. Seed 10 contacts + 8 deals across stages in localStorage
2. Contacts CRUD: render table, inline edit on row click (contenteditable
   cells), delete with confirm dialog
3. Kanban: render columns from stages array; deal cards are draggable
   (draggable="true"); handle dragover + drop events to move card to
   new column; update localStorage
4. Activity log: per-contact notes array; append timestamped note from
   textarea in contact detail modal
5. Dashboard stats: reduce deals for pipeline_value, group_by_stage for
   bar data; render with pure CSS bars (width: percentage%)
```

---

## SD-14: Task Management System

```
PROJECT CONTEXT:
A Trello/Notion-lite task manager with boards, lists, and cards. Teams
can organize work visually with drag-and-drop Kanban.

TECH STACK:
- HTML + CSS + Vanilla JS

FEATURES (MVP):
1. Multiple boards (Projects) with add/rename/delete
2. Each board: 3+ lists (To Do / In Progress / Done) with add list
3. Task cards: title, description, priority label, due date
4. Drag-and-drop cards between lists (HTML5 drag API)
5. Card detail modal: edit all fields + add checklist items
6. localStorage persistence

UI/UX AESTHETIC:
Notion-meets-Linear minimal aesthetic. Boards sidebar: dark #191919.
Board canvas: off-white #fafafa. List columns: white rounded containers
with soft shadow. Task cards: clean white with a colored left stripe
for priority (red=high, yellow=medium, blue=low). Drag state: card
becomes slightly transparent with a drop shadow. Empty list state:
dashed border card with "+ Add task" text. Font: "Geist" (or "DM Sans")
— very clean. No gradients — just precise shadows and spacing.

FILE STRUCTURE:
task-manager/
├── index.html
├── style.css
├── data.js      ← board/list/card schema + seed data
├── board.js     ← board switching, list management
├── cards.js     ← card CRUD, drag-and-drop
└── modal.js     ← card detail modal, checklist

IMPLEMENTATION STEPS:
1. Schema: { boards: [{ id, name, lists: [{ id, name, cards: [{ id,
   title, desc, priority, due_date, checklist: [] }] }] }] }
2. Board switcher: left sidebar renders board names, click activates board
3. Render lists: for active board, forEach list → create column div with
   cards inside + "Add card" input at bottom
4. Drag-and-drop: card.draggable=true; dragstart saves {cardId, sourceList}
   to data transfer; drop event moves card to target list in data structure
5. Card modal: click card opens overlay modal pre-filled with card data;
   checklist: array of { text, done } items with checkbox toggle
6. Priority filter: top bar filter buttons show only cards of selected
   priority across all lists
```

---

## SD-15: Complaint Management System

```
PROJECT CONTEXT:
A civic complaint portal. Citizens submit complaints, get a ticket ID,
track status, and admins can update complaint stages. Simulates a
government portal.

TECH STACK:
- HTML + CSS + Vanilla JS

FEATURES (MVP):
1. Submit complaint form: category, title, description, location, contact
2. Auto-generated ticket ID (e.g., CMP-2024-0043)
3. Track complaint by ticket ID: shows current stage + timeline
4. Admin panel (password: admin123): view all complaints, update status
5. Status stages: Submitted → Under Review → In Progress → Resolved
6. Email notification simulation (just a toast: "SMS sent to XXXXX")

UI/UX AESTHETIC:
Government portal done right — clean, accessible, trustworthy. White
background with a top nav in deep blue #1e40af. Category icons: circular
colored icons (Road / Water / Electricity / Sanitation). Complaint cards
in admin: clean table with status badge pills. Status timeline: vertical
stepper with connecting line like a shipping tracker. Font: "Noto Sans"
— highly legible, inclusive. Progress stages: blue → green when resolved.
Urgency labels: High/Medium/Low as colored tags.

FILE STRUCTURE:
complaint-system/
├── index.html      ← submit complaint
├── track.html      ← track by ticket ID
├── admin.html      ← admin dashboard
├── style.css
├── complaint.js    ← form submission, ticket generation
├── tracker.js      ← status lookup, timeline render
└── admin.js        ← admin auth, status updates

IMPLEMENTATION STEPS:
1. Generate ticket ID: `CMP-${year}-${String(count).padStart(4,'0')}`
   Store counter in localStorage
2. Complaint object: { ticket_id, category, title, description, location,
   contact_masked, status, submitted_at, updates: [] }
3. Track page: input ticket ID → find in localStorage → render stepper
   with completed stages colored, current stage pulsing
4. Admin auth: sessionStorage flag set when "admin123" entered; admin page
   redirects to login if flag missing
5. Admin updates: dropdown to change status, text input for admin note →
   push { status, note, timestamp } to complaint.updates
6. Status timeline: map updates array to vertical timeline entries
```

---

## SD-16: Online Insurance System

```
PROJECT CONTEXT:
A digital insurance portal for buying policies, filing claims, and
tracking claim status. Covers health, auto, and life insurance types.

TECH STACK:
- HTML + CSS + Vanilla JS

FEATURES (MVP):
1. Insurance product browsing (Health / Auto / Life) with compare feature
2. Buy policy form: personal details + coverage selection + premium calc
3. My Policies dashboard: active policies with key details
4. File a claim: link to policy, describe incident, upload image URL
5. Claim tracker: status timeline (Filed → Under Review → Approved/Rejected)
6. Premium calculator widget: interactive sliders for coverage amount

UI/UX AESTHETIC:
Professional financial services aesthetic. Clean white + deep teal
#0f766e. Policy cards: feature comparison table style with a checkmark
list. Premium calculator: two sliders with real-time price update — feels
like a product configurator. Claim status: color-coded badge (green =
approved, red = rejected, amber = pending). Font: "Source Serif 4" for
headings (trustworthy), "Source Sans 3" for body. Hero section: soft
gradient from teal to white.

FILE STRUCTURE:
insurance-portal/
├── index.html        ← product listing + calculator
├── buy.html          ← purchase flow
├── dashboard.html    ← my policies
├── claim.html        ← file + track claims
├── style.css
├── data.js           ← insurance products, coverage tiers
├── premium.js        ← calculator logic, sliders
└── claims.js         ← claim CRUD, status tracking

IMPLEMENTATION STEPS:
1. Products: 3 types × 3 tiers (Basic/Standard/Premium) with coverage
   amount, premium per year, features list
2. Premium calculator: base = coverage_amount × rate (0.02 for health,
   0.015 for life, 0.03 for auto); adjust for age slider and riders
3. Buy flow: form → generate policy number → save to localStorage →
   show policy card with all details
4. Claim form: dropdown of user's active policies; text + image URL →
   auto-assign claim ID, set status to 'Filed'
5. Claim tracker: same stepper pattern as complaint system but 4 stages:
   Filed → Under Review → Settlement Calculation → Resolved
```

---

## SD-17: Smart Home Automation System

```
PROJECT CONTEXT:
A home automation control panel. Users control smart devices (lights,
AC, fans, locks, cameras) in different rooms through a visual floor plan
interface.

TECH STACK:
- HTML + CSS + Vanilla JS

FEATURES (MVP):
1. Floor plan view: rooms clickable (Living Room, Bedroom, Kitchen,
   Bathroom) — highlights active room
2. Device panel for selected room: toggle on/off each device
3. AC control: temperature slider (16°C – 30°C), mode selector
4. Scene presets: "Good Morning", "Movie Mode", "Sleep" — applies
   predefined device states
5. Energy usage tracker: calculates estimated Watts for active devices
6. Scheduling: set device on/off times (stored in localStorage)

UI/UX AESTHETIC:
Smart home premium dashboard. Very dark background (#080c12) with a
faint blueprint grid pattern (CSS). Device cards: dark glassmorphism
(rgba(255,255,255,0.05) background, 1px border, blur). Active devices
glow with a warm amber light (#f59e0b box-shadow). AC card has a
circular dial-style temperature selector. Toggle switches: smooth CSS
transitions. Room selector buttons: floor plan style with room labels.
Font: "Exo 2" — futuristic but readable. Energy counter: large green
number that updates live.

FILE STRUCTURE:
smart-home/
├── index.html
├── style.css
├── devices.js    ← device state management, scene presets
├── controls.js   ← UI interactions, slider/toggle handlers
└── energy.js     ← energy calculation, scheduler

IMPLEMENTATION STEPS:
1. Device registry: { rooms: [{ id, name, devices: [{ id, name, type,
   status, wattage }] }] }; types: light/ac/fan/lock/camera
2. Room click: show device grid for that room; apply 'active-room' class
3. Toggle switches: input[type=checkbox] with custom CSS; onChange updates
   device.status in state + localStorage
4. AC temperature: input[type=range], value displayed in large text;
   store per-device settings
5. Scenes: preset objects mapping device IDs to states; "Apply Scene"
   iterates all devices and sets states, re-renders all toggles
6. Energy: sum wattage of all active devices; update #energy-display; add
   warning class if > 2000W
```

---

## SD-18: Subscription Billing System

```
PROJECT CONTEXT:
A SaaS billing dashboard simulation. Companies can set up subscription
plans, manage customer subscriptions, and view billing analytics.

TECH STACK:
- HTML + CSS + Vanilla JS
- Chart.js for revenue charts

FEATURES (MVP):
1. Plan management: create/edit pricing plans (name, price, billing cycle,
   features list)
2. Customer list: name, plan, billing date, status (active/past due/churned)
3. Invoice history per customer with download simulation
4. Revenue dashboard: MRR, ARR, churn rate, new subs this month
5. Chart.js line chart: MRR over last 12 months
6. Upgrade/downgrade customer plan with prorated amount shown

UI/UX AESTHETIC:
Stripe-inspired clean SaaS dashboard. White background with clear data
hierarchy. Revenue metric cards: large number + percentage change with
arrow. Customer table: sortable columns, status badges (green/red/grey
pills). Plan cards in a 3-column grid with feature checklist. MRR chart:
smooth gradient line chart (blue fill beneath the line). Font: "Inter"
at precise weights (400/500/600). Very tight, dense information layout.
CTAs: filled blue #2563eb.

FILE STRUCTURE:
subscription-billing/
├── index.html      ← dashboard overview
├── customers.html
├── plans.html
├── style.css
├── data.js         ← seed plans + customers + invoice history
├── billing.js      ← subscription logic, proration calc
└── dashboard.js    ← MRR/ARR calculation, chart init

IMPLEMENTATION STEPS:
1. Seed 3 plans + 20 customers with random plan assignments and billing
   dates distributed across the month
2. MRR calculation: sum(active_customers × their_plan_price) / 12 for
   annual plans; compute churn as churned/total_last_month × 100
3. Invoice generation: for each customer, create invoice object with id,
   amount, date, status (paid/pending) when billing_date matches today
4. Plan upgrade/downgrade modal: show current plan → new plan; proration
   = (days_remaining / days_in_cycle) × price_diff
5. MRR trend: generate 12 months of simulated MRR data with slight
   variance; pass to Chart.js
```

---

## SD-19: Recommendation System (AI/ML)

```
PROJECT CONTEXT:
A content recommendation engine demo. Shows how collaborative filtering
and content-based filtering work through an interactive visualization.
Users rate items and see how recommendations are generated.

TECH STACK:
- HTML + CSS + Vanilla JS
- Chart.js for similarity heatmap visualization

FEATURES (MVP):
1. Movie rating interface: rate 10 movies 1-5 stars
2. "Get Recommendations" runs a simplified collaborative filtering algo
   (cosine similarity between user vectors in JS)
3. Recommended movies list with similarity scores
4. Algorithm explainer: shows WHY each movie was recommended
5. Content-based tab: shows tag similarity between rated and unrated items
6. Similarity heatmap matrix using Chart.js

UI/UX AESTHETIC:
ML research tool aesthetic. Dark background (#0f0f12) with a scientific
precision feel. Rating stars: SVG stars with smooth fill animation.
Similarity scores shown as progress bars with percentage. Algorithm
explainer: clean step-by-step breakdown in a mono-code style panel.
Heatmap: Chart.js matrix chart with blue-to-red gradient. Font:
"Fira Code" for scores/code panels, "Inter" for descriptions.

FILE STRUCTURE:
recommendation-system/
├── index.html
├── style.css
├── data.js          ← mock movie data + pre-defined user ratings matrix
├── algorithm.js     ← cosine similarity, collaborative + content-based
└── visualization.js ← heatmap chart + results rendering

IMPLEMENTATION STEPS:
1. Data: 20 movies with tags (genre, year, director) + mock user ratings
   matrix (10 users × 20 movies, 0=unrated)
2. Collect current user's ratings from star inputs
3. Cosine similarity function: sim(u,v) = dot(u,v)/(|u||v|); compute
   between current user and all 10 mock users
4. Predicted rating for unrated item: weighted sum of similar users'
   ratings, weight = similarity score
5. Rank unrated movies by predicted rating → top 5 = recommendations
6. Explainer: "User4 (91% similar to you) rated Inception 4.5/5"
```

---

## SD-20: Traffic Monitoring System

```
PROJECT CONTEXT:
A smart traffic dashboard for a city grid. Shows real-time simulated
traffic density, signal timing, incident reports, and a heat map of
congested zones.

TECH STACK:
- HTML + CSS + Vanilla JS
- Leaflet.js for map visualization

FEATURES (MVP):
1. City grid map (Leaflet) with traffic density color overlays
   (green/yellow/red circles at intersections)
2. Live signal timer simulation: each intersection cycles through signals
3. Incident report: mark an intersection as "incident" which triggers
   surrounding areas to show congestion
4. Traffic stats panel: vehicles/hr per zone, avg speed, incidents count
5. Auto-refresh: simulation updates every 3 seconds
6. Historical chart: Chart.js line graph of traffic density over last hour

UI/UX AESTHETIC:
Smart city control room aesthetic. Very dark background #060810.
Leaflet map uses a dark tile layer (CartoDB Dark Matter CDN tile).
Traffic density circles pulse with CSS animation (scale + opacity).
Stats panel: fixed right sidebar with large numbers + trend indicators.
Signal timer: circular countdown rings per intersection (SVG stroke-
dasharray animation). Incidents: red blinking markers. Font: "Orbitron"
for the dashboard title, "Roboto Condensed" for data.

FILE STRUCTURE:
traffic-monitoring/
├── index.html
├── style.css
├── map.js        ← Leaflet init, circle overlays, marker management
├── simulation.js ← traffic state machine, incident logic
└── stats.js      ← aggregation, Chart.js history chart

IMPLEMENTATION STEPS:
1. Define 12 intersections with lat/lng coords (use a real city grid like
   Chandigarh Sector layout)
2. Each intersection has: density (0-100), signal_phase, incident: bool
3. Map circles: color = density < 40 green, < 70 yellow, else red;
   radius proportional to density
4. setInterval(3000): randomly vary density ±10 per intersection; 5%
   chance of new incident; update circles + stats
5. Signal simulation: each intersection rotates through Green(30s) →
   Yellow(5s) → Red(30s) cycles independently with setInterval
6. Chart: maintain array of last 20 snapshots of avg_density; update
   Chart.js line chart on each tick
```

---
# 🚀 FULL STACK DEVELOPMENT — AI PROMPTS

---

## FS-01: Smart Role-Based College Management Portal

```
PROJECT CONTEXT:
A college ERP portal with 3 roles: Admin, Faculty, Student — each with
a different dashboard and permissions. Simulates real college operations
including timetables, marks, and fee management.

TECH STACK:
- HTML + CSS + Vanilla JS
- Role-based routing via sessionStorage

FEATURES (MVP):
1. Login screen with role selection (Admin/Faculty/Student) + ID/password
2. Admin dashboard: manage students, faculty, departments, announcements
3. Faculty dashboard: view assigned courses, mark attendance, enter grades
4. Student dashboard: view timetable, marks, fee status, announcements
5. Announcements module: admin posts, all roles see
6. Simple marks entry (Faculty) → marks display (Student)

UI/UX AESTHETIC:
Clean academic SaaS portal. White background with a colored top nav
per role: Admin = deep purple #7c3aed, Faculty = teal #0f766e, Student
= indigo #4f46e5. Dashboard cards with icon + number + label (Total
Students, Today's Attendance, etc.). Sidebar navigation with icon labels.
Timetable: CSS grid weekly calendar. Marks table: clean striped rows
with grade badge (A+/A/B etc.). Font: "Plus Jakarta Sans" — modern and
institutional. Transitions between sections: smooth fade via CSS.

FILE STRUCTURE:
college-portal/
├── index.html        ← login
├── dashboard.html    ← dynamic dashboard (all roles)
├── style.css
├── auth.js           ← login, role detection, session management
├── data.js           ← seed students, faculty, courses, marks
├── admin.js          ← admin module rendering
├── faculty.js        ← faculty module rendering
└── student.js        ← student module rendering

IMPLEMENTATION STEPS:
1. Login: hardcoded credentials per role (admin/admin123, fac001/pass,
   stu001/pass); store { userId, role } in sessionStorage
2. dashboard.html: on load, check role and call render_{role}_dashboard()
3. Admin: CRUD table of students (add/edit/delete rows); announcement
   form pushes to localStorage announcements array
4. Faculty: attendance grid (student list × checkbox); marks entry form
   per student per subject
5. Student: render timetable from data.js weekly_schedule object; marks
   table from localStorage grades for student's ID
6. Role guard: each JS module checks sessionStorage role on load,
   redirects to login if mismatch
```

---

## FS-02: Secure Online Examination System

```
PROJECT CONTEXT:
A timed online exam platform. Teachers create question banks, students
take exams, results auto-process. Anti-cheat via fullscreen detection.

TECH STACK:
- HTML + CSS + Vanilla JS

FEATURES (MVP):
1. Admin: create exam (title, duration, questions as MCQ/True-False)
2. Student: enter exam code, see instructions, start exam
3. Exam interface: one question at a time with navigation, timer countdown
4. Anti-cheat: detect tab switch (document visibilitychange) → log warning
5. Auto-submit on timer end or manual submit
6. Results page: score, correct/incorrect breakdown per question

UI/UX AESTHETIC:
Focus-mode examination interface. Distraction-free full-width layout.
White background, very minimal chrome. Top bar: exam title + circular
countdown timer (SVG stroke animation, turns red at < 5 min). Question
card: large centered white card with generous padding. Option buttons:
full-width, outline style, turn blue when selected, green/red on result
review. Progress dots at bottom: filled for answered, empty for skipped.
Font: "Literata" for question text (readable), "Inter" for UI. Tab-switch
warning banner: red flash with count.

FILE STRUCTURE:
exam-system/
├── admin.html      ← exam + question creation
├── lobby.html      ← enter exam code
├── exam.html       ← exam interface
├── results.html    ← score breakdown
├── style.css
├── data.js         ← sample exam + questions
├── exam-engine.js  ← question navigation, timer, auto-submit
└── results.js      ← scoring, result rendering

IMPLEMENTATION STEPS:
1. Question schema: { id, type: 'mcq'|'truefalse', text, options:[],
   correct_answer, explanation }
2. Admin exam creator: dynamically add question forms; save exam object
   with generated 6-digit code to localStorage
3. Lobby: validate exam code → load exam → show instructions modal with
   rules + "Enter Fullscreen & Start" button
4. Exam engine: maintain { current_q: 0, answers: {}, start_time };
   navigation with prev/next; save answer on option click
5. visibilitychange listener: increment tab_switch_count, show warning
   banner; if count > 3 → force submit
6. Results: compare answers to correct_answer; calculate percentage;
   render per-question cards with user answer vs correct + explanation
```

---

## FS-03: Multi-Vendor E-Commerce Platform

```
PROJECT CONTEXT:
An Amazon-lite marketplace where multiple vendors sell products. Buyers
can filter by vendor, category, and compare products. Vendors have a
dashboard to manage their listings.

TECH STACK:
- HTML + CSS + Vanilla JS

FEATURES (MVP):
1. Product listing with vendor filter, category filter, price sort
2. Product detail page: images, description, seller info, reviews
3. Cart + checkout flow (no payment gateway)
4. Vendor dashboard: add/edit/remove products, view orders
5. Product comparison: select up to 3 products, side-by-side specs table
6. Simple review system: rating + text, shown on product page

UI/UX AESTHETIC:
Marketplace aesthetic: clean white, lots of product photography (picsum
with varied seeds). Top nav with category menu. Left filter sidebar with
checkbox groups (Category, Price Range, Rating, Vendor). Product grid:
3-column with hover quick-view overlay. Cart indicator in nav with
animated badge. Vendor dashboard: clean admin table aesthetic. Product
cards: crisp white with precise typography. Font: "Epilogue" for
headings, "Inter" for everything else. CTA: deep orange #ea580c.

FILE STRUCTURE:
multi-vendor-ecommerce/
├── index.html          ← product listing
├── product.html        ← product detail
├── cart.html
├── vendor-dashboard.html
├── style.css
├── data.js             ← 3 vendors, 20 products, categories
├── catalog.js          ← filter, sort, search logic
├── cart.js             ← cart management
└── vendor.js           ← vendor CRUD operations

IMPLEMENTATION STEPS:
1. Data: 3 vendors, each with 6-7 products; product has { id, name,
   vendor_id, price, category, images[], rating, reviews[], stock, specs{} }
2. Filter logic: chained filters on products array (category AND vendor
   AND price_range AND min_rating); re-render grid on every filter change
3. Product comparison: "Compare" checkbox on each card; store up to 3
   product IDs in Set; comparison panel slides up from bottom with specs
   table using the products' specs{} objects
4. Vendor dashboard login: vendorId + "pass" → sessionStorage; show only
   their products; add product form → push to localStorage
5. Reviews: array per product; form on product page pushes { user, rating,
   text, date }; aggregate rating as array average
```

---

## FS-04: Digital Expense Tracker

```
PROJECT CONTEXT:
A personal finance tracker. Log expenses and income, categorize them,
see spending trends with charts, and set monthly budget limits.

TECH STACK:
- HTML + CSS + Vanilla JS
- Chart.js for visualizations

FEATURES (MVP):
1. Add transaction: amount, type (expense/income), category, date, note
2. Transaction list with filter by date range + category
3. Dashboard: monthly summary (income, expenses, balance)
4. Donut chart: spending by category
5. Line chart: spending trend over last 6 months
6. Budget limits per category with progress bars + overspend alert
7. Export transactions as CSV

UI/UX AESTHETIC:
Modern personal finance app. Clean white with a green (#16a34a) income
theme. Balance card at top: large number, clean. Expense transactions:
red amount, income: green. Category icons: colorful emoji circles.
Add transaction: floating action button (+) that reveals a clean form
slide-up panel. Charts section: side-by-side donut + line chart.
Budget bars: fill from left, turn red when > 80%. Font: "Satoshi"
(premium personal finance feel). Monthly calendar mini-view showing
transaction dots on days.

FILE STRUCTURE:
expense-tracker/
├── index.html
├── style.css
├── data.js          ← seed transactions + budget limits
├── transactions.js  ← add/filter/export logic
├── dashboard.js     ← summary calculations
└── charts.js        ← Chart.js donut + line chart

IMPLEMENTATION STEPS:
1. Transaction schema: { id, type, amount, category, date, note };
   categories: Food, Transport, Shopping, Bills, Health, Entertainment,
   Salary, Freelance
2. Monthly summary: filter transactions by current month, reduce for
   total_income and total_expenses, balance = income - expenses
3. Donut chart: group expenses by category, pass as Chart.js doughnut
   with custom colors per category
4. Line chart: group by month for last 6 months, compute total expenses
   per month, pass to Chart.js line
5. Budget module: { category: limit } stored in localStorage; on dashboard
   load, compute spent/limit per category, render progress bars
6. CSV export: filter by date range, map to CSV rows, Blob download
```

---

## FS-05: Student Feedback & Rating System

```
PROJECT CONTEXT:
A university feedback portal where students rate faculty and courses.
Faculty and admin can view analytics. Anonymous submission mode.

TECH STACK:
- HTML + CSS + Vanilla JS

FEATURES (MVP):
1. Student: select course + faculty, submit 5-parameter feedback (Teaching
   Quality, Communication, Course Material, Engagement, Overall)
2. Star rating interface (5 stars per parameter)
3. Optional text comments (anonymous flag toggle)
4. Faculty view: see aggregated ratings + anonymous comments for their courses
5. Admin: see all faculty ratings, sorted by avg score, with trends
6. Department-level analytics: average scores per department

UI/UX AESTHETIC:
Academic feedback form that feels modern and Google Forms-inspired but
much cleaner. White card with generous padding for the feedback form.
Star ratings: interactive SVG stars with hover preview effect (partially
fill on hover). Parameter labels on the left, stars on the right in a
clean table layout. Result analytics: horizontal bar charts (pure CSS)
showing score per parameter. Faculty profile cards with their avg
rating prominently displayed. Font: "Nunito Sans" — approachable and
clean. Positive scores: green, below 3: amber.

FILE STRUCTURE:
feedback-system/
├── index.html        ← feedback form
├── faculty-view.html
├── admin-view.html
├── style.css
├── data.js           ← courses, faculty, departments seed
├── feedback.js       ← form submission, anonymous handling
└── analytics.js      ← aggregation, rendering

IMPLEMENTATION STEPS:
1. 5-parameter rating: render 5 rows of { label, 5-star SVG input }; store
   selection per param in ratings{} object
2. Anonymous toggle: if checked, studentId not stored with submission
3. Feedback object: { id, courseId, facultyId, ratings, comment, anon,
   timestamp }; push to localStorage feedback array
4. Faculty analytics: filter submissions by facultyId; average each param;
   render bar chart as CSS width percentages
5. Comment display: show comments for faculty's courses; prefix with
   "Anonymous Student" or student name based on anon flag
6. Admin: aggregate all faculty → compute overall avg → rank table;
   highlight lowest-rated faculty for review
```

---

## FS-06: Vehicle Service Booking System

```
PROJECT CONTEXT:
An online automotive service booking platform. Customers book service
appointments, choose service type, select time slots, and track their
vehicle's service status.

TECH STACK:
- HTML + CSS + Vanilla JS

FEATURES (MVP):
1. Service menu: Oil Change, Tire Rotation, Brake Check, Full Service,
   AC Service — with prices and duration
2. Slot picker: weekly calendar view, available slots (9AM-6PM, hourly)
3. Booking form: vehicle details (make, model, year, reg number)
4. My Bookings: list with service status tracker
5. Admin panel: view all bookings, update service status
6. Service status: Booked → Vehicle Received → Work In Progress → Ready

UI/UX AESTHETIC:
Automotive service center meets tech product. Dark grey (#1a1a2e) header
with chrome-like accent (#e2e8f0 silver). Service cards: dark card with
service icon, price highlighted in orange #f97316. Slot picker: calendar
grid with color-coded availability (green/grey). Vehicle registration
input styled like an actual number plate (yellow bg, black text, border
radius). Service tracker: horizontal status bar with car icon that moves.
Font: "Rajdhani" for headings (industrial), "Inter" for body.

FILE STRUCTURE:
vehicle-service/
├── index.html         ← service selection
├── booking.html       ← slot selection + form
├── my-bookings.html
├── admin.html
├── style.css
├── services.js        ← service data, slot generation
├── booking.js         ← booking flow, localStorage CRUD
└── admin.js           ← admin status management

IMPLEMENTATION STEPS:
1. Generate weekly slots: for each day Mon-Sat, create slots from 9AM
   to 6PM, mark some as 'booked' randomly in localStorage on first init
2. Service selection: click service card → highlight + store selected
   service; pass to booking page via sessionStorage
3. Slot grid: render 6 days × 9 slots; grey out booked slots; click picks
   slot, highlights it; disabled + cursor:not-allowed for booked
4. Booking form: vehicle details + confirm; booking ID = `SVC-${timestamp}`;
   mark slot as booked in localStorage
5. My Bookings: filter by phone number (entered in a simple form); render
   booking cards with current status + service type
6. Admin: show all bookings in table; status dropdown → update booking
   status → triggers SMS simulation toast
```

---

## FS-07: Online Quiz Platform

```
PROJECT CONTEXT:
An interactive quiz platform with multiple quiz categories, timed rounds,
leaderboard, and detailed results analysis. Teachers can create quizzes.

TECH STACK:
- HTML + CSS + Vanilla JS

FEATURES (MVP):
1. Quiz lobby: browse available quizzes by category (Science, History,
   Tech, Sports, General Knowledge)
2. Timed quiz interface: 30s per question, progress bar, question counter
3. Immediate feedback: correct/incorrect flash + explanation after each answer
4. Results page: score, time taken, accuracy %, question-by-question review
5. Leaderboard: top 10 scores per quiz (localStorage)
6. Quiz creator (teacher mode): add questions with options + correct answer

UI/UX AESTHETIC:
Game-like quiz energy without being childish. Dark background #0f0a1e.
Quiz cards in lobby: gradient cards (each category has distinct gradient:
Science = blue-cyan, History = amber-red, Tech = purple-blue). Timer bar:
fills → depletes left-to-right, turns red when < 10s remaining. Answer
buttons: 4 large rounded cards in a 2×2 grid; correct answer turns green
with a checkmark, wrong turns red with X. Score display: large animated
counter on results page. Font: "Fredoka" for headings (fun), "Inter" for
question text.

FILE STRUCTURE:
quiz-platform/
├── index.html        ← quiz lobby
├── quiz.html         ← quiz interface
├── results.html
├── leaderboard.html
├── creator.html      ← teacher quiz builder
├── style.css
├── data.js           ← sample quizzes + questions per category
├── quiz-engine.js    ← timer, answer evaluation, navigation
└── leaderboard.js    ← score management, ranking

IMPLEMENTATION STEPS:
1. Quiz data: 3 quizzes × 10 questions each; question: { text, options[4],
   correct_index, explanation }
2. Lobby: render quiz cards with title, category, question_count,
   avg_difficulty, best_score from localStorage
3. Quiz engine: load questions from selected quiz; per question: start 30s
   countdown with setInterval; update progress bar width = (time/30 × 100)%
4. Answer selection: disable all options after click; highlight correct/wrong;
   show explanation div; 1.5s delay before next question
5. Results: calculate score, time, accuracy; render per-question mini cards
   with green/red indicator; push score to leaderboard array
6. Leaderboard: read all scores for current quiz, sort desc, render top 10
   with rank medals (🥇🥈🥉) for top 3
```

---

## FS-08: Customer Support Ticketing System

```
PROJECT CONTEXT:
A Zendesk-lite support ticket system. Customers submit support requests,
agents manage and resolve tickets with priority queuing.

TECH STACK:
- HTML + CSS + Vanilla JS

FEATURES (MVP):
1. Customer portal: submit ticket (subject, description, category, priority)
2. Ticket tracking by email: see status + agent replies
3. Agent dashboard: all tickets sorted by priority, filter by status
4. Ticket detail: thread view (customer + agent messages), status control
5. Quick reply templates for agents (predefined responses)
6. SLA indicator: time elapsed since ticket creation (color coded)

UI/UX AESTHETIC:
Professional customer support tool. White sidebar + white content area
with light grey (#f8fafc) ticket list background. Ticket cards: left
colored border by priority (red=urgent, orange=high, blue=normal,
grey=low). Thread view: chat-like alternating left/right bubbles
(customer left, agent right). SLA timer: small clock icon + elapsed
time, turns red if >24h without response. Status badges: pill-shaped.
Font: "Inter" — this is purely functional. Clean, dense, efficient.

FILE STRUCTURE:
support-ticketing/
├── customer.html     ← submit + track
├── agent.html        ← agent dashboard
├── ticket.html       ← ticket detail thread
├── style.css
├── data.js           ← seed tickets + templates
├── tickets.js        ← ticket CRUD, status management
└── agent.js          ← agent-specific logic, templates

IMPLEMENTATION STEPS:
1. Ticket schema: { id, subject, description, category, priority,
   status: 'open'|'in_progress'|'resolved'|'closed', customer_email,
   messages: [{ sender, text, timestamp }], created_at }
2. Customer submit: generate ticket ID, store, show confirmation with
   ticket ID; track page searches by email
3. Agent list: sort tickets by priority weight (urgent=4, high=3, etc.),
   then by created_at; filter bar for status
4. Ticket thread: render messages as alternating bubbles; agent reply
   textarea with quick-reply template dropdown above it
5. SLA timer: for each ticket in list, compute elapsed = Date.now() -
   created_at, display in human readable (2h 30m), red if > threshold
6. Quick reply templates: array of canned responses; dropdown inserts
   selected template text into reply textarea
```

---

## FS-09: HR Recruitment & Interview Scheduling System

```
PROJECT CONTEXT:
A recruiting workflow tool. HR creates job postings, candidates apply,
HR shortlists and schedules interviews, tracks candidates through stages.

TECH STACK:
- HTML + CSS + Vanilla JS

FEATURES (MVP):
1. Job posting CRUD: create job with title, department, skills, deadline
2. Candidate application form: name, email, skills, resume URL, experience
3. HR pipeline board: Kanban with stages (Applied → Screened → Interview
   → Offer → Hired/Rejected)
4. Interview scheduler: pick candidate + slot from calendar widget
5. Interview confirmation modal with details
6. Candidate search + filter by skills/status

UI/UX AESTHETIC:
Modern HR tech product. Clean white with indigo #4f46e5 accents.
Job cards: clean list view with department badge and "N applicants"
counter. Pipeline Kanban: columns with candidate avatars (initials +
color). Interview calendar: mini month calendar with booked slots
highlighted. Candidate profile modal: two-column layout (info left,
timeline right). Offer stage cards: subtle green glow. Font:
"DM Sans" — professional, approachable. Status transitions with
smooth card movement animations.

FILE STRUCTURE:
hr-recruitment/
├── index.html         ← job listings
├── apply.html         ← candidate application
├── pipeline.html      ← HR kanban board
├── scheduler.html     ← interview scheduling
├── style.css
├── data.js            ← seed jobs + candidates
├── pipeline.js        ← kanban drag-drop + stage management
└── scheduler.js       ← calendar + interview slot logic

IMPLEMENTATION STEPS:
1. Job creation form: dynamic skills tag input (press comma to add tag);
   save to localStorage; display on listings page
2. Application form: validate required fields; push candidate to
   job.applicants[] array with status: 'Applied'
3. Pipeline kanban: same drag-drop pattern as task manager but stages
   are recruitment-specific; candidate card shows name + position
4. Scheduler: grid of this week's days × hourly slots; click booked slot
   shows interview details; book new: select candidate + slot → save
5. Interview notification: "SMS simulation" toast after booking: "Interview
   scheduled for [Name] on [date] at [time]"
6. Skills filter: candidate list with multi-select skills filter (AND logic)
```

---

## FS-10: Course Certification Platform

```
PROJECT CONTEXT:
An online learning platform with courses, progress tracking, quizzes,
and digital certificate generation on completion.

TECH STACK:
- HTML + CSS + Vanilla JS
- jsPDF (CDN) for PDF certificate generation

FEATURES (MVP):
1. Course catalog: browse courses with category, duration, level filters
2. Course detail: syllabus, instructor info, enrollment
3. Course player: lesson list with video embed (YouTube embed) + notes
4. Progress tracking: completed lessons checklist → % complete
5. End-of-course quiz (5 questions, must score 80%+ to pass)
6. Certificate generator: generate PDF certificate with jsPDF on passing

UI/UX AESTHETIC:
Udemy/Coursera-inspired but cleaner and more modern. Warm cream (#fdf6e3)
background for reading comfort. Course cards: flat design with category
color stripe at top. Progress bar: below enrolled course cards. Course
player: video on left (65%) + lesson list sidebar (35%). Lesson items:
checkboxes that fill green on completion. Certificate: portrait PDF
with decorative border, course name in a display serif font, university-
style seal. Font: "Merriweather" for course titles, "Open Sans" for body.

FILE STRUCTURE:
certification-platform/
├── index.html         ← course catalog
├── course.html        ← course detail + enroll
├── player.html        ← lesson player
├── certificate.html   ← certificate preview + download
├── style.css
├── data.js            ← courses, lessons, quiz questions
├── player.js          ← progress tracking, lesson navigation
├── quiz.js            ← end-course quiz engine
└── certificate.js     ← jsPDF certificate generation

IMPLEMENTATION STEPS:
1. Course data: 4 courses each with { id, title, instructor, lessons:[],
   category, duration, level, quiz_questions[] }
2. Enrollment: save { userId, courseId, progress: {}, enrolled_at } to
   localStorage; enrolled badge on course card
3. Player: render lesson list from course.lessons; clicking lesson marks
   it complete in progress object; % = completed/total × 100
4. Certificate generation with jsPDF:
   - addRect for decorative border
   - setFont + setFontSize for title "Certificate of Completion"
   - fillText for course name, student name, date
   - addImage for a simple SVG seal converted to dataURL
5. Quiz gate: must complete all lessons before quiz; must score 80%+
   before certificate button appears
```

---

## FS-11: Travel Booking & Itinerary Management

```
PROJECT CONTEXT:
A MakeMyTrip-lite travel planning tool. Search flights/hotels, build
a multi-day itinerary, and get a shareable PDF travel plan.

TECH STACK:
- HTML + CSS + Vanilla JS
- jsPDF for itinerary export

FEATURES (MVP):
1. Flight search: origin, destination, date → show mock flight results
   with price, airline, duration
2. Hotel search: city, dates → mock hotel results
3. Itinerary builder: day-by-day drag-and-drop activity planner
4. Budget tracker: add costs per item, running total
5. Packing checklist (customizable)
6. Export full itinerary as PDF

UI/UX AESTHETIC:
Travel & wanderlust aesthetic. Hero with a full-bleed destination image.
Search bar: clean pill-shaped form overlay. Flight cards: airline logo
circle, departure/arrival times prominently displayed with a horizontal
timeline connector (●─────●). Hotel cards: room photo, star rating,
price per night. Itinerary builder: timeline-style day view with
activity cards that can be reordered. Budget pie chart (Chart.js).
Font: "Josefin Sans" for headings (adventurous), "Roboto" for details.
Color: deep sky blue #0284c7 + sandy beige.

FILE STRUCTURE:
travel-booking/
├── index.html         ← search page
├── results.html       ← flight + hotel results
├── itinerary.html     ← itinerary builder
├── style.css
├── data.js            ← mock flights, hotels, destinations
├── search.js          ← filter + sort logic
├── itinerary.js       ← day builder, drag-sort
└── export.js          ← jsPDF itinerary generation

IMPLEMENTATION STEPS:
1. Mock flight data: 5 routes × 3 flights each with { airline, depart,
   arrive, duration, price, class, stops }; filter by origin/destination/date
2. Flight cards: show timeline (origin ●──duration──● destination), price,
   "Book" button that adds to itinerary
3. Itinerary builder: data structure { days: [{ date, activities: [] }] };
   each activity: { time, title, location, cost, type }
4. Drag-sort activities within a day using HTML5 drag API
5. Budget: sum all activity.cost values, show total + breakdown by type
6. PDF export: jsPDF multi-page doc with day-by-day activities table,
   total budget summary on last page
```

---

## FS-12: E-Learning Doubt Resolution Platform

```
PROJECT CONTEXT:
A StackOverflow-for-students platform. Students post doubts by subject,
faculty/peers answer, solutions are voted and marked resolved.

TECH STACK:
- HTML + CSS + Vanilla JS

FEATURES (MVP):
1. Post a doubt: subject, title, description with code block support
2. Browse doubts with filters (subject, status: open/resolved, latest/top)
3. Answer a doubt: rich text reply with upvote/downvote
4. Mark as resolved: questioner marks best answer → green resolved badge
5. Tag-based search (#javascript, #dbms, etc.)
6. User activity score (reputation points for answers + votes)

UI/UX AESTHETIC:
Minimal knowledge-sharing platform aesthetic. Clean white, very StackOverflow-
inspired but warmer. Left sidebar: subject filter list. Center: doubt
feed. Right: top contributors list. Doubt cards: title, tag pills, vote
count, answer count, asker info + time. Open doubts: white card, Resolved:
subtle green left border + "Resolved" badge. Code blocks: dark background
monospace sections within doubt text. Vote arrows: SVG triangles, up-voted
turns indigo. Font: "Source Sans 3" for text, "Source Code Pro" for code.

FILE STRUCTURE:
doubt-platform/
├── index.html         ← doubt feed
├── doubt.html         ← doubt detail + answers
├── post.html          ← create doubt
├── style.css
├── data.js            ← seed doubts + answers + users
├── feed.js            ← filter, sort, render doubts
├── doubt.js           ← answer submission, voting
└── reputation.js      ← user score management

IMPLEMENTATION STEPS:
1. Doubt schema: { id, subject, title, description, tags[], answers:[],
   votes, status: 'open'|'resolved', asker_id, timestamp }
2. Feed: render doubt cards, apply subject filter and sort (newest/top
   votes/unanswered); tag chips are clickable filters
3. Doubt detail: render question, then answers sorted by vote count desc;
   "accepted answer" shown first with green checkmark background
4. Post doubt: textarea with code block formatting (wrap `code` in <pre>);
   tag input with autocomplete from existing tags
5. Voting: ±1 vote per user per post (track in localStorage voted_items{});
   update count + button state
6. Reputation: answerer gets +10 for accepted answer, +2 for upvote on
   answer; display on user profile
```

---

## FS-13: Freelancer Marketplace Platform

```
PROJECT CONTEXT:
An Upwork-lite connecting freelancers with clients. Freelancers list
services (gigs), clients post projects and hire. Simulates the full
hire-to-delivery workflow.

TECH STACK:
- HTML + CSS + Vanilla JS

FEATURES (MVP):
1. Gig listings: browse freelancer services with category + budget filter
2. Freelancer profile: skills, portfolio, ratings, hourly rate
3. Post a project: title, description, budget range, required skills
4. Bid on project: freelancers submit proposals with bid amount + message
5. Hire flow: client reviews bids, hires one → status changes to "In Progress"
6. Review & rating: after project completion, both parties rate each other

UI/UX AESTHETIC:
Professional gig economy aesthetic. Clean white + warm grey tones.
Freelancer cards: avatar with online indicator dot, skill tags, rating
stars, starting price. Gig cover images (picsum). Project listing:
compact list view with budget badge and "X bids" indicator. Proposal
cards: clean with bid amount highlighted. Hire button: prominent green
#16a34a. Proposal comparison view: side-by-side cards. Font: "Nunito"
— friendly and professional. Progress indicators for project status.

FILE STRUCTURE:
freelancer-marketplace/
├── index.html            ← gig/project browse
├── freelancer.html       ← freelancer profile
├── project.html          ← project detail + bids
├── post-project.html
├── style.css
├── data.js               ← mock freelancers, gigs, projects
├── marketplace.js        ← filter, browse logic
├── project.js            ← bid management, hire flow
└── review.js             ← rating submission

IMPLEMENTATION STEPS:
1. Freelancer data: 8 freelancers with { name, skills[], hourly_rate,
   rating, portfolio_items[], bio, gigs[] }
2. Gig listings: filter by category (Design/Dev/Writing/Marketing) and
   max budget slider; sort by rating/price
3. Bid system: project.bids[] array; each bid has freelancer_id, amount,
   cover_letter, status: 'pending'|'hired'|'rejected'
4. Hire flow: clicking "Hire" on a bid → set that bid status to 'hired',
   others to 'rejected'; project status → 'in_progress'
5. Review: after project completion, show rating modal for both sides;
   update freelancer's rating as rolling average
6. Project detail: tabbed view (Description | Bids | Messages)
```

---

## FS-14: Smart City Issue Reporting System

```
PROJECT CONTEXT:
A citizen portal to report civic issues (potholes, broken streetlights,
garbage, etc.) by location. Authorities see all reports on a map and
update resolution status.

TECH STACK:
- HTML + CSS + Vanilla JS
- Leaflet.js for the city map

FEATURES (MVP):
1. Citizen: report issue with category, description, photo URL, map pin
2. Map view: all open issues as colored markers on Leaflet map by category
3. Issue list view: sortable by date, category, upvotes
4. Upvote mechanism: citizens upvote existing issues to signal priority
5. Authority panel: change issue status, add resolution notes
6. Stats widget: issues by category, resolution rate, avg resolution time

UI/UX AESTHETIC:
Civic tech aesthetic — accessible, clear, official but modern. White
background with dark navy #1e3a5f header. Map takes prominent space.
Issue markers: emoji icons per category on map (🕳 pothole, 💡 streetlight,
🗑 garbage). Issue cards below map: left border color per category.
Upvote button: like a Reddit upvote with count. Authority panel:
clean dashboard with resolution workflow. Status badges: color-coded
(red=open, amber=in_progress, green=resolved). Font: "Noto Sans" —
maximally accessible.

FILE STRUCTURE:
city-issues/
├── citizen.html       ← report + browse issues
├── authority.html     ← management panel
├── style.css
├── data.js            ← seed issues + categories
├── map.js             ← Leaflet map + markers
├── issues.js          ← report submission, upvote, CRUD
└── stats.js           ← aggregation, charts

IMPLEMENTATION STEPS:
1. Issue schema: { id, category, description, photo_url, lat, lng, status,
   upvotes, reports_count, created_at, resolution_notes, resolved_at }
2. Map: Leaflet with custom DivIcon per category; click marker opens
   issue detail popup with status + upvote button
3. Report form: click on map to place new marker (record lat/lng from
   click event); fill form → submit → marker appears immediately
4. Upvote: localStorage tracks upvoted issue IDs per session; toggle +1/-1
5. Stats: Chart.js donut for category distribution; resolution rate =
   resolved/total × 100%; avg_time = mean of (resolved_at - created_at)
6. Authority: table with all issues + quick status dropdown + resolution
   notes textarea per row
```

---

## FS-15: Secure File Sharing System

```
PROJECT CONTEXT:
A Google Drive-lite for secure document sharing. Upload files (simulated
via FileReader API), organize in folders, share with access links, set
expiry on shared links.

TECH STACK:
- HTML + CSS + Vanilla JS
- FileReader API for local file handling

FEATURES (MVP):
1. File upload: drag-and-drop or click upload (FileReader reads file as
   dataURL, stores in localStorage/IndexedDB)
2. File/folder browser with grid and list view toggle
3. File preview: images show preview, PDFs show page count info
4. Share link generation: random token + optional password + expiry time
5. Shared file access page: validate token + password + expiry
6. File operations: rename, delete, move to folder, download

UI/UX AESTHETIC:
Premium file management aesthetic. Dark sidebar (#1a1a2e) with icon+name
folder tree. Main area: white with files in a clean grid (like macOS
Finder). File cards: icon based on type (🖼 image, 📄 PDF, 📝 text, etc.)
or thumbnail preview. Drag-and-drop zone: dashed border that pulses blue
when dragging over. Share modal: link with copy button + expiry picker.
Font: "SF Pro"-like feel with "System UI" or "Geist". Upload progress bar:
smooth fill animation. Selection: cmd-click style multi-select.

FILE STRUCTURE:
file-sharing/
├── index.html        ← file browser
├── shared.html       ← shared file access
├── style.css
├── storage.js        ← localStorage/IndexedDB file CRUD
├── uploader.js       ← FileReader integration, drag-drop
├── share.js          ← token generation, access validation
└── ui.js             ← grid/list toggle, selection, preview

IMPLEMENTATION STEPS:
1. File schema: { id, name, type, size, dataURL, folder_id, created_at,
   shared_token: null, share_password: null, share_expires: null }
2. FileReader upload: input[type=file] change event; for each file, read
   as dataURL; warn if file > 2MB (localStorage limit concern)
3. Grid view: render file cards with correct icon; img files show
   thumbnail (src = dataURL); click file opens detail modal
4. Share generation: crypto.randomUUID() or Math.random().toString(36)
   for token; store token→fileId map in localStorage
5. shared.html: parse token from URL; validate expiry (Date.now() vs
   share_expires); if password protected, show input form first
6. Drag-drop upload: dragover preventDefault, drop reads event.dataTransfer.files
```

---

## FS-16: Online Doctor Consultation Platform

```
PROJECT CONTEXT:
A Practo-lite telemedicine portal. Patients search doctors by specialty,
book video consultation slots, and receive digital prescriptions.

TECH STACK:
- HTML + CSS + Vanilla JS

FEATURES (MVP):
1. Doctor directory: filter by specialty, experience, rating, fee range
2. Doctor profile: bio, qualifications, available slots, patient reviews
3. Slot booking: weekly calendar of available slots
4. Consultation room: simulated (video placeholder + chat + prescription form)
5. Digital prescription: generate and "download" as printable HTML page
6. Medical history: patient's past consultations list

UI/UX AESTHETIC:
Healthcare meets premium digital product. Clean white with calming blue
#0ea5e9 + green #10b981 accents. Doctor cards: photo (picsum), specialty
badge in colored chip, star rating, consultation fee prominently shown.
Slot picker: pill-shaped time slots (09:00 / 09:30 / 10:00...) in a grid;
available: white, booked: grey, selected: blue. Consultation room:
two-column (video left, chat + prescription right). Prescription: clean
printable format with doctor letterhead styling. Font: "Lexend" — highly
legible (healthcare accessibility standard).

FILE STRUCTURE:
doctor-consultation/
├── index.html          ← doctor search
├── doctor.html         ← profile + slot booking
├── consultation.html   ← consultation room
├── prescription.html   ← prescription view/print
├── style.css
├── data.js             ← mock doctors, specialties, slots
├── booking.js          ← slot selection, appointment CRUD
└── prescription.js     ← prescription form + print

IMPLEMENTATION STEPS:
1. Doctor data: 8 doctors across specialties (GP, Cardiologist, Dermatologist,
   Pediatrician, Psychiatrist); each with slots[], fee, experience, bio
2. Directory filters: multi-select specialty, fee range slider, min rating;
   real-time filter on array
3. Slot booking: render 5 days × hourly slots; click to select; confirm
   button shows appointment ID
4. Consultation room: video area is a placeholder div with camera-off icon;
   chat sends messages to room log; prescription form: complaints, diagnosis,
   medicines (dynamic add rows), advice
5. Prescription page: render prescription data in a clean medical format
   with @media print CSS for proper printing
```

---

## FS-17: Warehouse Logistics System

```
PROJECT CONTEXT:
A warehouse management tool. Track inventory across warehouse zones,
manage incoming/outgoing orders, and optimize storage allocation.

TECH STACK:
- HTML + CSS + Vanilla JS
- Chart.js for inventory visualizations

FEATURES (MVP):
1. Warehouse map: visual grid of zones (A1–D5 = 20 storage locations)
   showing occupancy
2. Inventory dashboard: total SKUs, stock levels, low-stock alerts
3. Inbound: receive shipment form → update inventory + zone allocation
4. Outbound: process order → pick items → deduct from inventory
5. Zone visualization: color-coded capacity per zone (empty/partial/full)
6. Reports: daily inbound/outbound summary with Chart.js bar chart

UI/UX AESTHETIC:
Industrial operational dashboard. Dark graphite (#1a1c20) header + sidebar.
Warehouse grid: top-down blueprint view with zone cells colored by
capacity (green→yellow→red gradient). Inventory table: dense, sortable,
with low-stock rows highlighted yellow. Inbound form: clean card with
barcode-style SKU input design. Outbound order processing: step-by-step
"pick list" workflow. Capacity bars: horizontal fill bars per zone.
Font: "IBM Plex Mono" for SKUs/quantities, "IBM Plex Sans" for labels.

FILE STRUCTURE:
warehouse-logistics/
├── index.html          ← dashboard overview
├── inventory.html      ← full inventory table
├── inbound.html        ← receive shipment
├── outbound.html       ← process order
├── style.css
├── data.js             ← seed inventory, zones, orders
├── inventory.js        ← stock management
├── warehouse-map.js    ← visual grid rendering
└── reports.js          ← Chart.js summary charts

IMPLEMENTATION STEPS:
1. SKU schema: { id, name, category, quantity, zone, min_stock, unit_price }
2. Warehouse zones: 20 zones each with { id, capacity: 100, current_items: 0 }
3. Inbound form: SKU search/create, quantity input, auto-assign zone (first
   zone with available capacity)
4. Outbound: order items list; for each item, validate stock ≥ ordered_qty;
   deduct from inventory; if stock drops below min_stock, add to alerts
5. Warehouse grid: forEach zone → div with background-color = capacity ratio
   (0%=green, 50%=yellow, 90%=red); tooltip on hover with zone details
6. Reports: daily summary by grouping inbound/outbound by date; Chart.js
   grouped bar chart
```

---

## FS-18: Real-Time Sports Analytics Dashboard

```
PROJECT CONTEXT:
A live sports analytics dashboard showing player stats, team performance,
match timelines, and heat maps. Data is simulated with realistic patterns.

TECH STACK:
- HTML + CSS + Vanilla JS
- Chart.js for all data visualizations

FEATURES (MVP):
1. Match scoreboard: live score simulation (auto-updates) + match timer
2. Team stats comparison: possession, shots, passes, fouls side-by-side
3. Player performance table: goals, assists, rating, minutes played
4. Match event timeline: goals, cards, substitutions in chronological order
5. Formation display: SVG soccer field with player position dots
6. Shot map: SVG goal visualization showing shot locations + outcomes

UI/UX AESTHETIC:
Sports broadcast overlay meets premium sports analytics app. Very dark
background #030a12. Neon accent: team colors (dynamically set per team).
Scoreboard: large bold team names, score in massive numbers. Stats
comparison: horizontal bars that fill from center outward (team A left,
team B right). Formation SVG: green pitch background with white lines,
player dots as circles with jersey numbers. Event timeline: vertical
line with event icons (⚽🟥🟨🔄) at correct minute marks. Font:
"Bebas Neue" for scores, "Barlow" for stats.

FILE STRUCTURE:
sports-analytics/
├── index.html          ← match dashboard
├── style.css
├── data.js             ← mock match data, players, events
├── scoreboard.js       ← live score simulation
├── stats.js            ← team stat charts (Chart.js)
├── formation.js        ← SVG formation renderer
└── timeline.js         ← match event timeline

IMPLEMENTATION STEPS:
1. Define match data: 2 teams, 11 players each with positions, initial
   stats; match events array with { minute, type, player, team }
2. Score simulation: setInterval(5000ms) → 8% chance of goal event;
   add event to timeline; update score display with flash animation
3. Team stats bar comparison: each stat renders as two bars extending
   from center (left = teamA, right = teamB); CSS transitions animate
   on stat update
4. Formation SVG: hardcode 4-3-3 positions as % coordinates; map players
   to positions; render as SVG circles with text labels
5. Shot map: SVG element matching goal shape; render circles at x,y coords
   for each shot; green = goal, red = saved, grey = off target
6. Timeline: position event markers absolutely at (minute/90 × 100)% of
   timeline height; tooltip on hover
```

---

## FS-19: CI/CD Full Stack Application (DevOps)

```
PROJECT CONTEXT:
A DevOps demonstration project. A simple React + Node.js todo app with
a complete CI/CD pipeline using GitHub Actions — automated testing, Docker
build, and deployment simulation.

TECH STACK:
- React (frontend) + Node.js/Express (backend)
- Docker + docker-compose
- GitHub Actions (CI/CD pipeline)
- Jest for tests

FEATURES (MVP):
1. Full-stack Todo app (React frontend + REST API backend)
2. GitHub Actions workflow: on push to main → lint + test → Docker build
3. Dockerfile for both frontend and backend
4. docker-compose.yml: orchestrate frontend + backend + MongoDB
5. Jest unit tests for backend API routes
6. README with pipeline diagram and setup instructions

FILE STRUCTURE:
cicd-fullstack-app/
├── .github/
│   └── workflows/
│       └── ci-cd.yml        ← GitHub Actions pipeline
├── frontend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/
│   │       └── TodoList.jsx
│   └── package.json
├── backend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── server.js
│   │   ├── routes/todos.js
│   │   └── models/Todo.js
│   ├── tests/
│   │   └── todos.test.js
│   └── package.json
├── docker-compose.yml
└── README.md

CI/CD PIPELINE (ci-cd.yml) CONTENTS:
  on: [push to main, pull_request]
  jobs:
    test:
      - checkout code
      - setup Node.js 18
      - npm install (backend)
      - npm test (Jest)
      - npm install (frontend)
      - npm run build (React)
    docker-build:
      needs: test
      - docker buildx build frontend
      - docker buildx build backend
      - push to GitHub Container Registry (ghcr.io)
    deploy (simulated):
      needs: docker-build
      - echo "Deploying to production server..."
      - simulated SSH deploy command

IMPLEMENTATION STEPS:
1. Backend: Express server with CRUD routes /api/todos;
   GET / POST / PUT /:id / DELETE /:id; in-memory array (no DB needed)
2. Backend tests: Jest + supertest; test each CRUD route with assertions
3. Frontend: React with useState hook; fetch todos from API on mount;
   add/toggle/delete with API calls
4. Dockerfiles: multi-stage builds; frontend nginx serve, backend node:18-alpine
5. docker-compose: services: frontend (port 3000), backend (port 5000),
   networks: app-network; frontend depends_on: backend
6. README: ASCII pipeline diagram + docker-compose up instructions
```

---
# ☁️ CLOUD COMPUTING — AI PROMPTS
> **Note for Cloud Projects:** Each project ships with two deliverables:
> 1. An interactive **demo UI** (HTML/JS) that simulates/visualizes the AWS concept
> 2. A complete **AWS setup guide** (Markdown) with exact CLI commands and architecture diagram

---

## CC-01: Personal Portfolio Website on EC2

```
PROJECT CONTEXT:
Deploy a personal portfolio as a static website on AWS EC2 with Apache.
The demo UI is the actual portfolio; the guide covers EC2 + Apache setup.

TECH STACK:
- HTML + CSS (portfolio) + Vanilla JS
- AWS EC2 t2.micro, Apache HTTP Server
- SSH for deployment

PORTFOLIO UI AESTHETIC:
Minimal dark portfolio. Background: #0d0d0d. Name in large display
type at center, brief tagline below. Projects in a horizontal scroll
or 3-column grid. Sections: About / Projects / Skills / Contact.
Smooth scroll navigation. Hover on project cards reveals overlay with
links. Font: "Clash Display" or "Space Grotesk". No gradients — pure
typography and whitespace.

FILE STRUCTURE:
portfolio-on-ec2/
├── README.md              ← EC2 + Apache setup guide
├── website/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── aws-setup/
    ├── setup-guide.md     ← Step-by-step EC2 setup
    └── apache-config.conf ← Virtual host config

SETUP GUIDE CONTENTS (setup-guide.md):
1. Launch EC2 t2.micro (Amazon Linux 2023 AMI)
   aws ec2 run-instances --image-id ami-0c02fb55956c7d316 \
     --instance-type t2.micro --key-name MyKeyPair \
     --security-group-ids sg-xxx
2. Configure Security Group: allow port 80 (HTTP) + 22 (SSH)
   aws ec2 authorize-security-group-ingress --group-id sg-xxx \
     --protocol tcp --port 80 --cidr 0.0.0.0/0
3. SSH into instance + install Apache:
   ssh -i MyKeyPair.pem ec2-user@<public-ip>
   sudo yum install httpd -y && sudo systemctl start httpd
4. Upload website files:
   scp -i MyKeyPair.pem -r ./website/* ec2-user@<ip>:/var/www/html/
5. Access via http://<EC2-PUBLIC-IP>

DEMO UI ADDITIONS:
Add an "Architecture" section to the portfolio showing:
- Browser → EC2 → Apache → HTML files
- Rendered as a CSS diagram with animated arrows
```

---

## CC-02: Photo Gallery with S3

```
PROJECT CONTEXT:
Host a photo gallery as a static website directly on AWS S3 with public
bucket policy. The gallery fetches images from S3 bucket URLs.

TECH STACK:
- HTML + CSS + Vanilla JS (gallery UI)
- AWS S3 Static Website Hosting

GALLERY UI AESTHETIC:
Photography portfolio gallery. Pure black background. Images in a
masonry CSS grid layout (columns: 3 on desktop, 2 on tablet, 1 on
mobile). Images load lazily with a blur-up placeholder (CSS filter
blur → none transition). Lightbox: clicking image opens full-screen
overlay with prev/next navigation. Upload indicator for new photos.
Font: minimal — only a top title bar. Album categories: pill tabs.

FILE STRUCTURE:
photo-gallery-s3/
├── README.md           ← S3 setup guide
├── gallery/
│   ├── index.html
│   ├── style.css
│   └── gallery.js      ← image loading, lightbox, lazy load
├── sample-images/      ← 5 sample images for testing
└── aws-setup/
    ├── setup-guide.md
    └── bucket-policy.json

BUCKET POLICY (bucket-policy.json):
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::my-gallery-bucket/*"
  }]
}

SETUP GUIDE CONTENTS:
1. Create S3 bucket: aws s3 mb s3://my-portfolio-gallery
2. Enable static website hosting:
   aws s3 website s3://my-gallery-bucket/ --index-document index.html
3. Apply public bucket policy:
   aws s3api put-bucket-policy --bucket my-gallery-bucket \
     --policy file://bucket-policy.json
4. Upload gallery files:
   aws s3 sync ./gallery/ s3://my-gallery-bucket/
5. Access: http://my-gallery-bucket.s3-website-us-east-1.amazonaws.com
6. Upload new photos:
   aws s3 cp photo.jpg s3://my-gallery-bucket/photos/

GALLERY JS IMPLEMENTATION:
- Replace image src with actual S3 URLs after setup
- Masonry layout: CSS columns + break-inside: avoid
- Lightbox: position:fixed overlay with keyboard navigation
```

---

## CC-03: EC2 Instance Auto-Stop Scheduler

```
PROJECT CONTEXT:
Automate EC2 instance shutdown during non-business hours to reduce costs.
Uses Lambda + EventBridge (CloudWatch Events) on a cron schedule.

DEMO UI: A scheduling dashboard showing:
- Current instance status (simulated)
- Schedule configuration (business hours picker)
- Cost savings calculator
- Execution history log

TECH STACK:
- HTML + CSS + JS (demo dashboard)
- AWS Lambda (Python) + EventBridge + EC2 API

DEMO UI AESTHETIC:
Cost optimization dashboard. Dark green theme (savings = green).
Instance status card: large colored indicator (green=running, red=stopped).
Schedule picker: visual 24-hour timeline with draggable "business hours"
window. Cost savings: animated counter showing $/month saved. Execution
log: terminal-style dark card with timestamped entries.
Font: "Fira Code" for the logs, "Inter" for UI.

FILE STRUCTURE:
ec2-auto-stop/
├── README.md
├── dashboard/
│   ├── index.html
│   ├── style.css
│   └── dashboard.js      ← simulated scheduler UI
└── aws-setup/
    ├── setup-guide.md
    ├── lambda_stop.py    ← Lambda function to stop instances
    ├── lambda_start.py   ← Lambda function to start instances
    └── eventbridge-rules.json

LAMBDA FUNCTION (lambda_stop.py):
import boto3
def lambda_handler(event, context):
    ec2 = boto3.client('ec2', region_name='us-east-1')
    instance_ids = ['i-1234567890abcdef0']  # Replace with your IDs
    response = ec2.stop_instances(InstanceIds=instance_ids)
    print(f"Stopped: {[i['InstanceId'] for i in response['StoppingInstances']]}")
    return {'statusCode': 200}

SETUP GUIDE CONTENTS:
1. Create Lambda execution role with EC2:StopInstances permission
2. Create Lambda function: aws lambda create-function ...
3. Create EventBridge rule for stop (weekdays 10PM):
   Schedule expression: cron(0 22 ? * MON-FRI *)
4. Create EventBridge rule for start (weekdays 8AM):
   Schedule expression: cron(0 8 ? * MON-FRI *)
5. Add Lambda as target for each EventBridge rule
6. Test: aws lambda invoke --function-name StopEC2Instances output.json

DEMO DASHBOARD FEATURES:
- Schedule timeline: CSS grid 24-hours; drag to set on/off window
- Cost calc: (24 - business_hours) × 365 × instance_cost_per_hour
- Instance status: poll simulation with random state changes
```

---

## CC-04: VPC with Public-Private Architecture

```
PROJECT CONTEXT:
Design and deploy a secure two-tier network: public subnet (web server)
and private subnet (database) with NAT Gateway for outbound access.

DEMO UI: Interactive VPC architecture visualizer showing:
- Network topology diagram (animated)
- Traffic flow simulation
- Security group rules table
- CIDR block configuration

TECH STACK:
- HTML + CSS + JS (interactive architecture diagram)
- AWS VPC, Subnets, IGW, NAT Gateway, Route Tables

DEMO UI AESTHETIC:
AWS Console-inspired but much cleaner. Dark background with cloud
infrastructure diagram as the centerpiece. VPC box: dashed blue border.
Public subnet: green background. Private subnet: orange background.
Internet Gateway: top edge connection. Traffic animation: small packets
(dots) moving along connection lines using CSS animation. Security
rules table: clean accordion per resource. Font: "IBM Plex Sans".

FILE STRUCTURE:
vpc-public-private/
├── README.md
├── visualizer/
│   ├── index.html
│   ├── style.css
│   └── diagram.js        ← SVG/Canvas network topology
└── aws-setup/
    ├── setup-guide.md
    └── vpc-cli-commands.sh  ← all CLI commands in sequence

VPC CLI COMMANDS (vpc-cli-commands.sh):
#!/bin/bash
# 1. Create VPC
VPC_ID=$(aws ec2 create-vpc --cidr-block 10.0.0.0/16 \
  --query 'Vpc.VpcId' --output text)
# 2. Create public subnet
PUB_SUBNET=$(aws ec2 create-subnet --vpc-id $VPC_ID \
  --cidr-block 10.0.1.0/24 --query 'Subnet.SubnetId' --output text)
# 3. Create private subnet
PRIV_SUBNET=$(aws ec2 create-subnet --vpc-id $VPC_ID \
  --cidr-block 10.0.2.0/24 --query 'Subnet.SubnetId' --output text)
# 4. Create Internet Gateway
IGW_ID=$(aws ec2 create-internet-gateway --query \
  'InternetGateway.InternetGatewayId' --output text)
aws ec2 attach-internet-gateway --internet-gateway-id $IGW_ID \
  --vpc-id $VPC_ID
# 5. Create NAT Gateway (in public subnet)
EIP=$(aws ec2 allocate-address --query 'AllocationId' --output text)
NAT_ID=$(aws ec2 create-nat-gateway --subnet-id $PUB_SUBNET \
  --allocation-id $EIP --query 'NatGateway.NatGatewayId' --output text)
# 6. Route tables: public → IGW, private → NAT
echo "VPC: $VPC_ID | Public: $PUB_SUBNET | Private: $PRIV_SUBNET"

DIAGRAM IMPLEMENTATION:
SVG-based network diagram with:
- Animated dashed line for VPC boundary
- Labeled subnet boxes inside
- Directional arrows for traffic flow
- Click on any component → shows description sidebar
```

---

## CC-05: Serverless Image Resizer

```
PROJECT CONTEXT:
Upload an image to S3, Lambda automatically resizes it to multiple
dimensions (thumbnail, medium, large) and stores outputs in another S3
bucket. Event-driven architecture demonstration.

DEMO UI: Serverless pipeline visualizer:
- Upload interface with drag-and-drop
- Pipeline visualization (S3 → Lambda → S3 with animated flow)
- Output images display (simulated resize results)
- Lambda execution logs viewer

TECH STACK:
- HTML + CSS + JS (demo UI with FileReader simulation)
- AWS Lambda (Python + Pillow layer) + S3 triggers

DEMO UI AESTHETIC:
Developer tools aesthetic. Split screen: left = upload + pipeline diagram,
right = simulated output (3 resized versions). Pipeline diagram shows
SVG flow: bucket icon → lambda icon → three output bucket icons. When
"uploading," animate the flow from left to right with glowing dots.
Output panels show image at 3 sizes with dimensions overlaid.
Font: "Fira Code" throughout.

FILE STRUCTURE:
serverless-image-resizer/
├── README.md
├── demo-ui/
│   ├── index.html
│   ├── style.css
│   └── resizer-demo.js   ← FileReader + Canvas simulation
└── aws-setup/
    ├── setup-guide.md
    └── lambda_function.py

LAMBDA FUNCTION (lambda_function.py):
import boto3
import json
from PIL import Image
import io

SIZES = {'thumbnail': (150, 150), 'medium': (800, 600), 'large': (1920, 1080)}
OUTPUT_BUCKET = 'my-resized-images'

def lambda_handler(event, context):
    s3 = boto3.client('s3')
    record = event['Records'][0]
    source_bucket = record['s3']['bucket']['name']
    key = record['s3']['object']['key']
    
    response = s3.get_object(Bucket=source_bucket, Key=key)
    image = Image.open(io.BytesIO(response['Body'].read()))
    
    for size_name, dimensions in SIZES.items():
        resized = image.copy()
        resized.thumbnail(dimensions, Image.LANCZOS)
        buffer = io.BytesIO()
        resized.save(buffer, format=image.format or 'JPEG')
        buffer.seek(0)
        output_key = f"{size_name}/{key}"
        s3.put_object(Bucket=OUTPUT_BUCKET, Key=output_key, Body=buffer)
        print(f"Saved {size_name}: {output_key}")
    return {'statusCode': 200}

DEMO JS: Use Canvas API to resize uploaded image in-browser at 3
sizes; display side-by-side with dimensions; animate the pipeline flow

SETUP GUIDE:
1. Create source bucket + output bucket
2. Create Lambda with Python 3.11 + Pillow Lambda layer
3. Add S3 trigger: source_bucket → Lambda on ObjectCreated
4. Set Lambda environment variable OUTPUT_BUCKET
5. IAM: Lambda role needs s3:GetObject (source) + s3:PutObject (output)
```

---

## CC-06: IAM User Management System

```
PROJECT CONTEXT:
Demonstrate AWS IAM best practices. Create users with different
permission levels (admin, developer, read-only) and visualize the
access control hierarchy.

DEMO UI: Interactive IAM policy simulator:
- User creation wizard with role selection
- Permission matrix visualization (resource × action grid)
- Policy document viewer/editor
- "What can this user do?" tester

TECH STACK:
- HTML + CSS + JS (policy simulator)
- AWS IAM CLI commands

DEMO UI AESTHETIC:
Security dashboard aesthetic. Dark background #0f1729. IAM hierarchy
displayed as an org chart (SVG). Permission matrix: CSS grid with
green checkmarks and red X marks. Policy JSON viewer: syntax-highlighted
code block (manual syntax highlighting with spans). User cards with
role badge and permission summary. Simulated "deny" reason explanations.
Font: "JetBrains Mono" for JSON, "Inter" for UI.

FILE STRUCTURE:
iam-user-management/
├── README.md
├── policy-simulator/
│   ├── index.html
│   ├── style.css
│   └── simulator.js      ← permission logic + policy rendering
└── aws-setup/
    ├── setup-guide.md
    ├── admin-policy.json
    ├── developer-policy.json
    └── readonly-policy.json

POLICIES:
admin-policy.json: { "Effect":"Allow", "Action":"*", "Resource":"*" }
developer-policy.json: Allow EC2/S3/Lambda actions, Deny IAM mutations
readonly-policy.json: Allow *.Describe* and *.List* and *.Get* only

SETUP GUIDE:
1. Create user groups: aws iam create-group --group-name Admins
2. Attach policies to groups
3. Create users: aws iam create-user --user-name dev-user-01
4. Add users to groups: aws iam add-user-to-group ...
5. Create access keys for programmatic access
6. Enable MFA: aws iam enable-mfa-device ...
7. Test: aws iam simulate-principal-policy ...

SIMULATOR FEATURES:
- Select user role → load their policy JSON
- Select service (S3/EC2/Lambda) + action → check if allowed
- Show allow/deny result with which policy rule matched
```

---

## CC-07: Static Website with CloudFront CDN

```
PROJECT CONTEXT:
Host a static website on S3 with CloudFront CDN for global delivery.
Demonstrates content caching, edge locations, and HTTPS.

DEMO UI: CDN performance visualizer:
- World map showing CloudFront edge locations (SVG)
- Latency comparison: Direct S3 vs CloudFront (simulated)
- Cache hit/miss counter
- The actual portfolio/static site being served

TECH STACK:
- HTML + CSS + JS (site + CDN demo)
- AWS S3 + CloudFront Distribution

DEMO UI AESTHETIC:
Performance monitoring dashboard. Dark world map SVG with glowing
dots at edge location cities. Latency bars: animated fill showing
speed difference (CDN much faster). Cache stats: donut chart of
hit% vs miss%. The actual static site preview in an iframe or
replicated below. Real-time simulated request log. Font: "Orbitron"
for metrics, "Inter" for descriptions.

FILE STRUCTURE:
static-site-cloudfront/
├── README.md
├── website/
│   ├── index.html         ← actual static site
│   ├── cdn-demo.html      ← CDN visualization
│   ├── style.css
│   └── cdn-viz.js         ← world map + metrics simulation
└── aws-setup/
    ├── setup-guide.md
    └── cloudfront-config.json

SETUP GUIDE:
1. Create S3 bucket + upload website (disable public access)
2. Create CloudFront distribution:
   aws cloudfront create-distribution \
     --origin-domain-name bucket.s3.amazonaws.com \
     --default-root-object index.html
3. Configure OAC (Origin Access Control) for secure S3 access
4. Update S3 bucket policy to allow only CloudFront OAC
5. Set custom error page: 404 → /index.html (for SPA routing)
6. Request SSL cert via ACM (us-east-1 only for CloudFront)
7. Invalidate cache: aws cloudfront create-invalidation --paths "/*"

CDN DEMO IMPLEMENTATION:
- SVG world map with 12 edge location cities marked
- Animated "request" dot travels from user → nearest edge → origin
- Simulated latency: S3 direct = 250ms, CloudFront = 30ms
- Click any edge city to "simulate" request from that location
```

---

## CC-08: EC2 Health Monitoring Dashboard

```
PROJECT CONTEXT:
Monitor EC2 instance health metrics (CPU, memory, disk, network) using
CloudWatch. Dashboard displays real-time and historical metrics.

DEMO UI: Real-time monitoring dashboard:
- 4 metric cards: CPU%, Memory%, Disk%, Network I/O
- Animated live graphs for each metric (simulated data)
- Alert threshold indicators with notification simulation
- Instance info panel (instance type, uptime, region)

TECH STACK:
- HTML + CSS + JS (monitoring dashboard with Chart.js)
- AWS CloudWatch + EC2 + SNS for alerts

DEMO UI AESTHETIC:
Operations control room aesthetic. Dark background #0a0f1a. Metric
cards: dark glass with a subtle colored top border (CPU=blue,
Memory=green, Disk=orange, Network=purple). Live charts: line charts
that scroll right as new data arrives (Chart.js streaming). Alert
status: small LED-style indicator (green/yellow/red). When metric
exceeds threshold → card border flashes red. Font: "Roboto Mono"
for numbers, "Inter" for labels.

FILE STRUCTURE:
ec2-health-dashboard/
├── README.md
├── dashboard/
│   ├── index.html
│   ├── style.css
│   └── monitoring.js     ← Chart.js + metric simulation
└── aws-setup/
    ├── setup-guide.md
    └── cloudwatch-alarms.sh

CLOUDWATCH ALARMS SCRIPT:
# CPU > 80% alert
aws cloudwatch put-metric-alarm \
  --alarm-name "HighCPU" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --dimensions Name=InstanceId,Value=i-xxxx \
  --period 300 --evaluation-periods 2 \
  --threshold 80 --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:us-east-1:xxx:MyAlertTopic

DASHBOARD IMPLEMENTATION:
- setInterval(1000): generate random metric values with realistic variance
  (CPU: 20-90%, Memory: 40-80%, Disk: 30-70%, Network: 0-100 MB/s)
- Chart.js line chart: max 60 data points, shift oldest on new data
- Threshold lines: Chart.js annotation plugin for danger lines
- Alert simulation: if CPU > 80% → show SNS notification toast
```

---

## CC-09: Serverless Contact Form

```
PROJECT CONTEXT:
A contact form with zero servers — form submits to API Gateway,
Lambda processes it and sends email via SES. Classic serverless pattern.

DEMO UI: Beautiful contact form + serverless flow visualizer:
- Polished contact form UI
- Architecture animation showing form → API GW → Lambda → SES → Email
- Submission status tracking
- Form validation with real-time feedback

TECH STACK:
- HTML + CSS + JS (contact form)
- AWS API Gateway + Lambda (Python) + SES

DEMO UI AESTHETIC:
Premium contact page. Split layout: left = contact info + architecture
diagram, right = form. Dark background with clean form inputs. On
submit: architecture diagram animates step-by-step (each node lights
up as data flows through). Success state: checkmark with animation.
Form inputs: bottom-border only style (no box), focus moves label up.
Font: "Clash Grotesk" or "Outfit" — modern and clean.

FILE STRUCTURE:
serverless-contact-form/
├── README.md
├── contact-form/
│   ├── index.html
│   ├── style.css
│   └── form.js           ← form validation + API call + animation
└── aws-setup/
    ├── setup-guide.md
    └── lambda_contact.py

LAMBDA FUNCTION (lambda_contact.py):
import boto3
import json

def lambda_handler(event, context):
    ses = boto3.client('ses', region_name='us-east-1')
    body = json.loads(event['body'])
    
    ses.send_email(
        Source='verified@yourdomain.com',
        Destination={'ToAddresses': ['you@yourdomain.com']},
        Message={
            'Subject': {'Data': f"Contact Form: {body['subject']}"},
            'Body': {
                'Text': {'Data': f"From: {body['name']} ({body['email']})\n\n{body['message']}"}
            }
        }
    )
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True})
    }

SETUP GUIDE:
1. Verify email in SES: aws ses verify-email-identity --email-address
2. Create Lambda function with SES permission
3. Create API Gateway REST API → POST /contact → Lambda integration
4. Enable CORS on API Gateway
5. Deploy API → copy invoke URL → update form.js fetch URL
6. Test: curl -X POST API_URL -d '{"name":"Test",...}'

FORM JS: fetch(API_URL, {method:'POST', body: JSON.stringify(formData)})
```

---

## CC-10: Auto-Scaling Web Application

```
PROJECT CONTEXT:
Deploy a web application that automatically scales EC2 instances based
on CPU load using Auto Scaling Group + Load Balancer.

DEMO UI: Auto-scaling simulator:
- Traffic simulator slider (requests per second)
- Animated instance pool (shows instances spinning up/down)
- CPU utilization gauge per instance
- Response time chart
- Scaling event log

TECH STACK:
- HTML + CSS + JS (scaling simulation)
- AWS EC2 Auto Scaling + Application Load Balancer

DEMO UI AESTHETIC:
DevOps operations dashboard. Dark background. Instance pool: visual
grid of server icons. Idle servers: dim, Active servers: glowing.
New instances "boot up" with a loading animation (0→100% spin).
Terminated instances fade out. Traffic slider: prominent horizontal
slider at top. CPU gauges: circular arc per instance. ALB indicator:
shows request distribution arrows. Font: "Space Mono" for numbers.

FILE STRUCTURE:
auto-scaling-webapp/
├── README.md
├── simulator/
│   ├── index.html
│   ├── style.css
│   └── autoscaler-sim.js ← scaling algorithm simulation
└── aws-setup/
    ├── setup-guide.md
    └── autoscaling-setup.sh

AUTOSCALING SETUP SCRIPT:
# Create launch template
aws ec2 create-launch-template --launch-template-name WebAppLT \
  --version-description v1 \
  --launch-template-data '{"InstanceType":"t2.micro","ImageId":"ami-xxx"}'

# Create Auto Scaling Group
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name WebAppASG \
  --launch-template "LaunchTemplateName=WebAppLT,Version=1" \
  --min-size 1 --max-size 5 --desired-capacity 2 \
  --vpc-zone-identifier "subnet-xxx,subnet-yyy"

# CPU-based scaling policy
aws autoscaling put-scaling-policy \
  --auto-scaling-group-name WebAppASG \
  --policy-name CPUScaleOut \
  --policy-type TargetTrackingScaling \
  --target-tracking-configuration '{"TargetValue":70,"PredefinedMetricSpecification":{"PredefinedMetricType":"ASGAverageCPUUtilization"}}'

SIMULATOR LOGIC:
- Traffic slider (0-1000 RPS) maps to simulated CPU per instance
- CPU = requests_per_instance / instance_capacity × 100
- Scale out: if avg CPU > 70% for 3 ticks → add instance (animate boot)
- Scale in: if avg CPU < 30% for 5 ticks → remove instance (animate term)
- Min 1 instance, max 5 instances
```

---

## CC-11: Serverless To-Do List API

```
PROJECT CONTEXT:
A complete CRUD REST API built entirely on AWS serverless:
Lambda functions + API Gateway + DynamoDB. No EC2 or servers.

DEMO UI: REST API tester + architecture explorer:
- Postman-like API tester UI built into the page
- Full CRUD operations for to-do items
- Architecture diagram (interactive)
- DynamoDB table viewer showing live item state
- Lambda cold start indicator

TECH STACK:
- HTML + CSS + JS (API tester)
- AWS Lambda (Python) + API Gateway + DynamoDB

DEMO UI AESTHETIC:
API documentation tool aesthetic. Dark background with clean request/
response panels. API endpoint list on the left (like Postman collections).
Request panel: method badge (GET=blue, POST=green, PUT=amber, DELETE=red),
URL input, JSON body editor. Response panel: syntax-highlighted JSON.
DynamoDB viewer: clean table of current items. Architecture: small
top diagram showing the serverless flow. Font: "JetBrains Mono".

FILE STRUCTURE:
serverless-todo-api/
├── README.md
├── api-tester/
│   ├── index.html
│   ├── style.css
│   └── api-tester.js     ← fetch-based API client
└── aws-setup/
    ├── setup-guide.md
    ├── lambda_todos.py    ← single Lambda handling all routes
    └── api-gateway-config.json

LAMBDA FUNCTION (lambda_todos.py):
import boto3
import json
import uuid
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Todos')

def lambda_handler(event, context):
    method = event['httpMethod']
    path = event.get('pathParameters', {})
    
    if method == 'GET' and not path:
        result = table.scan()
        return respond(200, result['Items'])
    
    elif method == 'POST':
        body = json.loads(event['body'])
        item = {'id': str(uuid.uuid4()), 'text': body['text'],
                'done': False, 'created_at': datetime.now().isoformat()}
        table.put_item(Item=item)
        return respond(201, item)
    
    elif method == 'PUT':
        body = json.loads(event['body'])
        table.update_item(
            Key={'id': path['id']},
            UpdateExpression='SET done = :d',
            ExpressionAttributeValues={':d': body['done']}
        )
        return respond(200, {'updated': True})
    
    elif method == 'DELETE':
        table.delete_item(Key={'id': path['id']})
        return respond(204, {})

def respond(status, body):
    return {'statusCode': status, 'body': json.dumps(body),
            'headers': {'Access-Control-Allow-Origin': '*'}}

SETUP GUIDE:
1. Create DynamoDB table: aws dynamodb create-table --table-name Todos
   --attribute-definitions AttributeName=id,AttributeType=S
   --key-schema AttributeName=id,KeyType=HASH
   --billing-mode PAY_PER_REQUEST
2. Create Lambda function + attach DynamoDB policy
3. Create API Gateway: GET /todos, POST /todos, PUT /todos/{id}, DELETE /todos/{id}
4. Deploy API + copy base URL → update api-tester.js
5. Test via demo UI

API TESTER IMPLEMENTATION:
Pre-configured request templates for each endpoint; click to execute;
display formatted JSON response; update DynamoDB viewer after mutations
```

---

## CC-12: Multi-AZ Database Deployment

```
PROJECT CONTEXT:
Deploy an RDS MySQL database in Multi-AZ mode for automatic failover.
Demonstrates high availability database architecture.

DEMO UI: Database HA architecture visualizer:
- Multi-AZ architecture diagram (Primary AZ + Standby AZ)
- Failover simulation: click "Simulate Failure" → watch failover animation
- Database metrics: connections, query latency, replication lag
- Connection string switcher (primary → replica)

TECH STACK:
- HTML + CSS + JS (HA demo)
- AWS RDS Multi-AZ + Parameter Groups

DEMO UI AESTHETIC:
High availability operations center. Split AZ diagram: two columns
(AZ-1 and AZ-2) with database icons. Primary: glowing blue. Standby:
dim. Synchronous replication: animated dashed line between them.
During failover simulation: primary goes red → standby promotes → spins
up to blue. DNS endpoint updates animated. Recovery time objective
(RTO) timer shown. Font: "Roboto Mono" for technical specs.

FILE STRUCTURE:
multi-az-database/
├── README.md
├── ha-demo/
│   ├── index.html
│   ├── style.css
│   └── failover-sim.js   ← HA animation state machine
└── aws-setup/
    ├── setup-guide.md
    └── rds-setup.sh

RDS SETUP SCRIPT:
# Create RDS Multi-AZ MySQL instance
aws rds create-db-instance \
  --db-instance-identifier mydb-prod \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --engine-version 8.0 \
  --master-username admin \
  --master-user-password SecurePass123 \
  --allocated-storage 20 \
  --multi-az \
  --db-subnet-group-name my-db-subnet-group \
  --vpc-security-group-ids sg-xxx \
  --backup-retention-period 7 \
  --storage-encrypted

# Create Read Replica
aws rds create-db-instance-read-replica \
  --db-instance-identifier mydb-read-replica \
  --source-db-instance-identifier mydb-prod

FAILOVER ANIMATION:
- Normal state: primary glowing, data flowing to standby
- "Simulate Failure" button: primary blinks red → goes offline
- setInterval sequence: 5s "detecting failure" → 5s "electing new primary"
  → 5s "updating DNS" → standby becomes primary (glowing blue)
- Total animated RTO: ~30s (vs actual AWS ~60-120s)
- Connection string updates from primary-endpoint to new endpoint
```

---

## CC-13: Serverless To-Do (Lambda Function Scheduler)

```
PROJECT CONTEXT:
Schedule and automate tasks using AWS Lambda + EventBridge. Demonstrates
cron-based and event-based scheduling for maintenance tasks.

DEMO UI: Task scheduler management panel:
- Create scheduled task (name, cron expression, Lambda action)
- Cron expression builder (visual selector → generates cron string)
- Execution history calendar heatmap
- Next 5 execution times preview
- Lambda function code editor simulation

TECH STACK:
- HTML + CSS + JS (scheduler UI)
- AWS Lambda + EventBridge

DEMO UI AESTHETIC:
DevOps scheduler tool. Dark theme. Cron builder: visual dropdowns
for minute/hour/day/month/weekday that update the cron string live.
Execution history: calendar heatmap (like GitHub contribution graph)
showing green squares for successful runs. Next executions: countdown
chips. Task cards: show name, cron, last run, next run, status toggle.
Font: "Fira Code" for cron expressions, "Inter" for UI.

FILE STRUCTURE:
lambda-scheduler/
├── README.md
├── scheduler-ui/
│   ├── index.html
│   ├── style.css
│   └── cron-builder.js   ← cron expression builder + history
└── aws-setup/
    ├── setup-guide.md
    └── eventbridge-setup.sh

EVENTBRIDGE SETUP:
# Daily backup at 2AM UTC
aws events put-rule \
  --name "DailyBackup" \
  --schedule-expression "cron(0 2 * * ? *)" \
  --state ENABLED

aws events put-targets \
  --rule "DailyBackup" \
  --targets "Id=BackupLambda,Arn=arn:aws:lambda:us-east-1:xxx:function:BackupFunction"

# Weekly cleanup every Sunday 11PM
aws events put-rule \
  --name "WeeklyCleanup" \
  --schedule-expression "cron(0 23 ? * SUN *)"

CRON BUILDER IMPLEMENTATION:
- 5 dropdowns: minute (0-59 + */5,*/10,*/15,*/30), hour, day-of-month,
  month, day-of-week with common options
- Live cron string display: e.g. "0 2 * * ? *"
- Natural language translation: "Daily at 2:00 AM UTC"
- Next 5 runs calculator: iterate from Date.now() finding next matches
- Execution heatmap: generate 90 days of mock execution data
```

---

## CC-14: S3 Bucket Policy Manager

```
PROJECT CONTEXT:
Create and manage fine-grained S3 bucket policies for access control.
Demonstrates IAM policy language with a visual policy builder.

DEMO UI: Visual S3 policy builder:
- Bucket selector with policy preview
- Visual policy statement builder (Effect/Action/Principal/Resource)
- JSON policy editor with syntax validation
- Policy tester: "What access does user X have to bucket Y?"
- Common policy templates gallery

TECH STACK:
- HTML + CSS + JS (visual policy builder)
- AWS S3 + IAM

DEMO UI AESTHETIC:
Security configuration tool. Clean, precise UI. Dark sidebar with
policy statement list. Main area: policy builder form + JSON preview
side by side. Policy statement cards: green="Allow", red="Deny".
JSON editor: dark background with syntax highlighting via CSS spans.
Validation errors: red underline + error message. Templates gallery:
clean grid of common use cases (Public Read, Private Write-Only, etc.).
Font: "JetBrains Mono" for JSON, "Inter" for form labels.

FILE STRUCTURE:
s3-policy-manager/
├── README.md
├── policy-builder/
│   ├── index.html
│   ├── style.css
│   └── policy-builder.js  ← policy JSON generation + validation
└── aws-setup/
    ├── setup-guide.md
    └── common-policies/
        ├── public-read.json
        ├── private-write.json
        ├── cross-account.json
        └── ip-restricted.json

COMMON POLICIES:
public-read.json: Allow s3:GetObject to Principal:* for all objects
private-write.json: Allow s3:PutObject only to specific IAM role ARN
ip-restricted.json: Allow all actions but Deny if aws:SourceIp not in CIDR
cross-account.json: Allow specific account ID to ListBucket + GetObject

POLICY BUILDER IMPLEMENTATION:
1. Statement form: Effect dropdown, Principal input, Actions checkboxes
   (s3:GetObject, s3:PutObject, s3:DeleteObject, s3:ListBucket, etc.),
   Resource input (bucket ARN)
2. JSON generation: build policy document object from form state, JSON.stringify
3. Condition builder: select condition key (aws:SourceIp, aws:SecureTransport,
   s3:prefix) + operator + value
4. Tester: given principal ARN + action + resource → evaluate all statements
   → show allow/deny result with which statement matched
5. Apply: aws s3api put-bucket-policy --bucket NAME --policy file://policy.json

SETUP GUIDE:
1. Get current policy: aws s3api get-bucket-policy --bucket my-bucket
2. Apply new policy: aws s3api put-bucket-policy --bucket my-bucket --policy '...'
3. Delete policy: aws s3api delete-bucket-policy --bucket my-bucket
4. Enable bucket versioning: aws s3api put-bucket-versioning ...
```

---

## CC-15: Cross-Region S3 Replication

```
PROJECT CONTEXT:
Automatically replicate S3 objects across AWS regions for disaster
recovery and data redundancy.

DEMO UI: Replication topology visualizer:
- World map showing source region → destination regions
- Object upload simulation with replication animation
- Replication status per object
- Replication time metrics (simulated latency)
- Failover demonstration

FILE STRUCTURE:
cross-region-replication/
├── README.md
├── replication-demo/
│   ├── index.html
│   ├── style.css
│   └── replication-viz.js ← world map + replication animation
└── aws-setup/
    ├── setup-guide.md
    └── replication-setup.sh

REPLICATION SETUP SCRIPT:
# Enable versioning on both buckets (required for replication)
aws s3api put-bucket-versioning \
  --bucket source-bucket-us-east \
  --versioning-configuration Status=Enabled

aws s3api put-bucket-versioning \
  --bucket dest-bucket-eu-west \
  --versioning-configuration Status=Enabled

# Create replication configuration
aws s3api put-bucket-replication \
  --bucket source-bucket-us-east \
  --replication-configuration '{
    "Role": "arn:aws:iam::xxx:role/S3ReplicationRole",
    "Rules": [{
      "Status": "Enabled",
      "Destination": {
        "Bucket": "arn:aws:s3:::dest-bucket-eu-west",
        "StorageClass": "STANDARD_IA"
      },
      "Filter": {"Prefix": ""}
    }]
  }'

DEMO IMPLEMENTATION:
- SVG world map with us-east-1 and eu-west-1 marked
- "Upload Object" simulation: dot appears at source, travels to destination
- Animated replication progress (0% → 100% with simulated delay)
- Object list with replication status: PENDING / COMPLETED / FAILED
- Disaster recovery simulation: "disable" source → demo accessing from replica
```

---

## CC-16: Containerized Blog Application (ECS + Docker)

```
PROJECT CONTEXT:
Containerize a simple blog application with Docker, push to ECR, and
deploy on ECS. Demonstrates the full container lifecycle.

DEMO UI: Container deployment pipeline visualizer:
- Docker build → ECR push → ECS deploy animation
- Container status monitor (running/stopped/pending)
- The actual blog frontend
- Docker layer visualization

TECH STACK:
- HTML + CSS + JS (blog + pipeline demo)
- Docker + AWS ECR + ECS (Fargate)

BLOG UI AESTHETIC:
Clean minimal blog. White background. Large reading-optimized typography.
Featured post: full-width image header. Post list: elegant list with
date + category. Individual post: centered 660px column, like Medium.
Font: "Playfair Display" for titles, "Georgia" for body text. Very
comfortable line-height (1.75).

FILE STRUCTURE:
containerized-blog/
├── README.md
├── blog-app/
│   ├── index.html        ← blog frontend
│   ├── style.css
│   ├── posts.js          ← mock blog posts data
│   └── Dockerfile
├── pipeline-demo/
│   ├── pipeline.html     ← deployment pipeline visualizer
│   └── pipeline.js
└── aws-setup/
    ├── setup-guide.md
    └── ecs-task-definition.json

DOCKERFILE:
FROM nginx:alpine
COPY ./blog-app /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

ECS TASK DEFINITION (ecs-task-definition.json):
{
  "family": "blog-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [{
    "name": "blog",
    "image": "xxx.dkr.ecr.us-east-1.amazonaws.com/blog-app:latest",
    "portMappings": [{"containerPort": 80, "protocol": "tcp"}],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/ecs/blog-app",
        "awslogs-region": "us-east-1",
        "awslogs-stream-prefix": "ecs"
      }
    }
  }]
}

SETUP GUIDE:
1. Build image: docker build -t blog-app .
2. Create ECR repo: aws ecr create-repository --repository-name blog-app
3. Authenticate: aws ecr get-login-password | docker login --username AWS ...
4. Tag + push: docker tag blog-app:latest xxx.dkr.ecr.../blog-app:latest
   && docker push xxx.dkr.ecr.../blog-app:latest
5. Register task definition: aws ecs register-task-definition ...
6. Create ECS cluster + service with Fargate launch type
```

---

## CC-17: Load Balanced Web Application

```
PROJECT CONTEXT:
Deploy multiple EC2 instances behind an Application Load Balancer.
Traffic distributes across healthy instances automatically.

DEMO UI: Load balancer traffic simulator:
- 3 simulated "instances" receiving colored request balls
- Traffic distribution visualization (round-robin animation)
- One instance "fails" → ALB stops routing to it
- Health check status per instance
- Request rate + response time charts

FILE STRUCTURE:
load-balanced-webapp/
├── README.md
├── lb-simulator/
│   ├── index.html
│   ├── style.css
│   └── lb-sim.js         ← traffic distribution animation
└── aws-setup/
    ├── setup-guide.md
    └── alb-setup.sh

ALB SETUP SCRIPT:
# Create Target Group
aws elbv2 create-target-group \
  --name WebAppTG \
  --protocol HTTP --port 80 \
  --vpc-id vpc-xxx \
  --health-check-path /health \
  --health-check-interval-seconds 30

# Create Application Load Balancer
aws elbv2 create-load-balancer \
  --name WebAppALB \
  --subnets subnet-xxx subnet-yyy \
  --security-groups sg-xxx

# Create Listener
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTP --port 80 \
  --default-actions Type=forward,TargetGroupArn=arn:...

# Register targets
aws elbv2 register-targets \
  --target-group-arn arn:... \
  --targets Id=i-xxx Id=i-yyy Id=i-zzz

LB SIMULATOR IMPLEMENTATION:
- 3 instance boxes shown horizontally below ALB box
- Incoming requests shown as colored dots falling from ALB to instances
- Round-robin: dots alternate between instances in order
- "Kill Instance 2" button: instance 2 shows red X, dots stop going there
- Health check indicator: green/red badge per instance, checks every 3s
- Request counter per instance: shows % of total traffic
```

---
# 🚀 REMAINING FULL STACK PROMPTS

---

## FS-20: Job Portal Application

```
PROJECT CONTEXT:
An Indeed-lite job portal. Employers post jobs, candidates apply, and
a matching algorithm surfaces relevant jobs based on skills.

TECH STACK: HTML + CSS + Vanilla JS

FEATURES (MVP):
1. Job listings with filters: role type, location, salary range, skills
2. Job detail page with apply button + company info
3. Employer portal: post/edit/delete jobs, view applicant list
4. Candidate profile: skills, experience, resume URL
5. Skill-match score: shows % match between candidate skills + job requirements
6. Saved jobs (bookmarks) in localStorage

UI/UX AESTHETIC:
Professional job board. Clean white + indigo accents. Job cards: company
logo (initials circle), role title, company name, location badge, salary
range, skill chips. "Match score" badge: green circle with %. Apply button:
solid indigo. Filters in a left panel with checkbox groups. Job detail:
two-column (description left, company info + apply right). Font: "DM Sans".

FILE STRUCTURE:
job-portal/
├── index.html         ← job listings
├── job.html           ← job detail
├── employer.html      ← employer dashboard
├── style.css
├── data.js            ← 10 mock jobs + 5 employers
├── jobs.js            ← filter, match scoring, search
└── employer.js        ← job CRUD

IMPLEMENTATION STEPS:
1. Job schema: { id, title, company, location, type, salary_min,
   salary_max, skills_required[], description, posted_at }
2. Skill match: candidate_skills ∩ job_skills / job_skills.length × 100
3. Filters: chained array filters + debounced search on title/company
4. Employer auth: company + "emp123" → sessionStorage; show only their jobs
5. Application: push applicant object to job.applicants[]; show count
```

---

## FS-21: Inventory & Stock Management System

```
PROJECT CONTEXT:
A retail inventory system. Track products across warehouses, manage
stock in/out, get low-stock alerts, and generate purchase orders.

TECH STACK: HTML + CSS + Vanilla JS + Chart.js

FEATURES (MVP):
1. Product catalog with stock levels, SKU, category, reorder point
2. Stock-in form: receive shipment → update inventory
3. Stock-out form: sales/consumption → deduct from inventory
4. Low stock alerts: products below reorder_point shown in alert panel
5. Inventory valuation: total stock value at cost and selling price
6. Movement history: timeline of all stock changes per product
7. Chart.js bar chart: top 10 products by stock value

UI/UX AESTHETIC:
Clean warehouse management tool. White + orange (#ea580c) accent for
urgency alerts. Product table: dense rows with colored stock status bar
(green=healthy, amber=low, red=critical). Low stock alert banner at top:
orange dismissable. Stock movement history: timeline with in=green/out=red
color coding. Dashboard stat cards: total SKUs, total value, low-stock
count, top category. Font: "IBM Plex Sans".

FILE STRUCTURE:
inventory-management/
├── index.html         ← dashboard + product table
├── product.html       ← product detail + history
├── style.css
├── data.js            ← 20 seed products across 4 categories
├── inventory.js       ← stock operations, alerts
└── charts.js

IMPLEMENTATION STEPS:
1. Product: { sku, name, category, quantity, unit_cost, selling_price,
   reorder_point, supplier, movements: [] }
2. Stock-in: add quantity to product, push { type:'in', qty, date, note }
3. Stock-out: validate qty ≤ available, deduct, push movement
4. Alerts: filter products where quantity ≤ reorder_point on every render
5. Valuation: sum(quantity × unit_cost) across all products
```

---

## FS-22: Online Voting System

```
PROJECT CONTEXT:
A secure digital voting platform for elections. One vote per registered
voter, real-time result visualization, and an audit trail.

TECH STACK: HTML + CSS + Vanilla JS

FEATURES (MVP):
1. Voter registration: name + voter ID → generates ballot token
2. Voting interface: candidate cards with photo, party, bio — cast vote
3. One-vote enforcement: localStorage token marks voter as voted
4. Live results: animated bar chart updating in real-time (simulated)
5. Candidate detail modal: full profile + manifesto excerpt
6. Admin panel: monitor turnout, toggle voting window open/closed

UI/UX AESTHETIC:
Official but modern election portal. National flag colors (blue + white).
Voter registration: clean ID card-style form. Ballot: candidates in clear
comparison cards with photo, name, party badge. "Cast Vote" button:
large, prominent, one-click. After voting: confirmation page with
ballot receipt animation. Results: animated horizontal bars with live
percentage counters. Font: "Noto Sans" — accessible and official.

FILE STRUCTURE:
voting-system/
├── register.html
├── ballot.html
├── results.html
├── admin.html
├── style.css
├── voting.js         ← vote casting, token management
└── results.js        ← live results chart

IMPLEMENTATION STEPS:
1. Voter registration: hash voter ID (simple btoa) → store as token
2. Ballot page: check token in localStorage; if already voted → show
   "Already voted" message with receipt
3. Cast vote: increment candidate.votes in localStorage; mark voter
   token as used; redirect to results
4. Results: setInterval(1000) auto-refreshes vote counts + recalculates
   percentages; Chart.js horizontal bar chart
5. Admin: toggle { voting_open: true/false } in localStorage; ballot page
   checks this before allowing votes
```

---

## FS-23: Library Management System

```
PROJECT CONTEXT:
A digital library system for book catalog management, member management,
book issue/return workflows, and fine calculation.

TECH STACK: HTML + CSS + Vanilla JS

FEATURES (MVP):
1. Book catalog: search, filter by genre/author, availability status
2. Issue book: assign to member with due date (14 days)
3. Return book: calculate fine if overdue (₹2/day after due date)
4. Member management: add/edit members with borrowing history
5. Dashboard: books issued today, overdue books, most borrowed books
6. Book reservation: reserve unavailable book → notify when available

UI/UX AESTHETIC:
Warm academic library aesthetic. Warm cream (#fef3c7) background.
Book cards: like actual books with spine color variety. Availability:
green "Available" / red "Issued" badge. Issue/return flow: clean modal
with member search autocomplete. Overdue books table: amber/red row
highlighting. Fine calculation: prominent amount in red. Font:
"Libre Baskerville" — classic and bookish.

FILE STRUCTURE:
library-management/
├── index.html         ← catalog + dashboard
├── issue-return.html
├── members.html
├── style.css
├── data.js            ← 30 books + 10 members seed
├── library.js         ← issue/return/fine logic
└── catalog.js         ← search, filter, reservation

IMPLEMENTATION STEPS:
1. Book: { isbn, title, author, genre, copies_total, copies_available,
   reservations: [] }
2. Issue: deduct copies_available, create transaction { book_isbn,
   member_id, issued_at, due_date, returned_at: null }
3. Return: find open transaction, set returned_at, increment copies_available;
   fine = max(0, daysDiff(due_date, returned_at)) × 2
4. Member history: filter transactions by member_id
5. Dashboard: today's issues, overdue = transactions where due_date < today
   and returned_at === null
```

---

## FS-24: Subscription-Based Content Platform

```
PROJECT CONTEXT:
A Medium/Substack-like content platform with free and premium tiers.
Premium content is gated behind a subscription paywall.

TECH STACK: HTML + CSS + Vanilla JS

FEATURES (MVP):
1. Article feed: mix of free and premium articles with "Members Only" lock
2. Login/signup with tier selection (Free / Pro at ₹199/month)
3. Premium content gate: blur effect + upgrade CTA for non-subscribers
4. Article detail: clean reading experience, estimated read time
5. Bookmarks + reading history per user
6. Author profiles with follower count + article list

UI/UX AESTHETIC:
Editorial premium publication. Stark white background with large serif
typography. Article cards: no images by default — just title, author,
excerpt, tags. Premium badge: gold star icon. Paywall overlay: frosted
glass blur with upgrade card in center. Reading view: centered column,
650px max-width, beautiful typography (line-height: 1.8). Font:
"Playfair Display" for headlines, "Lora" for body text. Tag chips: minimal.

FILE STRUCTURE:
subscription-content/
├── index.html         ← article feed
├── article.html       ← article reader
├── author.html
├── pricing.html
├── style.css
├── data.js            ← 10 articles (5 free + 5 premium) + authors
├── auth.js            ← user session, tier management
└── paywall.js         ← content gating logic

IMPLEMENTATION STEPS:
1. Article: { id, title, author_id, excerpt, content, is_premium, tags[],
   read_time, published_at }
2. User session: { userId, tier: 'free'|'pro', bookmarks: [] }; stored in
   localStorage
3. Premium gate: if article.is_premium && user.tier !== 'pro' → show first
   200 chars, apply CSS blur filter to rest, overlay upgrade card
4. Upgrade: clicking "Upgrade" sets user.tier = 'pro' (simulated payment)
5. Bookmarks: heart button on articles; toggle in user.bookmarks array
```

---

# ☁️ REMAINING CLOUD COMPUTING PROMPTS

---

## CC-18: S3 Lifecycle Cost Optimizer

```
PROJECT CONTEXT:
Implement S3 lifecycle policies to automatically move old files to
cheaper storage classes (Standard → Standard-IA → Glacier) and delete
expired content.

DEMO UI: Storage lifecycle visualizer + cost calculator:
- File age simulator showing objects moving through storage tiers
- Cost comparison: without vs with lifecycle policies
- Policy configuration UI
- Animated object "aging" timeline

FILE STRUCTURE:
s3-lifecycle-optimizer/
├── README.md
├── lifecycle-demo/
│   ├── index.html
│   ├── style.css
│   └── lifecycle-viz.js  ← age simulation + cost calculator
└── aws-setup/
    ├── setup-guide.md
    └── lifecycle-policy.json

LIFECYCLE POLICY (lifecycle-policy.json):
{
  "Rules": [{
    "ID": "CostOptimizationRule",
    "Status": "Enabled",
    "Filter": {"Prefix": "data/"},
    "Transitions": [
      {"Days": 30, "StorageClass": "STANDARD_IA"},
      {"Days": 90, "StorageClass": "GLACIER"},
      {"Days": 365, "StorageClass": "DEEP_ARCHIVE"}
    ],
    "Expiration": {"Days": 730}
  }]
}

APPLY POLICY:
aws s3api put-bucket-lifecycle-configuration \
  --bucket my-data-bucket \
  --lifecycle-configuration file://lifecycle-policy.json

DEMO IMPLEMENTATION:
- Storage class pricing table (Standard: $0.023/GB, IA: $0.0125, Glacier: $0.004)
- Slider for file count + avg size → calculates monthly cost at each tier
- Timeline animation: files start at Standard, age through tiers visually
- Total savings calculator: shows annual cost with vs without lifecycle
- Storage class comparison table with retrieval time tradeoffs
```

---

## CC-19: Lambda-based Calculator API

```
PROJECT CONTEXT:
Build a serverless REST API for mathematical calculations using
Lambda + API Gateway. Demonstrates the serverless API pattern.

DEMO UI: API playground + architecture:
- Calculator UI that calls the actual (or simulated) Lambda API
- Architecture diagram showing the serverless flow
- Request/response log with latency
- Lambda function code viewer

FILE STRUCTURE:
lambda-calculator/
├── README.md
├── api-playground/
│   ├── index.html         ← calculator + API tester
│   ├── style.css
│   └── calculator.js      ← API calls + architecture
└── aws-setup/
    ├── setup-guide.md
    └── lambda_calc.py

LAMBDA FUNCTION (lambda_calc.py):
import json
import math
import operator

OPERATIONS = {
    'add': operator.add, 'subtract': operator.sub,
    'multiply': operator.mul, 'divide': operator.truediv,
    'power': operator.pow, 'sqrt': lambda a, b: math.sqrt(a),
    'modulo': operator.mod
}

def lambda_handler(event, context):
    try:
        body = json.loads(event.get('body', '{}'))
        op = body.get('operation')
        a, b = float(body.get('a', 0)), float(body.get('b', 0))
        
        if op not in OPERATIONS:
            return error(400, "Invalid operation")
        if op == 'divide' and b == 0:
            return error(400, "Division by zero")
        
        result = OPERATIONS[op](a, b)
        return {
            'statusCode': 200,
            'body': json.dumps({'result': result, 'operation': f"{a} {op} {b}"}),
            'headers': {'Access-Control-Allow-Origin': '*'}
        }
    except Exception as e:
        return error(500, str(e))

def error(code, msg):
    return {'statusCode': code, 'body': json.dumps({'error': msg}),
            'headers': {'Access-Control-Allow-Origin': '*'}}

CALCULATOR UI AESTHETIC:
iOS/macOS calculator-inspired dark design. Black background, circular
buttons. Orange accent for operations. Display: top-right aligned large
number. API mode: shows JSON request/response below calculator.
Architecture diagram: simple Lambda → API Gateway flow. Font: "SF Mono".

SETUP GUIDE:
1. Create Lambda function + add calculator code
2. Create API Gateway: POST /calculate → Lambda
3. Test: curl -X POST API_URL -d '{"operation":"add","a":5,"b":3}'
4. Update calculator.js with your API endpoint URL
5. Add CORS headers to Lambda response (already in code above)
```

---

## CC-20: S3 Event Notification System

```
PROJECT CONTEXT:
Automatically trigger workflows when files are uploaded to S3.
S3 → Lambda → SNS notification chain.

DEMO UI: Event pipeline simulator:
- Drag-drop "upload" simulation
- Pipeline animation: S3 → Lambda → SNS → Email/SMS
- Event log showing triggered events with metadata
- File type routing: different Lambda actions per file type

FILE STRUCTURE:
s3-event-notifications/
├── README.md
├── event-demo/
│   ├── index.html
│   ├── style.css
│   └── event-sim.js      ← upload simulation + event animation
└── aws-setup/
    ├── setup-guide.md
    └── lambda_notification.py

LAMBDA FUNCTION (lambda_notification.py):
import boto3, json

sns = boto3.client('sns')
SNS_TOPIC = 'arn:aws:sns:us-east-1:xxx:FileUploadTopic'

def lambda_handler(event, context):
    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']
        size = record['s3']['object']['size']
        message = f"New file uploaded!\nBucket: {bucket}\nFile: {key}\nSize: {size} bytes"
        sns.publish(TopicArn=SNS_TOPIC, Message=message,
                    Subject="S3 Upload Notification")
        print(f"Notified for: {key}")

SETUP GUIDE:
1. Create SNS topic + subscribe email
2. Create Lambda with SNS publish permission
3. Configure S3 event notification:
   aws s3api put-bucket-notification-configuration \
     --bucket my-bucket \
     --notification-configuration '{
       "LambdaFunctionConfigurations": [{
         "LambdaFunctionArn": "arn:aws:lambda:...",
         "Events": ["s3:ObjectCreated:*"]
       }]
     }'
4. Test: aws s3 cp test.txt s3://my-bucket/ → check email

DEMO IMPLEMENTATION:
- Drop zone accepts files, shows file metadata
- Sequential animation: S3 box lights → Lambda box fires → SNS box sends
- Event log: timestamped list of "uploaded" events with file info
- Different icons per file type trigger different "action" simulations
```

---

## CC-21: EC2 Scheduled Backup System

```
PROJECT CONTEXT:
Automate EC2 EBS snapshot creation on a schedule using Lambda +
EventBridge. Implement backup rotation to manage storage costs.

DEMO UI: Backup management dashboard:
- Backup calendar: GitHub-style heatmap of backup history
- Snapshot list with age, size, retention status
- Retention policy configurator
- Cost estimator for snapshots
- Manual backup trigger simulation

FILE STRUCTURE:
ec2-scheduled-backup/
├── README.md
├── backup-dashboard/
│   ├── index.html
│   ├── style.css
│   └── backup-dash.js    ← calendar heatmap + snapshot list
└── aws-setup/
    ├── setup-guide.md
    └── lambda_backup.py

LAMBDA FUNCTION (lambda_backup.py):
import boto3
from datetime import datetime, timedelta

ec2 = boto3.client('ec2')
INSTANCE_ID = 'i-xxxxxxxxxxxx'
RETENTION_DAYS = 7

def lambda_handler(event, context):
    # Create snapshot
    instance = ec2.describe_instances(InstanceIds=[INSTANCE_ID])
    volumes = [v['Ebs']['VolumeId'] for r in instance['Reservations']
               for i in r['Instances'] for v in i['BlockDeviceMappings']]
    
    for volume_id in volumes:
        snapshot = ec2.create_snapshot(
            VolumeId=volume_id,
            Description=f"Auto-backup {datetime.now().isoformat()}",
            TagSpecifications=[{'ResourceType': 'snapshot', 'Tags': [
                {'Key': 'AutoBackup', 'Value': 'true'},
                {'Key': 'CreatedAt', 'Value': datetime.now().isoformat()}
            ]}]
        )
        print(f"Created: {snapshot['SnapshotId']}")
    
    # Delete old snapshots
    cutoff = datetime.now() - timedelta(days=RETENTION_DAYS)
    old_snapshots = ec2.describe_snapshots(
        Filters=[{'Name': 'tag:AutoBackup', 'Values': ['true']}],
        OwnerIds=['self']
    )
    for snap in old_snapshots['Snapshots']:
        if snap['StartTime'].replace(tzinfo=None) < cutoff:
            ec2.delete_snapshot(SnapshotId=snap['SnapshotId'])
            print(f"Deleted old snapshot: {snap['SnapshotId']}")

SETUP GUIDE:
1. Create Lambda with EC2:CreateSnapshot + EC2:DescribeSnapshots + 
   EC2:DeleteSnapshot permissions
2. Create EventBridge rule: cron(0 1 * * ? *) for daily 1AM backup
3. Add Lambda as EventBridge target
4. Test: manually invoke Lambda → check EC2 Snapshots console
5. Monitor: CloudWatch Logs for execution history

DASHBOARD DEMO:
- Generate 90 days of mock backup data for calendar heatmap
- Snapshot list: simulated 7 most recent snapshots with sizes
- Retention dial: slider to set retention days → cost projection updates
- Manual backup: button that simulates creation with progress animation
```

---

## CC-22: Secure File Upload Portal

```
PROJECT CONTEXT:
Secure file upload system using S3 pre-signed URLs. Backend generates
a time-limited URL; client uploads directly to S3 without exposing
credentials. Zero-server upload pattern.

DEMO UI: Upload portal + pre-signed URL explainer:
- Clean file upload interface
- Visual explanation of pre-signed URL flow
- URL inspection: decode and show JWT-like pre-signed URL components
- Upload progress simulation
- Expiry countdown for generated URLs

FILE STRUCTURE:
secure-file-upload/
├── README.md
├── upload-portal/
│   ├── index.html
│   ├── style.css
│   └── upload.js         ← presigned URL simulation
└── aws-setup/
    ├── setup-guide.md
    └── generate_presigned.py

GENERATE PRESIGNED URL (generate_presigned.py):
import boto3
from botocore.exceptions import NoCredentialsError

s3 = boto3.client('s3', region_name='us-east-1')

def generate_upload_url(bucket_name, file_key, expiration=3600):
    """Generate a pre-signed URL for secure upload"""
    try:
        url = s3.generate_presigned_url(
            'put_object',
            Params={'Bucket': bucket_name, 'Key': file_key,
                    'ContentType': 'application/octet-stream'},
            ExpiresIn=expiration
        )
        return url
    except NoCredentialsError:
        return None

def generate_download_url(bucket_name, file_key, expiration=300):
    """Generate a pre-signed URL for temporary download"""
    return s3.generate_presigned_url(
        'get_object',
        Params={'Bucket': bucket_name, 'Key': file_key},
        ExpiresIn=expiration
    )

# Direct upload example (after getting pre-signed URL)
# import requests
# with open('file.pdf', 'rb') as f:
#     requests.put(presigned_url, data=f, headers={'Content-Type': 'application/octet-stream'})

SETUP GUIDE:
1. Create private S3 bucket (NO public access)
2. Create IAM user with s3:PutObject permission for specific bucket
3. Run generate_presigned.py to get upload URL
4. Client uploads directly: PUT presigned_url with file binary
5. Expiry: URL invalid after expiration seconds (default 1 hour)
6. Download URL expires in 5 minutes for security

DEMO UI FLOW:
- Select file → "Request Upload URL" → simulated API call →
  show generated URL with decoded components (AWSAccessKeyId, Expires,
  Signature) → "Upload File" → PUT to URL → success/failure state
```

---

# 📋 MASTER README TEMPLATE

```markdown
# 🎓 Mini Projects Repository
**Chandigarh University | BE-CSE/IT 3rd Year | Jan-June 2026**

## 📚 Subjects Covered
| Subject | Code | Projects |
|---------|------|----------|
| System Design | 23CSH-314 | 20 projects |
| Full Stack Dev II | 23CSH-309 | 24 projects |
| Cloud Computing | 23CSH-307 | 22 projects |
| AI/ML | — | 2 projects |
| **Total** | | **68 projects** |

## 🗂️ Repository Structure
[see folder tree above]

## 🚀 Quick Start Per Project
Every project folder contains:
- `README.md` — setup + demo instructions
- `prompt.md` — AI generation prompt for VS Code/Claude
- `src/` — starter code (or complete code)

## 🛠️ Tech Stack Overview
- **Frontend**: HTML/CSS/Vanilla JS (no build tools required)
- **Charts**: Chart.js (CDN)
- **Maps**: Leaflet.js (CDN)
- **PDF**: jsPDF (CDN)
- **Cloud**: AWS CLI + AWS SDK for Python (boto3)

## 📖 How to Use These Prompts
1. Open VS Code
2. Open GitHub Copilot Chat or Claude.ai
3. Copy the prompt from any project's `prompt.md`
4. Paste into the AI and start generating
5. Each prompt is designed to produce a portfolio-ready MVP

## 🎯 Portfolio Tips
- Deploy frontend projects to GitHub Pages (free)
- Cloud projects: use AWS Free Tier (12 months)
- Add screenshots to each project README
- Link from your LinkedIn/portfolio

## ✅ Project Completion Tracker
- [ ] SD-01: Movie Ticket Booking
- [ ] SD-02: Ride Booking System
[... all projects listed as checkboxes ...]
```

---

# 🔧 GLOBAL .gitignore TEMPLATE

```gitignore
# Dependencies
node_modules/
.npm/

# Environment & credentials
.env
.env.local
*.pem
*.key
aws-credentials.json

# Build outputs
dist/
build/
*.min.js.map

# OS files
.DS_Store
Thumbs.db
desktop.ini

# IDE files
.vscode/settings.json
.idea/
*.swp

# Logs
*.log
npm-debug.log*

# AWS CDK
cdk.out/
.cdk.staging/

# Python
__pycache__/
*.pyc
.venv/
```

---

# 📊 PROJECT COMPLEXITY INDEX

## Build Time Estimates (Solo Developer)

| Category | Project Count | Avg Build Time |
|----------|--------------|----------------|
| System Design | 20 | 3–5 hours each |
| Full Stack | 24 | 4–6 hours each |
| Cloud Computing | 22 | 2–4 hours each |
| AI/ML | 2 | 5–8 hours each |

## Difficulty Rating
- 🟢 **Beginner** (1–3 hrs): URL Shortener, Digital Wallet, Smart Parking,
  Photo Gallery S3, Serverless Contact Form, Lambda Calculator API
- 🟡 **Intermediate** (3–5 hrs): Most Full Stack + System Design projects
- 🔴 **Advanced** (5+ hrs): Recommendation System, Sports Analytics,
  Auto-Scaling App, CI/CD Pipeline, Multi-AZ Database

## Portfolio Impact (⭐ = high recruiter value)
- ⭐⭐⭐ Stock Trading Simulator, Recommendation System, CI/CD App
- ⭐⭐⭐ Auto-Scaling App, Load Balanced Web App, Sports Analytics
- ⭐⭐ Most Full Stack CRUD apps
- ⭐ Most System Design simulations

---

# 🎨 SHARED CSS DESIGN SYSTEM

```css
/* /shared/design-system.css — import in all projects */

/* Typography Scale */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

:root {
  /* Colors */
  --bg: #ffffff;
  --surface: #f8fafc;
  --border: #e2e8f0;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
  --accent: #6366f1;
  --accent-hover: #4f46e5;
  --success: #22c55e;
  --warning: #f59e0b;
  --danger: #ef4444;

  /* Spacing */
  --space-1: 4px;   --space-2: 8px;
  --space-3: 12px;  --space-4: 16px;
  --space-5: 20px;  --space-6: 24px;
  --space-8: 32px;  --space-10: 40px;
  --space-12: 48px; --space-16: 64px;

  /* Radii */
  --radius-sm: 4px;   --radius: 8px;
  --radius-lg: 12px;  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05);

  /* Transitions */
  --transition: 150ms ease;
  --transition-md: 250ms ease;
}

/* Base reset */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', system-ui, sans-serif; color: var(--text-primary);
       background: var(--bg); line-height: 1.5; }

/* Reusable components */
.card { background: var(--bg); border: 1px solid var(--border);
        border-radius: var(--radius-lg); padding: var(--space-6);
        box-shadow: var(--shadow); }

.btn { display: inline-flex; align-items: center; gap: var(--space-2);
       padding: var(--space-2) var(--space-4); border-radius: var(--radius);
       font-size: 14px; font-weight: 500; cursor: pointer; border: none;
       transition: var(--transition); }
.btn-primary { background: var(--accent); color: white; }
.btn-primary:hover { background: var(--accent-hover); }
.btn-outline { background: transparent; color: var(--text-primary);
               border: 1px solid var(--border); }
.btn-outline:hover { background: var(--surface); }

.badge { display: inline-flex; align-items: center; padding: 2px 8px;
         border-radius: var(--radius-full); font-size: 12px; font-weight: 500; }
.badge-success { background: #dcfce7; color: #16a34a; }
.badge-warning { background: #fef3c7; color: #d97706; }
.badge-danger { background: #fee2e2; color: #dc2626; }
.badge-info { background: #dbeafe; color: #2563eb; }

.input { width: 100%; padding: var(--space-3) var(--space-4);
         border: 1px solid var(--border); border-radius: var(--radius);
         font-size: 14px; outline: none; transition: var(--transition); }
.input:focus { border-color: var(--accent);
               box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
```
