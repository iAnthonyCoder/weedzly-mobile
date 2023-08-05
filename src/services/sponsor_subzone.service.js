import { REACT_APP_PUBLIC_API_URL } from '../config/tokens';
import { fetchWrapper } from '../helpers/fetch-wrapper';
const api = REACT_APP_PUBLIC_API_URL
const baseUrl = `${api}${'sponsor_subareas'}`;

export const sponsor_subzoneService = {
    findByLocation
};

function findByLocation(longitude, latitude) {
    return fetchWrapper.get(`${baseUrl}?longitude=${longitude}&latitude=${latitude}`);
}