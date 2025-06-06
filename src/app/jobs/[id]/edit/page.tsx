import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { notFound, redirect } from 'next/navigation';
import EditJobForm from '@/components/EditJobForm'; // We will create this next
import Link from 'next/link';

interface Job {
  id: string;
  created_at: string;
  title: string;
  company_name: string;
  description: string;
  location: string;
  job_type: string;
  user_id: string;
}

export default async function EditJobPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) { return cookieStore.get(name)?.value; },
      set(name, value, options) { try { cookieStore.set(name, value, options); } catch (error) {} },
      remove(name, options) { try { cookieStore.delete(name, options); } catch (error) {} },
    },
  });

  // Fetch the current user
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch the job posting data
  const { data: job, error } = await supabase
    .from('tbl_jobs')
    .select('*')
    .eq('id', params.id)
    .single();

  // If no job is found, return a 404 page
  if (error || !job) {
    return notFound();
  }

  // If user is not the owner of job posting, redirect to main page
  if (!user || user.id !== job.user_id) {
    redirect('/'); 
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <Link href={`/jobs/${job.id}`} 
          className="inline-block mb-6 font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
          ← Back to Job Details
        </Link>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Job Posting</h1>
        <EditJobForm job={job as Job} />
      </div>
    </div>
  );
}