import { comments, setComments, listElement, addFormElement, loginFormElement, noLoginElement, host, hostUserList, hostUserLogin, token, setToken} from "./vars.js";
import { timeFunction } from "./date.js";

// // API авторизация

// const getUserList = () => {
//     return fetch(hostUserList, {
//         method: "GET",
//     });
// }

// const registration = () => {
//     return fetch(hostUserList, {
//         method: "POST",
//     });
// }

// Получаем список комментариев с сервера

export const getComments = () => {
  return fetch(host, {
      method: "GET",
  });
};

// Отправляем логин-пароль на сервер

export const postLogIn = ({login, password}) => {
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

// Функция передачи написанного комментария на сервер

export const postComments = ({ token, comments, commentInputElement, nameInputElement }) => {
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

