import { fetchWrapper } from '../helpers/fetch-wrapper';
const api = process.env.REACT_APP_PUBLIC_API_URL
const baseUrl = `${api}${'users'}`;

export const userService = {
    findByEmail,
};

function findByEmail(email) {
    return fetchWrapper.get(`${baseUrl}/findByEmail/${email}`);
}