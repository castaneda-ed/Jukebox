const prisma = require("../prisma");
const { faker } = require("@faker-js/faker");

const seed = async (numUsers = 5, numPlaylists = 10, numTracks = 30) => {
  const users = Array.from({ length: numUsers }, () => ({
    username: faker.internet.displayName(),
  }));

  await prisma.user.createMany({ data: users });

  const tracks = Array.from({ length: numTracks }, () => ({
    name: faker.music.songName(),
  }));

  await prisma.track.createMany({ data: tracks });

  for (i = 0; i < numPlaylists; i++) {
    const tracksInPlaylist = Array.from({ length: 10 }, () => ({
      id: 1 + Math.floor(Math.random() * numTracks),
    }));

    await prisma.playlist.create({
      data: {
        name: faker.music.album(),
        description: faker.food.description(),
        ownerId: 1 + Math.floor(Math.random() * numUsers),
        tracks: { connect: tracksInPlaylist },
      },
    });
  }
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
