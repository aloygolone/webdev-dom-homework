import { objOfConst } from "./constant.js";

export function disabledFunction(boolean) {
    const buttonElement = document.getElementById("add-button");
    const nameInputElement = document.getElementById("name-input");
    const commentInputElement = document.getElementById("comment-input");
    buttonElement.disabled = boolean;
    nameInputElement.disabled = boolean;
    commentInputElement.disabled = boolean;
  }