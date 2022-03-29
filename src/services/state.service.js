import { fetchWrapper } from '../helpers/fetch-wrapper';
const api = process.env.REACT_APP_PUBLIC_API_URL
const baseUrl = `${api}${'states'}`;

export const stateService = {
    findByUUID,
    findById,
    findByAbr
};

function findByUUID(UUID) {
    return fetchWrapper.get(`${baseUrl}/${UUID}`);
}

function findByAbr(abr){
    return fetchWrapper.get(`${baseUrl}/byAbr/${abr}`)
}

function findById(id){
    return fetchWrapper.get(`${baseUrl}/byId/${id}`);
}


