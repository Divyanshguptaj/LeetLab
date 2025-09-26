import React, { useState } from 'react';
import Table from '../components/Table';


const ProblemsPage = () => {
  const difficulties = ["EASY", "MEDIUM", "HARD"];
  const [difficulty, setDifficulty] = useState("ALL");
  const [search, setSearch] = useState("");


  return (
    <div className='min-h-screen w-screen bg-gray-900 text-gray-100'>

      <div className='flex flex-col md:flex-row items-center justify-center pt-12 mb-8 px-4 gap-4'>
        {/* Search Bar */}
        <div className='relative flex items-center w-full max-w-md bg-gray-800 rounded-lg shadow-lg border border-gray-700 focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-300'>
          <svg className="h-6 w-6 text-gray-400 ml-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <input 
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            required 
            placeholder="Search problems..." 
            className='w-full p-3 pl-2 bg-transparent text-lg font-semibold placeholder-gray-500 focus:outline-none'
          />
        </div>

        {/* Difficulty Dropdown */}
        <div className="relative">
          <select 
            className="px-6 py-3 bg-gray-700 text-white rounded-lg appearance-none shadow-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 pr-10"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="ALL">ALL DIFFICULTIES</option>
            {difficulties.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          {/* Custom arrow for select element */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
            <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>
      
      <div className='flex justify-center px-4 mb-12'>
        <div className='w-full max-w-5xl bg-gray-800 rounded-lg shadow-xl overflow-hidden'>
          <Table difficulty={difficulty} search={search} />
        </div>
      </div>
    </div>
  );
}

export default ProblemsPage;