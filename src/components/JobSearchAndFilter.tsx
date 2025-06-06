'use client';

import { useState, FormEvent, useEffect, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSearch, FaSync } from 'react-icons/fa';

interface JobSearchAndFilterProps {
  allLocations: string[];
}

export default function JobSearchAndFilter({ allLocations }: JobSearchAndFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Define the static list of job types
  const jobTypeOptions = ['Full-Time', 'Part-Time', 'Contract'];

  // Initialize state for all filters from URL params or default to empty
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || '');
  const [jobTypeFilter, setJobTypeFilter] = useState(searchParams.get('job_type') || '');

  // Update state if URL params change
  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
    setLocationFilter(searchParams.get('location') || '');
    setJobTypeFilter(searchParams.get('job_type') || '');
  }, [searchParams]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);

    // Set or delete search term
    if (searchTerm.trim()) {
      params.set('q', searchTerm.trim());
    } else {
      params.delete('q');
    }

    // Set or delete location filter
    if (locationFilter) {
      params.set('location', locationFilter);
    } else {
      params.delete('location');
    }

    // Set or delete job type filter
    if (jobTypeFilter) {
      params.set('job_type', jobTypeFilter);
    } else {
      params.delete('job_type');
    }
    
    // When a new search is performed, reset to the first page
    params.set('page', '1');

    router.push(`/?${params.toString()}`);
  };

  // Reset all filters to their default state
  const handleReset = () => {
    setSearchTerm('');
    setLocationFilter('');
    setJobTypeFilter('');
    
    router.push('/');
  };

  return (
    <form onSubmit={handleSearch} className="mb-8 p-6 bg-gray-50 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="lg:col-span-1">
          <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
            Search Keywords
          </label>
          <input type="text" id="searchTerm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="e.g., React Developer"
            className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"/>
        </div>

        <div className="lg:col-span-1">
          <label htmlFor="locationFilter" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <select id="locationFilter" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}
            className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out">
            <option value="">All Locations</option>
            {allLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-1">
            <label htmlFor="jobTypeFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Job Type
            </label>
            <select id="jobTypeFilter" value={jobTypeFilter} onChange={(e) => setJobTypeFilter(e.target.value)}
                className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out">
                <option value="">All Types</option>
                {jobTypeOptions.map((type) => (
                    <option key={type} value={type}>
                        {type}
                    </option>
                ))}
            </select>
        </div>

        <div className="lg:col-span-1 flex space-x-2">
            <button type="submit"
                className="w-1/2 flex-1 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 flex items-center justify-center">
                <FaSearch className="mr-2 h-4 w-4" />
                Search
            </button>
            <button type="button" onClick={handleReset}
                className="w-1/2 flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-150 flex items-center justify-center">
                <FaSync className="mr-2 h-4 w-4" />
                Reset
            </button>
        </div>
      </div>
    </form>
  );
}
