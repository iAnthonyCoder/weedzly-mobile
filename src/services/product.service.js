import { REACT_APP_PUBLIC_API_URL } from '../config/tokens';
import { fetchWrapper } from '../helpers/fetch-wrapper';
const api = REACT_APP_PUBLIC_API_URL
const baseUrl = `${api}${'products'}`;

export const productService = {
    getAll,
    getById,
    getRetailers,
    buildAll,
    getBySlugAndBrand,
    getPaginated,
    getRandomByStrain,
    getMainPage,
    getCategoryProductsFromParent,
    getFilter
};

function getCategoryProductsFromParent (slug, query) {
    return fetchWrapper.get(`${baseUrl}/category_products_from_parent/${slug}/${query}`)
}

function getPaginated(query) {
    return fetchWrapper.get(`${baseUrl}${query}`);
}

function getFilter(id, query, collection) {
    return fetchWrapper.get(`${baseUrl}/business/${id}/filters/${collection}${query}`);
}

function getMainPage(query) {
    return fetchWrapper.get(`${baseUrl}/main_page${query}`);
}

function getRandomByStrain(id) {
    return fetchWrapper.get(`${baseUrl}/random_strain/${id}`)
}


function getAll(dispensaryId, query='') {
    return fetchWrapper.get(`${baseUrl}/${dispensaryId}${query}`);
}

function buildAll() {
    return fetchWrapper.get(`${baseUrl}/build`);
}


function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}


function getRetailers(id, query) {
    return fetchWrapper.get(`${baseUrl}/retailers/${id}?${query}`);
}

function getBySlugAndBrand(queryString) {
    return fetchWrapper.get(`${baseUrl+'/brand_and_slug?'+queryString}`);
}