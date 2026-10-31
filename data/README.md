# Home page static sections - API data

These JSON files are the data the frontend currently hardcodes for the home page.
Each file is the response we expect from a new endpoint. Field names can change
if the backend prefers, just tell the frontend dev.

| File | Home section | Suggested endpoint |
|------|--------------|--------------------|
| flash-sale-banner.json | Flash Sale right-side banner (shown on lg+ screens) | `flash-sale-banner-data` |
| dual-banners.json | Two promo banners (AirPods / Apple Watch) | `dual-banner-data` |
| recommended-for-you.json | "Recommended for You" image tiles (8 items) | `recommended-for-you-data` |
| brands.json | Brands grid (13 brands + "View All Brands" button on the frontend) | `brand-data` |
| why-shop-with-us.json | Four feature cards at the bottom of the page | `why-shop-data` (already used by another component) |

Notes:
- Response envelope is `{ status, message, data }`, same as `menu-data` and `most-viewed-products`.
- `image` values are the current local paths; the API should return uploaded image URLs.
- `serial` is the display order (ascending); only return items with `is_active: true`.
- `link` is a frontend route (e.g. `/shop`, `/category/<slug>`). Brand `slug` is used as `/brand/<slug>`.
- `icon` in why-shop-with-us is a lucide icon name; colors stay in the frontend.
- Empty `data` means the section is hidden (flash sale banner shows only when no flash sale is running).
