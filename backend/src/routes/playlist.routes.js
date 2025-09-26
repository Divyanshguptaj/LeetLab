import express from 'express'
const router = express.Router();
import { addProblemToPlaylist, createPlaylist, deletePlaylistById, getPlaylistsDetails, getPlaylistsDetailsbyId } from '../controllers/playlist.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

router.get('/', authMiddleware, getPlaylistsDetails);
router.get('/:PlaylistId', authMiddleware, getPlaylistsDetailsbyId);
router.delete('/delete/:PlaylistId', authMiddleware, deletePlaylistById);
router.post("/create-playlist", authMiddleware, createPlaylist);
router.post("/add-problem/:playlistId", authMiddleware, addProblemToPlaylist);

export default router;