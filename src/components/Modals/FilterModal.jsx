import { IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonItem, IonList, IonModal, IonProgressBar, IonTitle, IonToast, IonToolbar } from '@ionic/react'
import React, { useState } from 'react'
import { effectsIcons } from '../../helpers/icons'
import { strainService } from '../../services/strain.service'
import TopToolbar from '../Common/TopToolbar'

const FilterModal = (props) => {

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
                    props.settings && props.settings.items && props.settings.items.length > 0 && (
                        <IonList className='ion-no-padding' style={{
                            borderTop:'1px solid #cccccc', 
                            borderLeft:'1px solid #cccccc', 
                            borderRight:'1px solid #cccccc'
                        }}>
                            {
                                props.settings.items.map(x => <IonItem 
                                    color={props.filterString.includes(`&filterfield[]=${props.settings.field}&filtertype[]=${props.settings.type}&filtervalue[]=${x.value}`) ? "primary" : ''}
                                    onClick={()=>{
                                        props.filterer(`&filterfield[]=${props.settings.field}&filtertype[]=${props.settings.type}&filtervalue[]=${x.value}`, props.settings.multi)
                                        !props.settings.multi && props.setShowModal(false)
                                    }}
                                    lines='full'>
                                        {x.icon ? (
                                            <>{x.label.substr(0, x.label.indexOf(x.replaceWithIcon))}&nbsp;<IonIcon icon={x.icon}></IonIcon>&nbsp;{x.label.substr(x.label.indexOf(x.replaceWithIcon)+x.replaceWithIcon.length, x.label.length)}</>
                                        ) : x.label}
                                    </IonItem>
                                )
                            }
                        </IonList>
                    )
                }
            </IonContent>
            {
                props.settings.multi && <IonFooter collapse="fade">
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

export default FilterModal