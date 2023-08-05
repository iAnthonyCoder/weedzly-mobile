import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonSlide, IonSlides, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonButton, IonIcon, IonTabs, IonTabBar, IonTabButton, IonLabel, IonBadge, IonItem, IonInput, IonText, useIonRouter } from '@ionic/react';
import { useParams } from 'react-router';
import { home, car, map, informationCircle, search, location, locationOutline, storefront, pricetag, basket, menu } from 'ionicons/icons';
import CardsCarousel from '../components/Carousels/CardsCarousel'
import './Page.css';
import TopToolbar from '../components/Common/TopToolbar';
import { MY_LOCATION, MY_LOCATION_PLACE, MY_LOCATION_PLACE_FULLNAME } from '../helpers/constants';
import { useEffect, useState } from 'react';
import { TemporaryLocation } from '../components/Modals/TemporaryLocation';
import useIsInViewport from 'use-is-in-viewport'
import { home_sliders } from '../config/home_page';
import DealsCarousel from '../components/Carousels/DealsCarousel';
import BusinessesCarousel from '../components/Carousels/BusinessesCarousel';
import { useDispatch, useSelector } from 'react-redux';
import { changeMustNavigateTo, updateModalStatus } from '../store/actions';
import Tabs from '../components/Tabs/Tabs';
import ProductCard from '../components/Cards/Product';
import StatesGrid from '../components/Sections/States';

