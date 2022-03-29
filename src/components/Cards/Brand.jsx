import { IonCard, IonCardContent, IonImg, IonText, useIonRouter } from '@ionic/react'
import React from  'react'
import ImageUrlFormatter from '../../helpers/ImageUrlFormatter'
import FavoriteButton from '../Common/FavoriteButton'

const BrandCard = ({
    item
}) => {

    const router = useIonRouter()

    return (
        <IonCard onClick={()=>router.push(`/brands/${item.slug}`)} className='ion-no-margin' style={{height:'100%', width:'100%'}}>
            <div style={{position:'absolute', right:'0', top:'0'}}>
                <FavoriteButton 
                    collection={'brands'}
                    _id={item._id}
                />
            </div>
            <img 
                style={{
                    height: '100%',
                    width:'100%',
                    objectFit: 'cover'
                }} 
                src={item.logo ? ImageUrlFormatter(item.logo, 'full', 200, 200, false, false) : '/assets/images/default-pic.png'} 
            />
            <div style={{ position:'absolute', bottom:'0', backgroundColor:'rgba(0,0,0,0.75)', width:'100%', display:'flex', paddingTop:'3px', paddingBottom:'3px'}}>
                <IonText color='light' className='ion-text-center' style={{width:'100%', fontSize:'16px'}}>
                    {
                        item.name
                    }
                </IonText>
            </div>
        </IonCard>
    )
}

export default BrandCard