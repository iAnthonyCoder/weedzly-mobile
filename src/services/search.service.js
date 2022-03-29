import { fetchWrapper } from '../helpers/fetch-wrapper';
const api = process.env.REACT_APP_PUBLIC_API_URL
const baseUrl = `${api}${'searches'}`;

export const searchService = {
    searchAll,
};

function searchAll(query) {
    return fetchWrapper.get(`${baseUrl}${query}`);
}