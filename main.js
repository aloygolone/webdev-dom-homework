import { loginAndComment } from "./loginAndCommentApp.js";
import { fetchAndRender } from "./renderApp.js";

const app = new Promise(() => {
    return fetchAndRender();
}).then(loginAndComment())
