'use server';

import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

interface JobFormData {
  title: string;
  company_name: string;
  description: string;
  location: string;
  job_type: string;
}

// Update the job posting
export async function updateJobAction(jobId: string, formData: JobFormData) {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      // You need set/remove here for getUser to work correctly
      set(name, value, options) {
        cookieStore.set(name, value, options as CookieOptions);
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.delete({ name, ...options });
        } catch (error) { 
          console.error(`Error removing cookie ${name}:`, error); 
        }
      },
    },
  });

  // Get current current authentication
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to update a job.');
  }

  // Perform the update operation, ensuring user_id matches
  const { error: updateError } = await supabase
    .from('tbl_jobs')
    .update({
      title: formData.title,
      company_name: formData.company_name,
      description: formData.description,
      location: formData.location,
      job_type: formData.job_type,
      updated_at: new Date().toISOString() 
    })
    .eq('id', jobId)
    .eq('user_id', user.id);

  if (updateError) {
    console.error('Error updating job:', updateError);
    throw new Error('Could not update job posting.');
  }

  // Revalidate paths to clear cache and show updated data
  revalidatePath('/');
  revalidatePath(`/jobs/${jobId}`);

  // Redirect back to the job detail page
  redirect(`/jobs/${jobId}`);
}

// Delete the job posting
export async function deleteJobAction(jobId: string) {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name, value, options) {
        cookieStore.set(name, value, options as CookieOptions);
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.delete({ name, ...options });
        } catch (error) { 
          console.error(`Error removing cookie ${name}:`, error); 
        }
      },
    },
  });

  // Get current current authentication
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('You must be logged in to delete a job.');
  }

  // Perform the delete operation, ensuring the user_id matches
  const { error: deleteError } = await supabase
    .from('tbl_jobs')
    .delete()
    .eq('id', jobId)
    .eq('user_id', user.id);

  if (deleteError) {
    console.error('Error deleting job:', deleteError);
    throw new Error('Could not delete job.');
  }

  // Revalidate the cache for the homepage
  revalidatePath('/');

  // Redirect back to the homepage
  redirect('/');
}