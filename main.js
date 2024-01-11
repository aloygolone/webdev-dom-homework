
// 1.2 Обработчик клика лайка

const initLikeListeners = () => {

  const likeButtons = document.querySelectorAll(".like-button");

  for (const likeButton of likeButtons) {
    likeButton.addEventListener("click", (event) => {
      event.stopPropagation();

      const index = likeButton.dataset.index;
      comments[index].likes += comments[index].isLiked ? -1 : +1;
      comments[index].isLiked = !comments[index].isLiked;

      // 1.1 Отправляем данные о лайке на сервер

    let hostLikes = `https://wedev-api.sky.pro/api/v2/eugene-alyoshin/comments/${comments[index].id}/toggle-like`;

    const toggleLike = () => {
      return fetch(hostLikes, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(
            {
              likes: comments[index].likes,
              isLiked: comments[index].isLiked,
            },
          ),  
      });
    }

      toggleLike();
      return renderComments();
      
    });
  }
};

