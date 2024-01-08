import { timeFunction } from "./date.js";




// Логика работы:
// 1.1. Загружаем с сервера комментарии (ничего не работает, пока нет авторизации)

// 1.1.1 Получаем список комментариев с сервера (отображаем)

const host = "https://wedev-api.sky.pro/api/v2/eugene-alyoshin/comments";

const getComments = () => {
  return fetch(host, {
      method: "GET",
  });
};

// 1.1.2 Функция рендера комментариев в Html

let comments = [];
const listElement = document.getElementById("list");

const renderComments = () => {
  
  listElement.innerHTML = comments.map((comment, index) => {
      return `<li class="comment" data-comment="${index}">
      <div class="comment-header">
        <div>${comment.name}</div>
        <div>${comment.date}</div>
      </div>
      <div class="comment-body">
        <div class="comment-text">
          ${comment.text}
         </div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${comment.likes}</span>
          <button class="like-button ${
            comment.isLiked ? "-active-like" : ""
          }" data-index="${index}"></button>
        </div>
      </div>
    </li>`;
    })
    .join("");

    initLikeListeners();
};

// 1.1.3 Собираем воедино (получаем данные с сервера и преобразовываем в Html)

const fetchAndRender = () => {
  return getComments()
  .then((response) => {
    return response.json();
  })
  .then((responseData) => {
    comments = responseData.comments.map((comment) => {
      return {
        name: comment.author.name,
        login: comment.author.login,
        id: comment.author.id,
        date: timeFunction(comment.date),
        text: comment.text,
        likes: comment.likes,
        isLiked: comment.isLiked,
      };
    })
    return renderComments();
  })  
}

// 1.2. Включаем форму добавления комментария (не отображается вначале)

// 1.2.1 Функция формы добавления комментария

const addFormElement = document.getElementById("add-form");

const renderAddForm = () => {
  
  const addFromHtml = `<div class="add-form">
  <input
    id="name-input"
    type="text"
    class="add-form-name"
    value="${comments.name}" readonly
  />
  <textarea
    id="comment-input"
    type="textarea"
    class="add-form-text"
    placeholder="Введите ваш коментарий"
    rows="4"
  ></textarea>
  <div class="add-form-row">
    <span id="adding" class="add-form-adding"
      >Добавляем комментарий...</span
    >
    <button id="add-button" class="add-form-button">Написать</button>
  </div>`

  addFormElement.innerHTML = addFromHtml;
  const addingText = document.getElementById("adding");
  addingText.style.display = "none";
  
  

}

// 1.3. Включаем форму неавторизованного пользователя (отображается)

const noLoginElement = document.getElementById("no-login");

// 1.3.1 Функция неавторизованного пользователя

const renderNoLogin = () => {

  const noLoginHtml = `<p id="none-login">Чтобы добавить комментарий, <a id="login-link" style="color: white;" href="#login-form">авторизуйтесь.</a></p>
  `;

  noLoginElement.innerHTML = noLoginHtml;

}

// 1.4. Подключаем форму авторизации (не отображается)

const loginFormElement = document.getElementById("login-form");

const renderLoginForm = () => {
   
  const loginHtml = `
  <div class="login-form">
    <div class="login-form-in">
      <h4>Логин</h4>
      <input
      id="login-input"
      type="text"
      class="add-form-name"
      placeholder="Введите ваш логин"
    />
    </div>
    <div class="login-form-in">
      <h4>Пароль</h4>
      <input
      id="password-input"
      type="password"
      class="add-form-name"
      placeholder="Введите ваш пароль"
    />
    </div>
    <div class="add-form-row">
      <span id="login-wait" class="add-form-adding"
        >Идет авторизация...</span
      >
      <span id="login-error" class="add-form-adding"
        >Пароль или логин введены неверно</span
      >
      <button id="login-button" class="add-form-button">Войти</button>
    </div>
  </div>  
  `;

  loginFormElement.innerHTML = loginHtml;
  
}

// Результат 1-4 собираем воедино

const renderHtml = () => {

  fetchAndRender();
  
  renderNoLogin();

  renderLoginForm();

  renderAddForm();

  addFormElement.style.display = "none";
  loginFormElement.style.display = "none";

}


// 2. Приложение авторизации

// 2.1.1 Отправка логина-пароля в API

const hostUserLogin = "https://wedev-api.sky.pro/api/user/login";

const postLogIn = ({login, password}) => {
  return fetch(hostUserLogin, {
      method: "POST",
      body: JSON.stringify(
          {
              login,
              password,
          },
        ),
  });
}

// 2.1.2 Функция получения токена

let token;
const setToken = (newToken) => {
    token = newToken;
};

// 2.2 Приложение авторизации

