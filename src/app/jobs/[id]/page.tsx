import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import Link from 'next/link';
import DeleteJobButton from '@/components/DeleteJobButton';
import { FaPencilAlt } from 'react-icons/fa';

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) { return cookieStore.get(name)?.value; },
      set(name: string, value: string, options: CookieOptions) { try { cookieStore.set(name, value, options); } catch (error) {} },
      remove(name: string, options: CookieOptions) { try { cookieStore.delete(name, options); } catch (error) {} },
    },
  });

  // Fetch the current user session
  const { data: { session } } = await supabase.auth.getSession();

  // Fetch the data
  const { data: job, error } = await supabase
    .from('tbl_jobs')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !job) {
    return notFound();
  }

  const isOwner = session?.user?.id === job.user_id;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto"> {/* Centering container */}
        <div className="mb-6 flex justify-between items-center">
          <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
            ← Back to Jobs
          </Link>
          
          {isOwner && (
            <div className="flex items-center space-x-3">
              <Link href={`/jobs/${job.id}/edit`} className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out transform hover:scale-105">
                <FaPencilAlt className="mr-1.5 h-4 w-4" />
                Edit
              </Link>
              <DeleteJobButton jobId={job.id} /> 
            </div>
          )}
        </div>
        
        <div className="bg-white shadow-xl rounded-lg p-8 border border-gray-200">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{job.title}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600 mb-4">
            <p><strong>Company:</strong> {job.company_name}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Type:</strong> {job.job_type}</p>
          </div>
          <hr className="my-6" />
          <div className="prose max-w-none text-gray-800 whitespace-pre-wrap">
            {job.description}
          </div>
        </div>
      </div>
    </div>
  );
}