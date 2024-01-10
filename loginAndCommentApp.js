import { renderLoginForm, renderNoLogin, renderAddForm } from "./htmlForms.js"
import { comments, setComments, listElement, addFormElement, loginFormElement, noLoginElement, host, hostUserList, hostUserLogin, token, setToken } from "./vars.js";
import { postLogIn } from "./api.js";
import { addCommentByClick } from "./commentApp.js";

export const loginAndComment = () => {
  renderNoLogin();
    
  const loginLink = document.getElementById("login-link");
  const noneLogin = document.getElementById("none-login");

  loginLink.addEventListener("click", () => {
    renderLoginForm();

    noneLogin.style.display = "none";
    loginFormElement.style.display = "block";

    const loginWait = document.getElementById("login-wait");
    const loginError = document.getElementById("login-error");
    loginWait.style.display = "none";
    loginError.style.display = "none";

    const loginButtonElement = document.getElementById("login-button");
    const loginInputElement = document.getElementById("login-input");
    const passwordInputElement = document.getElementById("password-input");

    const disabledLogAndPass = (boolean) => {
      loginInputElement.disabled = boolean;
      passwordInputElement.disabled = boolean;
    }

    loginButtonElement.addEventListener("click", () => {
      loginWait.style.display = "block";
      disabledLogAndPass(true);
        
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
        return addCommentByClick();
      })
      .catch((error) => {
                
        if (error.message === "Неверный запрос") {
          loginWait.style.display = "none";
          loginError.style.display = "block";
          loginInputElement.classList.add("error");
          passwordInputElement.classList.add("error");
          disabledLogAndPass(false);
          console.warn("Код ошибки - 400");
          return;
        } else {
          disabledLogAndPass(false);
          alert("Кажется, у Вас проблемы с интернетом");
          console.warn("Нет сети");
          return;
        }
        
      });
    })
  })  
}

