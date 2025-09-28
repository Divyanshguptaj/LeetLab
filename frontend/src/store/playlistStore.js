import { create } from 'zustand'
import toast from 'react-hot-toast'
import axiosInstance from '../utils/axios.js'

const usePlaylistStore = create((set) => ({
    isAddingProblemToPlaylist: false,
    isDeletingProblemFromPlaylist: false,
    isCreatingPlaylist: false,
    playlist: null,
    playlists: [],


    createPlaylist: async (name, description) => {
        try {
            set({ isCreatingPlaylist: true })
            const res = await axiosInstance.post('/playlist/create-playlist', { name, description })
            toast.success(res.data.message)
            const playlist = res.data.playList;
            set({ playlist });
            return playlist;
        } catch (error) {
            console.log("Error creating playlist");
            toast.error("Error creating Playlist", error);
        } finally {
            set({ isCreatingPlaylist: false })
        }
    },

    getPlaylistsDetails: async (silent = false) => {
        try {
            const res = await axiosInstance.get('/playlist')
            set({ playlists: res.data.playlists })
        } catch (error) {
        }
    },

    getPlaylistDetail: async (id) => {
        try {
            const res = await axiosInstance.get(`/playlist/${id}`)
            set({ playlist: res.data.playlist });
        } catch (error) {
            toast.error("Error getting details of playlsit");

        }
    },

    deletePlaylist: async (id) => {
        try {
            const res = await axiosInstance.delete(`/playlist/delete/${id}`);
            set((state) => ({
                playlists: state.playlists.filter(p => p.id !== id)
            }));
            toast.success(res.data.message);
        } catch (error) {
            toast.error("Error deleting playlist");

        }
    },

    updatePlaylist: async (id, data) => {
        try {
            const res = await axiosInstance.put(`/playlist/update/${id}`, data);
            set(state => ({
                playlist: { ...state.playlist, ...data }
            }));
            // toast.success(res.data.message);
        } catch (error) {
            toast.error("Error updating playlist");
        }
    },

    addProblemToPlaylist: async (playlistId, problemIds) => {
        try {
            const res = await axiosInstance.post(
                `/playlist/add-problem/${playlistId}`,
                { problemIds }
            );
    
            set((state) => ({
                playlists: state.playlists.map((playlist) =>
                    playlist.id === playlistId
                        ? {
                              ...playlist,
                              problems: [
                                  ...playlist.problems,
                                  // if API returns updated problems, you can replace this
                                  ...problemIds.map((pid) => ({ id: pid }))
                              ],
                          }
                        : playlist
                ),
            }));
    
            // toast.success(res.data.message);
        } catch (error) {
            toast.error("Error adding Problem to playlist");
            console.log(error);
        }
    },
    

    deleteProblemFromPlaylist: async (playlistId, problemIds) => {
        try {
            const res = await axiosInstance.delete(`/playlist/remove-problem/${playlistId}`, {
                data: { problemIds }
            })


            set((state) => ({
                playlists: state.playlists.map((playlist) =>
                    playlist.id === playlistId
                        ?
                        {
                            ...playlist,
                            problems: playlist.problems.filter(
                                (problem) => !problemIds.includes(problem.id)
                            )
                        }
                        : playlist
                )
            }));



            toast.success(res.data.message);
        } catch (error) {
            toast.error("Error deleting problem from playlist", error)
        }
    }

}))


export default usePlaylistStore