'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

interface JobFormState {
  title: string;
  company_name: string;
  description: string;
  location: string;
  job_type: 'Full-Time' | 'Part-Time' | 'Contract' | '';
}

interface PostJobFormProps {
  userId: string;
}

export default function PostJobForm({ userId }: PostJobFormProps) {
  const router = useRouter();
   const { startGlobalLoader, stopGlobalLoader } = useAuth();

  const [formData, setFormData] = useState<JobFormState>({
    title: '',
    company_name: '',
    description: '',
    location: '',
    job_type: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Define job type options for the select dropdown
  const jobTypeOptions: Exclude<JobFormState['job_type'], ''>[] = ['Full-Time', 'Part-Time', 'Contract'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value as JobFormState[keyof JobFormState] }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    startGlobalLoader();
    setError(null);
    setSuccessMessage(null);

    // Basic validation
    if (!formData.title || !formData.company_name || !formData.description || !formData.location || !formData.job_type) {
      setError("All fields are required, including job type.");
      setIsLoading(false);
      stopGlobalLoader();
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from('tbl_jobs')
        .insert({
          title: formData.title,
          company_name: formData.company_name,
          description: formData.description,
          location: formData.location,
          job_type: formData.job_type,
          user_id: userId,
        });

      if (insertError) {
        throw insertError;
      }

      setSuccessMessage('Job posted successfully! You will be redirected shortly.');
      setFormData({
        title: '',
        company_name: '',
        description: '',
        location: '',
        job_type: '',
      });

      // Redirect to the main job board or the new job's page after a short delay
      setTimeout(() => {
        router.push('/'); // Redirect to homepage, or perhaps a jobs dashboard
        router.refresh(); // Ensure the page displaying jobs is updated
      }, 2000);

    } catch (e: any) {
      console.error('Error posting job:', e);
      setError(e.message || 'Failed to post job. Please check the console and try again.');
    } finally {
      setIsLoading(false);
      stopGlobalLoader();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 shadow-lg rounded-xl max-w-2xl mx-auto border border-gray-200">
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-800 mb-1">
          Job Title <span className="text-red-500">*</span>
        </label>
        <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required
          className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
          placeholder="e.g., Senior Software Engineer" />
      </div>
      <div>
        <label htmlFor="company_name" className="block text-sm font-semibold text-gray-800 mb-1">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input type="text" name="company_name" id="company_name" value={formData.company_name} onChange={handleChange} required
          className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
          placeholder="e.g., XYZ Corp" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={5} required
          className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
          placeholder="Describe the job role, responsibilities, qualifications, etc." />
      </div>
      <div>
        <label htmlFor="location" className="block text-sm font-semibold text-gray-800 mb-1">
          Location <span className="text-red-500">*</span>
        </label>
        <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} required
          className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
          placeholder="e.g., New York, NY or Remote" />
      </div>
      <div>
        <label htmlFor="job_type" className="block text-sm font-semibold text-gray-800 mb-1">
          Job Type <span className="text-red-500">*</span>
        </label>
        <select name="job_type" id="job_type" value={formData.job_type} onChange={handleChange} required
          className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out">
          <option value="" disabled>Select a job type</option>
          {jobTypeOptions.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-300">{error}</p>}
      {successMessage && <p className="text-sm text-green-700 bg-green-50 p-3 rounded-md border border-green-300">{successMessage}</p>}

      <div>
        <button type="submit" disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-in-out">
          {isLoading ? 'Posting Job...' : 'Post Job'}
        </button>
      </div>
    </form>
  );
}