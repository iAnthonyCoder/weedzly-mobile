import { IonBackButton, IonRow, useIonPopover, PopoverList, IonCol, IonButton,IonGrid, IonButtons, IonCard, IonContent, IonHeader, IonIcon, IonItem, IonItemDivider, IonLabel, IonList, IonPage, IonProgressBar, IonSegment, IonSegmentButton, IonText, IonTitle, IonToolbar, IonCardTitle, IonCardHeader, IonCardSubtitle, IonCardContent, useIonRouter } from '@ionic/react'
import { accessibility, arrowDownCircle, atOutline, callOutline, car, card, carOutline, cash, chevronDownOutline, chevronUpOutline, documentOutline, linkOutline, locationOutline, logoInstagram, logoTwitter, logoYoutube, mailOutline, map, shield, star, starOutline, storefrontOutline, ticket, timerOutline } from 'ionicons/icons'
import React, { useState, useEffect } from 'react'
import { dispensaryService } from '../../../services'
import SVG from 'react-inlinesvg'
import './index.css'
import { getDayAndTime } from '../../../helpers/time'
import moment from 'moment'
import CheckIfOpen from '../../../helpers/checkIfOpen'
import _ from 'lodash'
import HoursOfOperation from '../../../components/Tables/HoursOfOperation'
import { mapboxService } from '../../../services/mapbox.service'
import { GetDirectionsModal } from '../../../components/Modals/GetDirections'
import Menu from './Menu'
import Deals from './Deals'
import Reviews from './Reviews'
import DispensaryReviews from './Reviews'
import DispensaryRewards from './Rewards'
import TopToolbar from '../../../components/Common/TopToolbar'
import FullSpinner from '../../../components/Common/FullSpinner'

