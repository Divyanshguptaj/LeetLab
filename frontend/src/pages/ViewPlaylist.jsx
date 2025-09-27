import React, { useEffect, useState } from "react";
import usePlaylistStore from "../store/playlistStore";
import { MdDeleteForever } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal";
import { Plus } from "lucide-react";

const ViewPlaylist = () => {
  const { getPlaylistsDetails, playlists, deletePlaylist, createPlaylist } = usePlaylistStore();

  // Modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    playlist: null,
  });

  // Fetch playlists on mount
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        await getPlaylistsDetails(false);
      } catch (error) {
        toast.error("Failed to fetch playlists.");
        console.error("Error fetching playlists:", error);
      }
    };
    fetchPlaylists();
  }, [getPlaylistsDetails]);

  // Open delete confirmation modal
  const openDeleteModal = (playlist) => {
    setDeleteModal({
      isOpen: true,
      playlist,
    });
  };

  // Close modal
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      playlist: null,
    });
  };

  // Confirm delete playlist
  const confirmDeletePlaylist = async () => {
    try {
      await deletePlaylist(deleteModal.playlist.id);
      // toast.success("Playlist deleted successfully!");
      await getPlaylistsDetails(true);
      closeDeleteModal();
    } catch (error) {
      toast.error("Failed to delete playlist.");
      console.error("Error deleting playlist:", error);
    }
  };

  return (
    <>
      <div className="min-h-screen w-screen flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-base-200 to-base-300 animate-fade-in">
        {/* Header Section */}
        <div className="w-full max-w-4xl text-center mb-12 relative">
          <div className="absolute right-0 top-0 z-10">
            <Link to="/createPlaylist">
              <button className="btn btn-secondary flex items-center gap-2 btn-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <Plus className="w-5 h-5" />
                Create Playlist
              </button>
            </Link>
          </div>

          <h1 className="text-5xl font-extrabold text-primary mb-4 animate-fade-in-down drop-shadow-lg">
            My Playlists
          </h1>
          <p className="text-xl text-base-content opacity-90 max-w-2xl mx-auto leading-relaxed">
            Curate and manage your personalized collections of coding problems.
          </p>
        </div>

        {/* Playlists Container Card */}
        <div className="card w-full max-w-4xl bg-base-100 shadow-2xl mb-8 rounded-2xl animate-fade-in-up transform transition-all duration-300 hover:scale-[1.01]">
          <div className="card-body p-8 sm:p-10">
            <h3 className="card-title text-3xl font-bold text-primary mb-8 text-center border-b-2 border-primary/20 pb-4">
              Your Collections
            </h3>

            {/* Conditional rendering for playlists */}
            {playlists && playlists.length > 0 ? (
              <div className="flex flex-col gap-6">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="card bg-base-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <div className="card-body p-6">
                      <div className="flex justify-between items-center">
                        {/* Left Section: Playlist Info */}
                        <Link
                          to={`/viewPlaylist/${playlist.id}`}
                          className="flex flex-col items-start flex-1 cursor-pointer"
                        >
                          <h4 className="text-xl font-bold text-base-content hover:text-primary transition-colors duration-300">
                            {playlist.name}
                          </h4>
                          {playlist.description && (
                            <p className="text-sm text-base-content opacity-70 mt-1 line-clamp-2">
                              {playlist.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-base-content/60">
                            <span>
                              {playlist.problems?.length || 0} problems
                            </span>
                            {playlist.createdAt && (
                              <span>
                                Created:{" "}
                                {new Date(
                                  playlist.createdAt
                                ).toLocaleDateString("en-GB", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            )}
                          </div>
                        </Link>

                        {/* Right Section: Delete Button */}
                        <button
                          className="p-2 rounded-full text-error hover:bg-error/10 transition duration-200 active:scale-90"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(playlist);
                          }}
                          title="Delete Playlist"
                        >
                          <MdDeleteForever className="text-3xl" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Message when no playlists are created
              <div className="text-center py-10">
                <p className="text-xl text-gray-500 mb-6">
                  You haven't created any playlists yet.
                </p>
                <Link to={"/createPlaylist"}>
                  <button className="btn btn-primary btn-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    Create Your First Playlist
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        playlist={deleteModal.playlist}
        onCancel={closeDeleteModal}
        onConfirm={confirmDeletePlaylist}
      />
    </>
  );
};

export default ViewPlaylist;
