document.querySelector("#postingBtn").addEventListener("click", postingComment);

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
              <p>${render.nickname}</p>
              <p>${render.comment}</p>
              <p>별점 : ${render.rating} / 10</p>
            <button type="button" class="delBtn" onclick="DeleteComment(${render.id})">삭제</button>
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
