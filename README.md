# Hôtel Youcef — Restaurant Menu

The digital restaurant menu of **Hôtel Youcef, Khenchela**. Guests open it by scanning a QR code on the table.

- **Public menu** (`/`): hero, popular dishes, the full menu by category, gallery, contact and social links. French by default, with an Arabic (right-to-left) version one tap away. Dark mode by default, light mode available.
- **Admin** (`/admin`): the manager adds, edits and deletes dishes, uploads photos, marks dishes sold out ("Épuisé") and picks the dishes shown under "Les plus demandés". Each change goes live about one minute after saving.

Hosting is **free on GitHub Pages**. There is no server, database or subscription.

## How it works

- The site is a static Next.js 16 export, built with TypeScript and Tailwind CSS v4.
- It is served from the `gh-pages` branch of this repository.
- The live menu is the file `menu.json` at the root of `gh-pages`. The public page loads it on every visit, so admin edits show up without a rebuild.
- `/admin` writes to `menu.json` (and to `uploads/` for photos) directly through the GitHub API. GitHub Pages then republishes the branch automatically.
- `public/menu.json` on `main` is the copy used at build time. `npm run deploy` first syncs it from the live version, so a deploy never erases what the hotel edited.

## Admin access code

The admin logs in with a GitHub **fine-grained personal access token**, which works as its password. To create one:

1. Go to GitHub → *Settings* → *Developer settings* → *Personal access tokens* → **Fine-grained tokens** → *Generate new token*.
2. Fill in the token settings:
   - **Repository access**: *Only select repositories* → `hotel-youcef-menu`.
   - **Permissions** → *Repository permissions* → **Contents: Read and write**. Leave everything else as it is.
   - **Expiration**: up to one year. Note the date, because you must give the hotel a new code before it expires.
3. Give the token to the manager. They paste it once on `/admin` and the device remembers it.

This token can only change files in this one repository. To revoke access, delete the token on GitHub.

## Develop and deploy

```bash
npm install
npm run dev        # http://localhost:3000   (the admin edits the live menu too)
npm run deploy     # build + publish to gh-pages → live in ~1 minute
```

Code changes need `npm run deploy`. Menu changes made from `/admin` do not.

To reset the menu to the original printed menu, copy `data/menu.seed.json` over `public/menu.json` and run `npm run deploy`.

## Configuration

`lib/site.ts`:
- phone number
- WhatsApp number: also settable with the `NEXT_PUBLIC_WHATSAPP` environment variable at build time
- social links

`lib/github.ts`: the repository and branch the admin writes to.

`NEXT_PUBLIC_BASE_PATH`: defaults to `/hotel-youcef-menu`. Set it to an empty string when using a custom domain.

## Custom domain (free)

To serve the menu at `menu.<hotel-domain>`:

1. Add a **CNAME** DNS record pointing `menu` to `chekhabayoub04-glitch.github.io`.
2. Set the custom domain under *Repository Settings → Pages*.
3. Deploy with `NEXT_PUBLIC_BASE_PATH= npm run deploy`.

## Still to confirm with the client

- the full WhatsApp number (the printed menu shows "0661 8888…", cut off)
- the full street address
- photos of the dining room, the tables and the pool loungers, plus dish photos, to replace the remaining Unsplash placeholders (the hotel's own photos are in `public/photos/`)
- the exact YouTube channel URL
