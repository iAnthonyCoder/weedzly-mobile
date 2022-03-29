import { fetchWrapper } from '../helpers/fetch-wrapper';
const api = process.env.REACT_APP_PUBLIC_API_URL
const baseUrl = `${api}${'favorites'}`;

export const favoriteService = {
    getAllByCollection,
    getAll,
    manage
};

function getAll() {
    return fetchWrapper.get(`${baseUrl}`);
}

function getAllByCollection(collection, query) {
    return fetchWrapper.get(`${baseUrl}/${collection}${query}`);
}

function manage(body) {
    return fetchWrapper.post(baseUrl, body);
}

