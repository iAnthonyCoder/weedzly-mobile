import React, {useEffect, useState, useRef} from 'react'
import moment from 'moment';
import { IonContent, IonItem, IonList, IonListHeader, IonText } from '@ionic/react';

export default function HoursOfOperation({hoursofoperation, open, closeThis, currentDay}){
    
    const scheduleInitialValue = []
    const [ _schedule, setSchedule ] = useState(scheduleInitialValue)



    useEffect(() => {
        setSchedule(hoursofoperation);
    }, [hoursofoperation])


    return(
        <IonContent>
            <IonList style={{padding: '1rem'}}>
                {/* <IonListHeader>Hours of operation</IonListHeader> */}
                {
                    _schedule && Object.keys(_schedule).map( (x, i) => 
                        _schedule[x].isEnabled ? (
                            (x.toUpperCase()===currentDay.toUpperCase()) ? (
                                <IonItem lines="none" color='primary' style={{borderRadius:'5px', marginTop:'2px'}}>
                                    <IonText style={{width:'100%'}}>
                                        <small>
                                            <strong>{x.toUpperCase()}</strong>
                                        </small> 
                                    </IonText>
                                    <IonText>
                                        <small style={{marginLeft:'auto'}}>
                                            <strong>{`${moment.utc().startOf('day').add(_schedule[x].opens_at, 'minutes').format('h:mm A')} - ${moment.utc().startOf('day').add(_schedule[x].closes_at, 'minutes').format('h:mm A')}`}</strong>
                                        </small>
                                    </IonText>
                                </IonItem>
                            ) : (
                                <IonItem lines="none" color='' style={{borderRadius:'5px', marginTop:'2px'}}>
                                    <IonText style={{width:'100%'}}>
                                        <small>
                                            <strong>{x.toUpperCase()}</strong>
                                        </small>
                                    </IonText>
                                    <IonText>
                                        <small style={{marginLeft:'auto'}}>
                                            <strong>{`${moment.utc().startOf('day').add(_schedule[x].opens_at, 'minutes').format('h:mm A')} - ${moment.utc().startOf('day').add(_schedule[x].closes_at, 'minutes').format('h:mm A')}`}</strong>
                                        </small>
                                    </IonText>
                                </IonItem>
                            )
                        ) : (
                            <IonItem lines="none" color='' style={{ borderRadius:'5px', marginTop:'2px'}}>
                                <IonText style={{width:'100%'}}>
                                    <small>
                                        <strong>{x.toUpperCase()}</strong>
                                    </small>
                                </IonText>
                                <IonText>
                                    <small style={{marginLeft:'auto'}}>
                                        CLOSED
                                    </small>
                                </IonText>
                            </IonItem>
                        )
                        
                        
                    )
                }
            </IonList>
        </IonContent>
    )
}