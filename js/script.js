const API_TOKEN = 'YOUR API TOKEN'
const ALLOW_ADULT = 'false'

//add to watchlist by given ID
let page = "movie";
function addWatchList(movieId, addBtn) {
    movieId = movieId.toString();
    //fetch from localStorage
    if (
        !localStorage.watchList
    ) {
        localStorage.setItem("watchList", movieId);
    } else {
        let watchlistSaved = localStorage.getItem("watchList");
        watchlistSaved = watchlistSaved.split("@");
        //check if exist
        if (watchlistSaved.indexOf(movieId) == -1) {
            //convert  add movie to array
            watchlistSaved.push(movieId);
            //convert back array to string
            watchlistSaved = watchlistSaved.join("@");
            //save to localStorage
            localStorage.setItem("watchList", watchlistSaved);
        } else {
            watchlistSaved = watchlistSaved.join("@");
            localStorage.setItem("watchList", watchlistSaved);
        }
    }

    addBtn.classList.replace("fa-heart", "fa-heart-broken");
    addBtn.setAttribute("onclick", `removeWatchList(${movieId},this)`);
    addBtn.innerText = " Remove Watchlist";
    //change button effect
}

//remove from watchlist by given ID
function removeWatchList(movieId, addBtn) {
    //fetch from localStorage
    movieId = movieId.toString();
    //fetch from localStorage
    if (
        !localStorage.watchList
    ) {
    } else if (localStorage.watchList == movieId) {
        localStorage.watchList = "";
    } else {
        let watchlistSaved = localStorage.getItem("watchList").split("@");
        //check if exist
        if (watchlistSaved.indexOf(movieId) != -1) {
            let index = watchlistSaved.indexOf(movieId);
            watchlistSaved.splice(index, 1);
            watchlistSaved = watchlistSaved.join("@");
            localStorage.setItem("watchList", watchlistSaved);
        }
    }
    addBtn.classList.replace("fa-heart-broken", "fa-heart");
    addBtn.innerText = " Add To Watchlist";
    addBtn.setAttribute("onclick", `addWatchList(${movieId},this)`);
}

//return data from watch list and invoke with printwatchlist
function getWatchList() {
    //fetch from localStorage
    let watchlistSaved = localStorage.watchList;
    if (!localStorage.watchList) {
        document.getElementById("movieContainer").innerHTML = `<div><h2 style=color:var(--pink)>You haven't added movies</h2><a href='home.html'> Return Home</a></div>`;
    } else {
        watchlistSaved = watchlistSaved.split("@");

        watchlistSaved.forEach((movieId) => {
            movieId = parseInt(movieId);
            getMovie(movieId);
        });
    }
}

//get movie information by given Movie ID
function getMovie(movieId) {
    let xhr = new XMLHttpRequest();
    //movieId = parseInt(movieId);

    let url =
        "https://api.themoviedb.org/3/movie/" + movieId + "Id?api_key=" + API_TOKEN;
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let movieDetails = xhr.responseText;
            movieDetails = JSON.parse(movieDetails);
            console.log(movieDetails);
            if (page == "movie") {
                let urlBase = "https://image.tmdb.org/t/p/w500";
                let movieDiv = document.createElement("div");
                movieDiv.className = "result-grid";
                movieDiv.setAttribute("id", "result-grid");
                movieDiv.innerHTML = `
                        <!-- movie information here -->
                        <div class="movie-poster">
                            <img src="${urlBase + movieDetails.poster_path}" alt="movie poster" />
                        </div>
                        <div class="movie-info">
                            <h3 class="movie-title">${movieDetails.title}</h3>
                            <p class="rated"><h3><i class="fas fa-star"></i>${movieDetails.vote_average}</h3></p>
                            <p class="plot">${movieDetails.overview}</p>
                            <p><b>Language:  </b>${movieDetails.original_language}</p>
                            <p><b>ٌRelease Date:  </b>${movieDetails.release_date}</p>
                            <b><b>ٌIMDB link:  </b><a href="https://www.imdb.com/title/${movieDetails.imdb_id}"><i class="fa-brands fa-imdb fa-2xl"></i></a></b>
                        </div>
                        `;
                document.getElementById("movieInfo").appendChild(movieDiv);
            } else if (page == "watchlist") {
                appendMovies(movieDetails);
            }
        }
    };

    xhr.open("GET", url, true);
    xhr.send();
}

// get trending movies
function getTrending() {
    let xhr = new XMLHttpRequest();
    let moviesCollection;
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            moviesCollection = xhr.responseText;
            moviesCollection = JSON.parse(moviesCollection);
            for (let i = 0; i < moviesCollection.results.length; i++) {
                appendMovies(moviesCollection.results[i]);
            }
        }
    };
    let url =
        "https://api.themoviedb.org/3/trending/movie/day?api_key=" + API_TOKEN;
    xhr.open("GET", url, true);
    xhr.send();
}

function appendMovies(movie) {
    let urlBase = "https://image.tmdb.org/t/p/w500";
    let movieDiv = document.createElement("div");
    movieDiv.className = "box";
    movieDiv.setAttribute("id", movie.id);

    movieDiv.innerHTML =
        `<img src='${urlBase + movie.poster_path}' alt='${movie.title}' />
        <div class='content'>
            <h3><i class='fas fa-star'></i>${movie.vote_average}</h3>
            <p>${movie.title}</p>
            ${(!localStorage.watchList || localStorage.watchList.toString().indexOf(movie.id.toString()) == -1)
            ? `<i class='fas fa-heart' onclick='addWatchList(${movie.id},this)'> Add To Watchlist</i>`
            : `<i class='fas fa-heart-broken' onclick='removeWatchList(${movie.id},this)'> Remove From Watchlist</i>`
        }
        </div>
        <div class='trailer'>
            <a href="movie.html?id=${movie.id}"">More Details</a>
        </div>`;

    document.getElementById("movieContainer").appendChild(movieDiv);
}
//movie from querystring
function movieFromQuery() {
    page = "movie";
    if (location.search) {
        movId = getMovie(location.search.substr(4));
    }
}

function searchQuery() {
    document.getElementById("movieContainer").innerHTML = "";
    let xhr = new XMLHttpRequest();
    let moviesCollection;
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            moviesCollection = xhr.responseText;
            moviesCollection = JSON.parse(moviesCollection);
            for (let i = 0; i < moviesCollection.results.length; i++) {
                appendMovies(moviesCollection.results[i]);
            }
        }
    };
    let queryString = document.getElementById("movie-search-box").value;
    let url =
        `https://api.themoviedb.org/3/search/movie?api_key=${API_TOKEN}&query=${queryString}&page=1&include_adult=${ALLOW_ADULT}`;
    xhr.open("GET", url, true);
    xhr.send();
}
