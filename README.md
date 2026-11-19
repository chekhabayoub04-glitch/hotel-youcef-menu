# Hôtel Youcef — Restaurant Menu (demo)

A preview of the digital restaurant menu for **Hôtel Youcef, Khenchela**. It runs on its own temporary URL so the client can review it before it is connected to the hotel's main domain.

- Public menu (`/`): hero, popular dishes, the full menu by category, gallery, contact and social links. Built mobile-first for QR-code access, with dark mode by default and a light mode toggle.
- Languages: French by default, with an Arabic version (right-to-left) one tap away. The choice is remembered in a cookie. Interface text is in `lib/i18n.ts`. Each dish and category has optional `nameAr` / `descriptionAr` fields, which are also editable in the admin.
- Admin (`/admin`): password-protected. Add, edit and delete dishes, upload photos, mark dishes sold out ("Épuisé") and choose which ones appear under "Les plus demandés". Changes show up on the public menu right away.

## Stack

Next.js 16 (App Router), TypeScript and Tailwind CSS v4. There is no database and no external service at this stage.

## Run locally

```bash
npm install
cp .env.example .env.local   # then edit the values
npm run dev                  # http://localhost:3000  ·  admin: /admin
```

| Variable | Purpose | Demo default |
|---|---|---|
| `ADMIN_PASSWORD` | Shared admin password | `youcef2026` |
| `ADMIN_SECRET` | Signs the admin session cookie | built-in demo value |
| `NEXT_PUBLIC_WHATSAPP` | WhatsApp number for the order buttons, digits only (e.g. `213XXXXXXXXX`) | `213000000000` (placeholder) |

Change `ADMIN_PASSWORD` and `ADMIN_SECRET` before sharing the link.

## Deploy a preview on Vercel

```bash
npx vercel          # creates a preview URL
```

Or push the folder to GitHub and import it in Vercel. Set the three environment variables in *Project → Settings → Environment Variables*.

> **Demo limitation:** Vercel's file system is read-only and temporary. On Vercel, admin edits are written to `/tmp`. They can disappear after a redeploy or a period of inactivity, and they may not be visible on every server instance. The admin page shows a banner about this. That is acceptable for a client preview. The production version fixes it by using Google Sheets (see below). Locally, edits are saved permanently to `data/menu.json`.

## Data layer

The UI only depends on the `MenuRepository` interface:

```
lib/data/repository.ts        interface: getMenu / saveDish / deleteDish
lib/data/json-repository.ts   demo implementation (JSON file)
lib/data/index.ts             picks the implementation  ← the only line to change
data/menu.seed.json           original menu (initial data, also used to reset)
data/menu.json                live data when running locally
```

To reset the demo data: `cp data/menu.seed.json data/menu.json`.

Dish photos are resized in the browser to about 900 px JPEG and stored as data URLs. That way an upload works with any storage backend and needs no separate file host.

## Production roadmap

1. **Google Sheets as the live data source.** Add `GoogleSheetsMenuRepository` that implements `MenuRepository`, with one sheet tab for categories and one for dishes, accessed through a Google service account. Register it in `lib/data/index.ts`. Upload photos to Google Drive or a storage bucket and keep only their URLs in the sheet.
2. **Custom domain.** Point a subdomain such as `menu.<hotel-domain>` to the Vercel project, then generate the QR codes from the final URL.
3. **Content to confirm with the client:**
   - the full WhatsApp number (the printed menu shows "0661 8888…", cut off); the phone number 032 73 15 40 is already in place
   - the full street address
   - photos of the dining room, the tables and the pool loungers, plus dish photos, to replace the remaining Unsplash placeholders. The hotel's own photos live in `public/photos/`.
   - the exact YouTube channel URL
