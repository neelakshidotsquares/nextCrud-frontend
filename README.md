# NextCRUD Frontend

Simple, clean Next.js (App Router) frontend for the existing Express + MongoDB
CRUD API. Built with **Next.js 14**, **React 18**, **Tailwind CSS**, **Axios**,
and **react-hot-toast**.

## Features

- Registration with full client-side validation (name, email, address, password)
- Login with token persistence (localStorage **or** cookies, configurable)
- Protected dashboard route (auto-redirects unauthenticated users to `/login`)
- Profile fetch + display
- Profile photo upload with instant preview
- Update profile (name, email, address)
- Delete account with confirmation modal
- Logout from the navbar user menu
- Loading states everywhere + global toast notifications
- Reusable UI primitives (`Input`, `Button`, `Modal`, `Spinner`, `Textarea`)
- Modular API services so endpoints can be swapped without touching pages

## Folder structure

```
frontend/
├── app/                    # App Router routes & layouts
│   ├── layout.js           # Root layout (Navbar + Providers)
│   ├── page.js             # Landing page
│   ├── providers.js        # Auth + Toaster providers
│   ├── login/page.js
│   ├── register/page.js
│   ├── dashboard/page.js   # Protected
│   └── not-found.js
├── components/             # Reusable UI
│   ├── Navbar.js
│   ├── ProfileCard.js
│   ├── ProfileForm.js
│   └── ui/
│       ├── Button.js
│       ├── Input.js
│       ├── Textarea.js
│       ├── Modal.js
│       └── Spinner.js
├── hooks/                  # Client hooks
│   ├── AuthContext.js      # useAuth provider
│   ├── useProtectedRoute.js
│   └── useGuestRoute.js
├── services/               # API integration layer
│   ├── apiClient.js        # Axios instance + interceptors
│   ├── endpoints.js        # All endpoint paths (env overridable)
│   ├── authService.js      # register, login
│   └── userService.js      # profile, update, upload, delete
├── utils/
│   ├── apiError.js         # Normalize axios errors
│   ├── storage.js          # token + user storage (localStorage/cookie)
│   └── validation.js       # Field validators
├── styles/globals.css      # Tailwind + small component classes
└── ...config files
```

## Getting started

```bash
cd frontend
npm install
cp .env.local.example .env.local   # already provided too
npm run dev
```

Then open http://localhost:3000.

> The Express API in the parent folder runs on port 5000 by default
> (`MONGO_URL` and `PORT` are set in the root `.env`). Make sure it’s running:
>
> ```bash
> # in the project root
> npm run start
> ```

## Configuration

All configuration lives in `.env.local`:

| Variable                          | Purpose                                              |
| --------------------------------- | ---------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`        | Axios base URL (e.g. `http://localhost:5000/api`)    |
| `NEXT_PUBLIC_AUTH_STORAGE`        | `localStorage` (default) or `cookie`                 |
| `NEXT_PUBLIC_API_REGISTER`        | Path for register, default `/auth/register`          |
| `NEXT_PUBLIC_API_LOGIN`           | Path for login, default `/auth/login`                |
| `NEXT_PUBLIC_API_PROFILE`         | Path for current profile, default `/user/me`         |
| `NEXT_PUBLIC_API_UPDATE_PROFILE`  | Path for profile update                              |
| `NEXT_PUBLIC_API_DELETE_ACCOUNT`  | Path for delete account                              |
| `NEXT_PUBLIC_API_UPLOAD_IMAGE`    | Path for avatar upload                               |

When you receive the real endpoints, update those vars — no code changes needed.

## API contract assumptions

The services try to be tolerant of common server response shapes. If your API
differs, the only files you’ll likely need to touch are:

- `services/authService.js` — see `normalizeAuthResponse`
- `services/userService.js` — see `pickUser`

Login / register are expected to return one of:

```json
{ "token": "...", "user": { "name": "...", "email": "...", "address": "...", "profileImage": "..." } }
{ "data": { "token": "...", "user": { ... } } }
{ "accessToken": "...", "user": { ... } }
```

Profile endpoints accept either `user`, `User`, `profile`, `data`, or the
object directly.

## Notes about the existing backend

Your current `controller/userController.js` doesn’t yet expose:

- a `password` field on the user model
- a login endpoint
- a JWT/auth flow
- an avatar upload route

The frontend is wired so adding those server-side requires zero frontend code
changes — just update the env var paths if needed.
