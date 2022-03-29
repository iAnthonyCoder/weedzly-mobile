import { REACT_APP_PUBLIC_API_URL } from '../config/tokens';
import { fetchWrapper } from '../helpers/fetch-wrapper';
const api = REACT_APP_PUBLIC_API_URL
const baseUrl = `${api}${'users'}`;

export const userService = {
    findByEmail,
};

function findByEmail(email) {
    return fetchWrapper.get(`${baseUrl}/findByEmail/${email}`);
}