const Page = () => {

    const router = useIonRouter()

    const redir = (path) => {
		router.push(path)
    }

    const { mustNavigateTo } = useSelector(state => state)

    const dispatch = useDispatch()
	
    useEffect(() => {
        if(mustNavigateTo.length > 0){
            dispatch(changeMustNavigateTo(''))
            router.push(mustNavigateTo)
        }
    }, [mustNavigateTo])

    const [ showLocationModal, setShowLocationModal ] = useState(false)

    const statesF = {
        'Alabama':'AL',
    'Alaska':'AK',
    'Arizona':'AZ',
    'Arkansas':'AR',
    'California':'CA',
    'Colorado':'CO',
    'Connecticut':'CT',
    'Delaware':'DE',
    'Florida':'FL',
    'Georgia':'GA',
    'Hawaii':'HI',
    'Idaho':'ID',
    'Illinois':'IL',
    'Indiana':'IN',
    'Iowa':'IA',
    'Kansas':'KS',
    'Kentucky':'KY',
    'Louisiana':'LA',
    'Maine':'ME',
    'Maryland':'MD',
    'Massachusetts':'MA',
    'Michigan':'MI',
    'Minnesota':'MN',
    'Mississippi':'MS',
    'Missouri':'MO',
    'Montana':'MT',
    'Nebraska':'NE',
    'Nevada':'NV',
    'New Hampshire':'NH',
    'New Jersey':'NJ',
    'New Mexico':'NM',
    'New York':'NY',
    'North Carolina':'NC',
    'North Dakota':'ND',
    'Ohio':'OH',
    'Oklahoma':'OK',
    'Oregon':'OR',
    'Pennsylvania':'PA',
    'Rhode Island':'RI',
    'South Carolina':'SC',
    'South Dakota':'SD',
    'Tennessee':'TN',
    'Texas':'TX',
    'Utah':'UT',
    'Vermont':'VT',
    'Virginia':'VA',
    'Washington':'WA',
    'West Virginia':'WV',
    'Wisconsin':'WI',
    'Wyoming':'WY',
    'District of Columbia':'DC'
    }
    

    const states = [
'AL',	
'AK',	
'AZ',	
'AR',	
'CA',	
'CO',	
'CT',	
'DE',	
'FL',	
'GA',	
'HI',	
'ID',	
'IL',	
'IN',	
'IA',	
'KS',	
'KY',	
'LA',	
'ME',	
'MD',	
'MA',	
'MI',	
'MN',	
'MS',	
'MO',	
'MT',	
'NE',	
'NV',
'NH',	
'NJ',	
'NM',	
'NY',	
'NC',	
'ND',	
'OH',	
'OK',
'OR',	
'PA',	
'RI',	
'SC',
'SD',
'TN',	
'TX',	
'UT',
'VT',	
'VA',	
'WA',	
'WV',	
'WI',	
'WY',	
'WC',
    ]

  
    return (
        
        <IonPage>
            
            <IonHeader>
                <IonToolbar>
                    <TopToolbar
                        logoTitle={'Weedzly'}
                        showLogo={true}
                    />
                </IonToolbar>
            </IonHeader>
        
            <IonContent>
                <section style={{
                    backgroundImage: `url(https://res.cloudinary.com/timj111/image/upload/f_auto,c_limit,q_75,w_${window.innerWidth*0.7}/v1633363545/states/State_${states.includes(localStorage.getItem('REGION') && localStorage.getItem('REGION').replaceAll('"', '')) ? localStorage.getItem('REGION') && localStorage.getItem('REGION').replaceAll('"', '') : statesF[localStorage.getItem('REGION').replaceAll('"', '')] ? statesF[localStorage.getItem('REGION').replaceAll('"', '')] : 'CA'}`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: '50% 30%',
                    borderBottom:'1px solid #e7e7e7',
                    backgroundColor:'white'
                }} className='full-width'>
                    <div style={{backgroundColor:'#00000061'}}>
                        <br />
                        <br />
                        <div>
                            <div style={{display:'flex', flexDirection:'column'}}>
                                <div className='ion-margin-top ion-padding-top ion-padding-bottom ion-margin-bottom'>
                                    <IonText color='light'>
                                        <h1 style={{textAlign:'center'}}>
                                            Browse dispensaries, find deals, & discover new strains
                                        </h1>
                                    </IonText>
                                    <form className='ion-padding ion-margin'>
                                        <input onFocus={()=>redir('/search')} placeholder='Search...' type='search' style={{borderRadius:'5px', width:'100%', paddingTop:'8px', paddingBottom:'8px', paddingLeft:'8px', paddingRight:'32px', backgroundColor:'white'}}></input>
                                        <IonIcon icon={search} style={{position:'absolute', fontSize:'20px', marginTop:'9px', marginLeft:'-6px', transform:'translateX(-100%)'}}></IonIcon>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <br />
                        <br />
                        <div onClick={()=>dispatch(updateModalStatus({location:true}))} style={{paddingRight:'16px', paddingLeft:'16px', paddingBottom:'0px', backgroundColor:'rgb(255 255 255 / 11%)', backdropFilter:'blur(5px)'}}>
                            <IonText color='light'>
                                <div style={{display:'flex', alignItems:'center'}}>
                                    <IonIcon style={{fontSize:'24px', marginRight:'8px'}} icon={locationOutline}></IonIcon>
                                    <p style={{fontSize:'14px'}} className='ellipsed-text'><strong>{localStorage.getItem(MY_LOCATION_PLACE_FULLNAME)}</strong></p>
                                </div>
                            </IonText>
                        </div>
                    </div>
                </section>
                <br/>
         
                {/* <CardsCarousel 
                    title={'Dispensaries near you'}
                />
                <CardsCarousel 
                    title={'Delivery Services In Your Area'}
                />
                <CardsCarousel 
                    title={'Featured Brands'}
                />*/}
                {
                    localStorage.getItem(MY_LOCATION) && <BusinessesCarousel 
                        {...home_sliders.nearestRetailers}
                        dispensaries={true}
                        disableBorder={true}
                    /> 
                }
                
                {
                    localStorage.getItem(MY_LOCATION) && <BusinessesCarousel 
                        {...home_sliders.deliveriesCoveringLocation}
                        deliveries={true}
                        disableBorder={true}
                    /> 
                }
                {
                    localStorage.getItem(MY_LOCATION_PLACE) && JSON.parse(localStorage.getItem(MY_LOCATION_PLACE)).stateId && <CardsCarousel 
                        {...home_sliders.featuredBrands}
                        disableBorder={true}
                    />
                }
                
                <DealsCarousel 
                    {...{
    
                        title:'Find Deals On',
                        subtitle:'Stay up to date with the cannabis world',
                        urlButton: '/library',
                        buttonText: 'See more',
                        geolocate: false,
                        bigCard: false,
                    }}
                />



                <CardsCarousel 
                    {...home_sliders.lastestArticles}
                />
                
                <StatesGrid 
                    title='Find Dispensaries Across America'
                />
                
            </IonContent>
            {
                showLocationModal && <TemporaryLocation 
                    showModal={showLocationModal}
                    setShowModal={
                        (val)=>{
                            setTimeout(() => {
                                setShowLocationModal(val)
                            }, 200);
                        }
                    }
                />
            }
            <Tabs/>
        </IonPage>
        
       
    );
};

export default Page;
