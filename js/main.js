const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NWU4MzRhY2Q0Mjk5MDk0MzI4ZmMxZTUyZjVhYTBmMyIsInN1YiI6IjY2MjZmZDE2MmUyYjJjMDE2MzY3MjA4ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wl8aFUtCjzsNdhNXgwn4Aw1kdLas3x17gn0YiTIfoNU",
  },
};

const topButton = document.querySelector(".top_button");

async function fetchMovies() {
  let movies = [];

  for (let page = 1; page <= 3; page++) {
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=27`, options);
    const responseJson = await response.json();
    const pageResults = responseJson.results;

    movies.push(...pageResults);
  }

  return movies;
}

async function setCard(movies) {
  const content = document.querySelector(".content");
  console.log(movies);

  movies.forEach((movie) => {
    const posterImg = movie.poster_path;
    const title = movie.title;
    const average = movie.vote_average;

    content.insertAdjacentHTML(
      "beforeend",
      `
     <div class="card">
     <div class="back_part">
     <p>${title}</p>
     <p>${average}</p>
     </div>
     <img class="poster_img" src="http://image.tmdb.org/t/p/w400/${posterImg}" alt="영화포스터" />
     </div>
            `
    );
  });
}

fetchMovies().then((movies) => {
  setCard(movies);
});

topButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
