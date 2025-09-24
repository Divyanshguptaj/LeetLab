import {create} from 'zustand'
import toast from 'react-hot-toast'
import axiosInstance from '../utils/axios.js'

const usePlaylistStore = create((set)=>({


    isCreatingPlaylist : false,
    playlist:null,
    playlists:[],
    

    createPlaylist : async (name,description)=>{
        try {
            set({isCreatingPlaylist:true})
            const res = await axiosInstance.post('/playlist/create-playlist',{name,description})
             toast.success(res.data.message)
             const playlist = res.data.playList;
             set({ playlist });
           return playlist; 
        } catch (error) {
            console.log("Error creating playlist");
            toast.error("Error creating Playlist",error);
        }finally{
          set({isCreatingPlaylist:false})
        }
    },


    getPlaylistsDetails : async ()=>{
        try {
            const res = await  axiosInstance.get('/playlist')
            toast.success(res.data.message);
            set({playlists:res.data.playlists})
        } catch (error) {
            console.log("Error getting all Playlist details",error);
            toast.error("Error getting all Playlist details")
        }
    },

    getPlaylistDetail : async (id)=>{
        try {
            const res = await axiosInstance.get(`/playlist/${id}`)
            set({playlist:res.data.playlist});
        } catch (error) {
            console.log("Error getting details of playlsit",error);
            toast.error("Error getting details of playlsit");
            
        }
    },

 deletePlaylist : async (id)=>{
    try {
        const res = await axiosInstance.delete(`/playlist/delete/${id}`);
         set((state) => ({
      playlists: state.playlists.filter(p => p.id !== id)
    }));
        toast.success(res.data.message);
    } catch (error) {
        console.log("Error deleting playlist",error);
        toast.error("Error deleting playlist");
        
    }
 },

 deleteProblemFromPlaylist : async(playlistId,problemIds)=>{
    try {
    const res = await axiosInstance.delete(`/playlist/remove-problem/${playlistId}`,{
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
        console.log("Error deleting problem from playlist");
        toast.error("Error deleting problem from playlist",error) 
    }
 }


}))


export default usePlaylistStore