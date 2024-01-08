
const hostUserList = "https://wedev-api.sky.pro/api/user";


// API авторизация

const getUserList = () => {
    return fetch(hostUserList, {
        method: "GET",
    });
}

const registration = () => {
    return fetch(hostUserList, {
        method: "POST",
    });
}
