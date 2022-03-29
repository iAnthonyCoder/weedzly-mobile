import queryString from 'query-string';
import { ENTITY_CART, LOCAL_CART } from '../helpers/constants';

import { shoppingCartService } from './shoppingcart.service';

export const localShoppingCartService = {
    create,
    delete:_delete,
    update,
    reset,
    get,
};

async function create(item) {
    
    if(!item.reward){
        let entity = localStorage.getItem(ENTITY_CART)
   
        if(entity && entity.toString()!=item.dispensary.toString()){
            await reset()
            localStorage.setItem(ENTITY_CART, item.dispensary)
        }
        if(!entity){
            localStorage.setItem(ENTITY_CART, item.dispensary)
        }
        item._id = window.btoa(item.product.concat(item.variant))
        let localCart = getCartFromLocalStorage()
        let newCart
        let existingItem =  localCart.find( x => x._id === item._id )
        if(existingItem){
            newCart = localCart.map( x => {
                if(x => x._id === item._id){
                    x.quantity = item.quantity + x.quantity
                } 
                return x
            })
        } else {
            newCart = localCart.concat(item)
        }
      
        await saveLocalCart(newCart)
        return item
    }
    
}

async function get (dispensaryId) {
    let currentCart = getCartFromLocalStorage()

    if(currentCart.length > 0){
        let params = {
            products: currentCart.map( x => {return x.product}),
            variants: currentCart.map( x => {return x.variant})
        }
        let cart = await shoppingCartService.fillLocalCart(dispensaryId, '?'+queryString.stringify(params, {arrayFormat: 'bracket'}))
        
        cart.cartitems = ( cart.cartitems.map( (x, i) => {
            let localInfo = currentCart[i]
            let data = Object.assign({}, x, {
                quantity: localInfo.quantity,
                brandName: localInfo.brandName,
                itemName: localInfo.itemName,
                originalPrice: localInfo.originalPrice,
                _id: localInfo._id
            })
            return data
        }) )
        return cart
    }
}

async function update(id, data) {
    
    await saveLocalCart(JSON.parse(localStorage.getItem(LOCAL_CART)).map( x => {
        if(x._id === id){
            x.quantity = data.quantity
        }
        return x
    }))
}

async function _delete(_id) {
    let currentCart = getCartFromLocalStorage().filter(x=>x._id!=_id)
    if(currentCart.length===0){
        await reset()
    } else {
        await saveLocalCart(currentCart)
    }
    
}

async function reset() {
    await localStorage.removeItem(LOCAL_CART)
    await localStorage.removeItem(ENTITY_CART)  
}


const getCartFromLocalStorage = () => {
    let cart = localStorage.getItem(LOCAL_CART) ? JSON.parse(localStorage.getItem(LOCAL_CART)) : []
    return cart
}

const saveLocalCart = async (data) => {
    await localStorage.setItem(LOCAL_CART, JSON.stringify(data))
    return {ok:'ok'}
}

