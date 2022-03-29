import { IonBadge, IonCard, IonCardContent, IonCardHeader, IonHeader, IonImg, IonText, useIonRouter } from '@ionic/react'
import React from 'react'
import ImageUrlFormatter from '../../helpers/ImageUrlFormatter'
import FavoriteButton from '../Common/FavoriteButton'

const StrainCard = ({item}) => {

    const router = useIonRouter()

    const redir = (path) => {
		router.push(path)
    }

    return (
        <IonCard onClick={()=>redir(`/strains/${item.slug}`)} className='ion-no-margin' style={{height:'100%'}}>
            <FavoriteButton 
                collection='strains'
                _id={item._id}
            />
            <IonImg src={item.picture && item.picture.length > 0 ? ImageUrlFormatter(item.picture[0], 'full', 200, 200, false, false) : '/assets/images/default-pic.png'}></IonImg>
            <IonCardContent>
                <IonBadge>{item.type}</IonBadge><br />
                <IonText style={{fontSize:'16px', fontWeight:'600'}}>
                    {item.name}
                </IonText>
            </IonCardContent>
        </IonCard>
    )
}

export default StrainCard