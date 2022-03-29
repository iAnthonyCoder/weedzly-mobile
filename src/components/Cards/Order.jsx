import { IonAvatar, IonBadge, IonButton, IonCard, IonCardContent, IonCardHeader, IonImg, IonItem, IonLabel, IonList, IonText, useIonRouter } from '@ionic/react'
import moment from 'moment'
import React from  'react'
import { useDispatch } from 'react-redux'
import ImageUrlFormatter from '../../helpers/ImageUrlFormatter'
import { updateModalStatus } from '../../store/actions'
import FavoriteButton from '../Common/FavoriteButton'
import './Order.css'

const OrderCard = ({
    item,
    setShowReceiptModal,
    setScopedDispensary
}) => {

    const router = useIonRouter()
    const dispatch = useDispatch()

    const statusCustomizer = (status) => {
        switch (status) {
            case 'PENDING':
                return <>
                    <div style={{display:'flex'}}>
                        <div className='dot dot-yellow'></div>
                        <IonText style={{fontSize:'15px'}}><strong>Ordered {moment(item.createdAt).format('MM-DD-YYYY')} at {item.dispensary.name}</strong></IonText>
                    </div>
                    <IonText style={{fontSize:'15px', marginLeft:'16px'}}><strong>Order #{item.number} - Pending</strong></IonText>
                </>
                break;

            case 'ACCEPTED':
                return <>
                    <div style={{display:'flex'}}>
                        <div className='dot dot-blue'></div>
                        <IonText style={{fontSize:'15px'}}><strong>Ordered {moment(item.createdAt).format('MM-DD-YYYY')} at {item.dispensary.name}</strong></IonText>
                    </div>
                    <IonText style={{fontSize:'15px', marginLeft:'16px'}}><strong>Order #{item.number} - Processing</strong></IonText>
                </>
                break;  

            case 'REJECTED':
                return <>
                    <div style={{display:'flex'}}>
                        <div className='dot dot-red'></div>
                        <IonText style={{fontSize:'15px'}}><strong>Ordered {moment(item.createdAt).format('MM-DD-YYYY')} at {item.dispensary.name}</strong></IonText>
                    </div>
                    <IonText style={{fontSize:'15px', marginLeft:'16px'}}><strong>Order #{item.number} - Rejected</strong></IonText>
                </>
                break;
                
            case 'READY':
                return <>
                    <div style={{display:'flex'}}>
                        <div className='dot dot-green'></div>
                        <IonText style={{fontSize:'15px'}}><strong>Ordered {moment(item.createdAt).format('MM-DD-YYYY')} at {item.dispensary.name}</strong></IonText>
                    </div>
                    <IonText style={{fontSize:'15px', marginLeft:'16px'}}><strong>Order #{item.number} - Ready for pickup</strong></IonText>
                </>
                break; 
            
            case 'DISPATCHED':
                return <>
                    <div style={{display:'flex'}}>
                        <div className='dot dot-green'></div>
                        <IonText style={{fontSize:'15px'}}><strong>Ordered {moment(item.createdAt).format('MM-DD-YYYY')} at {item.dispensary.name}</strong></IonText>
                    </div>
                    <IonText style={{fontSize:'15px', marginLeft:'16px'}}><strong>Order #{item.number} - Dispatched</strong></IonText>
                </>
                break;
            
            case 'COMPLETED':
                return <>
                    <div style={{display:'flex'}}>
                        <div className='dot dot-purple'></div>
                        <IonText style={{fontSize:'15px'}}><strong>Ordered {moment(item.createdAt).format('MM-DD-YYYY')} at {item.dispensary.name}</strong></IonText>
                    </div>
                    <IonText style={{fontSize:'15px', marginLeft:'16px'}}><strong>Order #{item.number} - Completed</strong></IonText>
                </>
                break;
        
            case 'CANCELED':
                return <>
                    <div style={{display:'flex'}}>
                        <div className='dot dot-red'></div>
                        <IonText style={{fontSize:'15px'}}><strong>Ordered {moment(item.createdAt).format('MM-DD-YYYY')} at {item.dispensary.name}</strong></IonText>
                    </div>
                    <IonText style={{fontSize:'15px', marginLeft:'16px'}}><strong>Order #{item.number} - Canceled</strong></IonText>
                </>
                break;
            
            default:
                break;
        }
    }

    return (
        <IonCard className='ion-no-margin' style={{height:'100%', width:'100%'}}>
            <IonCardHeader style={{backgroundColor:'rgb(241 241 241)', borderBottom:'1px solid rgb(225 225 225)'}}>
                {statusCustomizer(item.status)}     
            </IonCardHeader>
         
            <IonCardContent className='ion-no-padding'>
                <IonList >
                    {
                        item.productorders.map((x, i) => <IonItem key={i} lines={i === item.productorders.length-1 ? 'none' : 'full'}>
                            <IonAvatar slot='start'>
                         
                                <IonImg
                                    src={x.picture ? ImageUrlFormatter(x.picture, 'full', 50, 50, false, false) : '/assets/images/default-pic.png'}
                                ></IonImg>
                            </IonAvatar>
                            <IonLabel>
                                {x.productName}
                            </IonLabel>
                        </IonItem>)
                    }
                </IonList>
            </IonCardContent>
            <div style={{backgroundColor:'rgb(241 241 241)', borderTop:'1px solid rgb(225 225 225)', padding:'16px'}}>
                <IonButton expand='full' onClick={()=>router.push(`/profile/orders/${item._id}`)}>
                    View Details
                </IonButton>
                <IonButton color='success' onClick={()=>{
                    setShowReceiptModal(true)
                    setScopedDispensary(item.dispensary)
                }} expand='full' style={{marginTop:'10px'}}>
                    Upload receipt and get nugs
                </IonButton>
                
            </div>
            {/* <div style={{position:'absolute', right:'0', top:'0'}}>
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
                src={item.logo} 
            />
            <div style={{ position:'absolute', bottom:'0', backgroundColor:'rgba(0,0,0,0.75)', width:'100%', display:'flex', paddingTop:'3px', paddingBottom:'3px'}}>
                <IonText color='light' className='ion-text-center' style={{width:'100%', fontSize:'16px'}}>
                    {
                        item.name
                    }
                </IonText>
            </div> */}
        </IonCard>
    )
}

export default OrderCard