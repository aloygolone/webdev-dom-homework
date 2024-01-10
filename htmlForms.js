import { comments, setComments, listElement, addFormElement, loginFormElement, noLoginElement, host, hostUserList, hostUserLogin, token, setToken } from "./vars.js";

// 1 Функция рендера комментариев в Html

export const renderComments = () => {
  
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
};

// 2 Функция неавторизованного пользователя

export const renderNoLogin = () => {

    const noLoginHtml = `<p id="none-login">Чтобы добавить комментарий, <a id="login-link" style="color: white;" href="#login-form">авторизуйтесь.</a></p>
    `;

    noLoginElement.innerHTML = noLoginHtml;

}

// 3 Функция рендера формы авторизации

export const renderLoginForm = () => {
   
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

// 4 Функция формы добавления комментария

export const renderAddForm = () => {
  
  const addFormHtml = `<div class="add-form">
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

  addFormElement.innerHTML = addFormHtml;
  
}