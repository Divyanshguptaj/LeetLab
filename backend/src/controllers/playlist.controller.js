import { db } from '../libs/db.js'

export const createPlaylist = async (req, res) => {
	try {
		const { name, description } = req.body;
		const userId = req.user?.id; // assuming auth middleware sets req.user

		if (!name) {
			return res.status(400).json({ message: "Playlist name is required" });
		}
		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const playList = await db.playlist.create({
			data: {
				name,
				description,
				userId,
			},
		});
		
		return res.status(201).json({
			message: "Playlist created successfully",
			playList
		});
	} catch (error) {
		console.error("Error creating playlist:", error);

		// Handle unique constraint error (name + userId unique)
		if (error.code === "P2002") {
			return res
				.status(400)
				.json({ message: "You already have a playlist with this name" });
		}

		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const addProblemToPlaylist = async (req, res) => {
	try {
		const { playlistId } = req.params;
		const { problemIds } = req.body;
		const userId = req.user?.id; // assuming auth middleware adds req.user
		// console.log(playlistId, problemIds, userId);
		
		if (!problemIds || problemIds.length === 0) {
			return res.status(400).json({ message: "No problem IDs provided" });
		}

		// check playlist ownership
		const playlist = await db.playlist.findUnique({
			where: { id: playlistId },
		});
		console.log(playlist);
		
		if (!playlist) {
			return res.status(404).json({ message: "Playlist not found" });
		}

		if (playlist.userId !== userId) {
			return res.status(403).json({ message: "Not authorized to modify this playlist" });
		}

		// create ProblemInPlaylist entries (skip duplicates)
		const data = problemIds.map((problemId) => ({
			playlistId,
			problemId,
		}));
		console.log("data", data);
		
		const result = await db.problemInPlaylist.createMany({
			data,
			skipDuplicates: true, // avoids adding same problem twice
		});
		console.log("result", result);
		
		return res.status(200).json({
			message: "Problems added to playlist successfully",
		});
	} catch (error) {
		console.error("Error adding problems to playlist:", error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const getPlaylistsDetails = async (req, res) => {
  try {
    const userId = req.user?.id; // assuming auth middleware sets req.user

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const playlists = await prisma.playlist.findMany({
      where: { userId },
      include: {
        problems: {
          include: {
            problem: true, // assuming ProblemInPlaylist → Problem relation
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      message: "Playlists fetched successfully",
      playlists,
    });
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPlaylistsDetailsbyId = async (req, res) => {
  try {
    const { PlaylistId } = req.params;
    const userId = req.user?.id; // from authMiddleware

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const playlist = await prisma.playlist.findUnique({
      where: { id: PlaylistId },
      include: {
        problems: {
          include: {
            problem: true, // assuming relation ProblemInPlaylist → Problem
          },
        },
      },
    });

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (playlist.userId !== userId) {
      return res.status(403).json({ message: "Not authorized to view this playlist" });
    }

    return res.status(200).json({
      message: "Playlist fetched successfully",
      playlist,
    });
  } catch (error) {
    console.error("Error fetching playlist by ID:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deletePlaylistById = async (req, res) => {
  try {
    const { PlaylistId } = req.params;
    const userId = req.user?.id; // from authMiddleware

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // find playlist
    const playlist = await prisma.playlist.findUnique({
      where: { id: PlaylistId },
    });

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // check ownership
    if (playlist.userId !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this playlist" });
    }

    // delete playlist (problems auto-deleted because of onDelete: Cascade)
    await prisma.playlist.delete({
      where: { id: PlaylistId },
    });

    return res.status(200).json({
      message: "Playlist deleted successfully",
      playlistId: PlaylistId,
    });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
  
export const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params; // Correctly get 'id' from params
    const userId = req.user?.id; // from authMiddleware
    const { name, description } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // find playlist
    const playlist = await prisma.playlist.findUnique({
      where: { id: id },
    });

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // check ownership
    if (playlist.userId !== userId) {
      return res.status(403).json({ message: "Not authorized to update this playlist" });
    }

    // update playlist
    const updatedPlaylist = await prisma.playlist.update({
      where: { id: id },
      data: {
        name,
        description,
      },
    });

    return res.status(200).json({
      message: "Playlist updated successfully",
      updatedPlaylist,
    });
  } catch (error) {
    console.error("Error updating playlist:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};