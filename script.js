import { API as apiKey } from "./config.js";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const movieGrid = document.getElementById("movie-grid");
const loadingIndicator = document.getElementById("loading");
const suggestionButtons = document.querySelectorAll(".suggestion-btn");
const toggleTheme = document.getElementById("toggleTheme");

let currentMovies = [];
let favorites = [];

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const movieTitle = searchInput.value.trim();
  if (!movieTitle) {
    displayError("Please enter a movie title.");
    return;
  }
  searchMovies(movieTitle);
});

suggestionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const movieTitle = button.textContent.trim();
    searchInput.value = movieTitle;
    searchMovies(movieTitle);
  });
});

async function searchMovies(movieTitle) {
  showLoading();

  try {
    const data = await getMovieData(movieTitle);
    currentMovies = data.Search || [];
    displayMovieInfo(currentMovies);
  } catch (error) {
    displayError("Error fetching movies.");
  } finally {
    hideLoading();
  }
}

async function getMovieData(movieTitle) {
  const url = `https://www.omdbapi.com/?s=${encodeURIComponent(
    movieTitle
  )}&apikey=${apiKey}&type=movie`;

  const response = await fetch(url);
  return await response.json();
}


function displayMovieInfo(movies) {
  movieGrid.innerHTML = "";

  if (movies.length === 0) {
    displayError("No movies found.");
    return;
  }

  movies.map((movie) => {
    const card = document.createElement("div");
    card.classList.add("movie-card");


    let poster;
    if (movie.Poster && movie.Poster !== "N/A") {
      poster = document.createElement("img");
      poster.src = movie.Poster;
      poster.alt = movie.Title;
    } else {
      poster = document.createElement("div");
      poster.textContent = "No Poster";
    }

    const title = document.createElement("h3");
    title.textContent = movie.Title;


    const year = document.createElement("p");
    year.textContent = movie.Year;

    const favBtn = document.createElement("button");
    favBtn.textContent = favorites.some(f => f.imdbID === movie.imdbID)
      ? "✅"
      : "❤️";

    favBtn.addEventListener("click", () => {
      if (!favorites.some(f => f.imdbID === movie.imdbID)) {
        favorites = [...favorites, movie];
        favBtn.textContent = "✅";
      }
    });

    card.appendChild(poster);
    card.appendChild(title);
    card.appendChild(year);
    card.appendChild(favBtn);

    movieGrid.appendChild(card);
  });
}

toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});

function displayError(msg) {
  movieGrid.innerHTML = `<p style="text-align:center">${msg}</p>`;
}

function showLoading() {
  loadingIndicator.classList.remove("hidden");
  movieGrid.innerHTML = "";
}

function hideLoading() {
  loadingIndicator.classList.add("hidden");
}