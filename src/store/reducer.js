import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { 
    ADD_TO_CART,
    REMOVE_ITEM,
    SUB_QUANTITY,
    ADD_QUANTITY, 
    ADD_SHIPPING,
    ADD_QUANTITY_WITH_NUMBER,
    RESET_CART,
    ADD_PRODUCTS,
    USER_LOGIN,
    CHECK_USER_LOGIN,
    GET_FAVORITES,
    USER_LOGOUT, 
    USER_UPDATE,
    GET_CART,
    ADD_ITEM_TO_CART,
    MODAL_UPDATE,
    UPDATE_QUANTITY,
    MANAGE_FAVORITES,
    ADD_ITEM_CART_MODAL,
    RESET_CART_MODAL,
    SET_PAGE_OPENED,
    FETCHED_CART,
    SET_SITEWIDE_DEAL,
    GET_NOTIFICATIONS,
    UPDATE_NOTIFICATION,
    CHANGE_MUST_NAVIGATE_TO,
    ADD_EMBEEDED_NOTIFICATION
} from './actions_constants'
import _ from 'lodash';


const initState = {
    modals:{
        location: false,
        menu: false,
        cart: false,
        user: false,
        deal: false,
        signup: false,
        login: false,
        notification: false,
        addRewardToCart: false,
        addProductToCart: false,
        shoppingCart: false,
        delivery: false,
        review: false,
        receipt: false
    },
    cartModal:{},
    favorites:{
        products: [],
        dispensaries: [],
        brands: [],
        strains: [],
        deals: []
    },
    dispensary:{},
    lastUpdate:'',
    products: [],
    recreationalSubtotal: 0,
    medicalSubtotal: 0,
    nugsSubtotal: 0,
    shipping: 0,
    login: false,
    user:{},
    id:'',
    pageOpened: false,
    fetched_cart: false,
    siteWideDeal: false,
    notifications:{
        totalData: [],
        fetched: false,
        hasMore:false
    },
    embeededNotification:{},
    fetched_notifications:false,
    fetched_favorites: false,
    mustNavigateTo:''
}


let updateRecreationalTotal = (newState) => {
    let recreationalSubtotal = 0
    
    newState.filter(x => !_.isEmpty(x.product)).filter(x => x.available).filter(x => x.product.variant.stock).filter(x => !x.product.isMedical).map(x => {
        recreationalSubtotal += x.reward ? 0 : x.quantity * x.product.variant.price
    })
    return recreationalSubtotal
}

let updateMedicalTotal = (newState) => {
    let medicalSubtotal = 0
    newState.filter(x => !_.isEmpty(x.product)).filter(x => x.available).filter(x => x.product.variant.stock).filter(x => x.product.isMedical).map(x => {
        medicalSubtotal += x.reward ? 0 : x.quantity * x.product.variant.price
    })
    return medicalSubtotal
}

let updateNugsTotal = (newState) => {
    let subtotal = 0
    newState.filter(x => !_.isEmpty(x.product)).filter(x => x.available).filter(x => x.product.variant.stock).map(x => {
        subtotal += !x.reward ? 0 : x.quantity * x.product.variant.WPointsValue
    })
    return subtotal
}

