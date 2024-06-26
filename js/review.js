const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NWU4MzRhY2Q0Mjk5MDk0MzI4ZmMxZTUyZjVhYTBmMyIsInN1YiI6IjY2MjZmZDE2MmUyYjJjMDE2MzY3MjA4ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wl8aFUtCjzsNdhNXgwn4Aw1kdLas3x17gn0YiTIfoNU",
  },
};

//메인 페이지에서 영화 고유 Id값 받아오기
let urlParams = new URL(location.href).searchParams;
const movieId = urlParams.get("movieId");

//리스트 불러오기
async function fetchMovies() {
  let movies = [];

  for (let page = 1; page <= 3; page++) {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=27`,
      options
    );
    const responseJson = await response.json();
    const pageResults = responseJson.results;

    // for (const movie of pageResults) {
    // const creditsResponse = await fetch(
    //   `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=7e82827d6ffa944c4567ae823e15e2df`,
    //   options
    // );
    //   const creditsData = await creditsResponse.json();
    //   movie.credits = creditsData;
    // }

    movies.push(...pageResults);
  }
  //리뷰페이지 영화 정보 fetch
  const credits = movies.map(async (movie) => {
    const creditsResponse = await (
      await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=7e82827d6ffa944c4567ae823e15e2df`,
        options
      )
    ).json();

    return { ...movie, credits: creditsResponse };
  });
  //모든 비동기화를 병렬로 진행하여 속도향상 -> 하나라도 오류시 문제 발생하는게 단점
  movies = await Promise.all(credits);
  //리뷰페이지 영화 정보 fetch 여기까지

  const content = document.querySelector(".content");

  movies.forEach((movie) => {
    const posterImg = movie.poster_path;
    const title = movie.title;
    const overView = movie.overview;
    const average = movie.vote_average.toFixed(1);
    const id = movie.id;
    const releaseDate = movie.release_date;

    const director = movie.credits.crew.find(
      (director) => director.job === "Director"
    ).name;
    const actor = movie.credits.cast
      .slice(0, 4)
      .map((actor, index) => {
        if (index === 0) {
          return actor.name;
        } else {
          return `<p class="actorName">${actor.name}</p>`;
        }
      })
      .join("");

    const movieData = movies.find(() => movie.id === parseInt(movieId));
    if (movieData) {
      content.insertAdjacentHTML(
        "beforeend",
        `
        <div class="modalContent2" id="${id}">
        <div class="movie_container">
          <img
            class="movieImg"
            src="https://image.tmdb.org/t/p/w300/${posterImg}"
          />
          <div class="movieInfo">
            <p class="movieTitle" id="movieName">
              ${title}
            </p>
            <div class="info2">
            <div class="left">
            <p class="movieOverview">${overView}</p>
            </div>
            <div class="right">
            <p class="movieDirector"><span>Director</span><br> ${director}</p>
            <p class="movieActor"><span>Actor</span><br> ${actor}</p>
            </div>
            </div>
            <div class="other_info">
            <p class="movieVoteAverage">Rating: ${average}</p>
            <p class="movieReleaseDate">releaseDate : ${releaseDate}</p>
            </div>
          </div>
          </div>
        </div>
            `
      );
    }
  });
}

fetchMovies();

document.querySelector("#postingBtn").addEventListener("click", postingComment);

function postingComment() {
  const nickname = document.querySelector("#nickname").value;
  const pw = document.querySelector("#pw").value;
  const rating = parseInt(document.querySelector("#rating").value);
  const comment = document.querySelector("#comment").value;
  const commentId = Date.now().toString();

  if (rating === 0) {
    alert("평점은 1점부터 10점까지 해주세요.");
    return;
  }

  if (!nickname || !pw || !comment || !rating) {
    alert("닉네임, 비밀번호, 평점, 댓글을 모두 입력해주세요.");
    return;
  }

  if (isNaN(rating)) {
    alert("평점은 숫자로 입력해주세요.");
    return;
  } else if (rating > 10 || rating < 0) {
    alert("평점은 1점부터 10점까지 해주세요.");
    return;
  } else {
    const data = {
      id: commentId,
      nickname: nickname,
      pw: pw,
      rating: rating,
      comment: comment,
    };

    const key = `comment_${movieId}_${commentId}`;
    localStorage.setItem(key, JSON.stringify(data));

    alert("댓글이 작성되었습니다.");
    window.location.reload();
  }
}

function loadComments() {
  const allComments = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("comment_" + movieId)) {
      //가져오고
      const commentAllDataString = localStorage.getItem(key);
      //파싱 한 번 더 필요하니까
      const commentAllDataArray = JSON.parse(commentAllDataString);
      //그리고 그걸 넣기
      allComments.push(commentAllDataArray);
    }
  }
  return allComments;
}

function renderComment() {
  const renderAllComment = loadComments(movieId);

  const CommentSection = document.querySelector(".commentLi");
  CommentSection.innerHTML = "";

  renderAllComment.forEach((render) => {
    CommentSection.innerHTML += `
            <div class="userComment">
              <p>닉네임: ${render.nickname}</p>
              <p>${render.comment}</p>
              <p>별점 : ${render.rating} / 10</p>
            <button type="button" class="delBtn" onclick="DeleteComment(${render.id})">삭제</button>
            </div>`;
  });
}
renderComment();

function DeleteComment(THIS_IS_FAKE_KEY) {
  const key = `comment_${movieId}_${THIS_IS_FAKE_KEY}`;
  const commentRaw = localStorage.getItem(key);

  const password = prompt("비밀번호를 입력해주세요.");
  if (password === null) {
    alert("비밀번호를 입력해주세요.");
    return;
  }
  if (commentRaw === null) {
    alert(`삭제할 댓글이 없습니다. (키값: ${key})`);
    return;
  }

  const commentData = JSON.parse(commentRaw);
  if (commentData.pw === password) {
    localStorage.removeItem(key);
    alert("삭제되었습니다.");
    window.location.reload();
  } else {
    alert("비밀번호가 틀렸습니다.");
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
