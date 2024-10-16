const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");

router.get("/", async (req, res, next) => {
  try {
    const playlists = await prisma.playlist.findMany();
    res.json(playlists);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const playlist = await prisma.playlist.findUniqueOrThrow({
      where: { id: +id },
      include: { tracks: true },
    });
    if (playlist) {
      res.json(playlist);
    } else {
      next({ status: 404, message: `Playlist with id: ${id} nopt found:(` });
    }
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  const { name, description, ownerId, trackIds } = req.body;

  if (!name || !description || !ownerId || !trackIds) {
    return next({
      status: 404,
      message: "Provide name, description, owner and tracks for the Playlist",
    });
  }

  const tracks = trackIds.map((id) => ({ id: +id }));

  try {
    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        ownerId: +ownerId,
        tracks: { connect: tracks },
      },
      include: {
        owner: true,
        tracks: true,
      },
    });
    res.status(200).json(playlist);
  } catch (e) {
    next(e);
  }
});
