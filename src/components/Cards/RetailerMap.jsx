import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonText, useIonRouter } from "@ionic/react"
import { chevronDownOutline, chevronUpOutline, location, storefront, time } from "ionicons/icons"
import moment from "moment"
import ImageUrlFormatter from "../../helpers/ImageUrlFormatter"
import CheckIfOpen from "../../helpers/time"
import './RetailerMap.css'

const RetailerMapCard = ({entity, sliderPositionClass, setSliderPositionClass}) => {

    const router = useIonRouter()

    const redir = (path) => {
		router.push(path)
    }

    return (
        <IonCard style={{width:'100%', minHeight:'170px'}}>
            {/* <div className={`gestureCatcher`} style={{width:'100%', display:'flex', justifyContent:'center'}}>
                <div className='slider-dragger' style={{
                    height: '4px',
                    width: '25px',
                    marginTop:'5px',
                    marginBottom:'5px',
                    backgroundColor: '#cccccc',
                    borderRadius:'5px'
                }}></div>
            </div> */}
            <div onClick={()=>setSliderPositionClass(sliderPositionClass === 'top' ? 'bottom' : 'top')} style={{width:'100%', display:'flex', justifyContent:'center'}}>
                
                        <IonIcon slot="icon-only" style={{fontSize:'20px'}} icon={sliderPositionClass === 'top' ? chevronDownOutline : chevronUpOutline} />
                  
                
            </div>
            {/* <IonCardHeader style={{paddingTop:'2px', paddingBottom:'4px'}}>
                
            </IonCardHeader> */}
            <IonCardContent style={{textAlign:'start', paddingTop:'4px'}}>
            
                <img src={ImageUrlFormatter(entity.logo, 'full', 100, 100, false, false)} style={{width:'25%', borderRadius:'100%', float:'right'}}></img>
                <h4 className="dispensary-name" style={{fontSize:'14px', color:'black', marginTop:'4px', marginBottom:'8px', textAlign:'start', fontWeight:'700'}}>{entity.name}</h4>
                <p style={{textTransform:'capitalize', fontSize:'12px', marginBottom:'0px'}}>
                    <IonIcon icon={storefront} style={{marginRight:'8px'}}></IonIcon>
                    <span>{entity.type.toLowerCase()}</span>
                </p>
                <p style={{textTransform:'capitalize', fontSize:'12px', marginBottom:'0px'}}>
                    <IonIcon icon={location} style={{marginRight:'8px'}}></IonIcon>
                    <span>{entity.city.name}, {entity.city.state.name}</span>
                </p>
                <p style={{fontSize:'12px', marginBottom:'0px'}}>
                    <IonIcon icon={time} style={{marginRight:'8px'}}></IonIcon>
                    <span>
                        <strong style={ CheckIfOpen(entity.hoursofoperation, entity.TZ).isOpen === true ? {color:'#1885ff'} : {color:'#e35889'} }>
                        {
                            CheckIfOpen(entity.hoursofoperation, entity.TZ).isOpen === true 
                                ? 'Open '
                                : 'Closed '
                        }
                        </strong>
                        {
                            CheckIfOpen(entity.hoursofoperation, entity.TZ).isOpen && <>&nbsp;until {moment(Math.floor(CheckIfOpen(entity.hoursofoperation, entity.TZ).closes_at/60) + ':' + (CheckIfOpen(entity.hoursofoperation, entity.TZ).isOpen%60 < 10 ? (CheckIfOpen(entity.hoursofoperation, entity.TZ).closes_at%60).toString()+'0' : CheckIfOpen(entity.hoursofoperation, entity.TZ).isOpen%60), 'HH:mm').format('h:mm A')}</>
                        }
                    </span>
                </p>
                <div>
                    <IonButton onClick={()=>redir(`/businesses/profile/${entity.slug}`)} size='small'>See profile</IonButton>
                </div>
            </IonCardContent>
        </IonCard>
    )
}

export default RetailerMapCard