const BusinessProfile = (props) => {

    

    const [ entity, setEntity ] = useState({})

    const [ actionsLoading, setActionsLoading ] = useState(true)

    const [ selectedSegment, setSelectedSegment ] = useState(window.location.hash.replace('#', '') ? window.location.hash.replace('#', '') : 'overview')

    const getEntity = async () => {
        try {
            setActionsLoading(true)
            const entity = await dispensaryService.getDetailsPage(props.match.params.slug, getDayAndTime(true)) 
            setEntity(entity)
            setActionsLoading(false)
        } catch (er) {
            console.log(er)
        }
    }
    
    const router = useIonRouter()

    useEffect(() => {
        getEntity()
    }, [])

    const [ open, setOpen ] = useState(false)
    const [ fullTime, setFullTime ] = useState(false)

    useEffect(() => {
        if(!_.isEmpty(entity)){
            setOpen(CheckIfOpen(entity.hoursofoperation, entity.TZ))
            let dayPos = (moment().isoWeekday())
            if(dayPos === 7) {
                dayPos = 0
            }
            let acum = 0
            Object.keys(entity.hoursofoperation).map(x => {
                acum += entity.hoursofoperation[x]['opens_at']
                acum += entity.hoursofoperation[x]['closes_at']
            })
        
            if(acum === 10073){
                setFullTime(true)
            } else {
                setFullTime(false)
            }   
        }
    }, [entity])


    const [ scrollPos, setScrollPos ] = useState(0)

    
    const [present, dismiss] = useIonPopover(<HoursOfOperation 
        currentDay = { open.previousDay ? moment().subtract('1', 'day').format('dddd').toLowerCase() : moment().format('dddd').toLowerCase() }
        hoursofoperation={entity.hoursofoperation}
    />, {
    onHide: () => dismiss(),
  });

    const [ scheduleOpened, setScheduleOpened ] = useState(false)

    const [ showGetDirectionsModal, setShowGetDirectionsModal ] = useState(false)

    return (
        <IonPage>
            {
                showGetDirectionsModal && <GetDirectionsModal  
                    entity={entity}
                    showModal = {showGetDirectionsModal}
                    setShowModal = {setShowGetDirectionsModal}
                />
            }
            <IonHeader>
                {
                    actionsLoading && <IonProgressBar type="indeterminate"></IonProgressBar>
                }
  	        	{/* <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                   
                    <IonTitle>
                        
                        {entity.name}
                    </IonTitle>
                   
                    
                    <IonButtons slot="end">
                        <IonButton fill='clear'>
                            <IonIcon slot="icon-only" icon={star} />
                        </IonButton>
                    </IonButtons>
  	            </IonToolbar> */}
                <TopToolbar
                    title={entity.name ? entity.name : 'Loading...'}
                    enableBackButton={true}
                    disableSearch={true}
                    disableNotifications={true}
                    disableCart={true}
                    enableFavoriteButton={true}
                    favoriteParams={!actionsLoading ? {
			        	collection: 'dispensaries',
			        	_id: entity._id
                    } : false}	
                /> 
           
                <IonToolbar>
                    <IonSegment scrollable={true} value={selectedSegment}>
        	            <IonSegmentButton onClick={()=>setSelectedSegment('overview')} value="overview">
        	                <IonLabel>Overview</IonLabel>
        	            </IonSegmentButton>
        	            <IonSegmentButton onClick={()=>setSelectedSegment('menu')} value="menu">
        	                <IonLabel>Menu</IonLabel>
        	            </IonSegmentButton>
                        <IonSegmentButton onClick={()=>setSelectedSegment('rewards')} value="rewards">
        	                <IonLabel>Rewards</IonLabel>
        	            </IonSegmentButton>
                        <IonSegmentButton onClick={()=>setSelectedSegment('deals')} value="deals">
        	                <IonLabel>Deals</IonLabel>
        	            </IonSegmentButton>
                        <IonSegmentButton onClick={()=>setSelectedSegment('reviews')} value="reviews">
        	                <IonLabel>Reviews</IonLabel>
        	            </IonSegmentButton>
        	        </IonSegment>
                </IonToolbar>
  	        </IonHeader>
            {
                !_.isEmpty(entity) ? (
                    selectedSegment === 'overview' ? (
                        <IonContent fullscreen overflow-scroll='false' scrollEvents={true} onIonScroll={(e)=>setScrollPos(e.detail.scrollTop)}>
                            <IonCard  style={{margin:'0', borderRadius:'0'}} > 
                                <IonItem lines="full" style={{display:'flex', alignItems:'center'}}>
                                    <div style={{padding: '20px 0', display:'flex', alignItems:'center'}}>
                                        <img src={entity.logo} width='17.5%' style={{borderRadius:'100%'}}></img>
                                        <div style={{display:'flex',flexDirection:'column'}}>
                                            <h5 style={{padding:0, margin:'0.25rem 0.75rem'}}>{entity.name}</h5>
                                            <small style={{padding:0, margin:'0.25rem 0.75rem'}}>
                                                {
			            			    	    	entity.isMedical && entity.isRecreational 
			            			    	    	? 'Medical & Recreational' 
			            			    	    	: (entity.isMedical)
			            			    	    	? 'Medical'
			            			    	    	: (entity.isRecreational)
			            			    	    	? 'Recreational'
			            			    	    	: ''
			            			    	    }
                                            </small>
                                        </div>
                                    </div>
                                </IonItem>
                                <IonItem className='no-p' style={{margin:0, padding:0}}>
                                <IonGrid style={{width:'100%'}}>
                                    <IonRow>
                                        <IonCol >
                                            <IonItem lines='none' style={{height:'28px', display:'flex'}}>
                                                <IonIcon style={{fontSize:'18px', marginRight:'12px'}} icon={entity.type === 'DISPENSARY' ? storefrontOutline : carOutline} />
                                                <IonLabel style={{textTransform:'capitalize', fontSize:'11px', margin:'0'}}>{entity.type.toLowerCase()}</IonLabel>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol>
                                            <IonItem lines='none' style={{height:'28px', display:'flex'}}>
                                                <IonIcon style={{fontSize:'18px', marginRight:'12px'}} icon={documentOutline} />
                                                <IonLabel style={{textTransform:'capitalize', fontSize:'11px', margin:'0'}}>
                                                    {
			            		    	        	    entity.isMedical && entity.isRecreational 
			            		    	        	    ? 'Medical & Recreational' 
			            		    	        	    : (entity.isMedical)
			            		    	        	    ? 'Medical'
			            		    	        	    : (entity.isRecreational)
			            		    	        	    ? 'Recreational'
			            		    	        	    : ''
			            		    	        	}
                                                </IonLabel>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol>
                                            <IonItem lines='none' style={{height:'28px', display:'flex'}}>
                                                <IonIcon style={{fontSize:'18px', marginRight:'12px'}} icon={starOutline} />
                                                <IonLabel style={{textTransform:'capitalize', fontSize:'11px', margin:'0'}}>
                                                    {entity.reviewsAmt} Reviews
                                                </IonLabel>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol>
                                            <IonItem lines='none' style={{height:'28px', display:'flex'}}>
                                                <IonIcon style={{fontSize:'18px', marginRight:'12px'}} icon={locationOutline} />
                                                <IonLabel style={{textTransform:'capitalize', fontSize:'11px', margin:'0'}}>
                                                    {
                                                        entity.type!='DELIVERY' && (
                                                            <>
                                                                {entity.address.replace('Street', '')}
                                                                {entity.address_line_2 && <>&nbsp;{entity.address_line_2.replace('Street', '')}</>}
                                                            </>
                                                        )
                                                    }
                                                    {entity.type!='DELIVERY' ? ' - ' : ' '}{entity.city.name}, {entity.city.state.abbreviation}
                                                </IonLabel>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol>
                                            <IonItem onClick={(e) =>
                                                  present({
                                                    event: e.nativeEvent,
                                                  })
                                                } lines='none' style={{height:'28px', display:'flex'}}>
                                                <IonIcon style={{fontSize:'18px', marginRight:'12px'}} icon={timerOutline} />
                                                {
                                                    open.isOpen ? (
                                                        <IonLabel color={'success'} style={{textTransform:'capitalize', fontSize:'11px', margin:'0'}}>
                                                            {
                                                                fullTime ? (
                                                                    <><strong>{'Open 24/7'}</strong></>
                                                                ) : (
                                                                    <><strong>{'Open'}</strong>&nbsp;until&nbsp;{moment.utc().startOf('day').add(open.closes_at, 'minutes').format('h:mm A')}</>
                                                                )
                                                            }
                                                        </IonLabel>
                                                    ) : (
                                                        <IonLabel color={fullTime ? 'success' : 'danger'} style={{textTransform:'capitalize', fontSize:'11px', margin:'0'}}>
                                                        {
                                                            fullTime ? <strong>Open 24/7</strong> : (
                                                                <>
                                                                    <strong>{'Closed'}</strong>
                                                                    {
                                                                        open.opensToday ? (<>, opens today at {moment.utc().startOf('day').add(open.opens_at ,'minutes').format("h:mm A")}</>) : open.day ? (
                                                                            <><span>, opens <span className='capitalize'>{open.day}</span>&nbsp;</span>{' at '}  
                                                                                {moment.utc().startOf('day').add(open.opens_at, 'minutes').format('h:mm A')}
                                                                            </>
                                                                        ) : ""
                                                                    }&nbsp;
                                                                    <span><strong>({moment.tz(entity.TZ).zoneAbbr()})</strong></span>
                                                                </>
                                                            )
                                                        }
                                                        </IonLabel>
                                                    )
                                                }
                                                <IonIcon width icon={arrowDownCircle} style={{fontSize:'16px', marginLeft:'12px'}}  />
                                            </IonItem>
                                            
                                        </IonCol>
                                        <IonCol />
                                    </IonRow>
                                    </IonGrid>
                                    {/* <IonList> 





                                        <IonItem lines='none'>
                                            <IonIcon style={{fontSize:'18px', marginRight:'12px'}} icon={linkOutline} />
                                            <IonLabel style={{textTransform:'capitalize', fontSize:'11px'}}>
                                                {entity.website}
                                            </IonLabel>
                                        </IonItem>

                                    </IonList>
                                </IonItem>
                                <IonItem className='no-p' style={{margin:0, padding:0}}>
                                    <IonList>
                                        {
                                            entity.phone && <IonItem lines='none'>
                                                <IonIcon style={{fontSize:'18px', marginRight:'12px'}} icon={callOutline} />
                                                <IonLabel style={{fontSize:'11px'}}>
                                                    {entity.phone}
                                                </IonLabel>
                                            </IonItem>
                                        }

                                        {
                                            entity.email && <IonItem lines='none'>
                                                <IonIcon style={{fontSize:'18px', marginRight:'12px'}} icon={mailOutline} />
                                                <IonLabel style={{fontSize:'11px'}}>
                                                    {entity.email}
                                                </IonLabel>
                                            </IonItem>
                                        }
                                        {
                                            entity.instagram && <IonItem lines='none'>
                                                <IonIcon style={{fontSize:'18px', marginRight:'12px'}} icon={logoInstagram} />
                                                <IonLabel style={{fontSize:'11px'}}>
                                                    {entity.instagram}
                                                </IonLabel>
                                            </IonItem>
                                        }
                                        {
                                            entity.twitter && <IonItem lines='none'>
                                                <IonIcon style={{fontSize:'18px', marginRight:'12px'}} icon={logoTwitter} />
                                                <IonLabel style={{fontSize:'11px'}}>
                                                    {entity.twitter}
                                                </IonLabel>
                                            </IonItem>
                                        }
                                        {
                                            entity.youtube && <IonItem lines='none'>
                                                <IonIcon style={{fontSize:'18px', marginRight:'12px'}} icon={logoYoutube} />
                                                <IonLabel style={{fontSize:'11px'}}>
                                                    {entity.youtube}
                                                </IonLabel>
                                            </IonItem>
                                        }
                                    </IonList> */}
                                </IonItem>
                            </IonCard>
                            {/* {

                                    open.isOpen ? (
                                        <IonCard  style={{padding: '10px'}} >
                                            <IonItem color='none' lines="none" >
                                                <IonIcon  slot="start" color='secondary' icon={timerOutline} style={{fontSize:'24px'}}/> &nbsp;
                                                <IonText color="secondary">
                                                    {
                                                        fullTime ? <strong>Open 24/7</strong> : (<><strong>{'Open'}</strong>&nbsp;until&nbsp;{moment.utc().startOf('day').add(open.closes_at, 'minutes').format('h:mm A')}</>)
                                                    }
                                                </IonText>
                                                <IonButtons onClick={()=>setScheduleOpened(!scheduleOpened)} slot="end">
                                                    <IonButton fill='clear'>
                                                        <IonIcon slot="icon-only" icon={scheduleOpened ? chevronUpOutline : chevronDownOutline} />
                                                    </IonButton>
                                                </IonButtons>
                                            </IonItem>
                                            {
                                                scheduleOpened === true && (
                                                    <HoursOfOperation 
                                                        hoursofoperation={entity.hoursofoperation}
                                                        currentDay = { open.previousDay ? moment().subtract('1', 'day').format('dddd').toLowerCase() : moment().format('dddd').toLowerCase() }
                                                    />
                                                )
                                            }
                                        </IonCard>
                                    ) : (
                                        <IonCard  style={{padding: '10px'}} onClick={()=>setScheduleOpened(!scheduleOpened)}>
                                            <IonItem color='none' lines="none" >
                                                <IonIcon color="danger" slot="start" icon={timerOutline} style={{fontSize:'24px'}}/>
                                                <IonText color="danger">
                                                    {
                                                        fullTime ? <strong>Open 24/7</strong> : (
                                                            <>
                                                                <strong>{'Closed'}</strong>
                                                                {
                                                                    open.opensToday ? (<>, opens today at {moment.utc().startOf('day').add(open.opens_at ,'minutes').format("h:mm A")}</>) : open.day ? (
                                                                        <><span>, opens <span className='capitalize'>{open.day}</span>&nbsp;</span>{' at '}  
                                                                            {moment.utc().startOf('day').add(open.opens_at, 'minutes').format('h:mm A')}
                                                                        </>
                                                                    ) : ""
                                                                }&nbsp;
                                                                <span><strong>({moment.tz(entity.TZ).zoneAbbr()})</strong></span>
                                                            </>
                                                        )
                                                    }
                                                </IonText>
                                                <IonButtons onClick={()=>setScheduleOpened(!scheduleOpened)} slot="end">
                                                    <IonButton fill='clear'>
                                                        <IonIcon slot="icon-only" icon={scheduleOpened ? chevronUpOutline : chevronDownOutline} />
                                                    </IonButton>
                                                </IonButtons>
                                            </IonItem>
                                            {
                                                scheduleOpened === true && (
                                                    <HoursOfOperation 
                                                        hoursofoperation={entity.hoursofoperation}
                                                        currentDay = { open.previousDay ? moment().subtract('1', 'day').format('dddd').toLowerCase() : moment().format('dddd').toLowerCase() }
                                                    />
                                                )
                                            }

                                        </IonCard>
                                    )
                                        
                            } */}
                            {
                                entity.type != 'DELIVERY' && <IonCard>
                                    <img style={{width:'100%'}} src={mapboxService.getStaticMap(entity.location.coordinates[0], entity.location.coordinates[1])} />
                                    <IonItem color='none' lines="none" style={{marginTop:'0.5rem', marginBottom:'0.5rem'}}>
                            
                                        <div>
                                            <small>{entity.address}</small>&nbsp;<br />
                                            { entity.address_line_2 && <small>{entity.address_line_2}</small>}<br />
                                            <small>{entity.city.name} {entity.city.state.name}, {entity.addresszip}</small>
                                        </div>
                                    </IonItem>
                                    <IonItem color='none' lines="none" style={{marginTop:'0.5rem', width:'100%'}}>
                                        <IonButton onClick={()=>setShowGetDirectionsModal(true)} expand="block" style={{width:'100%'}}>
                                            <IonIcon slot="start" icon={map} />
                                            Get Directions
                                        </IonButton>
                                    </IonItem>
                                </IonCard>
                            }

                            {
                                entity.amenities && !_.isEmpty(entity.amenities) && Object.keys(entity.amenities).find(x => entity.amenities[x] === true || entity.amenities[x] > 0) && 
                                <IonCard>
                                    <IonCardHeader>
                                        <IonCardSubtitle>Amenities</IonCardSubtitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <IonRow>
                                        {
                                            (entity.amenities && entity.amenities.isCreditCardAccepted) && 
                                            <IonCol size="4" size-md><div style={{ display:'flex', alignItems:'center', justifyContent:'center', flexDirection: 'column'}}>
                                                <IonIcon style={{fontSize:'32px'}} icon={card}></IonIcon>
                                                <small>Credit Card</small>
                                            </div>
                                            </IonCol>
                                        }
                                        {
                                            (entity.amenities && entity.amenities.isAtmAvailable) && 
                                            <IonCol size="4" size-md><div style={{ display:'flex', alignItems:'center', justifyContent:'center', flexDirection: 'column'}}>
                                                <IonIcon style={{fontSize:'32px'}} icon={cash}></IonIcon>
                                                <small>ATM</small>
                                            </div></IonCol>
                                        }
                                        {
                                            (entity.amenities && entity.amenities.isSecurityAvailable) && 
                                            <IonCol size="4" size-md><div style={{ display:'flex', alignItems:'center', justifyContent:'center', flexDirection: 'column'}}>
                                                <IonIcon style={{fontSize:'32px'}} icon={shield}></IonIcon>
                                                <small>Security</small>
                                            </div></IonCol>
                                        }
                                        {
                                            (entity.amenities && entity.amenities.isAccessible) && 
                                            <IonCol size="4" size-md><div style={{ display:'flex', alignItems:'center', justifyContent:'center', flexDirection: 'column'}}>
                                                <IonIcon style={{fontSize:'32px'}} icon={accessibility}></IonIcon>
                                                <small>Accessible</small>
                                            </div></IonCol>
                                        }
                                        {
                                            (entity.amenities && entity.amenities.isCurbsidePickupServiceAvailable) && 
                                            <IonCol size="4" size-md><div style={{ display:'flex', alignItems:'center', justifyContent:'center', flexDirection: 'column'}}>
                                                <IonIcon style={{fontSize:'32px'}} icon={car}></IonIcon>
                                                <small>Curbside Pickup</small>
                                            </div></IonCol>
                                        }

                                    
                                        </IonRow>
                                    </IonCardContent>
                                </IonCard>
                            }


                        </IonContent>
                    ) : selectedSegment==='menu' ? <Menu entity={entity} /> : selectedSegment==='deals' ? <Deals entity={entity} /> : selectedSegment==='reviews' ? <DispensaryReviews entity={entity} /> : selectedSegment==='rewards' ? <DispensaryRewards entity={entity} /> : ''
                ) : (<IonContent>
                    <FullSpinner />
                </IonContent>)
            }
        </IonPage>
    )
}

export default BusinessProfile