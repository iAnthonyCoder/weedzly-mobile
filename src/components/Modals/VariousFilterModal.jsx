import { IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonItem, IonList, IonModal, IonProgressBar, IonTitle, IonToast, IonToolbar } from '@ionic/react'
import React, { useState } from 'react'
import { effectsIcons } from '../../helpers/icons'
import { strainService } from '../../services/strain.service'
import TopToolbar from '../Common/TopToolbar'

const VariousFilterModal = (props) => {

    const [ actionsLoading, setActionsLoading ] = useState(false)

    return (
        <IonModal isOpen={props.showModal} swipeToClose={true}>
            <IonHeader>
                {
                    actionsLoading && <IonProgressBar type="indeterminate"></IonProgressBar>
                }
                <IonToolbar>
                    <IonTitle>{props.title}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton fill='clear'>
				    		<IonButton onClick={()=>props.setShowModal(false)}>Close</IonButton>
				        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
        
            <IonContent className='ion-padding'>
                {
                    props.settings && props.settings.length > 0 && (
                        <IonList className='ion-no-padding' style={{
                            borderTop:'1px solid #cccccc', 
                            borderLeft:'1px solid #cccccc', 
                            borderRight:'1px solid #cccccc'
                        }}>
                            {
                                props.settings.map(x => <IonItem 
                                    color={props.filterString.includes(`&filterfield[]=${x.field}&filtertype[]=${x.type}&filtervalue[]=${x.value}`) ? "primary" : ''}
                                    onClick={()=>{
                                        props.filterer(`&filterfield[]=${x.field}&filtertype[]=${x.type}&filtervalue[]=${x.value}`)
                                    }}
                                    lines='full'>
                                        {x.label}
                                    </IonItem>
                                )
                            }
                        </IonList>
                    )
                }       
            </IonContent>
            {
                <IonFooter collapse="fade">
                    <IonToolbar className='ion-padding-start ion-padding-end'>
                        <IonButton onClick={()=>props.setShowModal(false)} fill='outline' color='secondary' expand='block' >
                            Done
                        </IonButton>
                    </IonToolbar>
                </IonFooter>
            }
        </IonModal>
    )
}

export default VariousFilterModal