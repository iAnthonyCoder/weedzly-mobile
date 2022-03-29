import { IonButton, IonButtons, IonChip, IonContent, IonFooter, IonHeader, IonIcon, IonItem, IonList, IonModal, IonProgressBar, IonRange, IonTitle, IonToast, IonToolbar } from '@ionic/react'
import { close } from 'ionicons/icons'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { effectsIcons } from '../../helpers/icons'
import { strainService } from '../../services/strain.service'
import TopToolbar from '../Common/TopToolbar'

const FilterRangeModal = (props) => {

    const currentValueInitialState = {lower:0, upper:100}
    const [ actionsLoading, setActionsLoading ] = useState(false)
    const [ currentValue, setCurrentValue ] = useState(currentValueInitialState)
    const [ lastValue, setLastValue ] = useState(null)
    const [ currentIndex, setCurrentIndex ] = useState(null)

    // useEffect(() => {
    //     if(currentValue.length > 0){
    //         if(currentValue === lastValue){
    //             props.filterer(currentValue)
    //         } else {
    //             props.filterer(currentValue, false, lastValue)
    //         }
    //     }
        
    // }, [currentValue]);

    const setSelectedFilter = () => {
        if(currentValue.lower === 0 && currentValue.upper === 100 && !_.isEmpty(lastValue)){
            props.filterer(`&filterfield[]=${props.settings.field}&filtertype[]=gte&filtervalue[]=${lastValue.lower}&filterfield[]=${props.settings.field}&filtertype[]=lte&filtervalue[]=${lastValue.upper}`)
        } else if(!lastValue){
            props.filterer(`&filterfield[]=${props.settings.field}&filtertype[]=gte&filtervalue[]=${currentValue.lower}&filterfield[]=${props.settings.field}&filtertype[]=lte&filtervalue[]=${currentValue.upper}`)
        } else {
            props.filterer(`&filterfield[]=${props.settings.field}&filtertype[]=gte&filtervalue[]=${currentValue.lower}&filterfield[]=${props.settings.field}&filtertype[]=lte&filtervalue[]=${currentValue.upper}`, false, `&filterfield[]=${props.settings.field}&filtertype[]=gte&filtervalue[]=${lastValue.lower}&filterfield[]=${props.settings.field}&filtertype[]=lte&filtervalue[]=${lastValue.upper}`)
        }
        props.setShowModal(false)
        setLastValue(currentValue)
    }
    

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
                    props.settings.type === 'range' && (<>
                        <div style={{width:'100%', display:'flex', justifyContent:'space-between', paddingLeft:'5px', paddingRight:'5px'}}>
                            <IonChip onClick={()=>setCurrentValue({lower:0, upper:currentValue.upper})}>Min: {currentValue.lower}<IonIcon icon={close}></IonIcon></IonChip>
                            <IonChip onClick={()=>setCurrentValue({lower:currentValue.lower, upper:100})}>Max: {currentValue.upper}<IonIcon icon={close}></IonIcon></IonChip>
                        </div>
                        <IonRange value={currentValue} dualKnobs={true} min={0} max={100} step={1} pin={true} snaps={false} onIonChange={e => {
                         
                            setCurrentValue(e.detail.value)
                        }} />
                        <div style={{width:'100%', display:'flex', justifyContent:'space-between', paddingLeft:'5px', paddingRight:'5px'}}>
                            <small>0%</small><small>100%</small>
                            
                        </div>
                        <br />
                        <IonButton expand='full' onClick={()=>{
                            setCurrentValue(currentValueInitialState)
                        }}>Reset</IonButton>
                    </>) 
                    
                }
            </IonContent>
            {
                <IonFooter collapse="fade">
                    <IonToolbar className='ion-padding-start ion-padding-end'>
                        <IonButton onClick={()=>{
                            setSelectedFilter()
                        }} fill='outline' color='secondary' expand='block' >
                            Done
                        </IonButton>
                    </IonToolbar>
                </IonFooter>
            }
        </IonModal>
    )
}

export default FilterRangeModal