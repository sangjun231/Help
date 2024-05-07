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
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=27`,
      options
    );
    const responseJson = await response.json();
    const pageResults = responseJson.results;

    movies.push(...pageResults);
  }

  let urlParams = new URL(location.href).searchParams;
  const name = urlParams.get("movieId");
  console.log(name);
  // const viewModal = document.querySelector(".review");
  // if (viewModal) {
  //   const modalId = viewModal.id;
  //   const movieData = movies.find((movie) => movie.id === parseInt(modalId));
  //   if (movieData) {
  //     openModal(`
  //         <div class="modalContent2" id="${modalId}">
  //           <img
  //             class="movieImg"
  //             src="https://image.tmdb.org/t/p/w500/${movieData.poster_path}"
  //           />
  //           <div class="movieInfo">
  //             <p class="movieTitle" id="movieName">
  //               ${movieData.title}
  //             </p>
  //             <p class="movieOverview">${movieData.overview}</p>
  //             <p class="movieVoteAverage">Rating: ${movieData.vote_average}</p>
  //           </div>
  //         </div>`);
  //   }
  // }
}

fetchMovies();

document.querySelector(".commentForm").addEventListener("submit", postingComment);

function postingComment() {
  const nickname = document.querySelector("#nickname").value;
  const pw = document.querySelector("#pw").value;
  const rating = parseInt(document.querySelector("#rating").value);
  const comment = document.querySelector("#comment").value;
  const commentId = Date.now().toString();

  if (isNaN(rating)) {
    alert("평점은 숫자로 입력해주세요,");
    return;
  } else if (rating > 10 || rating < 0) {
    alert("평점은 0점부터 10점까지 해주세요.");
    return;
  } else if (!nickname || !pw || !comment) {
    alert("닉네임, 비밀번호, 평점, 댓글을 모두 입력해주세요.");
    return;
  } else {
    const data = {
      id: commentId,
      nickname: nickname,
      pw: pw,
      rating: rating,
      comment: comment,
    };

    const key = "comment_" + commentId;
    localStorage.setItem(key, JSON.stringify(data));

    alert("댓글이 작성되었습니다.");
    window.location.reload();
  }
}

function loadComments() {
  const allComments = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("comment_")) {
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
  const renderAllComment = loadComments();

  const CommentSection = document.querySelector(".commentLi");
  CommentSection.innerHTML = "";

  renderAllComment.forEach((render) => {
    CommentSection.innerHTML += `
            <div class="userComment">
              <p>작성자 : ${render.nickname}</p>
              <p>${render.comment}</p>
              <div class="delArea">
              <p>별점 : ${render.rating} / 10 </p>
              <button type="button" class="delBtn" onclick="DeleteComment(${render.id})">삭제</button>
              </div>             
                    
            </div>`;
  });
}
renderComment();

function DeleteComment(THIS_IS_FAKE_KEY) {
  const key = "comment_" + THIS_IS_FAKE_KEY;
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

function m(mId) {
  console.log(mId);
}

m(mId);

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
