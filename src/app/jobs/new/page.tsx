export const dynamic = 'force-dynamic';

import { cookies as getNextCookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import PostJobForm from '@/components/PostJobForm';
import Link from 'next/link';

export default async function PostNewJobPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          const cookieStore = getNextCookies(); 
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            const cookieStore = getNextCookies();
            cookieStore.set(name, value, options);
          } catch (error) {
            console.warn(`Failed to set cookie '${name}' in Server Component:`, error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            const cookieStore = getNextCookies();
            cookieStore.delete(name, options);
          } catch (error) {
            console.warn(`Failed to delete cookie '${name}' in Server Component:`, error);
          }
        },
      },
    }
  );

  let sessionData;
  try {
    const { data, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("Error getting session in PostNewJobPage:", sessionError.message);
      sessionData = null;
    } else {
      sessionData = data.session;
    }
  } catch (e: any) {
    console.error("Critical error during getSession in PostNewJobPage:", e.message);
    sessionData = null;
  }

  if (!sessionData) {
    console.log("No session found in PostNewJobPage, redirecting to /login.");
    redirect('/login');
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-block mb-6 font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
          ← Back to jobs
        </Link>
        {sessionData && sessionData.user && (
           <PostJobForm userId={sessionData.user.id} />
        )}
      </div>
    </div>
  );
}