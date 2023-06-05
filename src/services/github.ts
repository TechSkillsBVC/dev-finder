import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.github.com/',
});

export function getUserInfo(username: string) {
    return api.get(`/users/${username}`).then(({ data }) => data);
}
