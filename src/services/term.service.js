import { fetchWrapper } from '../helpers/fetch-wrapper';
const api = process.env.REACT_APP_PUBLIC_API_URL
const baseUrl = `${api}${'terms'}`;

export const termService = {
    getAll,
};

function getAll(query='') {
    return fetchWrapper.get(`${baseUrl}${query}`);
}