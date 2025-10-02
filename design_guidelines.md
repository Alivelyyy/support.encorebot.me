# Design Guidelines: Support Ticket System for EncoreBot

## Design Approach
**Hybrid Approach**: Utility-focused design system with strong brand identity
- Foundation: Modern dark UI patterns inspired by Linear and Discord
- Brand Identity: Team Epic's purple/blue gradient aesthetic
- Priority: Functionality and clarity with professional polish

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary)**
- Background: 220 20% 10% (deep navy-black)
- Surface: 220 18% 14% (elevated panels)
- Surface Elevated: 220 16% 18% (cards, modals)
- Border: 220 10% 25% (subtle divisions)

**Brand Colors**
- Primary Purple: 270 70% 60% (main CTAs, active states)
- Primary Blue: 220 80% 55% (secondary actions, links)
- Gradient: Linear from Purple to Blue (hero, headers, accents)

**Status Colors**
- Success (Resolved): 150 65% 50%
- Warning (In Progress): 45 90% 60%
- Error (Urgent): 0 75% 60%
- Info (Open): 210 80% 60%

**Text Colors**
- Primary: 220 10% 95% (headings, important text)
- Secondary: 220 10% 70% (body text)
- Tertiary: 220 10% 50% (metadata, timestamps)

### B. Typography
**Font Stack**: 'Inter', system-ui, -apple-system, sans-serif (via Google Fonts)

**Hierarchy**
- Display (Hero): 48px/56px, font-bold (gradient text effect)
- H1 (Page Titles): 32px/40px, font-semibold
- H2 (Section Headers): 24px/32px, font-semibold
- H3 (Card Titles): 18px/24px, font-medium
- Body: 16px/24px, font-normal
- Small (Metadata): 14px/20px, font-normal
- Tiny (Labels): 12px/16px, font-medium, uppercase, tracking-wide

### C. Layout System
**Spacing Units**: Tailwind scale of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-6 or p-8
- Section spacing: py-16 or py-20
- Card gaps: gap-6 or gap-8
- Form fields: space-y-4

**Container Strategy**
- Max width: max-w-7xl for content areas
- Admin dashboard: Full-width with sidebar layout
- Forms and tickets: max-w-3xl centered
- Modals: max-w-2xl

### D. Component Library

**Navigation**
- Top Bar: Full-width gradient background (purple to blue), 64px height
- Logo: Left-aligned, white text with subtle glow effect
- User Menu: Right-aligned with avatar, dropdown on click
- Admin Sidebar: 240px width, collapsible, icon + text navigation

**Ticket Cards**
- Background: Surface Elevated color
- Border: 1px solid Border color, rounded-lg
- Padding: p-6
- Layout: Title + Category badge + Status badge + Timestamp + Preview
- Hover: Subtle border color brightening, smooth transition
- Status Badge: Small pill with status color background, positioned top-right

**Forms**
- Input Fields: Dark background (220 20% 12%), border (220 10% 25%)
- Focus State: Purple border glow, smooth transition
- Labels: Small size, Tertiary text color, mb-2
- Textareas: min-h-32 for ticket descriptions
- Select/Dropdown: Custom styled with chevron icon, matches input style
- Submit Buttons: Gradient background, white text, rounded-lg, py-3 px-6

**Admin Panel**
- Sidebar Navigation: Icons + labels, active state with purple background gradient
- Ticket List: Table view with alternating row backgrounds for readability
- Filter Bar: Horizontal pills for category/status filtering
- Quick Stats: 4-column grid showing Open/In Progress/Resolved/Total counts

**Ticket Detail View**
- Two-column layout: Main content (70%) + Sidebar info (30%)
- Main: Conversation thread with clear user/admin message distinction
- Sidebar: Status selector, category, creation date, user info card
- Response Box: Fixed at bottom with textarea + send button

**Email Templates**
- White background with purple/blue gradient header
- EncoreBot logo centered in header
- Clear button CTAs with gradient backgrounds
- Footer with social links and unsubscribe option
- Mobile-responsive table layout

**User Dashboard**
- Hero Section: Gradient background, 300px height, centered content
- Welcome message + "Create New Ticket" prominent CTA
- Ticket Grid: 3-column responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- Recent Tickets: Cards showing latest 6 tickets with quick status view

### E. Interactions & Animations
**Minimal, Purposeful Motion**
- Hover states: Scale 1.02 for cards, brightness increase for buttons
- Transitions: 200ms ease-in-out for interactive elements
- Loading states: Subtle pulse animation on skeleton loaders
- Avoid: Page transitions, unnecessary scroll animations

## Images
**Hero Section**: Large gradient background with geometric pattern overlay (not a photo)
- No images required; rely on gradients and iconography
**Icons**: Use Heroicons throughout for consistency (ticket, user, settings, etc.)

## Page-Specific Guidelines

**Landing/Login Page**
- Split layout: Left (60%) - gradient hero with benefits, Right (40%) - login/signup form
- No traditional hero image; use gradient with floating UI elements mockup

**User Dashboard**
- Compact hero with gradient (200px), quick create CTA
- Grid of ticket cards below
- Empty state: Illustration placeholder with "No tickets yet" message

**Admin Panel**
- Persistent sidebar navigation
- Main area: Filters + ticket table/grid
- Responsive: Sidebar collapses to hamburger on mobile

**Ticket Detail**
- Clean conversation view with timestamp headers
- Clear visual distinction: User messages (left-aligned, lighter bg) vs Admin replies (right-aligned, purple accent)

This design creates a professional, branded ticket system that balances functionality with the Team Epic/EncoreBot brand identity through strategic use of gradients and color without overwhelming the utility-first purpose.