import { IonBadge, IonItem, IonLabel, IonList, IonSpinner, IonText } from '@ionic/react'
import React, { useState, useEffect } from 'react'
import { calcDistance } from '../../../helpers/calcDistance'
import { brandService } from '../../../services/brand.service'
import CheckIfOpen from '../../../helpers/checkIfOpen'

const FindBrandRetailers = (props) => {

    const userLocation = JSON.parse(localStorage.getItem('myLocation'))
    const  [ actionsLoading, setActionsLoading ] = useState(false)
    const [ nearestRetailers, setNearestRetailers ] = useState([])

    const no_retailers = () => (<div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}} className='ion-margin-top ion-margin-bottom'>
        <img style={{width:'40%'}} src={'/assets/images/no-data.png'}></img><br />
        <h2 style={{marginTop:'0px'}}>No Retailers Found</h2>
        <IonText style={{textAlign:'center'}}>There are no retailers carrying <strong>{props.entity.name}</strong> products available near you</IonText><br/>
    </div>)

    const findNearRetailers = async () => {
        try {
            setActionsLoading(true)
            let result = await brandService.findRetailers(props.entity.slug, `?boundingRadius=80467.2&latitude=${userLocation.latitude}&longitude=${userLocation.longitude}`)
            setNearestRetailers(result.totalData)
            setActionsLoading(false)
        } catch (er) {
            console.log(er)
        }
    }

    useEffect(() => {
        findNearRetailers()
    }, [props.entity])

    const getDistance = (coordinates) => {

        
        let distance = calcDistance(coordinates, [userLocation.longitude, userLocation.latitude])

        return distance
    }

    if(actionsLoading) return <div className='ion-margin-top ion-margin-bottom' style={{display:'flex', justifyContent:'center'}}>
        <IonSpinner name="crescent" />
    </div>

    return (
        nearestRetailers.length > 0 ? (
            <IonList>
                {
                    nearestRetailers.map((x, i) => <IonItem key={i}>
                        <IonLabel>
                            <h2><strong>{x.name}</strong></h2>
                            <h3><strong>{getDistance(x.location.coordinates).toFixed(1)}</strong> miles away</h3>
                            <div className='d-flex pt-2'>
                                {
                                    x.isOnlineOrderingEnabled && <IonBadge style={{marginRight:'5px'}}>Online Ordering</IonBadge>
                                }
                                {
                                    (CheckIfOpen(x.hoursofoperation, x.TZ).isOpen) ? (
                                        <IonBadge>Open now</IonBadge>
                                    ) : (
                                        <IonBadge color='danger'>Closed now</IonBadge>
                                    )
                                }
                            </div>
                        </IonLabel>
                    </IonItem>)
                }
                
            </IonList>
        ) : (
            no_retailers()
        )
    )
}

export default FindBrandRetailers