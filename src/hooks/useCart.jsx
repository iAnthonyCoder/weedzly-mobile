import { IonAlert, IonToast } from '@ionic/react';
import _ from 'lodash'
import { useSelector, useDispatch } from 'react-redux'
import { ENTITY_CART, LOCAL_CART } from '../helpers/constants';
import { localShoppingCartService } from '../services/localShoppingCart.service';
import { shoppingCartService } from '../services/shoppingcart.service';

import { getCart, addToCart, removeItem, updateQuantity, resetCart, fetchedCart } from '../store/actions';



const useCart = () => {
    const { user, dispensary } = useSelector(state => state)
    const dispatch = useDispatch()
    
    const service = !_.isEmpty(user) ? shoppingCartService : ''
    const user_entity_cart = !_.isEmpty(user) ? undefined : localStorage.getItem(ENTITY_CART)


    const get = async (dispensaryId=user_entity_cart) => {
        
        let cartData = await service.get(dispensaryId)

        if(cartData){
            dispatch(getCart(cartData))
        }

        dispatch(fetchedCart(cartData))
        
        
    }


    const add = async (item) => {
        
        
       
        const fields = {
            itemName: item.product.name,
            brandName: item.product.brand.name,
            originalPrice: item.product.variant.price || item.product.variant.WPointsValue,
            quantity: item.quantity,
            product: item.product._id,
            dispensary: item.dispensary,
            variant: item.product.variant._id,
            reward: item.reward
        }

        

        if(!_.isEmpty(dispensary) && item.dispensary!=dispensary._id){

            <IonAlert
                isOpen={true}
        
                cssClass='my-custom-class'
                header={'Delete this review?'}
                message={'asdasdasdasd'}
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'secondary',
                        id: 'cancel-button',
                        
                    },
                    {
                        text: 'Okay',
                        id: 'confirm-button',
                        handler: async () => {
                            await dispatch(resetCart())
                            addItem(fields, item, {})
                        }
                    }
                ]}
            />
        } else {
            addItem(fields, item, dispensary)
        }
    }

    const addItem = async (fields, item, dispensary) => {
       
        try {
          
            let { _id } = await service.create(fields)
            if(_.isEmpty(dispensary)){
                await get(item.dispensary)
            } else {
            
                dispatch(addToCart({...item, _id, available: true}))
                
            
            }
      
            
        } catch(err) {
            <IonToast
                isOpen={true}
                message={'asd'}
                // icon={informationCircle}
                position="bottom"
                color={'danger'}
                translucent={true}
                duration={3000}
                buttons={[
                    {
                      text: 'Hide',
                      role: 'cancel',
                    }
                ]}
            />
        }

    }


    const remove = async(id) => {
        
        try {
            await service.delete(id)
            dispatch(removeItem(id))
        } catch (err){
            console.log(err)
        }
        
    }

    const update = async (_id, item) => {
        await service.update(_id, item)
        dispatch(updateQuantity(_id, item))
    }

    const sync = async () => {
       
        let localCart = localStorage.getItem(LOCAL_CART) ? JSON.parse(localStorage.getItem(LOCAL_CART)).map( x => {
            delete x._id
            return x
        }) : []
        if(localCart.length>0){
            try {
                await shoppingCartService.sync(localStorage.getItem(ENTITY_CART), {cartitems: localCart})
                await get()
                await localShoppingCartService.reset()
            } catch(err) {
                console.log(err)
            }
        }
    }

    return [
        get,
        add,
        remove,
        update,
        sync
    ]

}

export default useCart