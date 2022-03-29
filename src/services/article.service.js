import { REACT_APP_PUBLIC_API_URL } from '../config/tokens';
import { fetchWrapper } from '../helpers/fetch-wrapper';
const api = REACT_APP_PUBLIC_API_URL
const baseUrl = `${api}${'articles'}`;


export const articleService = {
    getBySlug,
    getPaginated,
    getMainPage,
    setViewed,
    getAll
};

function getPaginated(query) {
    return fetchWrapper.get(`${baseUrl}${query}`);
}

function getAll(query) {
    return fetchWrapper.get(`${baseUrl}${query}`);
}

function getMainPage(query) {
    return fetchWrapper.get(`${baseUrl}/get_main_page${query}`);
}

function setViewed(id) {
    return fetchWrapper.get(`${baseUrl}/set_viewed/${id}`);
}

function getBySlug(slug) {
    return fetchWrapper.get(`${baseUrl}/${slug}`);
}
