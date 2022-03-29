import { IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonItem, IonList, IonModal, IonProgressBar, IonTitle, IonToast, IonToolbar } from '@ionic/react'
import React, { useState } from 'react'
import { effectsIcons } from '../../helpers/icons'
import { strainService } from '../../services/strain.service'
import TopToolbar from '../Common/TopToolbar'

const FilterDaysModal = (props) => {

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
                                    color={x.current ? "primary" : ''}
                                    style={{textTransform:'capitalize'}}
                                    onClick={()=>{
                                        props.handleSelectedDay(x)
                                        props.setShowModal(false)
                                    }}
                                    lines='full'>
                                        {x.day}
                                    </IonItem>
                                )
                            }
                        </IonList>
                    )
                }
            </IonContent>
        </IonModal>
    )
}

export default FilterDaysModal