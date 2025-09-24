import React, { useEffect } from 'react';
import useProblemStore from '../store/problemStore';
import useAuthStore from '../store/authStore';
import { Link } from 'react-router-dom';

const Table = ({ difficulty, search }) => {
  const { problems, getAllProblems, isProblemsLoading } = useProblemStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  const filteredProblems = problems
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .filter((p) =>
      difficulty === "ALL" ? true : p.difficulty.toLowerCase() === difficulty.toLowerCase()
    );

  if (isProblemsLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <span className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></span>
      </div>
    );
  }

  const getDifficultyColor = (level) => {
    switch (level.toLowerCase()) {
      case 'easy':
        return 'bg-green-600 text-green-100';
      case 'medium':
        return 'bg-yellow-600 text-yellow-100';
      case 'hard':
        return 'bg-red-600 text-red-100';
      default:
        return 'bg-gray-600 text-gray-100';
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-xl border border-gray-700 bg-gray-800">
      {filteredProblems.length === 0 ? (
        <div className="p-8 text-center text-gray-400 text-lg">
          No problems found matching your criteria.
        </div>
      ) : (
        // Added wrapper div for scrolling
        <div className="max-h-96 overflow-y-auto"> {/* Adjust max-h-96 as needed, e.g., max-h-[500px] */}
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700 sticky top-0 z-10"> {/* Make header sticky */}
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Solved
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Difficulty
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Tags
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredProblems.map((p, index) => (
                <tr key={p.id || index} className="hover:bg-gray-700 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={p.solvedBy?.some(solved => solved.userId === authUser?.id)}
                      readOnly
                      className="form-checkbox h-5 w-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400 hover:text-blue-300">
                    <Link to={`/problem/${p.id}`} className="hover:underline">
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(p.difficulty)}`}>
                      {p.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {p.tags && p.tags.length > 0 ? p.tags.join(', ') : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Table;