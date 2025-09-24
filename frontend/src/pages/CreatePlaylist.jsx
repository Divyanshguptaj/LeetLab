import React, { useEffect, useState } from 'react';
import useProblemStore from '../store/problemStore.js';
import usePlaylistStore from '../store/playlistStore.js';
import toast from 'react-hot-toast';
import axiosInstance from '../utils/axios.js';
import  {useNavigate} from 'react-router-dom'

const CreatePlaylist = () => {
  const { problems, getAllProblems } = useProblemStore();
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [selectedProblems, setSelectedProblems] = useState(new Set()); 

  const {isCreatingPlaylist,createPlaylist} = usePlaylistStore();
 
  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]); 

  const addProblemToPlaylist  = async(problemIds, playlistId)=>{
           try {
        const res = await axiosInstance.post(`/playlist/add-problem/${playlistId}`,{problemIds});
        toast.success(res.data.message);
           } catch (error) {
            console.log("Error adding problem to playlist",error);
            toast.error("Error adding problem to playlist");
           }
  }

  
  const handleProblemToggle = (problemId) => {
    setSelectedProblems((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(problemId)) {
        newSelected.delete(problemId);
      } else {
        newSelected.add(problemId);
      }
      return newSelected;
    });
  };

  const navigate = useNavigate();

 
  const handleCreatePlaylist = async() => {
    console.log('Playlist Name:', playlistName);
    console.log('Playlist Description:', playlistDescription);
    console.log('Selected Problems IDs:', Array.from(selectedProblems));
    

     try {
 const createdPlaylist  = await createPlaylist(playlistName, playlistDescription); 
    if(createdPlaylist && createdPlaylist.id) {
      await addProblemToPlaylist(Array.from(selectedProblems),createdPlaylist.id);
      setPlaylistName("");
      setPlaylistDescription("");
      setSelectedProblems(new Set())
      navigate('/viewPlaylist')
    } else {
      toast.error("Playlist creation failed, cannot add problems.");
    }
  } catch (error) {
    console.error("Error in creating playlist and adding problems:", error);
  }


  };

  return (
    <div className='min-h-screen w-screen flex flex-col items-center  justify-center py-10 px-4 sm:px-6 lg:px-8 bg-base-200'>
      {/* Header Section */}
      <div className='text-center mb-10'>
        <h1 className='text-5xl font-extrabold text-primary mb-4 animate-fade-in-down'>
          Create New Playlist
        </h1>
        <p className='text-xl text-base-content opacity-90 max-w-2xl mx-auto'>
          Organize your favorite coding problems into custom collections for focused practice.
        </p>
      </div>

      {/* Playlist Details Card */}
      <div className='card w-full max-w-3xl bg-base-100 shadow-xl mb-8 rounded-xl animate-fade-in-up'>
        <div className='card-body p-8'>
          <h3 className='card-title text-2xl text-primary mb-6 text-center'>Playlist Details</h3>

          <div className='form-control w-full mb-4'>
            <label className='label'>
              <span className='label-text text-base-content text-lg font-medium'>Playlist Name</span>
            </label>
            <input
              type='text'
              placeholder='e.g., My DSA Practice, Blind 75 List'
              className='input input-bordered w-full text-base'
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />
          </div>

          <div className='form-control w-full mb-6'>
            <label className='label'>
              <span className='label-text text-base-content text-lg font-medium'>Description (Optional)</span>
            </label>
            <textarea
              placeholder='A brief description of your playlist...'
              className='textarea textarea-bordered h-24 w-full text-base resize-none'
              value={playlistDescription}
              onChange={(e) => setPlaylistDescription(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>

      {/* Select Problems Card */}
      <div className='card w-full max-w-3xl bg-base-100 shadow-xl mb-8 rounded-xl animate-fade-in-up-delay'>
        <div className='card-body p-8'>
          <h3 className='card-title text-2xl text-primary mb-6 text-center'>Select Problems</h3>

          <div className='overflow-y-auto max-h-96 pr-2 -mr-2'> {/* Scrollable area for problems */}
            {problems && problems.length > 0 ? (
              problems.map((problem) => (
                <div
                  key={problem.id}
                  className={`flex items-center justify-between p-4 mb-3 rounded-lg cursor-pointer transition-all duration-200
                  ${
                    selectedProblems.has(problem.id)
                      ? 'bg-primary/20 hover:bg-primary/30 ring-2 ring-primary' 
                      : 'bg-base-200 hover:bg-base-300' 
                  }`}
                  onClick={() => handleProblemToggle(problem.id)} 
                >
                  <div className='flex items-center gap-4 flex-grow mr-4'>
                    <input
                      type='checkbox'
                      checked={selectedProblems.has(problem.id)}
                      onChange={() => handleProblemToggle(problem.id)} 
                      className='checkbox checkbox-primary'
                    />
                    <div>
                      <h4 className='text-lg font-semibold text-base-content'>{problem.title}</h4>
                      <p className='text-sm text-base-content opacity-70 line-clamp-1'>{problem.description}</p>
                    </div>
                  </div>
                  <div
                    className={`badge badge-lg ${
                      problem.difficulty === 'EASY'
                        ? 'badge-success'
                        : problem.difficulty === 'MEDIUM'
                        ? 'badge-warning'
                        : 'badge-error'
                    }`}
                  >
                    {problem.difficulty}
                  </div>
                </div>
              ))
            ) : (
              <div className='text-center py-6'>
                <p className='text-lg text-gray-500'>No problems available to select.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Playlist Button */}
      <div className='w-full max-w-3xl text-center mt-6'>
        <button className='btn btn-primary btn-lg w-full max-w-xs transition-transform transform hover:scale-105' onClick={handleCreatePlaylist}>
            {
                isCreatingPlaylist ? (
                    <span className="loading loading-spinner loading-md text-primary"></span>
                ) : 'Create Playlist'
            }
         
        </button>
      </div>
    </div>
  );
};

export default CreatePlaylist;