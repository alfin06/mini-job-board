'use client';

import { useState, FormEvent } from 'react';
import { updateJobAction } from '@/app/action';

interface Job {
  id: string;
  title: string;
  company_name: string;
  description: string;
  location: string;
  job_type: string;
}

interface EditJobFormProps {
  job: Job;
}

export default function EditJobForm({ job }: EditJobFormProps) {
  // Initialize form state with the existing job data
  const [formData, setFormData] = useState({
    title: job.title,
    company_name: job.company_name,
    description: job.description,
    location: job.location,
    job_type: job.job_type,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await updateJobAction(job.id, formData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update job.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 shadow-lg rounded-xl border border-gray-200">
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-800 mb-1">Job Title</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required 
          className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"/>
      </div>
      <div>
        <label htmlFor="company_name" className="block text-sm font-semibold text-gray-800 mb-1">Company Name</label>
        <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} required 
          className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"/>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-1">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows={5} required 
          className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"/>
      </div>
      <div>
        <label htmlFor="location" className="block text-sm font-semibold text-gray-800 mb-1">Location</label>
        <input type="text" name="location" value={formData.location} onChange={handleChange} required 
          className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"/>
      </div>
      <div>
        <label htmlFor="job_type" className="block text-sm font-semibold text-gray-800 mb-1">Job Type</label>
        <select name="job_type" value={formData.job_type} onChange={handleChange} required 
          className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out">
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Contract">Contract</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}

      <div>
        <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60">
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}