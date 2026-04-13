# GoBarber — Backend API

![GoBarber dashboard hero](./docs/image/screenshot.jpg)

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License: MIT" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3.8-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-LTS-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" /></a>
  <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express-4.17-000000?style=flat-square&logo=express&logoColor=white" alt="Express" /></a>
  <a href="https://typeorm.io/"><img src="https://img.shields.io/badge/TypeORM-0.2-FE0902?style=flat-square" alt="TypeORM" /></a>
  <a href="https://jestjs.io/"><img src="https://img.shields.io/badge/Jest-26-C21325?style=flat-square&logo=jest&logoColor=white" alt="Jest" /></a>
</p>

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
- **Docker + Docker Compose** (recommended for local databases)
- OR local services for **PostgreSQL**, **Redis**, and **MongoDB**

---

## Getting started

1. **Clone and install**

   ```bash
   git clone https://github.com/carloswimmer/gobarber-backend.git
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

4. **Start databases (Docker Compose)**

   ```bash
   docker compose up -d
   ```

   This starts `postgres`, `redis`, and `mongo` from `docker-compose.yml`. PostgreSQL runs `docker/postgres/init.sql` on first startup to enable `uuid-ossp`.

5. **Migrations**

   Run TypeORM migrations against your PostgreSQL database (see the `typeorm` script in `package.json` and the files under `src/shared/infra/typeorm/migrations/`). Example:

   ```bash
   yarn typeorm migration:run
   ```

6. **(Optional) Seed appointments data**

   ```bash
   yarn seed:appointments
   ```

   The seed creates two users (`john-barber@gmail.com` and `sam-client@gmail.com`) both with password `12345678`, and 8 upcoming business-hour appointments between them. To remove this sample data:

   ```bash
   yarn seed:reset-appointments
   ```

7. **Run the API**

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
| `yarn seed:appointments` | Seed 8 upcoming appointments + sample users |
| `yarn seed:reset-appointments` | Remove seed users and related appointments |

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
