# Culturaft Backend

Run backend API for Culturaft.

Environment: create `.env` from `.env.example`.

Cloudinary
 - Set the Cloudinary URL in your environment for image uploads. Do NOT commit secrets to git.
 - Example env entry (use your real credentials only in a local `.env` or on your host):
```
CLOUDINARY_URL=cloudinary://<API_KEY>:<API_SECRET>@<CLOUD_NAME>
```
 - On Vercel add an Environment Variable named `CLOUDINARY_URL` with your value.


Install:

```powershell
cd backend
npm install
```

Run dev:

```powershell
npm run dev
```

Seed admin and sample products:

```powershell
npm run seed
```
