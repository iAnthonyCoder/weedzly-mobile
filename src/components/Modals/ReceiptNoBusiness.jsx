import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonItem, IonLabel, IonList, IonModal, IonPage, IonRouterLink, IonSearchbar, IonTitle, IonToast, IonToolbar, useIonModal, useIonRouter } from '@ionic/react'
import React, { useState, useRef, useEffect } from 'react'
import TopToolbar from '../Common/TopToolbar'
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { receiptService } from '../../services/receipt.service';
import { dispensaryService } from '../../services';
import _ from 'lodash';
import FullSpinner from '../Common/FullSpinner';

const ReceiptNoBusinessModal = (props) => {

    const router = useIonRouter()

    const handleDismiss = () => {
        dismiss()
        setTimeout(() => {
            props.setShowModal(false)
        }, 500)
    }

    const [present, dismiss] = useIonModal(Modal, {
        ...props,
        onDismiss: handleDismiss,
        router:router
    });

    useEffect(() => {
        props.showModal && present();
    }, [props.showModal])
    
    return false
}

export default ReceiptNoBusinessModal

const Modal = (props) => {

    const [ actionsLoading, setActionsLoading ] = useState(false)
    const [ receiptUrl, setReceiptUrl ] = useState('')
    const [ scopedDispensary, setScopedDispensary ] = useState({})
    const [ search, setSearch ] = useState('')
    const [ data, setData ] = useState([])
    const searchInput = useRef()

    //&filterfield[]=subscriptionFeatures.loyalty&filtertype[]=eq&filtervalue[]=true

    const searchBusiness = async (value) => {

        try { 
            setActionsLoading(true)
            let res = await dispensaryService.getAll(`?page=0&size=10&search=${value}&filterfield[]=subscriptionFeatures.loyalty&filtertype[]=eq&filtervalue[]=true`)
            setData(res.totalData);
            setActionsLoading(false)
        } catch (er) {
            console.log(er);
        }
    }

    useEffect(() => {
        console.log('asdasdasd')
        if(search.length > 0) {
            searchBusiness(search)
        }
    }, [search])
    

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
                dispensary: scopedDispensary._id,
                picture: receiptUrl
            })
            props.setShowToast({
                open: true,
                type:'success',
                message:'Receipt sent!'
            })
            props.setShowModal(false)
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
                        <IonItem lines={!_.isEmpty(scopedDispensary) ? 'full' : data.length > 0 ? 'full' : 'none'}>
                            


                            {
                                _.isEmpty(scopedDispensary) ? (
                                    <div style={{display:'flex', flexDirection:'column', marginTop:'1rem', marginBottom:'1rem'}}>
                                        <span>
                                            Search and select the business where you got the receipt from 
                                            <IonRouterLink onClick={()=>{
                                                props.setSelectedSegment('orders')
                                                props.onDismiss()
                                            }}>
                                                &nbsp;or go through your recent orders
                                            </IonRouterLink>
                                        </span>
                                        
                                        <IonSearchbar ref={searchInput} debounce='1000' value={search} onIonChange={(e) => setSearch(e.target.value)}></IonSearchbar>
                                    </div>
                                ) : (
                                    <>
                                        <IonAvatar slot='start'>
                                            <img src={scopedDispensary && scopedDispensary.logo ? scopedDispensary.logo : 'assets/images/default-pic.png'}></img>
                                        </IonAvatar>
                                        <IonLabel>
                                            <h2>{scopedDispensary.name}</h2>
                                            <span>
                                                <strong><small>{scopedDispensary.address}</small>,&nbsp;
                                                { scopedDispensary.address_line_2 && <small>{scopedDispensary.address_line_2}</small>}
                                                <small>{scopedDispensary.city.name} {scopedDispensary.city.state.name}, {scopedDispensary.addresszip}</small></strong>
                                            </span><br/>
                                            <div>
                                                <IonButton onClick={()=>{
                                                    setSearch('')
                                                    setScopedDispensary({})
                                                    setData([])
                                                }} color='danger' size='small'>Search again</IonButton>
                                            </div>
                                        </IonLabel>
                                    </>
                                )
                            }

                            
                        </IonItem>
                    </IonCardContent>
                    <IonCardContent>
                        {
                            actionsLoading ? (
                                <FullSpinner />
                            ) : _.isEmpty(scopedDispensary) ? (
                                <IonList style={{width:'100%'}}>
                                    {
                                        data.length > 0 && data.map(x => <IonItem onClick={()=>setScopedDispensary(x)}>
                                            <IonAvatar slot='start'>
                                                <img src={x.logo && x.logo.length > 0 ? x.logo : 'assets/images/default-pic.png'}></img>
                                            </IonAvatar>
                                            <IonLabel>
                                                <span>{x.name}</span><br/>
                                                <small>{x.address}, {x.city.name} ({x.addresszip}), {x.city.state.name}</small>
                                            </IonLabel>
                                        </IonItem>)
                                    }
                                </IonList>
                            
                            ) : (
                                <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center'}}>
                                    <img style={{width:'40%', paddingTop:'1rem', paddingBottom:'1rem'}} src={receiptUrl ? receiptUrl : 'assets/images/receipt-svgrepo-com.svg'}></img>
                                    <IonButton expand='block' disabled={actionsLoading} onClick={()=>!receiptUrl ? selectImage('picture') : submitReceipt()} expand='full'>{ actionsLoading ? 'Loading...' : !receiptUrl ? 'Select photo' : 'Upload selected photo'}</IonButton>
                                </div>
                            )
                        }
                     </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
        
   
    )

}