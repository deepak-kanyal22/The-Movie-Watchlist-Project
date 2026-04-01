import {API as apiKey} from "./config.js"

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const movieGrid = document.getElementById("movie-grid");
const loadingIndicator = document.getElementById("loading");
const suggestionButtons = document.querySelectorAll(".suggestion-btn");

searchForm.addEventListener("submit", async (event) => {
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
    const movieData = await getMovieData(movieTitle);
    displayMovieInfo(movieData);
  } catch (error) {
    console.error("Fetch error:", error);
    displayError("Could not fetch movie data. Please check your internet or API key.");
  } finally {
    hideLoading();
  }
}

async function getMovieData(movieTitle) {
  const apiUrl = `https://www.omdbapi.com/?s=${encodeURIComponent(movieTitle)}&apikey=${apiKey}&type=movie`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  return await response.json();
}

function displayMovieInfo(data) {
  movieGrid.innerHTML = "";

  if (data.Response === "True" && data.Search && data.Search.length > 0) {
    data.Search.forEach((movie) => {
      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");

      let posterElement;

      if (movie.Poster && movie.Poster !== "N/A") {
        posterElement = document.createElement("img");
        posterElement.src = movie.Poster;
        posterElement.alt = movie.Title;

        posterElement.onerror = function () {
          const fallback = createNoPosterElement();
          this.replaceWith(fallback);
        };
      } else {
        posterElement = createNoPosterElement();
      }

      const info = document.createElement("div");
      info.classList.add("movie-info");

      const title = document.createElement("h3");
      title.classList.add("movie-title");
      title.textContent = movie.Title;

      const year = document.createElement("p");
      year.classList.add("movie-year");
      year.textContent = movie.Year;

      info.appendChild(title);
      info.appendChild(year);

      movieCard.appendChild(posterElement);
      movieCard.appendChild(info);

      movieGrid.appendChild(movieCard);
    });
  } else {
    displayError(data.Error || "No movies found.");
  }
}

function createNoPosterElement() {
  const fallback = document.createElement("div");
  fallback.classList.add("no-poster");
  fallback.textContent = "No Poster Available";
  return fallback;
}

function displayError(message) {
  movieGrid.innerHTML = "";

  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.style.textAlign = "center";
  errorDisplay.style.gridColumn = "1 / -1";
  errorDisplay.style.color = "#ffffff";
  errorDisplay.style.fontSize = "1.1rem";
  errorDisplay.style.padding = "20px";

  movieGrid.appendChild(errorDisplay);
}

function showLoading() {
  loadingIndicator.classList.remove("hidden");
  movieGrid.innerHTML = "";
}

function hideLoading() {
  loadingIndicator.classList.add("hidden");
}