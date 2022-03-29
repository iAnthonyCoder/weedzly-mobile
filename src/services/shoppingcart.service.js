import { fetchWrapper } from '../helpers/fetch-wrapper';
const api = process.env.REACT_APP_PUBLIC_API_URL
const baseUrl = `${api}${'shoppingcarts'}`;

export const shoppingCartService = {
    get,
    delete:_delete,
    removeAll,
    create,
    update,
    fillLocalCart,
    sync
};


function get(dispensary) {
    return fetchWrapper.get(`${baseUrl}/`);
}

function create(params) {
    return fetchWrapper.post(baseUrl, params);
}

function sync(dispensaryId, data) {
    return fetchWrapper.post(`${baseUrl}/sync/${dispensaryId}`, data)
}

function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params)
}

function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`)
}

function removeAll(id) {
    return fetchWrapper.delete(`${baseUrl}/removecart/${id}`)
}

function fillLocalCart(dispensary, query) {
    return fetchWrapper.get(`${baseUrl}/${dispensary}${query}`)
}
