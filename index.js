const form = document.getElementById('search-form')
const searchBar = document.getElementById('search-bar')
const searchBtn = document.getElementById('search-btn')
const resultsEl = document.getElementById('results-container')
const watchlistEl = document.getElementById('watchlist-container')
const moviesFromLocalStorage = JSON.parse(localStorage.getItem("myWatchlist"))
let searchHtml = ""
let watchlistHtml = ''
let myWatchlistArr = []
let searchImdbIdsArr = []
let resultsArr = []


// prevents the search button from submitting and handles the search function
document.addEventListener('submit', function (e) {
    e.preventDefault()
    handleSearchBtn()
})



function handleSearchBtn() {
    fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=bc2e1490&s=${searchBar.value}`)
        .then(res => res.json())
        .then(data => {
            if(data.Search){
                for(let movie of data.Search){
                    searchImdbIdsArr.push(movie.imdbID)
                    }
                renderMovies()
                searchImdbIdsArr = []
            } else {
                noMoviesError()
            }
        })
}

function renderMovies() {
    for (let id of searchImdbIdsArr){
        fetch(`https://www.omdbapi.com/?i=${id}&apikey=bc2e1490`)
        .then(res => res.json())
        .then(data => {
            resultsArr.push(data)
            searchHtml +=`
            <div class="movie-result">
                    <img class="main-img" src="${data.Poster}">
                    <div>
                        <div class="main-title-container">
                            <h3 class="main-title">${data.Title}</h3>
                            <div class="rating-container">
                                <i class="fa-solid fa-star" style="color: #ffd700;"></i>
                                <p>${data.imdbRating}</p>
                            </div>
                        </div>
                        <div class="main-info">
                            <p>${data.Runtime}</p>
                            <p>${data.Genre}</p>
                            <div class="watchlist-container">
                                <i id="icon${data.imdbID}" class="fa-solid fa-circle-plus" style="color: #000000;" data-watchlist="${data.imdbID}"></i>
                                <p data-watchlist="${data.imdbID}">Watchlist</p>
                            </div>
                        </div>
                        <p class="main-blurb">${data.Plot}</p>
                    </div>
                </div>
            `
            resultsEl.innerHTML = searchHtml
        })
    }
}

function noMoviesError(){
        resultsEl.innerHTML = `<div class="no-result">
                                    <h3>Unable to find what you’re looking for. Please try another search.</h3>
                                </div>`
        searchImdbIdsArr = []
}

// WATCHLIST

document.addEventListener('click', (e) => {
    if(e.target.dataset.watchlist){
        handleWatchlistBtn(e.target.dataset.watchlist)
        document.getElementById(`icon${e.target.dataset.watchlist}`).style.color = "#00cc00"
    } else if (e.target.dataset.remove){
        handleRemoveClick(e.target.dataset.remove)
    } else if(e.target.dataset.add){
        window.location.replace ("/index.html")
    }
})



function handleWatchlistBtn(imdbId){
    const targetMovie = resultsArr.filter(function(movie){
        return movie.imdbID === imdbId
    })

    myWatchlistArr.push(targetMovie[0])
    
    myWatchlistArr = myWatchlistArr.reduce((accumulator, current) => {
        if (!accumulator.find((item) => item.imdbID === current.imdbID)) {
            accumulator.push(current);
        }
         return accumulator;         
    }, []);
        localStorage.setItem("myWatchlist", JSON.stringify(myWatchlistArr))
}



if (moviesFromLocalStorage) {
    myWatchlistArr = moviesFromLocalStorage
    renderWatchlist()
}



function handleRemoveClick(id){
    for(let item of myWatchlistArr){
            if(item.imdbID === id){
                const index = myWatchlistArr.indexOf(item)
                const newArr = myWatchlistArr.splice(index,1)
            }
        }

    localStorage.clear()
    localStorage.setItem("myWatchlist", JSON.stringify(myWatchlistArr))
    renderWatchlist()
}


function renderWatchlist() {
    if(myWatchlistArr.length < 1){
        watchlistHtml =  `
            <div class="no-result">
                    <h3>Your watchlist is looking a little empty...</h3>
                    <div class="watchlist-add-btn">
                        <i class="fa-sharp fa-solid fa-circle-plus" data-add="add"></i>
                        <h4 data-add="add">Let’s add some movies!</h4>
                    </div>
                </div>
            `
        }else {
            for(let item of myWatchlistArr){
            watchlistHtml += `
            <div class="movie-result">
                    <img class="main-img" src="${item.Poster}">
                    <div>
                        <div class="main-title-container">
                            <h3 class="main-title">${item.Title}</h3>
                            <div class="rating-container">
                                <i class="fa-solid fa-star" style="color: #ffd700;"></i>
                                <p>${item.imdbRating}</p>
                            </div>
                        </div>
                        <div class="main-info">
                            <p>${item.Runtime}</p>
                            <p>${item.Genre}</p>
                            <div class="watchlist-container">
                                <i id="icon${item.imdbID}" class="fa-solid fa-circle-minus add-remove" style="color: #FF0000;" data-remove="${item.imdbID}"></i>
                                <p data-remove="${item.imdbID}">Remove</p>
                            </div>
                        </div>
                        <p class="main-blurb">${item.Plot}</p>
                    </div>
                </div>
            `
            }
        }
     if(watchlistEl){
         watchlistEl.innerHTML = watchlistHtml
     }
}