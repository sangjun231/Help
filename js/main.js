const getMovie = async (val = "") => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZTgyODI3ZDZmZmE5NDRjNDU2N2FlODIzZTE1ZTJkZiIsInN1YiI6IjY2MjYyNTI4ZWI3OWMyMDE2NWQ0M2Q1MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bdvFO8e_naip64AYTGlq-zQSBQdh2vSqX6BTdRn-yH4",
    },
  };

  const response = await fetch(
    "https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=1",
    options
  );
  const json = await response.json();

  const responseArray = json.results;
  const movieInfo = responseArray
    .map((movieInfo, i) => {
      if (movieInfo.title.includes(val))
        return `
      <div class="movieInfo" id="${movieInfo.id}">
        <img class="movieImg" src="https://image.tmdb.org/t/p/w500/${movieInfo.poster_path}" />
        <p class="movieTitle" id="movieName">${movieInfo.title}</p>
        <p class="movieOverview">${movieInfo.overview}</p>
        <p class="movieVoteAverage">Rating: ${movieInfo.vote_average}</p>
      </div>`;
    })
    .join("");

  const movieSection = document.getElementById("movieSection");
  movieSection.innerHTML = "";
  movieSection.innerHTML = movieInfo;

  function openModal(text) {
    const modal = document.getElementById("modal");
    const modalText = document.getElementById("modalText");
    modalText.innerHTML = text;
    modal.style.display = "block";
  }

  function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
  }

  const closeBtn = document.getElementsByClassName("close")[0];
  closeBtn.onclick = function () {
    closeModal();
  };

  window.onclick = function (event) {
    const modal = document.getElementById("modal");
    if (event.target == modal) {
      closeModal();
    }
  };

  document.addEventListener("click", (event) => {
    const viewModal = event.target.closest(".movieInfo");
    if (viewModal) {
      const modalId = viewModal.id;
      const movieData = responseArray.find(
        (movie) => movie.id === parseInt(modalId)
      );

      if (movieData) {
        openModal(`
        <div class="movieInfo" id="${modalId}">
          <img class="movieImg" src="https://image.tmdb.org/t/p/w500/${movieData.poster_path}" />
          <p class="movieTitle" id="movieName">${movieData.title}</p>
          <p class="movieOverview">${movieData.overview}</p>
          <p class="movieVoteAverage">Rating: ${movieData.vote_average}</p>
        </div>
      `);
      }
    }
  });

  const searchInput = document.getElementById("Text");
  const searchButton = document.getElementById("Button");

  searchButton.addEventListener("click", (event) => {
    const val = searchInput.value;
    console.log(val);
    getMovie(val);
  });
};

await getMovie();
