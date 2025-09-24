import React, { useEffect } from 'react';
import usePlaylistStore from '../store/playlistStore';
import { MdDeleteForever } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast'; // Assuming you have react-hot-toast for notifications

const ViewPlaylist = () => {
    const { getPlaylistsDetails, playlists, deletePlaylist, deleteProblemFromPlaylist } = usePlaylistStore();

    useEffect(() => {
        getPlaylistsDetails();
    }, [getPlaylistsDetails]);

    const handleDeletePlaylist = async (playlistId) => {
        try {
            await deletePlaylist(playlistId);
            toast.success('Playlist deleted successfully!');
            await getPlaylistsDetails(); // Refresh playlists after deletion
        } catch (error) {
            toast.error('Failed to delete playlist.');
            console.error('Error deleting playlist:', error);
        }
    };

    const handleDeleteProblem = async (playlistId, problemIds) => {
        try {
            await deleteProblemFromPlaylist(playlistId, problemIds);
            toast.success('Problem removed from playlist!');
            await getPlaylistsDetails(); // Refresh playlists after problem removal
        } catch (error) {
            toast.error('Failed to remove problem.');
            console.error('Error removing problem:', error);
        }
    };

    return (
        <div className='min-h-screen w-screen flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-base-200 to-base-300 animate-fade-in'>
            {/* Header Section */}
            <div className='text-center mb-12'>
                <h1 className='text-5xl font-extrabold text-primary mb-4 animate-fade-in-down drop-shadow-lg'>
                    My Playlists
                </h1>
                <p className='text-xl text-base-content opacity-90 max-w-2xl mx-auto leading-relaxed'>
                    Curate and manage your personalized collections of coding problems.
                </p>
            </div>

            {/* Playlists Container Card */}
            <div className='card w-full max-w-4xl bg-base-100 shadow-2xl mb-8 rounded-2xl animate-fade-in-up transform transition-all duration-300 hover:scale-[1.01]'>
                <div className='card-body p-8 sm:p-10'>
                    <h3 className='card-title text-3xl font-bold text-primary mb-8 text-center border-b-2 border-primary/20 pb-4'>Your Collections</h3>

                    {/* Conditional rendering for playlists */}
                    {playlists && playlists.length > 0 ? (
                        <div className='flex flex-col gap-6'>
                            {playlists.map((playlist) => (
                                <div key={playlist.id} className='collapse collapse-plus bg-base-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300'>
                                    <input type='checkbox' className='peer' />
<div className=' flex justify-end'>
   <button
                                            className='btn btn-ghost btn-circle btn-sm text-error hover:bg-error/20 transition-transform duration-200 active:scale-90'
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent collapsing when deleting
                                                handleDeletePlaylist(playlist.id);
                                            }}
                                            title='Delete Playlist'
                                        >
                                            <MdDeleteForever className='text-2xl' />
                                        </button>
</div>

                                    <div className='flex justify-between items-center pr-4 py-3 collapse-title'>
                                        {/* Collapsible Title Only */}
                                        <div className='flex flex-col items-start'>
                                            <h4 className='text-xl font-bold text-base-content peer-checked:text-primary transition-colors duration-300'>
                                                {playlist.name}
                                            </h4>
                                            {playlist.description && (
                                                <p className='text-sm text-base-content opacity-70 mt-1 line-clamp-1'>
                                                    {playlist.description}
                                                </p>
                                            )}
                                            {playlist.createdAt && (
                                                <span className='text-xs text-gray-500 mt-1'>
                                                    Created: {new Date(playlist.createdAt).toLocaleDateString('en-GB', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            )}
                                        </div>

                                        {/* Delete Playlist Button OUTSIDE collapse-title */}
                                       
                                    </div>

                                    {/* Only one collapse-content block here */}
                                    <div className='collapse-content bg-base-100/50 p-4 border-t border-base-300 rounded-b-xl'>
                                        {playlist.problems && playlist.problems.length > 0 ? (
                                            <div className='flex flex-col gap-3'>
                                                <h4 className='text-lg font-semibold text-primary mb-2 border-b border-primary/10 pb-2'>Problems in this Playlist:</h4>
                                                {playlist.problems.map((problem) => (
                                                    <div key={problem.id} className='flex items-center justify-between bg-base-300 p-3 rounded-lg shadow-sm hover:bg-base-content/10 transition-colors duration-200'>
                                                        <div className='flex flex-col flex-grow mr-4'>
                                                            <Link to={`/problems/${problem.problem.id}`} className='font-semibold text-base-content hover:text-primary transition-colors duration-200'>
                                                                {problem.problem.title}
                                                            </Link>
                                                            <span className='text-sm text-base-content opacity-70 line-clamp-1'>
                                                                {problem.problem.description}
                                                            </span>
                                                        </div>
                                                        <div className='flex items-center gap-3'>
                                                            <div
                                                                className={`badge badge-lg font-bold ${
                                                                    problem.problem.difficulty === 'EASY'
                                                                        ? 'badge-success'
                                                                        : problem.problem.difficulty === 'MEDIUM'
                                                                        ? 'badge-warning'
                                                                        : 'badge-error'
                                                                }`}
                                                            >
                                                                {problem.problem.difficulty}
                                                            </div>
                                                            {/* Delete Problem Button */}
                                                            <button
                                                                className='btn btn-ghost btn-sm btn-circle text-error hover:bg-error/20 transition-transform duration-200 active:scale-90'
                                                                onClick={() => handleDeleteProblem(playlist.id, [problem.problem.id])}
                                                                title='Remove Problem'
                                                            >
                                                                <MdDeleteForever className='text-lg' />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className='text-base text-gray-500 text-center py-4 italic'>
                                                No problems added to this playlist yet. Start adding some!
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Message when no playlists are created
                        <div className='text-center py-10'>
                            <p className='text-xl text-gray-500 mb-6'>You haven't created any playlists yet.</p>
                            {/* Optional: Add a link or button to create a playlist */}
                            <Link to={'/createPlaylist'}>
                                <button className='btn btn-primary btn-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
                                    Create Your First Playlist
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewPlaylist;