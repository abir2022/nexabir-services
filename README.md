# Nexabir Services — a service business storefront

A small agency storefront: a service catalogue with three priced tiers each, a cart, checkout, order tracking, a client dashboard and an admin dashboard. Built as the website for a freelance services business rather than as a tutorial exercise.

`React` · `Vite` · `Supabase (auth + data)` · `Netlify`

---

## What it does

| Area | Behaviour |
|---|---|
| **Catalogue** | Services (design, ERP integration, web work) each with Basic / Standard / Premium tiers, delivery time and revision counts |
| **Cart** | Add a tier, keep it across navigation, review before checkout |
| **Checkout** | Delivery details, order summary, order created against the signed-in client |
| **Tracking** | Clients track an order by its ID without signing in |
| **Client dashboard** | A signed-in client's own orders and their status |
| **Admin dashboard** | Separate sign-in, order queue, service and site configuration |
| **Maintenance mode** | A switch that puts the public site behind a holding page |

## Structure

```
src/pages/            Home, CategoryPage, ServiceDetail, Checkout, TrackOrder,
                      ClientDashboard, admin/Login, admin/Dashboard, Signup
src/components/       Navbar, ServiceCard, ServiceModal, CartSidebar, DeliveryModal, ProtectedRoute
src/context/          AuthContext, CartContext, ConfigContext, ServiceContext
src/data.js           service catalogue and tier definitions
src/supabase.js       client (URL + publishable key only)
netlify.toml          SPA redirect + build config
```

## Running it

```bash
npm install
npm run dev
```

Create `.env.local`:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Both values are publishable by design. **Access control must come from Row Level Security in Supabase, not from hiding these** — an anon key is shipped to every visitor.

## What I would change before taking real payments

- Checkout records an order; it does not take money. Payment capture would go through a provider webhook server-side, never from the browser.
- The admin role check happens in the UI; it must be enforced by RLS policies and server-side session checks.
- Prices live in `src/data.js`, so they ship with the bundle. They belong in the database with an audit trail.

## Notes

Renamed from `nexabro` (a typo of the business name) — GitHub redirects the old URLs.

---

**Md. Abir Ul Islam** · [GitHub](https://github.com/abir2022) · [LinkedIn](https://www.linkedin.com/in/md-abir-ul-islam/)
