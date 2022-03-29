import { accountService } from '../services';

export const fetchWrapper = {
    get,
    post,
    put,
    protectedGet,
    delete: _delete,
}

function get(url, token) {

    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',  ...authHeader(url, token) },
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function protectedGet(url) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', ...authHeader(url) },
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function post(url, body) {
    
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader(url) },
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function put(url, body) {

    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader(url) },
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);    
}


function _delete(url) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader(url)||""
    };
    return fetch(url, requestOptions).then(handleResponse);
}





function authHeader(url, serverSideToken) {

    if(serverSideToken) {
        return { Authorization: `Bearer ${serverSideToken}` };
    } else {
        const user = accountService.userValue();
        const isLoggedIn = user && user.token;
        
        // const isApiUrl = url.startsWith("http://localhost/3000/api");
        
        if (isLoggedIn) {
            return { Authorization: `Bearer ${user.token}` };
        } else {
            return {};
        }
    }
}


function handleResponse(response) {
    
    if (!response.ok){
        if ([401, 403,].includes(response.status)) {
            // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
            accountService.logout();
        }
        if ([429].includes(response.status)) {
            // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
            accountService.logout();
            // alertService.error("TOO MANY REQUESTS... LOGGING OFF");
        }
    }
    return response.text().then(text => {
        const data = text && JSON.parse(text);

        if (!response.ok) {
            let message = (data && (data.message || data.errors[0].message)) || response.statusText;
            // alertService.error(error);
            if(message.message) message = message.message
            return Promise.reject({message, code: response.status});
        } 
        return data;
    });
}