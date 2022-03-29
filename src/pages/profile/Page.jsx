import { IonContent, IonHeader, IonLabel, IonPage, IonSegment, IonSegmentButton } from '@ionic/react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import TopToolbar from '../../components/Common/TopToolbar'
import Favorites from './Favorites'
import Nugs from './nugs/Page'
import ProfileOrders from './orders/Page'

import './Page.css'
import Receipts from './receipts/Page'
import ProfileReviews from './Reviews'

const Profile = () => {

    const user = useSelector(state => state.user)
    const [ selectedSegment, setSelectedSegment ] = useState('favorites')

    
    

    const sections = () => {
        {
            switch (selectedSegment) {
                case 'favorites':
                    return <Favorites />
                    break;

                case 'points':
                    return <Nugs setSelectedSegment={setSelectedSegment} />
                    break;

                case 'receipts':
                    return <Receipts setSelectedSegment={setSelectedSegment} />
                    break;

                case 'orders':
                    return <ProfileOrders />
                    break;

                break;

                case 'reviews':
                    return <ProfileReviews />
                    break;
            
                default:
                    break;
            }
        }

    }

    return (
        <IonPage>
            <IonHeader id='headx'>
                <TopToolbar
                    title={user.nickname}
                    disableSearch={true}
                    enableBackButton={true}
                />
                <IonSegment style={{backgroundColor:'white'}} scrollable={true} value={selectedSegment}>
                    <IonSegmentButton onClick={()=>setSelectedSegment('favorites')} value="favorites">
        		  	  	<IonLabel>Favorites</IonLabel>
        		  	</IonSegmentButton>
        		  	<IonSegmentButton onClick={()=>setSelectedSegment('points')} value="points">
        		  	  	<IonLabel>Nugs Balance</IonLabel>
        		  	</IonSegmentButton>
                    <IonSegmentButton onClick={()=>setSelectedSegment('receipts')} value="receipts">
        		  	  	<IonLabel>Receipts</IonLabel>
        		  	</IonSegmentButton>
                    <IonSegmentButton onClick={()=>setSelectedSegment('orders')} value="orders">
        		  	  	<IonLabel>Orders</IonLabel>
        		  	</IonSegmentButton>
                    <IonSegmentButton onClick={()=>setSelectedSegment('reviews')} value="reviews">
        		  	  	<IonLabel>Reviews</IonLabel>
        		  	</IonSegmentButton>
                </IonSegment>
            </IonHeader>
            <IonContent>
                {
                    sections()
                }
            </IonContent>
        </IonPage>
    )
}

export default Profile