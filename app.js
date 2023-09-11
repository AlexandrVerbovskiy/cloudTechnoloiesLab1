const express = require("express");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;
const favicon = require('serve-favicon')

app.use(express.json());
app.use(favicon());

const sendMovies = (res, movies) => {
  res.json(movies);
};

const generateUniqueId = () => {
  return "_" + Math.random().toString(36).substr(2, 9);
};

const getMovies = () => {
  const moviesData = JSON.parse(fs.readFileSync("movies.json"));
  return moviesData;
};

app.get("/movies", (req, res) => {
  return sendMovies(res, getMovies());
});

app.post("/movies-save", (req, res) => {
  const movieIdToUpdate = req.body.id;
  const moviesData = getMovies();

  if (movieIdToUpdate) {
    moviesData[movieIdToUpdate] = {
      ...moviesData[movieIdToUpdate],
      name: req.body.name,
    };
  } else {
    const id = generateUniqueId();
    moviesData[id] = {
      id: id,
      watched: false,
      name: req.body.name,
    };
  }

  fs.writeFileSync("movies.json", JSON.stringify(moviesData));
  return sendMovies(res, moviesData);
});

app.post("/movies-change-watching", (req, res) => {
  const movieIdToUpdate = req.body.id;
  const moviesData = getMovies();
  console.log(movieIdToUpdate);

  if (movieIdToUpdate) {
    moviesData[movieIdToUpdate] = {
      ...moviesData[movieIdToUpdate],
      watched: !moviesData[movieIdToUpdate].watched,
    };
  } else {
    return res.json("f*ck you");
  }

  fs.writeFileSync("movies.json", JSON.stringify(moviesData));
  return sendMovies(res, moviesData);
});

app.post("/movies-delete", (req, res) => {
  const movieIdToDelete = req.body.id;

  const moviesData = getMovies();
  const newMoviesData = {};
  const liveKeys = Object.keys(moviesData).filter(
    (key) => key != movieIdToDelete
  );

  liveKeys.forEach((key) => (newMoviesData[key] = moviesData[key]));
  fs.writeFileSync("movies.json", JSON.stringify(newMoviesData));
  return sendMovies(res, newMoviesData);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => {
  console.log(`Сервер запущено на порту ${port}`);
});