const authorizationApp = () => {

  renderHtml();

  const loginLink = document.getElementById("login-link");
  const noneLogin = document.getElementById("none-login");
  
// 2.2 Нажимаем на "авторизоваться" - неавторизованный пользователь не отображается, форма авторизации отображается

  loginLink.addEventListener("click", () => {
    noneLogin.style.display = "none";
    loginFormElement.style.display = "block";
  });

  const loginWait = document.getElementById("login-wait");
  const loginError = document.getElementById("login-error");
  loginWait.style.display = "none";
  loginError.style.display = "none";

  const loginButtonElement = document.getElementById("login-button");
  const loginInputElement = document.getElementById("login-input");
  const passwordInputElement = document.getElementById("password-input");

// 2.3 Вводим данные в форму авторизации и отправляем на сервер (проверка на верные данные)

  loginButtonElement.addEventListener("click", () => {
    loginWait.style.display = "block";

    return postLogIn({
      login: loginInputElement.value,
      password: passwordInputElement.value,
    })
    .then((response) => {
            
      if (response.status === 400) {
          throw new Error("Неверный запрос");
      } else {
        return response.json();
      }
    })
    .then((responseData) => {
      setToken(responseData.user.token);
      loginFormElement.style.display = "none";
      addFormElement.style.display = "block";

      comments.name = responseData.user.name;
      return renderAddForm();
    })
    .catch((error) => {
        
        if (error.message === "Неверный запрос") {
            loginError.style.display = "block";
            loginInputElement.classList.add("error");
            passwordInputElement.classList.add("error");
            disabledLogAndPass(false);
            console.warn("Код ошибки - 400");
            return;
        } else {
            alert("Кажется, у Вас проблемы с интернетом");
            console.warn("Нет сети");
            return;
        }

    });
  })
}

// authorizationApp();


// 1. Ставим лайк (отправляются данные на сервер)

// 1.1 Отправляем данные о лайке на сервер

const hostLikes = `https://wedev-api.sky.pro/api/v2/eugene-alyoshin/comments/${comments.id}/toggle-like`;

const toggleLike = () => {
  return fetch(hostLikes, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(
        {
          likes: comments.likes,
          isLiked: comments.isLiked,
        },
      ),  
  });
}

// 1.2 Обработчик клика лайка

const initLikeListeners = () => {

  const likeButtons = document.querySelectorAll(".like-button");

  for (const likeButton of likeButtons) {
    likeButton.addEventListener("click", (event) => {
      event.stopPropagation();

      const index = likeButton.dataset.index;
      comments[index].likes += comments[index].isLiked ? -1 : +1;
      comments[index].isLiked = !comments[index].isLiked;

      renderComments();

      toggleLike();

    });
  }
};

// Итоговое приложение сайта (с авторизацией и добавлением комментария)

const app = () => {

  authorizationApp();
  initLikeListeners();

  const buttonElement = document.getElementById("add-button");
  const commentInputElement = document.getElementById("comment-input");
  const addingText = document.getElementById("adding");
  const nameInputElement = document.getElementById("name-input");

  addingText.style.display = "none";

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

  // 3. Пишем комментарий - добавляем (проходим валидацию) - отправляем на сервер - получаем с сервера (обрабатываем на ошибки) - рендерим новый список комментариев

  // 3.1 Функция передачи написанного комментария на сервер

  const postComments = () => {
    return fetch(host, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(
        {
          login: comments.login,
          id: comments.id,
          text: commentInputElement.value.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
          name: nameInputElement.value.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
          date: timeFunction(),
          likes: comments.likes,
          isLiked: comments.isLiked,
          forceError: true,
        },
      ),
    });
  };

  // 3.2 Функция добавления комментария на сервер и проверки на ошибки

  const fetchPostAndErrors = () => {

    return postComments()
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
    // .then(() => {
    //   return disabledFunction(false);
    // })
    .then(() => {
      commentInputElement.value = "";
    })
    .catch((error) => {
      // disabledFunction(false);
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

  // 3.3 Добавление нового комментария с валидацией

  const addCommentByClick = () => {
  
    buttonElement.addEventListener("click", () => {
      const clearInput = () => {
        nameInputElement.classList.remove("error");
        commentInputElement.classList.remove("error");
        buttonElement.disabled = false;
      };

      nameInputElement.addEventListener("click", clearInput);
      commentInputElement.addEventListener("click", clearInput);

      if (nameInputElement.value.trim() === "" && " ") {
        nameInputElement.classList.add("error");
        commentInputElement.disabled = true;
        return;
      }

      if (commentInputElement.value.trim() === "" && " ") {
        commentInputElement.classList.add("error");
        buttonElement.disabled = true;
        return (commentInputElement.value = "");
      }

      // disabledFunction(true);
      addingText.style.display = "block";

      return fetchPostAndErrors();

    });
  }

  addCommentByClick();
 
}

app();