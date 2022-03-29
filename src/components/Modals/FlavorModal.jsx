import { IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonModal, IonPage, IonProgressBar, IonTitle, IonToast, IonToolbar, useIonModal } from '@ionic/react'
import React, { useState, useEffect } from 'react'
import { effectsIcons, flavorsIcons } from '../../helpers/icons'
import { strainService } from '../../services/strain.service'
import TopToolbar from '../Common/TopToolbar'

const FlavorModal = (props) => {

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

export default FlavorModal

const Modal = (props) => {

    const stateInitialValue = {
        'ammonia': false,
        'apple': false,
        'apricot': false,
        'berry': false,
        'blue cheese': false,
        'blueberry': false,
        'cheese': false,
        'chemical': false,
        'chestnut': false,
        'citrus': false,
        'coffee': false,
        'diesel': false,
        'earthy': false,
        'flowery': false,
        'grape': false,
        'grapefruit': false,
        'honey': false,
        'lavender': false,
        'lemon': false,
        'lime': false,
        'mango': false,
        'mint': false,
        'nutty': false,
        'orange': false,
        'peach': false,
        'pear': false,
        'pepper': false,
        'pine': false,
        'pineapple': false,
        'plum': false,
        'pungent': false,
        'rose': false,
        'sage': false,
        'skunk': false,
        'herbal': false,
        'strawberry': false,
        'sweet': false,
        'tar': false,
        'tea': false,
        'tobacco': false,
        'tree fruit': false,
        'tropical': false,
        'vanilla': false,
        'woody': false,
    }

    const [ state, setState ] = useState(stateInitialValue);
    const [ actionsLoading, setActionsLoading ] = useState(false)

    
    const sendReport = () => {

        setActionsLoading(true)
        let payload = Object.keys(state).filter(x=>state[x]!=false)
        strainService.update('flavors', props.slug, payload)
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
                            <img className='icon-strain' style={{height:'80%'}} src={flavorsIcons[x.toLowerCase()]} ></img> &nbsp;
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