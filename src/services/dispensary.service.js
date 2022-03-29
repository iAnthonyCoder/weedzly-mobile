import { fetchWrapper } from '../helpers/fetch-wrapper';
const api = process.env.REACT_APP_PUBLIC_API_URL
const baseUrl = `${api}${'dispensaries'}`;

export const dispensaryService = {
    getAll,
    getInfoAndMenuBySlug,
    getFilters,
    getDetailsPage,
    getBySlug,
    find,
    setViewed,
    getMenu,
    getProductBySlug,
    createRequest,
    getSearchAll,
    getNear,
    getProductAndVariant,
    requestMenu
};

function getMenu(slug, query) {
    return fetchWrapper.get(`${baseUrl}/getmenu/${slug}${query}`);
}

function requestMenu(_id){
    return fetchWrapper.post(`${baseUrl}/request_menu/${_id}`, {_id})
}

function setViewed(id) {
    return fetchWrapper.get(`${baseUrl}/set_viewed/${id}`);
}

function getAll(query) {
    return fetchWrapper.get(baseUrl+query);
}

function getNear(query) {
    return fetchWrapper.get(baseUrl+"/getByLocation"+query);
}

function getSearchAll(query) {
    return fetchWrapper.get(baseUrl+"/getByTextSearch"+query);
}

function getInfoAndMenuBySlug(slug) {
    return fetchWrapper.get(baseUrl+"/withmenu/"+slug);
}

function getBySlug(slug, queryString) {
    return fetchWrapper.get(`${baseUrl}/${slug}${queryString ? queryString : ''}`);
}

function getProductBySlug(params) {
    return fetchWrapper.get(`${baseUrl}/menu/${params}`);
}

function getProductAndVariant(dispensaryId, productId, vaiantId){
    return fetchWrapper.get(`${baseUrl}/menu/${dispensaryId}/${productId}/${vaiantId}`);
}

function find(params, query='') {
    return fetchWrapper.get(`${baseUrl}/main/${params}${query}`);
}

function getFilters(id) {
    return fetchWrapper.get(`${baseUrl}/getfilters/${id}`);
}

function getDetailsPage(id, query='') {
    return fetchWrapper.get(`${baseUrl}/getdetailspage/${id}${query}`);
}

function createRequest(payload) {
    return fetchWrapper.post(`${baseUrl}`, payload)
}