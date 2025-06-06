'use client';

import { deleteJobAction } from '@/app/action';
import { FaTrash } from 'react-icons/fa';

interface DeleteJobButtonProps {
  jobId: string;
}

export default function DeleteJobButton({ jobId }: DeleteJobButtonProps) {
  const handleDelete = async () => {
    // Confirm before deleting
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await deleteJobAction(jobId);
      } catch (error) {
        console.error(error);
        alert('Failed to delete job post.');
      }
    }
  };

  return (
    <button onClick={handleDelete} className="flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out transform hover:scale-105">
        <FaTrash className="mr-1.5 h-4 w-4" />
        Delete
    </button>
  );
}