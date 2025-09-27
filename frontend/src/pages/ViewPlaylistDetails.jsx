import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import usePlaylistStore from '../store/playlistStore';
import { 
  MdDeleteForever, 
  MdEdit, 
  MdAdd, 
  MdArrowBack, 
  MdCode, 
  MdCalendarToday,
  MdPlaylistPlay 
} from 'react-icons/md';
import { toast } from 'react-hot-toast';
import AddProblemModal from '../components/modals/AddProblemModal';

const ViewPlaylistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    playlist, 
    getPlaylistDetail, 
    deletePlaylist, 
    deleteProblemFromPlaylist,
    updatePlaylist,
    addProblemToPlaylist
  } = usePlaylistStore();

  // Modal states
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: null, // 'playlist' or 'problem'
    data: null
  });

  const [editModal, setEditModal] = useState({
    isOpen: false,
    name: '',
    description: ''
  });

  const [isAddProblemModalOpen, setAddProblemModalOpen] = useState(false);

  // Fetch playlist details on mount
  useEffect(() => {
    const fetchPlaylistDetail = async () => {
      try {
        await getPlaylistDetail(id);
      } catch (error) {
        toast.error('Failed to fetch playlist details.');
        console.error('Error fetching playlist:', error);
      }
    };
    fetchPlaylistDetail();
  }, [id, getPlaylistDetail]);

  // Initialize edit modal with current playlist data
  useEffect(() => {
    if (playlist) {
      setEditModal(prev => ({
        ...prev,
        name: playlist.name || '',
        description: playlist.description || ''
      }));
    }
  }, [playlist]);

  // Delete confirmation handlers
  const openDeleteModal = (type, data) => {
    setDeleteModal({ isOpen: true, type, data });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, type: null, data: null });
  };

  const confirmDelete = async () => {
    try {
      if (deleteModal.type === 'playlist') {
        await deletePlaylist(playlist.id);
        toast.success('Playlist deleted successfully!');
        navigate('/viewPlaylist');
      } else if (deleteModal.type === 'problem') {
        await deleteProblemFromPlaylist(playlist.id, [deleteModal.data.problemId]);
        toast.success('Problem removed successfully!');
        await getPlaylistDetail(id); // Refresh playlist data
      }
      closeDeleteModal();
    } catch (error) {
      toast.error(`Failed to delete ${deleteModal.type}.`);
      console.error('Error deleting:', error);
    }
  };

  // Edit modal handlers
  const openEditModal = () => {
    setEditModal({
      isOpen: true,
      name: playlist.name || '',
      description: playlist.description || ''
    });
  };

  const closeEditModal = () => {
    setEditModal({
      isOpen: false,
      name: '',
      description: ''
    });
  };

  const handleUpdatePlaylist = async () => {
    try {
      await updatePlaylist(playlist.id, {
        name: editModal.name,
        description: editModal.description
      });
      toast.success('Playlist updated successfully!');
      await getPlaylistDetail(id); // Refresh playlist data
      closeEditModal();
    } catch (error) {
      toast.error('Failed to update playlist.');
      console.error('Error updating playlist:', error);
    }
  };

  const handleAddProblems = async (problemIds) => {
    try {
      if (!problemIds || problemIds.length === 0) {
        toast.error('Please select at least one problem.');
        return;
      }
      console.log(problemIds, playlist.id);
      
      await addProblemToPlaylist(playlist.id, problemIds);
      toast.success('Problems added successfully!');
      await getPlaylistDetail(id); // Refresh playlist data
      setAddProblemModalOpen(false); // Close modal on success
    } catch (error) {
      toast.error('Failed to add problems.');
      console.error('Error adding problems:', error);
    }
  };

  if (!playlist) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen w-screen py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-base-200 to-base-300">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              to="/viewPlaylist" 
              className="btn btn-ghost btn-circle"
              title="Back to Playlists"
            >
              <MdArrowBack className="text-xl" />
            </Link>
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold text-primary mb-2">
                {playlist.name}
              </h1>
              <div className="flex items-center gap-4 text-base-content/60">
                <span className="flex items-center gap-1">
                  <MdCode className="text-base" />
                  {playlist.problems?.length || 0} problems
                </span>
                <span className="flex items-center gap-1">
                  <MdCalendarToday className="text-base" />
                  Created {new Date(playlist.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <button 
                className="btn btn-primary btn-sm gap-2"
                onClick={() => setAddProblemModalOpen(true)}
              >
                <MdAdd className="text-lg" />
                Add Problems
              </button>
              <button 
                className="btn btn-secondary btn-sm gap-2"
                onClick={openEditModal}
              >
                <MdEdit className="text-lg" />
                Edit
              </button>
              <button 
                className="btn btn-error btn-sm gap-2"
                onClick={() => openDeleteModal('playlist', playlist)}
              >
                <MdDeleteForever className="text-lg" />
                Delete
              </button>
            </div>
          </div>

          {/* Description */}
          {playlist.description && (
            <div className="card bg-base-100 shadow-lg rounded-xl mb-8">
              <div className="card-body p-6">
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-base-content/80 leading-relaxed">
                  {playlist.description}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Problems List */}
        <div className="max-w-4xl mx-auto">
          <div className="card bg-base-100 shadow-xl rounded-2xl">
            <div className="card-body p-8">
              <h2 className="card-title text-2xl font-bold text-primary mb-6 border-b-2 border-primary/20 pb-4">
                Problems in this Playlist
              </h2>

              {playlist.problems && playlist.problems.length > 0 ? (
                <div className="space-y-4">
                  {playlist.problems.map((problem, index) => (
                    <div
                      key={problem.id}
                      className="flex items-center justify-between bg-base-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-2xl font-bold text-base-content/40 min-w-[3rem]">
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <Link
                            to={`/problems/${problem.problem.id}`}
                            className="font-semibold text-lg text-base-content hover:text-primary transition-colors duration-200 block"
                          >
                            {problem.problem.title}
                          </Link>
                          <p className="text-sm text-base-content/60 line-clamp-2 mt-1">
                            {problem.problem.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className={`badge badge-lg font-bold px-3 py-2 ${
                            problem.problem.difficulty === 'EASY'
                              ? 'badge-success'
                              : problem.problem.difficulty === 'MEDIUM'
                              ? 'badge-warning'
                              : 'badge-error'
                          }`}
                        >
                          {problem.problem.difficulty}
                        </div>
                        
                        <button
                          className="btn btn-ghost btn-circle btn-sm text-error hover:bg-error/20 opacity-0 group-hover:opacity-100 transition-all duration-200"
                          onClick={() => openDeleteModal('problem', {
                            problemId: problem.problem.id,
                            problemTitle: problem.problem.title
                          })}
                          title="Remove from playlist"
                        >
                          <MdDeleteForever className="text-lg" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MdPlaylistPlay className="text-6xl text-base-content/20 mx-auto mb-4" />
                  <p className="text-xl text-base-content/60 mb-4">
                    No problems in this playlist yet.
                  </p>
                  <button 
                    className="btn btn-primary gap-2"
                    onClick={() => setAddProblemModalOpen(true)}
                  >
                    <MdAdd className="text-lg" />
                    Add Your First Problem
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <dialog className={`modal ${deleteModal.isOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Confirm Deletion</h3>
          {deleteModal.type === 'playlist' && (
            <p className="py-4">
              Are you sure you want to delete the playlist "{playlist.name}"? 
              This action cannot be undone and will remove all problems from this playlist.
            </p>
          )}
          {deleteModal.type === 'problem' && (
            <p className="py-4">
              Are you sure you want to remove "{deleteModal.data?.problemTitle}" from this playlist?
            </p>
          )}
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={closeDeleteModal}>
              Cancel
            </button>
            <button className="btn btn-error" onClick={confirmDelete}>
              {deleteModal.type === 'playlist' ? 'Delete Playlist' : 'Remove Problem'}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeDeleteModal}>close</button>
        </form>
      </dialog>

      {/* Edit Playlist Modal */}
      <dialog className={`modal ${editModal.isOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Edit Playlist</h3>
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Playlist Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={editModal.name}
                onChange={(e) => setEditModal(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter playlist name"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24 w-full"
                value={editModal.description}
                onChange={(e) => setEditModal(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter playlist description (optional)"
              />
            </div>
          </div>
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={closeEditModal}>
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleUpdatePlaylist}
              disabled={!editModal.name.trim()}
            >
              Update Playlist
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeEditModal}>close</button>
        </form>
      </dialog>

      <AddProblemModal
        isOpen={isAddProblemModalOpen}
        onClose={() => setAddProblemModalOpen(false)}
        onAddProblems={handleAddProblems}
        existingProblemIds={playlist?.problems?.map(p => p.problem.id) || []}
      />
    </>
  );
};

export default ViewPlaylistDetail;