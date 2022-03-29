import CheckIfOpen from '../../helpers/time'
import { 
	IonCard, 
	IonText, 
	IonCardHeader, 
	IonCardSubtitle, 
	IonCardTitle, 
	IonCardContent, 
	IonIcon,
	IonBadge,
    useIonRouter,
    IonImg,
} from '@ionic/react';
import cookie from 'js-cookie'
import { starOutline } from 'ionicons/icons';
import lodash from 'lodash';
import SVG from 'react-inlinesvg'
import { MY_LOCATION } from '../../helpers/constants';
import * as turf from "@turf/turf";
import './Business.css'
import FavoriteButton from '../Common/FavoriteButton';
import ImageUrlFormatter from '../../helpers/ImageUrlFormatter';


const BusinessCard = (props) => {

    const router = useIonRouter()
    
    return (
        <IonCard onClick={()=>router.push('/businesses/profile/'+props.item.slug, "forward", "push")} className='no-inline-margin'>	
			<FavoriteButton 
				collection='dispensaries'
				_id={props.item._id}
			/>								
			<IonCardContent>
				<div style={{width:'60%', height:'60%', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'0.5rem'}}>
					<img src={props.item.logo ? ImageUrlFormatter(props.item.logo, 'full', 100, 100, false, false) : 'assets/images/default-pic.png'} style={{borderRadius:'100%'}} />
				</div>
				<IonCardTitle style={{textAlign:'center', fontSize:'16px'}} className='card-title'><strong>{props.item.name}</strong></IonCardTitle>
				<IonCardSubtitle style={{textAlign:'center'}} className='card-subtitle' >
					{
						props.item.isMedical && props.item.isRecreational 
						? 'Medical & Recreational' 
						: (props.item.isMedical)
						? 'Medical'
						: (props.item.isRecreational)
						? 'Recreational'
						: ''
					}
				</IonCardSubtitle>
				<hr />
				{
        		    !lodash.isEmpty(props.item.amenities) && (
        		        <div style={{marginTop:'0.5rem'}}>
        		            {props.item.amenities.isCreditCardAccepted && <IonBadge color="medium" style={{fontSize:'10px', marginRight:'3px'}}>Credit Cards</IonBadge>}
        		            {props.item.amenities.isAtmAvailable && <IonBadge color="medium" style={{fontSize:'10px', marginRight:'3px'}}>ATM</IonBadge>}
        		            {props.item.amenities.isSecurityAvailable && <IonBadge color="medium" style={{fontSize:'10px', marginRight:'3px'}}>Security</IonBadge>}
        		            {props.item.amenities.isAccessible && <IonBadge color="medium" style={{fontSize:'10px', marginRight:'3px'}}>Accesibility</IonBadge>}
					
        		        </div>
        		    )
        		}
        		{
        		    props.item.avgRating < 0 && <div style={{display:'flex', alignItems:'center', marginTop:'4px'}}>
        		            <IonIcon slot="start" icon={starOutline} />&nbsp;&nbsp;<strong>
        		            <small>{props.item.avgRating.toFixed(1)}</small> &nbsp;
        		            <small>({props.item.reviewsAmt || 0} review{props.item.reviewsAmt > 1 ? 's' : ''})</small>&nbsp;</strong>
        		    </div> 
        		}
				
				<div>
				{
					props.item.type === 'DISPENSARY' && <>
        		       <small style={{display:'flex', alignItems:'center', marginTop:'4px'}}>
						   	<SVG
							   
        					    height={16}
        					    width={14}
        					    src={"/assets/icons/map-spot-svgrepo-com.svg"}
        					    style={{fill:'#5d5d5d'}}
        					/>
							<strong>
        		            &nbsp;&nbsp;
							
        		            {
								props.item.calcDistance ? (props.item.calcDistance/1609).toFixed(1) : 
							
								turf.distance(
									{
										"type": "Feature",
										"properties": {},
										"geometry": {
											"type": "Point",
											"coordinates": [props.item.dispensary.location.coordinates[0], props.item.dispensary.location.coordinates[1] ]
										}
									},
									{
										"type": "Feature",
										"properties": {},
										"geometry": {
											"type": "Point",
											"coordinates": [JSON.parse(String(localStorage.getItem(MY_LOCATION))).longitude, JSON.parse(String(localStorage.getItem(MY_LOCATION))).latitude]
											
										}
									}, 
									
									{ units: 'miles' }).toFixed(1)+' '
							
							} miles away
        		        </strong></small>
        		    </>
				}
        		{
        		    props.item.hasOwnProperty('deliveryTax') && props.item.deliveryTax >= 0  && (
        		        props.item.isDeliveryServiceAvailable && <small style={{display:'flex', alignItems:'center', marginTop:'4px'}}>
							<SVG
								height={20}
								width={14}
								src={'/assets/icons/delivery.svg'}
								style={{fill:'#5d5d5d'}}
							/>
							{props.item.deliveryTax > 0 ? <>&nbsp;&nbsp;Delivery fee:<b>&nbsp;${props.item.deliveryTax}</b></> : <strong>&nbsp;&nbsp;No delivery fee</strong>}{props.item.deliveryMinPurchase ? (<>&nbsp;| Min ${props.item.deliveryMinPurchase}</>) : ''}
						</small>
        		    )
        		}
        		{
        		    props.item.isCurbsidePickupServiceAvailable && 
						<small style={{display:'flex', alignItems:'center', marginTop:'4px'}}>
							<SVG
								height={20}
								width={14}
								src={'/assets/icons/car-garage-svgrepo-com.svg'}
								style={{fill:'#5d5d5d'}}
							/>&nbsp;&nbsp;<strong>
							Curbside Pickup
							</strong>
						</small>
					
        		}
        			<>
						<div style={{display:'flex', marginTop:'10px'}}>
		   						{
									   <IonBadge style={{fontSize:'10px', marginRight:'3px'}} color="primary">
										   Order Online
									   </IonBadge>
		   						}

		   						{
									   CheckIfOpen(props.item.hoursofoperation, props.item.TZ).isOpen ? <IonBadge style={{fontSize:'10px'}} color="primary">Open now</IonBadge> : <IonBadge style={{fontSize:'10px'}} color="danger">Closed</IonBadge>
								   }
		   						{/* {
									   sponsored && <span className='rounded mt-2 mr-1 badge badge-purple'>Sponsored</span>
		   						} */}
						</div>
					</>
        		</div>  
			</IonCardContent>
		</IonCard>
    )
}

