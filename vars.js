export let comments = [];

export const setComments = (newComments) => {
    comments = newComments;
}

export const host = "https://wedev-api.sky.pro/api/v2/eugene-alyoshin/comments";
export const hostUserList = "https://wedev-api.sky.pro/api/user";
export const hostUserLogin = "https://wedev-api.sky.pro/api/user/login";

export let token;
export const setToken = (newToken) => {
    token = newToken;
};

export const listElement = document.getElementById("list");
export const addFormElement = document.getElementById("add-form");
export const loginFormElement = document.getElementById("login-form");
export const noLoginElement = document.getElementById("no-login");