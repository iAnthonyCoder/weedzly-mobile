import { REACT_APP_PUBLIC_API_URL } from '../config/tokens';
import { fetchWrapper } from '../helpers/fetch-wrapper';
const api = REACT_APP_PUBLIC_API_URL
const baseUrl = `${api}${'orders'}`;

export const orderService = {
    get,
    create,
    update,
    getPaginated,
    create_no_acc,
    getGuest
};


function getPaginated(queryString, userToken) {
    return fetchWrapper.get(`${baseUrl}/paginate${queryString}`, userToken);
}

function get(id, userToken) {
    return fetchWrapper.get(`${baseUrl}/${id}`, userToken)
}

function getGuest(id, userToken) {
    return fetchWrapper.get(`${baseUrl}/guest/${id}${userToken}`)
}

function create(params) {
    return fetchWrapper.post(baseUrl, params);
}

function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params)
}

function create_no_acc (id, params) {
    return fetchWrapper.post(`${baseUrl}/${id}`, params)
}
