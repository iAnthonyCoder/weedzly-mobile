import { IonSlide, IonSlides, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonText, IonButton, useIonRouter, IonSkeletonText } from '@ionic/react';
import cookie from 'js-cookie';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { MY_LOCATION } from '../../helpers/constants';
import { getDayAndTime } from '../../helpers/time';
import './Page.css';

const BusinessesCarousel = (props) => {

    const slideOptsBig = {
        initialSlide: 0,
        speed: 400,
      
        // centeredSlides: true,
 
        freeMode: false,
        pagination: ' ',
        0: {
				
            slidesPerView: 1.2,
            spaceBetween: 16,
            },
        640: {
            
            slidesPerView: 2.4,
            spaceBetween: 16,
        }
    };

    const slideOpts = {
        initialSlide: 0,
        speed: 400,
       
        // centeredSlides: true,
      
        freeMode: false,
        pagination: ' ',
        breakpoints: {
			0: {
				
				slidesPerView: 1.6,
				spaceBetween: 16,
      	  	},
                640: {
				
				slidesPerView: 3.2,
				spaceBetween: 16,
			}
      	}
        
    };


    const [ data, setData ] = useState(null)
    const [ filterOpen, setFilterOpen ] = useState(false)
    const [ actionsLoading, setActionsLoading ] = useState(false)
    const [ fetched, setFetched ] = useState(false)

    const fetchData = async (props) => {
        try {
            setActionsLoading(true)
            const extraParams = ''
            let params = (props.urlParams ? props.urlParams : '?')+extraParams
            if(props.geolocate){
                params = params + `&longitude=${JSON.parse(localStorage.getItem(MY_LOCATION)).longitude}&latitude=${JSON.parse(localStorage.getItem(MY_LOCATION)).latitude}&boundingRadius=160934`
            }
            if(filterOpen){
                params = params + getDayAndTime()
            }
            let response = await props.service(params)
            setData(response.totalData)
            setActionsLoading(false)
            setFetched(true)
        } catch (er) {
            console.log(er);
        }
    }

    useEffect(() => {
        fetchData(props)
    }, [filterOpen])

    const router = useIonRouter()

    const loadingskeleton = () => (
        <section className='full-width ion-margin-bottom ion-padding-bottom ' style={props.borderBottom ? {borderBottom:'1px solid #e7e7e7'} : {}}>
            <div style={{display:'flex', alignItems:'end', justifyContent:'space-between', paddingLeft:'16px', paddingRight:'16px'}}>
                <IonSkeletonText animated style={{ width: '60%', height:'20px'}} />
                <IonSkeletonText animated style={{ width: '15%', height:'20px'}} />
            </div>
            <div style={{paddingLeft:'16px', paddingRight:'16px'}}>
                <IonSkeletonText animated style={{ width: '30%', height:'20px'}} />
            </div>
            <div className='ion-margin-start ion-margin-end ion-margin-top' style={{display:'flex', width: '120%'}}>
                <IonSkeletonText animated style={{ width: '70%', height:'275px', marginRight:'16px'}} /> 
                <IonSkeletonText animated style={{ width: '70%', height:'275px'}} /> 
            </div>
        </section>
    )

    if(actionsLoading) return loadingskeleton()
    if(!actionsLoading && fetched && !data.length > 0) return <></>
    return (
        <section className='full-width ion-margin-bottom ion-padding-bottom ' style={props.borderBottom ? {borderBottom:'1px solid #e7e7e7'} : {}}>
            <div style={{display:'flex', alignItems:'end', justifyContent:'space-between', paddingLeft:'16px', paddingRight:'16px'}}>
                <IonText>
                    <h4 style={{fontWeight:'900', marginBottom:'4px'}}>{props.title}</h4>
                </IonText>
                <IonButton onClick={()=>router.push(props.urlButton)} fill='outline' size='small' color='primary'>
                    {props.buttonText}
                </IonButton>
            </div>
            <div style={{paddingLeft:'16px', paddingRight:'16px'}}>
                <IonButton onClick={()=>setFilterOpen(!filterOpen)} size='small' color={'secondary'} fill={'outline'}>{filterOpen ? 'Show all' : 'Show open now'}</IonButton>
            </div>
            {
                filterOpen && !data.length > 0 ? (
                    <div className='ion-margin ion-padding' style={{border:'1px solid #cccccc', borderRadius:'5px'}}>
                        <IonText color='dark'>
                            <h4 style={{textAlign:'center'}}>{props.noOpenResultsMessage}</h4>
                        </IonText>
                    </div>
                ) : (
                    <IonSlides pager={true} options={props.bigCard ? slideOptsBig : slideOpts} style={{paddingLeft:'16px', paddingRight:'16px', paddingTop:'4px', paddingBottom:'4px'}}>
                        {
                            data && data.length > 0 && data.map((x, i) => <IonSlide key={i} className={'ion-padding-bottom ion-padding-top'}>
                                    <props.card
                                        item={x}
                                    />
                                </IonSlide>
                            )
                        }
                    </IonSlides>
                )
            }   
        </section>
    );
};

export default BusinessesCarousel;