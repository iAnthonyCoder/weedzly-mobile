import { IonButton, IonFab, IonFabButton, IonIcon } from '@ionic/react'
import { heart, heartOutline, star, starOutline } from 'ionicons/icons'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { favoriteService } from '../../services/favorite.service'
import { manageFavorites, updateModalStatus } from '../../store/actions'

const TopBarFavoriteButton = (props) => {

    const user = useSelector(state => state.user)
    const favorites = useSelector(state => state.favorites)

    const dispatch = useDispatch()

    const [ favorite, setFavorite ] = useState(false)

    const handleManageFavorite = async () => {
       
        try {
            if(!user._id){
                dispatch(updateModalStatus({login:true}))
            } else {
             
                let body = {
                    type: !favorite ? 'add' : 'remove',
                    collection: [props.collection],
                    _id: props._id
                }
                await favoriteService.manage(body)
                dispatch(manageFavorites(body))
                setFavorite(!favorite)
            }
        } catch (err) {
            console.log(err)
            // Swa.fire({
            //     icon: 'error',
            //     title: 'Error',
            //     text: err || err.message,
            // })
        }
    }

    useEffect(() => {
    
        favorites && setFavorite(favorites[props.collection].includes(props._id))
    }, [favorites])


    if(props.isFavoriteDeal) return (
        <IonButton 
            size='large' 
            fill='clear' 
            color='dark'
            onClick={(e)=>{
                e.stopPropagation()
                handleManageFavorite()
            }}
        >
            <IonIcon 
                icon={heart}
                color={favorite ? 'primary' : ''}
            />
        </IonButton>
    )

    return (
        
            <IonFabButton 
                style={{margin:0}} 
                color='light' 
                size='small'
                onClick={(e)=>{
                    e.stopPropagation()
                    handleManageFavorite()
                }}
            >
                <IonIcon icon={favorite ? star : starOutline} color='primary' />
            </IonFabButton>
      

        // <IonFab style={{backgroundColor:'white', borderRadius:'100%'}} onClick={(e)=>{
        //     e.stopPropagation()
        //     handleManageFavorite()
        // }} slot={props.slot} >
		// 	<IonIcon slot="icon-only" icon={favorite ? star : starOutline} />
		// </IonFa>
    )
}

export default TopBarFavoriteButton