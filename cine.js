const apikey = "e2e34002";
const movieList = document.getElementById("movieList");
const watchlistButton = document.getElementById("watchlistButton");
const watchlist = document.getElementById("watchlist");
let watchlistMovies = [];


function loadWatchlist() {
    const saved = localStorage.getItem("watchlistMovies");
    if (saved) {
        watchlistMovies = JSON.parse(saved);
        displayWatchlist();
    }
}

async function searchMovies() {
    const query = document.getElementById("searchInput").value.trim();
    if (!query) return;

    const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apikey}`);
    const data = await response.json();

    if (data.Response === "True") {
        displayMovies(data.Search);
    } else {
        movieList.innerHTML = "<p>Aucun film trouvé.</p>";
    }
}

function displayMovies(movies) {
    movieList.innerHTML = movies.map(movie => {
        const poster = movie.Poster === "N/A" ? "https://via.placeholder.com/150" : movie.Poster;
        const isInWatchlist = watchlistMovies.some(m => m.imdbID === movie.imdbID);
        return `
            <div class="movie-item">
                <img src="${poster}" class="movie-poster" alt="${movie.Title}">
                <h3>${movie.Title} - ${movie.Year}</h3>
                <button 
                    class="add-to-watchlist ${isInWatchlist ? 'added-to-watchlist' : ''}" 
                    id="addBtn-${movie.imdbID}" 
                    onclick="toggleWatchlist('${movie.imdbID}', '${movie.Title}', '${movie.Year}', '${poster}')" 
                    ${isInWatchlist ? "disabled" : ""}>
                    ${isInWatchlist ? "Ajouté à la Watchlist!" : "Ajouter à la Watchlist"}
                </button>
                <div class="notification" id="notification-${movie.imdbID}" style="display: none;">
                    Film ajouté à la watchlist!
                </div>
            </div>`;
    }).join("");
}

function toggleWatchlist(imdbID, title, year, poster) {
    const index = watchlistMovies.findIndex(m => m.imdbID === imdbID);
    const button = document.getElementById(`addBtn-${imdbID}`);

    if (index === -1) {
        watchlistMovies.push({ imdbID, title, year, poster });
        saveWatchlist();
        displayWatchlist();

        if (button) {
            button.textContent = "Ajouté à la Watchlist!";
            button.classList.add("added-to-watchlist");
            button.disabled = true;
        }

        const notification = document.getElementById(`notification-${imdbID}`);
        if (notification) {
            notification.style.display = "block";
            setTimeout(() => {
                notification.style.display = "none";
            }, 2000);
        }
    } else {
        watchlistMovies.splice(index, 1);
        saveWatchlist();
        displayWatchlist();

        if (button) {
            button.textContent = "Ajouter à la Watchlist";
            button.classList.remove("added-to-watchlist");
            button.disabled = false;
        }
    }
}

function displayWatchlist() {
    const watchlistElement = watchlist.querySelector("ul");
    watchlistElement.innerHTML = watchlistMovies.map(movie => {
        return `
            <li>
                <img src="${movie.poster}" class="watchlist-poster" alt="${movie.title}">
                ${movie.title} (${movie.year})
                <button class="remove-from-watchlist" onclick="toggleWatchlist('${movie.imdbID}', '${movie.title}', '${movie.year}', '${movie.poster}')">
                    Retirer
                </button>
            </li>`;
    }).join("");


    watchlistMovies.forEach(movie => {
        const btn = document.getElementById(`addBtn-${movie.imdbID}`);
        if (btn) {
            btn.textContent = "Ajouté à la Watchlist!";
            btn.classList.add("added-to-watchlist");
            btn.disabled = true;
        }
    });
}

function saveWatchlist() {
    localStorage.setItem("watchlistMovies", JSON.stringify(watchlistMovies));
}

watchlistButton.addEventListener("click", () => {
    watchlist.classList.toggle("show");
});

window.onload = loadWatchlist;
