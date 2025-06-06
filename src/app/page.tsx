// src/app/page.tsx
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import Link from 'next/link';
import JobSearchAndFilter from '@/components/JobSearchAndFilter';
import { FaPlus } from 'react-icons/fa';
import { formatTimeAgo } from '@/utils/dateFormatter';


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

export const dynamic = 'force-dynamic';

export default async function BrowseJobsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) { return cookieStore.get(name)?.value; },
      set(name: string, value: string, options: CookieOptions) { try { cookieStore.set(name, value, options); } catch (error) {} },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.delete({ name, ...options });
        } catch (error) { 
          console.error(`Error removing cookie ${name}:`, error); 
        }
      },
    },
  });

  const { data: { session } } = await supabase.auth.getSession();
  const currentUserId = session?.user?.id || null;

  // --- Fetch distinct locations
  let uniqueLocations: string[] = [];

  const { data: locationObjects, error: locationsError } = await supabase
    .from('tbl_jobs')
    .select('location');

  if (!locationsError && locationObjects) {
    uniqueLocations = [
      ...new Set(locationObjects.map(job => job.location).filter(Boolean))
    ].sort();
  }

  const searchQuery = typeof searchParams?.q === 'string' ? searchParams.q : undefined;
  const locationFilter = typeof searchParams?.location === 'string' ? searchParams.location : undefined;
  const jobTypeFilter = typeof searchParams?.job_type === 'string' ? searchParams.job_type : undefined;

  const page = parseInt(typeof searchParams?.page === 'string' ? searchParams.page : '1', 10);
  const limit = 9;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Base query with filters
  let query = supabase.from('tbl_jobs').select('*', { count: 'exact' });

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,company_name.ilike.%${searchQuery}%`);
  }

  if (locationFilter) {
    query = query.eq('location', locationFilter);
  }

  if (jobTypeFilter) {
    query = query.eq('job_type', jobTypeFilter);
  }

  if (currentUserId) {
    query = query.eq('user_id', currentUserId);
  }

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data: jobs, error, count } = await query;

  if (error) {
    console.error('Error fetching jobs:', error.message);
    return (
      <div className="container mx-auto px-4 py-8">
        <JobSearchAndFilter allLocations={uniqueLocations} />
        <h1 className="text-3xl font-bold my-6 text-center">Browse Jobs</h1>
        <p className="text-red-500 text-center">Could not fetch jobs. Please try again later.</p>
        <p className="text-red-500 text-center">{error.message}</p>
      </div>
    );
  }

  const authenticated = session?.user?.id;

  return (
    <div className="container mx-auto px-4 py-8">
      {authenticated && (
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0 text-black">My Posted Jobs</h1>
        <Link href="/jobs/new" className="flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out transform hover:scale-105">
          <FaPlus className="mr-1.5 h-4 w-4" />
          Post a New Job
        </Link>
      </div>
      )}

      <JobSearchAndFilter allLocations={uniqueLocations} />

      {!jobs || jobs.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">No jobs found.</p>
          <p className="mt-2 text-gray-500">Start by <Link href="/jobs/new" className="text-indigo-600 hover:text-indigo-800 font-semibold">posting a job</Link>.</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {(jobs as Job[]).map((job) => (
              <div key={job.id}
                className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-200 flex flex-col justify-between h-64">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-semibold text-indigo-700 truncate pr-2">{job.title}</h2>
                    <span className="text-xs text-gray-500 whitespace-nowrap pt-1">
                      {formatTimeAgo(job.created_at)}
                    </span>
                  </div>
                  <p className="text-lg text-gray-800 mb-1"><strong>Company:</strong> {job.company_name}</p>
                  <p className="text-md text-gray-600 mb-1"><strong>Location:</strong> {job.location}</p>
                  <p className="text-md text-gray-600"><strong>Type:</strong> {job.job_type}</p>
                </div>
                <div className="mt-4">
                  <Link href={`/jobs/${job.id}`} className="text-indigo-600 hover:text-indigo-800 font-medium underline">
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {count && count > limit && (
            <div className="flex justify-center mt-10 space-x-2">
              {Array.from({ length: Math.ceil(count / limit) }, (_, i) => i + 1).map((pageNum) => (
                <Link key={pageNum} href={{ pathname: '/', query: { ...searchParams, page: pageNum.toString() } }}
                  className={`px-4 py-2 rounded-md border text-sm font-medium ${
                    page === pageNum
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-indigo-600 border-gray-300 hover:bg-gray-100'
                  }`}>
                  {pageNum}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
