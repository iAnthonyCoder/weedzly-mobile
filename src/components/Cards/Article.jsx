import { IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonImg, IonText, useIonRouter } from '@ionic/react'
import React from  'react'
import ImageUrlFormatter from '../../helpers/ImageUrlFormatter'
import './article.css'

const ArticleCard = ({
    item
}) => {

    const router = useIonRouter()

    const redir = (path) => {
		router.push(path)
    }
    
    return (
        <IonCard onClick={()=>redir('/library/'+item.slug)} className='ion-no-margin' style={{height:'100%', display:'flex', flexDirection:'column'}}>
            <img 
                src={item.picture ? ImageUrlFormatter(item.picture, 'full', 200, 200, false, false) : '/assets/images/default-pic.png'}
                style={{
                    objectFit: 'cover',
                    height:'150px'
                }}  
            />
            <IonCardHeader>
                <IonCardSubtitle className='subtitle'>
                    <IonBadge color="primary">{item.category.name}</IonBadge>
                    <IonText style={{fontSize:'12px'}}>{`${item.timeread} MIN READ`}</IonText>
                </IonCardSubtitle>
                <IonCardTitle className='title'>
                    {item.name}
                </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonText className='description'>
                    {item.metadata}
                </IonText>
            </IonCardContent>
        </IonCard>
    )
}

export default ArticleCard