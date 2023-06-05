import User from '../types/user';
import axios from 'axios';

const api = axios.create({
    // TODO: replace the baseURL with your own IP address and port number
    // run 'npx json-server --watch db.json --port 3333 --host your_ip_address_here' to start the server
    baseURL: 'https://my-json-server.typicode.com/bvc-mobile-dev/dev-finder/',
});

export function getUsers() {
    return api.get<User[]>('/users/').then(({ data }) => data);
}

export function getUserByLogin(username: string) {
    return (
        api
            .get<User[]>(`/users/?login=${username}`)
            // there should be only one user with a given login (BE implementation)
            .then((res) => res.data[0])
    );
}

export function postUser(user: Omit<User, 'id'>) {
    return api.post<User>('/users/', user).then(({ data }) => data);
}

export function deleteUser(id: number) {
    return api.delete(`/users/${id}`).then(({ data }) => data);
}
