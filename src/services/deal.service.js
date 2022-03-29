import { REACT_APP_PUBLIC_API_URL } from '../config/tokens';
import { fetchWrapper } from '../helpers/fetch-wrapper';
const api = REACT_APP_PUBLIC_API_URL
const baseUrl = `${api}${'deals'}`;

export const dealService = {
    getAll,
    getById,
    getBySlug,
    getNear,
    getByDispensary
};

function getByDispensary(dispensary, query) {
    return fetchWrapper.get(`${baseUrl}/business/${dispensary}${query}`);
}

function getAll(query) {

    return fetchWrapper.get(`${baseUrl}${query}`);
}

function getNear(query) {

    return fetchWrapper.get(`${baseUrl}/near${query}`);
}

function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function getBySlug(dispensarySlug, slug) {
    return fetchWrapper.get(`${baseUrl}/${dispensarySlug}/${slug}`);
}
