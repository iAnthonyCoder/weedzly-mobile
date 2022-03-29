import { fetchWrapper } from '../helpers/fetch-wrapper';
const api = process.env.REACT_APP_PUBLIC_API_URL
const baseUrl = `${api}${'notifications'}`;


export const notificationService = {
    get,
    update
};

function get(params='') {
    return fetchWrapper.get(`${baseUrl}${params}`);
}

function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params)
}


