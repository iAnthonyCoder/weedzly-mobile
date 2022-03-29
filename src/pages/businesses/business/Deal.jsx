import { IonAvatar, IonBadge, IonButton, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonPage, IonText, IonToolbar, useIonPopover, useIonRouter } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import FullSpinner from '../../../components/Common/FullSpinner'
import TopToolbar from '../../../components/Common/TopToolbar'
import { MY_LOCATION } from '../../../helpers/constants'
import { dispensaryService } from '../../../services'
import { dealService } from '../../../services/deal.service'
import cookie from 'js-cookie'
import * as turf from "@turf/turf";
import CheckIfOpen from '../../../helpers/time'
import { dealsTagetAudiences } from '../../../helpers/dealsFeatures'
import { document, documentOutline, ellipsisVertical, ellipsisVerticalOutline, heart, heartOutline, information, informationCircle, informationCircleOutline, share, shareOutline, shareSocial, shareSocialOutline } from 'ionicons/icons'
import moment from 'moment'
import FavoriteButton from '../../../components/Common/FavoriteButton'
import _ from 'lodash'
import { GetDirectionsModal } from '../../../components/Modals/GetDirections'

const DealPage = (props) => {

    const itemInitialState = {}
    const actionsLoadingInitialState = true
    const [deal, setDeal] = useState(itemInitialState)
    const [dispensary, setDispensary] = useState(itemInitialState)
    const [actionsLoading, setActionsLoading] = useState(actionsLoadingInitialState)
    const [ showGetDirectionsModal, setShowGetDirectionsModal ] = useState(false)

    const router = useIonRouter()

    const redir = (path) => {
		router.push(path)
    }

    const [present, dismiss] = useIonPopover(
        <ion-list>
            <ion-item button onClick={
                !_.isEmpty(dispensary) 
                    ?   ()=>{
                            window.open(`https://www.google.com/maps/dir/?api=1&origin=${JSON.parse(localStorage.getItem(MY_LOCATION)).latitude},${JSON.parse(localStorage.getItem(MY_LOCATION)).longitude}&destination=${dispensary.location.coordinates[1]},${dispensary.location.coordinates[0]}`, '_system', 'location=yes'); 
                            return false;
                        }
                    :   ''
            }>Google Directions</ion-item>
            <ion-item button onClick={()=>{setShowGetDirectionsModal(true)}}>Routes</ion-item>
            <ion-item lines="none" detail="false" onClick={() => {
                if(!_.isEmpty(dispensary)){
                    redir(`/businesses/profile/${dispensary.slug}#deals`)
                    dismiss()
                }  else {
                   
                }
            }} button>More Deals</ion-item>
          </ion-list>, {
            onHide: () => dismiss(),
        }
    );

    const [present3, dismiss3] = useIonPopover(
            <section>
                <span><strong>Info</strong></span><br/>
                <small>
                    {deal.terms}
                </small>
            </section>, {
            onHide: () => dismiss(),
        }
    );

    const [present2, dismiss2] = useIonPopover(
            <section>
                <span><strong>Terms</strong></span><br/>
                <small>
                    This advertisement is simply for user reference only. It has no value and is not intended to be exchanged for any product. All state and local laws and restrictions apply to all advertisements. Weedzly is not responsible for the accuracy of any advertisement.  To ensure accuracy, you may call the business and get more information regarding this 
                    advertisement. This advertisement is only intended to be viewed by those of legal age and in the state/local area where the product is legally open for sale. Void where prohibited.
                </small>
            </section>, {
            onHide: () => dismiss(),
        }
    );

    const getDeal = async () => {

        try {
            setActionsLoading(true)
            const [ _deal, _dispensary ] = await Promise.all([
                dealService.getBySlug(props.match.params.businessSlug, props.match.params.dealSlug),
                dispensaryService.getDetailsPage(props.match.params.businessSlug), 
            ])
            setDeal(_deal);
            setDispensary(_dispensary)
            setActionsLoading(false)
        } catch (er) {

            console.log(er);

        }

    }

    useEffect(() => {
        getDeal()
    }, [props])

    const checkIfExpired = (date) => {
        const end = moment(date);
        const start = moment();
        const diff = end.diff(start)
        if(diff<0){
            return true
        } else {
            return false
        }
    }
    

    return (
        <IonPage>
            {
                showGetDirectionsModal && !_.isEmpty(dispensary) && <GetDirectionsModal  
                    entity={dispensary}
                    showModal = {showGetDirectionsModal}
                    setShowModal = {setShowGetDirectionsModal}
                />
            }
            <IonHeader>
                <TopToolbar 
                    enableBackButton={true}
                    disableSearch={true}
                    title={actionsLoading ? 'Loading...' : deal.name}
                />
                {
                    !actionsLoading && <IonToolbar style={{paddingLeft:'16px', paddingRight:'16px', display:'flex', alignItems:'center', paddingTop:'8px', paddingBottom:'8px'}}>
                        <IonAvatar slot='start'>
                                <img src={dispensary.logo} />
                        </IonAvatar>
                        <div style={{marginLeft:'16px'}}>
                            <IonText color='dark'>
                                <h6 style={{marginTop:'0px', marginBottom:'0px', color:'#4f4f4f'}}>
                                    <strong>
                                        {dispensary.name}
                                    </strong>
                                </h6>
                            </IonText>
                            <IonText color='medium'>
                                <strong>
                                    <small>
                                        {
                                            dispensary.isMedical && dispensary.isRecreational 
                                                ? 'Medical & recreational' 
                                                : dispensary.isMedical
                                                ? 'Medical'
                                                : dispensary.isRecreational
                                                ? 'Recreational'
                                                : 'Recreational'
                                        }
                                    </small>
                                </strong>
                            </IonText>
                            <div style={{marginTop:'5px'}}>
                                <IonBadge>
                                    {
                                        turf.distance(
                                            {
                                                "type": "Feature",
                                                "properties": {},
                                                "geometry": {
                                                    "type": "Point",
                                                    "coordinates": [JSON.parse(localStorage.getItem(MY_LOCATION)).longitude, JSON.parse(localStorage.getItem(MY_LOCATION)).latitude]
                                                }
                                            }, 
                                            {
                                                "type": "Feature",
                                                "properties": {},
                                                "geometry": {
                                                    "type": "Point",
                                                    "coordinates": [dispensary.location.coordinates[0], dispensary.location.coordinates[1] ]
                                                }
                                            },
                                            { units: 'miles' }).toFixed(1)+' '
                                    }
                                    miles away
                                </IonBadge>&nbsp;
                                {
                                    (CheckIfOpen(dispensary.hoursofoperation, dispensary.TZ).isOpen) ? (
                                        <IonBadge>Open now</IonBadge>
                                    ) : (
                                        <IonBadge color='danger'>Closed now</IonBadge>
                                    )
                                }
                            </div>
                        </div>
                    </IonToolbar>
                }
                
            </IonHeader>
            
            <IonContent color='light'>
                <IonFab vertical="top" horizontal="end" slot="fixed" style={{transform:'translateY(-70%)'}}>
                    <IonFabButton 
                        color='light'
                        onClick={(e) =>
                            present({
                                event: e.nativeEvent,
                            })
                        }
                    >
                        <IonIcon icon={ellipsisVertical}/>
                    </IonFabButton>
                </IonFab>
                {
                    actionsLoading ? (
                        <FullSpinner />
                    ) : (
                        <IonItem style={{boxShadow:'0px -4px 6px 0px'}} lines='full'>
                            <div style={{paddingBottom: '4px', width:'100%'}}>
                               
                                {(deal.isTemporary && deal.expiration &&  !checkIfExpired(deal.expiration)) && (<>
                                    <br></br>
                                    <IonBadge color='danger'>
                                        Expires <strong>{moment(deal.expiration).utc().format('MM-DD-YYYY')}</strong>
                                    </IonBadge>
                                </>)}

                                {(deal.isTemporary && deal.expiration  &&  checkIfExpired(deal.expiration)) && (<>
                                    <br></br>
                                    <IonBadge color='danger'>
                                        EXPIRED
                                    </IonBadge>
                                </>)}
                                <h4>{deal.name}</h4>
                                <p>{deal.description}</p>
                                {
                                    deal.happyHours && deal.happyHours.length > 0 && (
                                        <>
                                         
                                            <small><strong>Happy hour:</strong></small><br />
                                            {
                                                deal.happyHours.map( x => <>
                                                    
                                                    <IonBadge color='tertiary'>From 
                                                        <strong>{' '+moment.utc().startOf('day').add(x.happyHourStart, 'minutes').format('h:mm A')+' '}</strong>
                                                        until
                                                        <strong>{' '+moment.utc().startOf('day').add(x.happyHourEnd, 'minutes').format('h:mm A')+' '}</strong>
                                                    </IonBadge>
                                                    <br />
                                                </> )
                                            }
                                        </>  
                                    )
                                }
                                <br />
                                <div style={{borderTop:'1px solid #cccccc', paddingTop:'10px'}}>
                                    {
                                        (deal.target_audience && Array.isArray(deal.target_audience) && deal.target_audience.length > 0) && (
                                            <>
                                                {
                                                    deal.target_audience.map(
                                                        (x, i) => <IonBadge key={i} color='light' style={{marginRight:'4px'}}>{dealsTagetAudiences.find(y => y.value===x)['label']}</IonBadge>
                                                    )
                                                }
                                            </>
                                        )
                                    }
                                    {
                                        (deal.categories && Array.isArray(deal.categories) && deal.categories.length > 0) && (
                                            <>

                                                {/* <strong>Valid categories:</strong> */}
                                        
                                                {
                                                    deal.categories.map(
                                                        (x, i) => <IonBadge key={i} color='light' style={{marginRight:'4px'}}>
                                                            {x.name}
                                                        </IonBadge>
                                                    )
                                                }

                                            </>
                                        ) 
                                    }
                                    {
                                        (deal.genetics && Array.isArray(deal.genetics) && deal.genetics.length > 0) && (
                                            <>

                                                {/* <strong>Valid genetics:</strong> */}
                                        
                                                {
                                                    deal.genetics.map(
                                                        (x, i) => <IonBadge key={i} color='light'>
                                                            {x}
                                                        </IonBadge>
                                                    )
                                                }

                                            </>
                                        ) 
                                    }
                                    {
                                        (deal.brands && Array.isArray(deal.brands) && deal.brands.length > 0) && (
                                            <>
                                                {
                                                    deal.brands.map(
                                                        (x, i) => <IonBadge key={i} color='light'>
                                                            {x.name}
                                                        </IonBadge>
                                                    )
                                                }
                                            </>
                                        ) 
                                    }
                                </div>
                                <div style={{display:'flex', justifyContent:'flex-end'}}>
                                   
                                        <FavoriteButton 
                                            collection='deals'
                                            _id={deal._id}
                                            isFavoriteDeal={true}
                                        />
                                        {/* <IonIcon icon={heartOutline}></IonIcon> */}
                                   
                                    <IonButton size='large' fill='clear' color='dark'>
                                        <IonIcon icon={shareSocialOutline}></IonIcon>
                                    </IonButton>
                                    <IonButton 
                                        size='large' 
                                        fill='clear' 
                                        color='dark'
                                        onClick={(e) =>
                                            present3({
                                                event: e.nativeEvent,
                                            })
                                        }
                                    >
                                        <IonIcon icon={informationCircleOutline}></IonIcon>
                                    </IonButton>
                                    <IonButton 
                                        size='large' 
                                        fill='clear' 
                                        color='dark'
                                        onClick={(e) =>
                                            present2({
                                                event: e.nativeEvent,
                                            })
                                        }
                                    >
                                        <IonIcon icon={documentOutline}></IonIcon>
                                    </IonButton>
                                </div>
                            </div>
                        </IonItem>
                    )
                }
                
            </IonContent>
        </IonPage>
    )
}

export default DealPage