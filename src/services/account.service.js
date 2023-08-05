import { fetchWrapper } from '../helpers/fetch-wrapper'
const api = process.env.REACT_APP_PUBLIC_API_URL
const baseUrl = api;
const accountUrl = `${api}users`;

export const accountService = {
    login,
    logout,
    register,
    verifyEmail,
    forgotPassword,
    validatePasswordResetToken,
    resetPassword,
    resendToken,
    getMe,
    updateOwn,
    userValue,
    findByNickname
};

function login(email, password) {
    return fetchWrapper.post(`${baseUrl}auth/login`, { email, password })
    .then(user => {
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    });
}

function logout() {
    localStorage.removeItem('user');
}

function resendToken(params) {
    return fetchWrapper.post(`${baseUrl}auth/resend`, params)
}

function register(params) {
    return fetchWrapper.post(`${baseUrl}auth/signup`, params);
}

function verifyEmail(token) {
    return fetchWrapper.post(`${baseUrl}auth/verify/${token}`);
}

function forgotPassword(email) {
    return fetchWrapper.post(`${baseUrl}auth/forgot-password`, email );
}

function validatePasswordResetToken(token) {
    return fetchWrapper.post(`${baseUrl}auth/validate-password-reset-token${token}`);
}

function resetPassword(body) {
    return fetchWrapper.post(`${baseUrl}auth/reset-password`, body);
}

function updateOwn(params) {
    
    return fetchWrapper.put(`${accountUrl}/me`, params)
    .then(user => { 
        return user;
    });
}

function getMe(token) {
    return fetchWrapper.get(`${accountUrl}/me`, token)
}

function findByNickname(nickname){
    return fetchWrapper.get(`${accountUrl}/${nickname}`)
}



function userValue() {
    const user = localStorage.getItem('user')
    if(user){
        return JSON.parse(user)
    } else {
        return ''
    }
}