export default BusinessCard

export const BusinessSliderCard = ({
    item
}) => {

	const router = useIonRouter()

    return (
        <IonCard onClick={()=>router.push(`/businesses/profile/${item.slug}`)} className='ion-no-margin' style={{height:'100%', width:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
     
			<img 
                style={{
                    objectFit: 'cover'
                }} 
                src={item.logo ? ImageUrlFormatter(item.logo, 'full', 200, 200, false, false) : '/assets/images/default-pic.png'} 
            />
            <IonCardContent style={{textAlign:'start'}}>
                {
                    CheckIfOpen(item.hoursofoperation, item.TZ).isOpen === true ? (
                        <IonBadge color='primary'>Open now</IonBadge>
                    ) : (
                        <IonBadge color='danger'>Closed</IonBadge>
                    )
                }
                <IonText color={'dark'} style={{textAlign:'start'}}>
                    <h3 className='ellipsed-text' style={{marginBottom:'12px'}}><strong>{item.name}</strong></h3>
                    {
                        item.calcDistance && <p>
                            <span><strong>{(item.calcDistance/1609).toFixed(1)}mi</strong> away<br /><span style={{marginTop:"-5px"}}>{item.city.name}</span></span>
                        </p>
                    }
                </IonText>
            </IonCardContent>
        </IonCard>
    )

}
