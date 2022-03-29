import { REACT_APP_PUBLIC_API_URL } from '../config/tokens';
import { fetchWrapper } from '../helpers/fetch-wrapper';
const api = REACT_APP_PUBLIC_API_URL
const baseUrl = `${api}${'brands'}`;

export const brandService = {
    getAll,
    getById,
    buildAll,
    getPaginated,
    getFilters,
    getBySlug,
    findRetailers
};

function getPaginated(query = '') {
    return fetchWrapper.get(`${baseUrl}${query}`);
}

function getAll(query = '') {
    return fetchWrapper.get(`${baseUrl}${query}`);
}

function findRetailers(slug, query) {
    return fetchWrapper.get(`${baseUrl}/retailers/${slug}${query}`)
}

function buildAll() {
    return fetchWrapper.get(`${baseUrl}/build`);
}


function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function getFilters(id) {
    return fetchWrapper.get(`${baseUrl}/filters/${id}`);
}

function getBySlug(slug) {
    return fetchWrapper.get(`${baseUrl}/${slug}`);
}
