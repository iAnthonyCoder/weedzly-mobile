import { IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonItem, IonList, IonModal, IonProgressBar, IonTitle, IonToast, IonToolbar } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import { effectsIcons } from '../../helpers/icons'
import { strainService } from '../../services/strain.service'
import TopToolbar from '../Common/TopToolbar'

const FilterPriceModal = (props) => {

    const [ actionsLoading, setActionsLoading ] = useState(false)
    const [ currentValue, setCurrentValue ] = useState('')
    const [ lastValue, setLastValue ] = useState('')
    const [ currentIndex, setCurrentIndex ] = useState(null)

    useEffect(() => {
        if(currentValue.length > 0){
            if(currentValue === lastValue){
                props.filterer(currentValue)
            } else {
                props.filterer(currentValue, false, lastValue)
            }
        }
        
    }, [currentValue]);
    

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
                                props.settings.items.map((x, i) => <IonItem 
                                    color={i === currentIndex ? 'primary' : ''}
                                    onClick={()=>{
                                        
                                        
                                        if(i === currentIndex){
                                            props.filterer(currentValue)
                                            setCurrentIndex(null)
                                            setCurrentValue(``)
                                            setLastValue(``)
                                        } else {
                                            setLastValue(currentValue)
                                            setCurrentIndex(i)
                                        }
                                        if(x.type==='range'){
                                            setCurrentValue(`&filterfield[]=${props.settings.field}&filtertype[]=gte&filtervalue[]=${x.value[0]}&filterfield[]=${props.settings.field}&filtertype[]=lte&filtervalue[]=${x.value[1]}`)
                                        } else {
                                            setCurrentValue(`&filterfield[]=${props.settings.field}&filtertype[]=${x.type}&filtervalue[]=${x.value}`)
                                        }
                                        props.setShowModal(false)
                                    }}
                                    // lines='full'
                                >
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

export default FilterPriceModal