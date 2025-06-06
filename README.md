# Mini Job Board

A full-stack web application built with Next.js and Supabase that allows companies to post job openings and users to browse and filter them.

**LIVE DEMO**: https://mini-job-board-215naesge-alfins-projects-13fef5b2.vercel.app/

## ✅ Features Implemented

* **User Authentication**: Secure sign-up, login, logout, and forgot password functionality handled by Supabase Auth.
* **Post Jobs**: Authenticated users can create new job postings through a protected route.
* **Browse & Filter Jobs**: A public-facing homepage displays all job listings. Users can:
    * Search by keywords in the job title, company name, or description.
    * Filter by a specific location from a dynamically populated dropdown.
    * Filter by job type.
* **Job Detail Page**: Users can view the full details of any job by navigating to its dedicated page.
* **User Dashboard & Ownership**:
    * The main page automatically becomes a "My Posted Jobs" dashboard when a user is logged in, showing only the jobs they have created.
    * Users can **edit** their own job postings.
    * Users can **delete** their own job postings.
    * Ownership is enforced on the backend using Supabase's Row Level Security (RLS) policies, preventing users from editing or deleting jobs they don't own.

## 🛠️ Tech Stack
* **Frontend**: [**Next.js 14**](https://nextjs.org/)
* **Backend** & **Database**: [**Supabase**](https://supabase.io/)
* **Styling**: [**Tailwind**](https://tailwindcss.com/)
* **Deployment**: [**Vercel**](https://vercel.com/)
* **Icons**: [**React Icons**](https://react-icons.github.io/react-icons/)

## 🚀 Running the Project Locally

To set up and run this project on your local machine, follow these steps:

**1. Clone the Repository & Install Dependencies:**

```bash
git clone [https://github.com/your-username/mini-job-board.git](https://github.com/your-username/mini-job-board.git)
cd mini-job-board
npm install
```

**2. Set Up Supabase:**

* Create a new project on [Supabase](https://app.supabase.io/).
* In the SQL Editor, run the schema script found below to create the `tbl_jobs` table.
* Set up Row Level Security (RLS) policies for select, insert, update, and delete access.

### Supabase Schema (`tbl_jobs`)
```sql
-- Create the jobs table
CREATE TABLE public.tbl_jobs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title text NOT NULL,
  company_name text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  job_type text NOT NULL,
  user_id uuid NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT jobs_pkey PRIMARY KEY (id),
  CONSTRAINT jobs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- RLS Policies
-- Enable RLS
ALTER TABLE public.tbl_jobs ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to jobs" ON public.tbl_jobs FOR SELECT USING (true);

-- Allow users to insert their own jobs
CREATE POLICY "Enable insert for authenticated users only" ON public.tbl_jobs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own jobs
CREATE POLICY "Enable update for users based on user_id" ON public.tbl_jobs FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own jobs
CREATE POLICY "Enable delete for users based on user_id" ON public.tbl_jobs FOR DELETE TO authenticated USING (auth.uid() = user_id);
```

**3. Set Up Environment Variables:**

* In the root of your project, create a new file named `.env.local`.
* Go to your Supabase project's Settings > API.
* Copy your Project URL and the `anon` public key into the `.env.local` file:
```bash
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

**4. Run the Development Server:**
```bash
npm run dev
```
Open http://localhost:3000 in your browser to see the application.

## 🏗️ Architecture Overview

This application is built using the **Next.js App Router**, which leverages modern React features like Server Components, and deployed on **Vercel**.

* **Frontend (Vercel & Next.js)**: The Mini Job Board application is deployed on **Vercel**, which provides the serverless infrastructure for running Next.js application.. User requests are handled by Server Components, which fetch data directly. Interactive UI are handled by Client Components.

* **Backend**: Supabase serves as the all-in-one backend, providing:
  * Database: A PostgreSQL database to store job and user data.
  * Authentication: Supabase Auth for secure user sign-up, login, logout, forgot password, and session management.
  * Security layer: Row Level Security (RLS) policies that act as a secure backend, ensuring users can only access or modify the data they own.

## 🌟 What I Would Improve

Given more time, I would focus on the following enhancements:
* **Single Sign-On (SSO)**: For ease-of-use, I would integrate Supabase's third-party login providers, such as Google or GitHub, allowing users to sign up and log in with a single click.

* **Advanced Search**: Implement true full-text search with Supabase for the search filter, which would be more performant and accurate than the current `ilike` query.

* **User Profiles** & **Company Pages**: Allow users to create profiles and companies to create dedicated pages, listing all their open positions.

* **Image Uploads**: Add the ability for companies to upload logos for their job postings using Supabase Storage.

* **Show/Hide Job Post**: Add the ability for companies to show/hide their job posts.

* **Notifications**: Implement an email notification system to notify users when their job posting is about to expire or when new jobs matching their interests are posted.

* **UI/UX Polish**:
  * Implement a toast notification system for better user feedback on actions like "Job Posted" or "Update Successful."

* **Testing**: Write unit and integration tests for components and Server Actions using a framework like Jest and React Testing Library to ensure long-term stability and reliability.