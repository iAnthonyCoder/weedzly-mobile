import { fetchWrapper } from '../helpers/fetch-wrapper';
const api = process.env.REACT_APP_PUBLIC_API_URL
const baseUrl = `${api}${'pointstransactions'}`;

export const pointstransactionService = {
    get,
    create,
    findOne
};

function get(params='', userToken) {
    return fetchWrapper.get(`${baseUrl}${params}`, userToken);
}

function findOne(dispensary) {
    return fetchWrapper.get(`${baseUrl}/${dispensary}`);
}

function create(params) {
    return fetchWrapper.post(`${baseUrl}`, params);
}