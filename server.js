const express = require("express");
const app = express();
const PORT = 3000;

app.use(require("morgan")("dev"));

app.use(express.json());

app.use("/users", require("./api/users.js"));
app.use("/playlists", require("./api/playlists.js"));
app.use("/tracks", require("./api/tracks.js"));

app.use((req, res, next) => {
  next({ status: 404, message: "Endpoint not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.json(err.message ?? "Sorry, something went bad:(");
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}...`);
});
