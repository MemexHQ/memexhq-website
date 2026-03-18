# MemexHQ Landing Page

AI-powered context layer landing page built with Next.js and deployed on Vercel.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Deployment to Vercel

### 1. Create a Vercel Project

```bash
npm i -g vercel
vercel login
vercel
```

### 2. Add Vercel Postgres Database

1. Go to your Vercel dashboard
2. Navigate to Storage → Create Database
3. Select **Vercel Postgres** (Hobby tier - free 1GB)
4. Connect the database to your project
5. The environment variables will be automatically added

### 3. Environment Variables

The following variables are automatically set when you connect Vercel Postgres:

- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### 4. Deploy

```bash
vercel --prod
```

## Vercel Postgres Free Tier Limits

- 1GB storage
- 10M row reads/month
- 5M row writes/month
- 1 Database per project
- Serverless connection pooling

## Database Schema

The `signups` table is automatically created on first signup:

| Column     | Type         | Description              |
|------------|--------------|--------------------------|
| id         | SERIAL       | Primary key              |
| email      | VARCHAR(255) | User email (unique)      |
| company    | VARCHAR(255)  | Company/project name     |
| ref_code   | VARCHAR(20)  | Unique referral code     |
| created_at | TIMESTAMP    | Signup timestamp         |

## Project Structure

```
memexhq/
├── app/
│   ├── api/signup/route.ts   # Signup API endpoint
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   └── globals.css           # Global styles
├── components/               # SVG logos
│   └── dark/                 # Dark theme logos
├── package.json
├── vercel.json
└── tsconfig.json
```
