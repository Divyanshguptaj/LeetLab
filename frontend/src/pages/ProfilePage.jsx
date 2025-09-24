import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore.js';
import useProblemStore from '../store/problemStore.js';
import Navbar from '../components/Navbar.jsx'
import {Link} from 'react-router-dom'

const ProfilePage = () => {
  const { authUser} = useAuthStore();
  const { solvedProblems, getSolvedProblemByUser } = useProblemStore();

  const [easy, setEasy] = useState(0);
  const [medium, setMedium] = useState(0);
  const [hard, setHard] = useState(0);

  
  
  
  
  useEffect(() => {
    getSolvedProblemByUser();
  }, [getSolvedProblemByUser]);

  
  useEffect(() => {
    if (solvedProblems && solvedProblems.length > 0) {
      let easyCount = 0;
      let mediumCount = 0;
      let hardCount = 0;

      solvedProblems.forEach((element) => {
        if (element.difficulty === 'EASY') easyCount++;
        else if (element.difficulty === 'MEDIUM') mediumCount++;
        else if (element.difficulty === 'HARD') hardCount++;
      });

      setEasy(easyCount);
      setMedium(mediumCount);
      setHard(hardCount);
    } else {
      // Reset counts if there are no solved problems
      setEasy(0);
      setMedium(0);
      setHard(0);
    }
  }, [solvedProblems]);




  return (
<div className='flex flex-col min-h-screen w-screen bg-base-200'>
      {/* Navbar section, sticky at the top */}
      <div className='w-full sticky top-0 z-50'>
        <Navbar/>
      </div>
    <div className='min-h-screen  w-full flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 bg-base-200'>

      {/* User Profile Section */}


      <div className='card w-full max-w-4xl bg-base-100 shadow-xl mb-8'>
        <div className='card-body'>
          <h2 className='card-title text-3xl text-primary mb-4'>User Profile</h2>
          <div className='flex flex-col gap-2'>
            <p className='text-lg'>
              <strong className='font-semibold'>Name:</strong> {authUser?.name}
            </p>
            <p className='text-lg'>
              <strong className='font-semibold'>Email:</strong> {authUser?.email}
            </p>
            <div className='badge badge-lg badge-secondary'>{authUser?.role}</div>
          </div>
        </div>
      </div>

      {/* Problems Solved by Difficulty */}
      <div className='card w-full max-w-4xl bg-base-100 shadow-xl mb-8'>
        <div className='card-body'>
          <h1 className='card-title text-3xl text-primary text-center mb-6'>
            Problems Solved by Difficulty
          </h1>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='card bg-success text-success-content shadow-lg'>
              <div className='card-body items-center text-center'>
                <h2 className='card-title text-2xl'>Easy</h2>
                <p className='text-6xl font-extrabold'>{easy}</p>
              </div>
            </div>

            <div className='card bg-warning text-warning-content shadow-lg'>
              <div className='card-body items-center text-center'>
                <h2 className='card-title text-2xl'>Medium</h2>
                <p className='text-6xl font-extrabold'>{medium}</p>
              </div>
            </div>

            <div className='card bg-error text-error-content shadow-lg'>
              <div className='card-body items-center text-center'>
                <h2 className='card-title text-2xl'>Hard</h2>
                <p className='text-6xl font-extrabold'>{hard}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manage Playlist Section */}
      <div className='card w-full max-w-4xl bg-base-100 shadow-xl mb-8'>
        <div className='card-body'>
          <h1 className='card-title text-3xl text-primary text-center mb-6'>
            Manage Playlists
          </h1>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='card bg-neutral text-neutral-content shadow-lg'>
              <div className='card-body items-center text-center'>
                <h2 className='card-title text-2xl'>View Playlists</h2>
                  <Link className=' w-full' to={'/viewPlaylist'}>
                  <button className='btn btn-primary mt-4 w-full'>
                  View
                  </button>
                  </Link>

              </div>
            </div>
            <div className='card bg-neutral text-neutral-content shadow-lg'>
              <div className='card-body items-center text-center'>
                <h2 className='card-title text-2xl'>Create Playlist</h2>
                  <Link className=' w-full' to={'/createPlaylist'}>
                <button className='btn btn-primary mt-4 w-full'>
                  Create
                </button>
                  </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Solved Problems List */}
      <div className='card w-full max-w-4xl bg-base-100 shadow-xl mb-8'>
        <div className='card-body'>
          <h1 className='card-title text-3xl text-primary text-center mb-6'>
            All Solved Problems
          </h1>
          {/* Added div for scrollbar */}
          <div className='max-h-96 overflow-y-auto pr-2'> {/* Added max-h-96 and overflow-y-auto */}
            <div className=' m-4 gap-6 flex flex-col justify-items-center'> 
              {solvedProblems && solvedProblems.length > 0 ? (
                solvedProblems.map((problem) => (
                  <div key={problem.id} className=' flex card mt-8 w-full bg-base-200 shadow-lg rounded-box '>
                    <div className='card-body p-5 flex  justify-between h-full'>
                      <div> {/* Wrapper for title and description */}
                        <h3 className='card-title text-xl font-bold text-base-content mb-2'>
                          <Link to={`/problem/${problem.id}`}>
                          {problem.title}
                          </Link>
                        </h3>
                        <p className='text-sm text-base-content opacity-80 line-clamp-3 mb-4'>
                          {problem.description}
                        </p>
                      </div>
                      <div className='card-actions  mt-auto'> {/* Pushed to bottom */}
                        <div
                          className={`badge ${
                            problem.difficulty === 'EASY'
                              ? 'badge-success'
                              : problem.difficulty === 'MEDIUM'
                              ? 'badge-warning'
                              : 'badge-error'
                          } badge-lg`} // Larger badge
                        >
                          {problem.difficulty}
                        </div>
                        
                        
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='col-span-full w-full text-center py-10'> 
                  <p className='text-xl text-gray-500'>No problems solved yet! Keep practicing!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProfilePage;