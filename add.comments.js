
// Добавление через клавишу Enter

const addCommentByEnter = () => {document.addEventListener("keypress", function (e) {
  const key = e.which || e.keyCode;
  if (key === 13) {
    buttonElement.click();
  }
});
}