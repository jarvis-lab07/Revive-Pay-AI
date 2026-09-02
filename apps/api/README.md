# RecoverAI Backend API

## Setup Instructions

1. **Install dependencies**
   ```bash
   cd apps/api
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and fill in the values, particularly Supabase URL and Keys.
   ```bash
   cp .env.example .env
   ```

3. **Database Setup**
   Execute `src/database/schema.sql` in your Supabase SQL Editor to create tables.
   Execute `src/database/seed.sql` to populate initial mock data.

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   npm start
   ```