const reducers = (state = initState, action) => {

    if(action.type === SET_PAGE_OPENED){
        return{
            ...state,
            pageOpened: true
        }
    }

    if (action.type === ADD_ITEM_CART_MODAL){
        return{
            ...state,
            cartModal: action.data,
        }
    }

    if (action.type === SET_SITEWIDE_DEAL){
        return{
            ...state,
            siteWideDeal: action.data,
        }
    }

    if (action.type === FETCHED_CART){
        return{
            ...state,
            fetched_cart: true,
        }
    }




    if (action.type === GET_NOTIFICATIONS){
        return{
            ...state,
            notifications: action.data,
            fetched_notifications: true,
        }
    }
    // if (action.type === UPDATE_NOTIFICATION){
    //     let newNotifications = notification.map(x => {
    //         if(x._id === action.data._id){
    //             x = action.data
    //         }
    //         return x
    //     })
    //     return{
    //         notifications: newNotifications,
    //         ...state,
    //     }
    // }



    if (action.type === RESET_CART_MODAL){
        return{
            ...state,
            cartModal: {},
        }
    }


    // User Logout
    if (action.type === USER_LOGOUT){
        localStorage.removeItem('user');
        return{
            ...state,
            login: false,
            user:{}
        }
    }

    if (action.type === MODAL_UPDATE){
  
        const modal = action.modal
        const modals = { ...state.modals, ...modal }
        return{
            ...state,
            modals:modals
        }
    }

    // Check if user login
    if (action.type === CHECK_USER_LOGIN){

        const user = localStorage.getItem('user')
        if(user){
            return{
                ...state,
                login: true,
                user:JSON.parse(user)
            }
        } else {
            return{
                ...state,
                login: false,
                user: {}
            }
        }
    }

    //localStorage.getItem('user')
    //localStorage.setItem('user', JSON.stringify(user));
    // User Login
    if(action.type === USER_LOGIN){
        localStorage.setItem('user', JSON.stringify(action.user));
        return{
            ...state,
            login: true,
            user:action.user
        }
    }

    if(action.type === USER_UPDATE){
        localStorage.setItem('user', JSON.stringify(action.user));
        
        return{
            ...state,
            login: true,
            user:action.user
        }
    }

    if(action.type === GET_FAVORITES){
        return{
            ...state,
            favorites: action.data,
            fetched_favorites: true
        }
    }

    if(action.type === MANAGE_FAVORITES){
       
        let favorites = state.favorites
        let favoritesOnCollection = favorites[action.data.collection]
        if(action.data.type === 'add'){
            favoritesOnCollection = favoritesOnCollection.concat(action.data._id)
        } else {
            favoritesOnCollection = favoritesOnCollection.filter(x => x != action.data._id)
        }
        favorites[action.data.collection] = favoritesOnCollection
        
        return{
            ...state,
            favorites: favorites,
        }
    }


    if(action.type === GET_CART){

        
     
        return{
            ...state,
            dispensary: {...action.cart.dispensary},
            products: action.cart.cartitems,
            // lastUpdate:action.cart.updatedAt,
            recreationalSubtotal: updateRecreationalTotal(action.cart.cartitems),
            medicalSubtotal: updateMedicalTotal(action.cart.cartitems),
            nugsSubtotal: updateNugsTotal(action.cart.cartitems),
            // id: action.cart._id
        } 
    
    }

   
    if(action.type === ADD_TO_CART){
        let newItem = action.item
        let existedItem = state.products.filter(x=> x.available).find(item => (item.product.variant._id === newItem.product.variant._id) && (item.reward === newItem.reward))
        let newItems 
        if(existedItem){
            newItems = state.products.map(item => {
                if(item === existedItem){
                    item.quantity = parseInt(item.quantity, 10) + parseInt(newItem.quantity, 10) 
                    return item
                } else {
                    return item
                }
            })
        } else {
            newItems = state.products.concat(newItem)
        }

        return {
            ...state,
            products: newItems,
            recreationalSubtotal: updateRecreationalTotal(newItems),
            medicalSubtotal: updateMedicalTotal(newItems),
            nugsSubtotal: updateNugsTotal(newItems),
        }
    }

    



    if(action.type === REMOVE_ITEM){
        let newState = {}
        let new_items = state.products.filter(item=> action.id !== item._id)

        if(new_items.length > 0) {
            newState = {
                ...state,
                products: new_items,
                recreationalSubtotal: updateRecreationalTotal(new_items),
                medicalSubtotal: updateMedicalTotal(new_items),
            }
        } else {
            newState = {
                ...state,
                dispensary:{},
                products: [],
                recreationalSubtotal: 0,
                medicalSubtotal: 0,
                nugsSubtotal: 0,
                shipping: 0,
            }
        }
        return {
            ...state,
            ...newState
        }
    }

    if (action.type === UPDATE_QUANTITY){

        let newProducts = state.products.map( x=> {
            if(x._id === action._id){
                x.quantity = parseInt(action.quantity, 10) 
            }
            return x
        })
        return{
            ...state,
            products: newProducts,
            recreationalSubtotal: updateRecreationalTotal(newProducts),
            medicalSubtotal: updateMedicalTotal(newProducts),
            nugsSubtotal: updateNugsTotal(newProducts)
        }
    }

    
    if(action.type === RESET_CART){

        return {
            ...state,
            dispensary:'',
            lastUpdate:'',
            products: [],
            addedItems:[],
            recreationalSubtotal: 0,
            medicalSubtotal: 0,
            nugsSubtotal: 0,
            shipping: 0,
            id:''
        }
    }

    if(action.type === ADD_SHIPPING){
        return {
            ...state,
            shipping: state.shipping += 30
        }
    }
    
    if(action.type === CHANGE_MUST_NAVIGATE_TO){
        return {
            ...state,
            mustNavigateTo: action.url
        }
    }

    if(action.type === ADD_EMBEEDED_NOTIFICATION){
        return {
            ...state,
            embeededNotification: action.notification
        }
    }
    
    else {
        return state
    }
}


export const store = createStore(reducers, 
    composeWithDevTools(applyMiddleware(thunk))
);