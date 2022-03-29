import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonLabel, IonModal, IonPage, IonTitle, IonToast, IonToolbar, useIonModal } from '@ionic/react'
import React, { useState, useEffect } from 'react'
import TopToolbar from '../Common/TopToolbar'
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { receiptService } from '../../services/receipt.service';
import moment from 'moment';
import { add } from 'ionicons/icons';

const CheckReceiptModal = (props) => {

    const Modal = (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>View Receipt</IonTitle>
                    <IonButtons slot="end">
			        	<IonButton fill='clear' onClick={()=>dismiss()}>Close</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent color='light'>
                <IonCard>
                    <IonCardContent className='ion-no-padding'>
                        <IonItem lines='full'>
                            <IonAvatar slot='start'>
                                <img src={props.scopedDispensary.dispensary && props.scopedDispensary.dispensary.logo ? props.scopedDispensary.dispensary.logo : 'assets/images/default-pic.png'}></img>
                            </IonAvatar>
                            <IonLabel>
                                <h2>{props.scopedDispensary.dispensary.name}</h2>
                                <span>
                                    <strong><small>{props.scopedDispensary.dispensary.address}</small>
                                    { props.scopedDispensary.dispensary.address_line_2 && <small>,&nbsp;{props.scopedDispensary.dispensary.address_line_2}</small>}
                                    <small> ({props.scopedDispensary.dispensary.addresszip})</small></strong>
                                </span>
                            </IonLabel>
                        </IonItem>
                    </IonCardContent>
                    <IonCardContent style={{display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                     
                        <img style={{width:'100%', paddingTop:'1rem', paddingBottom:'1rem'}} src={props.scopedDispensary.picture ? props.scopedDispensary.picture : 'assets/images/receipt-svgrepo-com.svg'}></img>
                        <small>Uploaded {moment(props.scopedDispensary.createdAt).fromNow()}</small>
                    </IonCardContent>
                </IonCard>
                
            </IonContent>
        </IonPage>
    )

    const [present, dismiss] = useIonModal(Modal, {
        onDismiss: setTimeout(() => {
            props.setShowModal(false)
        }, 500)
    });

    useEffect(() => {
        props.showModal && present();
    }, [props.showModal])
    
    return false
}

export default CheckReceiptModal