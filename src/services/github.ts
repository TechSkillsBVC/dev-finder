import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.github.com/',
});

/**
 * Retrieves information about a GitHub user.
 * @param username - The username of the user to retrieve information for.
 * @returns A Promise that resolves to the user's information.
 */
export function getUserInfo(username: string): Promise<any> {
    return api.get(`/users/${username}`).then(({ data }) => data);
}
