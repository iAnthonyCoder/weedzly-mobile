
import { IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonModal, IonPage, IonProgressBar, IonTitle, IonToast, IonToolbar, useIonModal } from '@ionic/react'
import React, { useState, useEffect } from 'react'
import { effectsIcons } from '../../helpers/icons'
import { strainService } from '../../services/strain.service'
import TopToolbar from '../Common/TopToolbar'

const FeelingModal = (props) => {


    const handleDismiss = () => {
        dismiss()
        setTimeout(() => {
            props.setShowModal(false)
        }, 500)
    }

    const [present, dismiss] = useIonModal(Modal, {
        slug: props.slug,
        setShowToast: props.setShowToast,
        onDismiss: handleDismiss
    });

    useEffect(() => {
        props.showModal && present();
    }, [props.showModal])
    
    return false
}

export default FeelingModal


const Modal = (props) => {
    
    const stateInitialValue = {
        aroused: false,
        creative: false ,
        energetic: false ,
        euphoric: false ,
        focused: false ,
        giggly: false ,
        happy: false ,
        hungry: false ,
        relaxed: false ,
        sleepy: false ,
        talkative: false ,
        tingly: false ,
        uplifted: false 
    }

    const [ state, setState ] = useState(stateInitialValue);
    const [ actionsLoading, setActionsLoading ] = useState(false)

    
    const sendReport = () => {

        setActionsLoading(true)
        let payload = Object.keys(state).filter(x=>state[x]!=false)
        strainService.update('effects', props.slug, payload)
            .then(response => 
                {
                    props.setShowToast({
                        open: true,
                        type:'success',
                        message:'Report sent'
                    })
                    setState(stateInitialValue)
                    setActionsLoading(false)
                    props.onDismiss()
                }
            )
            .catch(error =>{ 
                props.setShowModal(false)
                props.setShowToast({
                    open: true,
                    type: 'warning',
                    message: error.message
                })
                setActionsLoading(false)
            })
    }

    return (
        <IonPage>
            <IonHeader>
                {
                    actionsLoading && <IonProgressBar type="indeterminate"></IonProgressBar>
                }
                <IonToolbar>
                    <IonTitle>Report new feeling</IonTitle>
                    <IonButtons slot="end">
                        <IonButton fill='clear'>
                            <IonButton onClick={()=>props.onDismiss()}>Close</IonButton>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className='ion-padding'>
                {
                    Object.keys(state).map((x, i) => 
                        <IonButton 
                            key={i}
                            onClick={(e)=>{setState({...state, [x]:!state[x] })}} 
                            expand='block' 
                            color={state[x] ? 'primary' : 'medium'}
                            fill={state[x] ? 'solid' : 'outline'}
                        >
                            <img className='icon-strain' style={{height:'80%'}} src={effectsIcons[x.toLowerCase()]} ></img> &nbsp;
                            {x}
                        </IonButton>
                    )
                }
            </IonContent>
            <IonFooter collapse="fade">
                <IonToolbar className='ion-padding-start ion-padding-end'>
                    <IonButton onClick={()=>sendReport()} fill='outline' color='secondary' expand='block' disabled={!Object.keys(state).some(x => state[x]) || actionsLoading}>
                        Send
                    </IonButton>
                </IonToolbar>
            </IonFooter>
        </IonPage>
    )
}