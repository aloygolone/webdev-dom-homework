import { postComments } from "./api.js";
import { renderAddForm } from "./htmlForms.js";
import { fetchAndRender } from "./renderApp.js";
import { token,comments } from "./vars.js";

// Добавление нового комментария с валидацией

export const addCommentByClick = () => {

  renderAddForm();

  const addingText = document.getElementById("adding");
  addingText.style.display = "none";

  const buttonElement = document.getElementById("add-button");
  const nameInputElement = document.getElementById("name-input");
  const commentInputElement = document.getElementById("comment-input");

  const disabledFunction = (boolean) => {
    buttonElement.disabled = boolean;
    nameInputElement.disabled = boolean;
    commentInputElement.disabled = boolean;
  }

  // Функция добавления комментария на сервер и проверки на ошибки

  const fetchPostAndErrors = () => {

    return postComments({ token, comments, commentInputElement, nameInputElement })
    .then((response) => {

      if (response.status === 500) {
        throw new Error("Ошибка сервера");
      } else if (response.status === 400) {
        throw new Error("Неверный запрос");
      } else {
        return response.json();
      }
      
    })
    .then(() => {
      return fetchAndRender();
    })
    .then(() => {
      return disabledFunction(false);
    })
    .then(() => {
      commentInputElement.value = "";
    })
    .catch((error) => {
      disabledFunction(false);
      addingText.style.display = "none";

      if (error.message === "Ошибка сервера") {
        alert("Сервер сломался, попробуйте позже");
        console.warn("Код ошибки - 500");
        return;
      } else if (error.message === "Неверный запрос") {
        alert("Имя и комментарий должны быть не короче 3х символов");
        console.warn("Код ошибки - 400");
        return;
      } else {
        alert("Кажется, у Вас проблемы с интернетом");
        console.warn("Нет сети");
        return;
      }

    });
  };

  // Обработчик клика для ответа на комментарий

  const initReplyListeners = () => {
    const commentElements = document.querySelectorAll(".comment");
      
    for (const commentElement of commentElements) {
      commentElement.addEventListener("click", () => {
        const index = commentElement.dataset.comment;
   
        commentInputElement.value = `> ${comments[index].text} (${comments[index].name})`;
      });
    }
   
  };
  
  initReplyListeners();
  
  // // Обработчик клика лайка

  // const initLikeListeners = () => {

  //   const likeButtons = document.querySelectorAll(".like-button");

  //   for (const likeButton of likeButtons) {
  //     likeButton.addEventListener("click", (event) => {
  //       event.stopPropagation();

  //       const index = likeButton.dataset.index;
  //       comments[index].likes += comments[index].isLiked ? -1 : +1;
  //       comments[index].isLiked = !comments[index].isLiked;

  //       let hostLikes = `https://wedev-api.sky.pro/api/v2/eugene-alyoshin/comments/${comments[index].id}/toggle-like`;

  //       const toggleLike = () => {
  //         return fetch(hostLikes, {
  //           method: "POST",
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //           body: JSON.stringify(
  //             {
  //               likes: comments.likes,
  //               isLiked: comments.isLiked,
  //             },
  //           ),  
  //         });
  //       }

  //       toggleLike();

  //       return renderComments();
  //     });
  //   }
  // };

  // initLikeListeners();
  
  buttonElement.addEventListener("click", () => {
    const clearInput = () => {
      commentInputElement.classList.remove("error");
      buttonElement.disabled = false;
    };

    commentInputElement.addEventListener("click", clearInput);

    if (commentInputElement.value.trim() === "" && " ") {
      commentInputElement.classList.add("error");
      buttonElement.disabled = true;
      return (commentInputElement.value = "");
    }

    disabledFunction(true);
    addingText.style.display = "block";

    return fetchPostAndErrors();

  });

  // Добавление через клавишу Enter

  const addCommentByEnter = () => {document.addEventListener("keypress", function (e) {
    const key = e.which || e.keyCode;
    if (key === 13) {
      buttonElement.click();
    }
    });
  }

  addCommentByEnter();
}