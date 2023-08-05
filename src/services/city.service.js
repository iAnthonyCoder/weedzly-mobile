import { REACT_APP_PUBLIC_API_URL } from '../config/tokens';
import { fetchWrapper } from '../helpers/fetch-wrapper';
const api = REACT_APP_PUBLIC_API_URL
const baseUrl = `${api}${'cities'}`;

export const cityService = {
    getAll,
    findByUUID,
    findBySlug
};

function getAll(query='') {
    return fetchWrapper.get(`${baseUrl}${query}`);
}

function findByUUID(UUID) {
    return fetchWrapper.get(`${baseUrl}/${UUID}`);
}

function findBySlug(slug, abbr) {
    return fetchWrapper.get(`${baseUrl}/bySlug/${slug}/${abbr}`);
}
