import { fetchWrapper } from '../helpers/fetch-wrapper';
const api = process.env.REACT_APP_PUBLIC_API_URL
const baseUrl = `${api}${'strains'}`;

export const strainService = {
    getAll,
    getBySlug,
    buildAll,
    getPaginated,
    update,
    getFeaturedBrands
};

function getPaginated(query) {
    return fetchWrapper.get(`${baseUrl}${query}`);
}

function getFeaturedBrands(id) {
    return fetchWrapper.get(`${baseUrl}/brands/${id}`);
}

function getAll(query='') {
    return fetchWrapper.get(`${baseUrl}${query}`);
}

function buildAll() {
    return fetchWrapper.get(`${baseUrl}/build`);
}


function getBySlug(slug) {
    return fetchWrapper.get(`${baseUrl}/${slug}`);
}

function update(type, slug, params){
    return fetchWrapper.put(`${baseUrl}/${type}/${slug}`, params);
}

