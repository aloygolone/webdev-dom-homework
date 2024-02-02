import { getComments } from "./api.js";
import { setComments } from "./vars.js";
// import { timeFunction } from "./date.js";
import { renderComments } from "./htmlForms.js";
import { format }  from "date-fns";

// Рендерим полученный список комментариев в Html

export const fetchAndRender = () => {
    return getComments()
    .then((response) => {
      return response.json();
    })
    .then((responseData) => {
      setComments(responseData.comments.map((comment) => {
        return {
          name: comment.author.name,
          login: comment.author.login,
          id: comment.id,
          date: format(new Date(comment.date), "dd-MM-yyyy hh.mm.ss"),
          text: comment.text,
          likes: comment.likes,
          isLiked: comment.isLiked,
        };
      })
      );
      return renderComments();
    })  
}

