import express from 'express'
const router = express.Router();
import { addProblemToPlaylist, createPlaylist, deletePlaylistById, getPlaylistsDetails, getPlaylistsDetailsbyId, updatePlaylist } from '../controllers/playlist.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

router.post("/add-problem/:playlistId", authMiddleware, addProblemToPlaylist);
router.get('/', authMiddleware, getPlaylistsDetails);
router.get('/:PlaylistId', authMiddleware, getPlaylistsDetailsbyId);
router.delete('/delete/:PlaylistId', authMiddleware, deletePlaylistById);
router.post("/create-playlist", authMiddleware, createPlaylist);
router.put("/update/:id", authMiddleware, updatePlaylist);

export default router;