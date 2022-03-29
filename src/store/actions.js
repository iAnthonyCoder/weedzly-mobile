import { 
    ADD_TO_CART,
    REMOVE_ITEM,
    SUB_QUANTITY,
    ADD_QUANTITY,
    ADD_QUANTITY_WITH_NUMBER,
    RESET_CART,
    ADD_PRODUCTS,
    USER_LOGIN,
    CHECK_USER_LOGIN,
    USER_LOGOUT,
    USER_UPDATE,
    GET_CART,
    ADD_ITEM_TO_CART,
    MODAL_UPDATE,
    UPDATE_QUANTITY,
    GET_FAVORITES,
    MANAGE_FAVORITES,
    ADD_ITEM_CART_MODAL,
    RESET_CART_MODAL,
    SET_PAGE_OPENED,
    FETCHED_CART,
    SET_SITEWIDE_DEAL,
    GET_NOTIFICATIONS,
    UPDATE_NOTIFICATION
} from './actions_constants'

//CHECK_USER_LOGIN
export const checkUserLogin = () => {
    return {
        type: CHECK_USER_LOGIN
    }
}

export const pageOpened = () => {
    return {
        type: SET_PAGE_OPENED
    }
}

export const setSiteWideDeal = (data) => {
    return {
        type: SET_SITEWIDE_DEAL,
        data: data
    }
}

export const getNotifications = (data) => {
    return {
        type: GET_NOTIFICATIONS,
        data: data
    }
}

export const updateNotification = (data) => {
    return {
        type: UPDATE_NOTIFICATION,
        data: data
    }
}

export const getFavorites = (data) => {
    return {
        type: GET_FAVORITES,
        data: data ? data.favorites : []
    }
}

export const addItemCartModal = (item) => {
    return {
        type: ADD_ITEM_CART_MODAL,
        data: item
    }
}

export const resetCartModal = () => {
    return {
        type: RESET_CART_MODAL,
    }
}

export const manageFavorites = (body) => {
    return {
        type: MANAGE_FAVORITES,
        data: body
    }
}

export const getCart = (cart) => {
    return {
        type: GET_CART,
        cart:cart
    }
}

export const fetchedCart = () => {
    return {
        type: FETCHED_CART,
        fetched_cart:true
    }
}

export const updateQuantity = (_id, {quantity}) => {
    
    return {
        type: UPDATE_QUANTITY,
        _id,
        quantity
    }
}


export const updateModalStatus = (modal) => {
    return {
        type: MODAL_UPDATE,
        modal: modal
    }
}

export const addItemToCart = (product) => {
    return {
        type: ADD_ITEM_TO_CART,
        product:product
    }
}

// USER_LOGOUT
export const userLogout = () => {
    return {
        type: USER_LOGOUT
    }
}

// USER_LOGIN
export const userLogin = (user) => {
    return {
        type: USER_LOGIN,
        user
    }
}

export const userUpdate = (user) => {
    return {
        type: USER_UPDATE,
        user
    }
}

//add products
export const addProducts = () => {
    return {
        type: ADD_PRODUCTS
    }
}
//add cart action
export const addToCart = (item) => {
    
    return {
        type: ADD_TO_CART,
        item
    }
}
//remove item action
export const removeItem = (id) => {
    return {
        type: REMOVE_ITEM,
        id
    }
}
//subtract qt action
export const subtractQuantity = (id) => {
    return {
        type: SUB_QUANTITY,
        id
    }
}
//add qt action
export const addQuantity = (id) => {
    return {
        type: ADD_QUANTITY,
        id
    }
}

//add qt action with quantity number
export const addQuantityWithNumber = (id, qty) => {
    return {
        type: ADD_QUANTITY_WITH_NUMBER,
        id,
        qty
    }
}

// Reset cart after form submit
export const resetCart = () => {
    return {
        type: RESET_CART
    }
}
