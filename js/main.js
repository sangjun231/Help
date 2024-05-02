const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NWU4MzRhY2Q0Mjk5MDk0MzI4ZmMxZTUyZjVhYTBmMyIsInN1YiI6IjY2MjZmZDE2MmUyYjJjMDE2MzY3MjA4ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wl8aFUtCjzsNdhNXgwn4Aw1kdLas3x17gn0YiTIfoNU",
  },
};

//리스트 불러오기
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

//카드 띄우기
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
     <p class="movie_title">${title}</p>
     <p>${average}</p>
     </div>
     <img class="poster_img" src="http://image.tmdb.org/t/p/w400/${posterImg}" alt="영화포스터" />
     </div>
            `
    );
  });
}

//fetchMovies 이후에 setCard 실행
fetchMovies().then((movies) => {
  setCard(movies);
});

//버튼, 엔터키 검색
const searchButton = document.querySelector(".search_button");
const searchMovie = document.querySelector(".search_input");

function buttonSearch() {
  searchButton.addEventListener("click", () => {
    search();
  });
}

searchMovie.addEventListener("keyup", (event) => {
  if (event.keyCode == 13) {
    searchButton.click();
  }
});

buttonSearch();

//검색
function search() {
  let card = document.querySelectorAll(".card");
  let title = document.querySelectorAll(".movie_title");

  if (searchMovie.value === "") {
    alert("검색어를 입력해주세요");
    return;
  }

  for (let i = 0; i < card.length; i++) {
    if (title[i].textContent.toLowerCase().includes(searchMovie.value.toLowerCase())) {
      card[i].style.display = "flex";
    } else {
      card[i].style.display = "none";
    }
  }
}

//탑버튼
const topButton = document.querySelector(".top_button");

topButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", (event) => {
  // event.preventDefault;
  if (scrollY > 50) {
    topButton.style.opacity = "100";
  } else {
    topButton.style.opacity = "0";
  }
});
