import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonItem, IonLabel, IonModal, IonPage, IonTitle, IonToast, IonToolbar, useIonModal } from '@ionic/react'
import React, { useState, useEffect } from 'react'
import TopToolbar from '../Common/TopToolbar'
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { receiptService } from '../../services/receipt.service';

const ReceiptModal = (props) => {

    const handleDismiss = () => {
        dismiss()
        setTimeout(() => {
            props.setShowModal(false)
        }, 500)
    }

    const [present, dismiss] = useIonModal(Modal, {
        ...props,
        setShowToast: props.setShowToast,
        onDismiss: handleDismiss
    });

    useEffect(() => {
        props.showModal && present();
    }, [props.showModal])
    
    return false
}
    
export default ReceiptModal

const Modal = (props) => {

    
    const [ actionsLoading, setActionsLoading ] = useState(false)
    const [ receiptUrl, setReceiptUrl ] = useState('')
    

    const selectImage = async (field) => {
       
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Base64,
            source: CameraSource.Prompt
        })

        if(image){
            setActionsLoading(true)
            const fileData = new FormData();
                fileData.append('file', 'data:image/'+image.format+';base64,'+image.base64String);
                fileData.append('upload_preset', 'spj28hqq'); // upload preset

                
            await fetch('https://api.Cloudinary.com/v1_1/timj111/image/upload', {
                method: 'post',
                body: fileData
              })
            .then(res => res.json())
            .then( res =>{
                setReceiptUrl(res.secure_url)
                setActionsLoading(false)
            }).catch(er => {
                setActionsLoading(false)
                props.setShowToast({
                    open: true,
                    type:'danger',
                    message:er.message
                })
            })
        } else {
            setActionsLoading(false)
            props.setShowToast({
                open: true,
                type:'danger',
                message:'Can not get image.'
            })
        }
    }

    const submitReceipt = async () => {
        try {
      
            setActionsLoading(true)
            await receiptService.create({
                dispensary: props.scopedDispensary._id,
                picture: receiptUrl
            })
            props.setShowToast({
                open: true,
                type:'success',
                message:'Receipt sent!'
            })
            props.onDismiss()
            setActionsLoading(false)
        } catch (err) {
            console.log(err)
        }
    }

    return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Upload Receipt</IonTitle>
                        <IonButtons slot="end">
                            <IonButton fill='clear'>
				        		<IonButton onClick={()=>props.onDismiss()}>Close</IonButton>
				            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent color='light'>
                    <IonCard>
                        <IonCardContent className='ion-no-padding'>
                            <IonItem lines='full'>
                                <IonAvatar slot='start'>
                                    <img src={props.scopedDispensary && props.scopedDispensary.logo ? props.scopedDispensary.logo : 'assets/images/default-pic.png'}></img>
                                </IonAvatar>
                                <IonLabel>
                                    <h2>{props.scopedDispensary.name}</h2>
                                    <span>
                                        <strong><small>{props.scopedDispensary.address}</small>,&nbsp;
                                        { props.scopedDispensary.address_line_2 && <small>{props.scopedDispensary.address_line_2}</small>}
                                        <small>{props.scopedDispensary.city.name} {props.scopedDispensary.city.state.name}, {props.scopedDispensary.addresszip}</small></strong>
                                    </span>
                                </IonLabel>
                            </IonItem>
                        </IonCardContent>
                        <IonCardContent style={{display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                         
                            <img style={{width:'40%', paddingTop:'1rem', paddingBottom:'1rem'}} src={receiptUrl ? receiptUrl : 'assets/images/receipt-svgrepo-com.svg'}></img>
                            <IonButton disabled={actionsLoading} onClick={()=>!receiptUrl ? selectImage('picture') : submitReceipt()} expand='full'>{ actionsLoading ? 'Loading...' : !receiptUrl ? 'Select photo' : 'Upload selected photo'}</IonButton>
                        </IonCardContent>
                    </IonCard>
                </IonContent>
            </IonPage>
            
    )
}
