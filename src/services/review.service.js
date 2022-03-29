import { REACT_APP_PUBLIC_API_URL } from '../config/tokens';
import { fetchWrapper } from '../helpers/fetch-wrapper';
const api = REACT_APP_PUBLIC_API_URL
const baseUrl = `${api}${'reviews'}`;

export const reviewService = {
    create,
    update,
    getPaginated,
    getGraph,
    addHelpful,
    remove,
    report,
    getById
};

function create(params) {
    return fetchWrapper.post(`${baseUrl}`, params);
}

function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}


function report(id, params) {
    return fetchWrapper.put(`${baseUrl}/report/${id}`, params);
}

function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params)
}

function getPaginated(queryString, userToken) {
    return fetchWrapper.get(`${baseUrl+'/paginated'+queryString}`, userToken);
}

function getGraph(queryString) {
    return fetchWrapper.get(`${baseUrl+'/graph'+queryString}`);
}

function addHelpful(id) {
    return fetchWrapper.post(baseUrl+'/helpful/'+id);
}

function remove(id) {
    return fetchWrapper.delete(baseUrl+'/'+id)
}
