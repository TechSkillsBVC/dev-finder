import User from '../types/user';
import axios from 'axios';

const api = axios.create({
    // TODO: replace the baseURL with your own IP address and port number
    // run 'npx json-server --watch db.json --port 3333 --host your_ip_address_here' to start the server
    baseURL: 'https://my-json-server.typicode.com/bvc-mobile-dev/dev-finder/',
});

/**
 * Retrieves all users from the API.
 * @returns {Promise<User[]>} A promise that resolves to an array of User objects.
 */
export function getUsers(): Promise<User[]> {
    return api.get<User[]>('/users/').then(({ data }) => data);
}

/**
 * Retrieves a user from the API by their username.
 * @param {string} username - The username of the user to retrieve.
 * @returns {Promise<User>} A promise that resolves to a User object.
 */
export function getUserByLogin(username: string): Promise<User | undefined> {
    return (
        api
            .get<User[]>(`/users/?login=${username}`)
            // there should be only one user with a given username (BE implementation)
            .then((res) => res.data[0])
    );
}

/**
 * Creates a new user in the API.
 * @param {Omit<User, 'id'>} user - The user object to create.
 * @returns {Promise<User>} A promise that resolves to the created User object.
 */
export function postUser(user: Omit<User, 'id'>): Promise<User> {
    return api.post<User>('/users/', user).then(({ data }) => data);
}

/**
 * Deletes a user from the API by their ID.
 * @param {number} id - The ID of the user to delete.
 * @returns {Promise<any>} A promise that resolves to the response data from the API.
 */
export function deleteUser(id: number): Promise<any> {
    return api.delete(`/users/${id}`).then(({ data }) => data);
}
