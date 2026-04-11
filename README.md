# GoBarber — Backend API

[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-3.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.17-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeORM](https://img.shields.io/badge/TypeORM-0.2-FE0902?style=flat-square)](https://typeorm.io/)
[![Jest](https://img.shields.io/badge/Jest-26-C21325?style=flat-square&logo=jest&logoColor=white)](https://jestjs.io/)

REST API for **GoBarber**, a scheduling platform where clients book time with barbers and service providers. This service handles accounts, authentication, profiles, availability, appointments, and provider notifications—so the front end can focus on the experience.

---

## Why this project

- **Clear domain**: users sign in, manage profiles, browse providers, and book 1-hour slots within business hours—with rules that prevent double-booking and invalid times.
- **Practical stack**: TypeScript, Express, and TypeORM on PostgreSQL, with Redis for caching and MongoDB for notifications—patterns you see in real products.
- **Tested workflows**: Jest specs cover critical services (auth, appointments, password reset, and more).

For the full requirement breakdown (functional, non-functional, and business rules), see **[SPEC.md](./SPEC.md)**.

---

## Features

| Area | What you get |
|------|----------------|
| **Accounts** | Registration, JWT sessions, password recovery with token flow |
| **Profile** | Update name, email, password, and avatar (local disk storage by default) |
| **Providers & scheduling** | List providers, month/day availability, create appointments with validation |
| **Provider dashboard** | Day view of appointments; notifications with read/unread state (MongoDB) |
| **Ops** | Rate limiting, Celebrate validation, structured `AppError` responses |

---

## Tech stack

- **Runtime**: Node.js, TypeScript  
- **HTTP**: Express, CORS, `express-async-errors`  
- **Data**: TypeORM — PostgreSQL (users, appointments, tokens) + MongoDB (notifications)  
- **Cache**: Redis (ioredis)  
- **Auth**: JWT (`jsonwebtoken`), `bcryptjs`  
- **Uploads**: Multer, configurable storage (disk / AWS-ready patterns)  
- **Email**: Nodemailer — Ethereal in dev; SES driver available for production (`aws-sdk`)  
- **DI & quality**: TSyringe, ESLint (Airbnb), Prettier, Jest  

---

## Prerequisites

- Node.js (compatible with the TypeScript version in `package.json`)
- **PostgreSQL** (with `uuid-ossp` or compatible UUID setup used by migrations)
- **Redis**
- **MongoDB** (notifications)

---

## Getting started

1. **Clone and install**

   ```bash
   git clone <your-fork-url>
   cd gobarber-backend
   yarn install
   ```

2. **Environment**

   ```bash
   cp .env.example .env
   ```

   Fill in `APP_SECRET`, URLs, Redis, and AWS keys if you use SES. Adjust `MAIL_DRIVER` and `STORAGE_DRIVER` as needed (`ethereal` / `ses`, `disk`, etc.).

3. **Database configuration**

   ```bash
   cp ormconfig.example.json ormconfig.json
   ```

   Edit **`ormconfig.json`** with your PostgreSQL and MongoDB hosts, ports, users, and database names. Keep the connection names **`default`** (PostgreSQL) and **`mongo`** (MongoDB)—the app expects those names.

   Ensure PostgreSQL has the **`uuid-ossp`** extension available (migrations use `uuid_generate_v4()`).

   If you compile to `dist/` for production, point `entities` in `ormconfig.json` at the compiled `.js` files under `dist/` instead of `src/`.

4. **Migrations**

   Run TypeORM migrations against your PostgreSQL database (see the `typeorm` script in `package.json` and the files under `src/shared/infra/typeorm/migrations/`). Example:

   ```bash
   yarn typeorm migration:run
   ```

5. **Run the API**

   ```bash
   yarn dev:server
   ```

   The server listens on **port 3333** by default (see `src/shared/infra/http/server.ts`).

---

## Scripts

| Command | Purpose |
|---------|---------|
| `yarn dev:server` | Dev server with reload and inspector |
| `yarn build` | Compile TypeScript to `dist/` |
| `yarn start` | Run compiled entry (or adjust for production) |
| `yarn test` | Jest test suite |
| `yarn typeorm` | TypeORM CLI (migrations, etc.) |

---

## HTTP routes (overview)

| Prefix | Module |
|--------|--------|
| `/sessions` | Login |
| `/users` | User registration & avatar |
| `/password` | Forgot / reset password |
| `/profile` | Authenticated profile updates |
| `/providers` | Provider listing & availability |
| `/appointments` | Booking |

Static uploaded files are served under `/files` when using disk storage.

---

## Project layout

- `src/modules/` — Feature modules (`users`, `appointments`, `notifications`)
- `src/shared/` — HTTP bootstrap, TypeORM, DI container, providers (cache, mail, storage)
- `src/config/` — Auth, upload, cache helpers

Path aliases: `@modules/*`, `@config/*`, `@shared/*` (see `tsconfig.json`).

---

## License

MIT — see `package.json`.
