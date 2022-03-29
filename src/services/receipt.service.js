import { fetchWrapper } from '../helpers/fetch-wrapper';
const api = process.env.REACT_APP_PUBLIC_API_URL
const baseUrl = `${api}${'receipts'}`;

export const receiptService = {
    get,
    create,
};

function get(params='', userToken) {
    return fetchWrapper.get(`${baseUrl}${params}`, userToken);
}

function create(params) {
    return fetchWrapper.post(baseUrl, params);
}