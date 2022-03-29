import { IonButton, IonFab, IonFabButton, IonIcon, IonSpinner } from '@ionic/react'
import { cart, heart, heartOutline, star, starOutline } from 'ionicons/icons'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { favoriteService } from '../../services/favorite.service'
import { manageFavorites, updateModalStatus } from '../../store/actions'

const FavoriteButton = (props) => {

    const user = useSelector(state => state.user)
    const favorites = useSelector(state => state.favorites)
    const fetched_favorites = useSelector(state => state.fetched_favorites)
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


    if(user._id && !fetched_favorites) return (
        <IonSpinner />
    )

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
                color={favorite ? 'primary' : 'medium'}
            />
        </IonButton>
    )

    if(props.isTopBar) return (
        <IonButton onClick={(e)=>{
            e.stopPropagation()
            handleManageFavorite()
        }} fill='clear'>
		    <IonIcon color={favorite ? 'danger' : 'medium'} slot="icon-only" icon={heart} />
							
		</IonButton>
        

            
    )

    return (
        <IonFab  vertical="top" horizontal="end" slot="">
            <IonFabButton 
                style={{margin:0}} 
                color='light' 
                size='small'
                onClick={(e)=>{
                    e.stopPropagation()
                    handleManageFavorite()
                }}
            >
                <IonIcon color={favorite ? 'danger' : 'medium'}  icon={heart} />
            </IonFabButton>
        </IonFab>

        // <IonFab style={{backgroundColor:'white', borderRadius:'100%'}} onClick={(e)=>{
        //     e.stopPropagation()
        //     handleManageFavorite()
        // }} slot={props.slot} >
		// 	<IonIcon slot="icon-only" icon={favorite ? star : starOutline} />
		// </IonFa>
    )
}

export default FavoriteButton