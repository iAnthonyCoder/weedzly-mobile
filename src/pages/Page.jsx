import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonSlide, IonSlides, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonButton, IonIcon, IonTabs, IonTabBar, IonTabButton, IonLabel, IonBadge, IonItem, IonInput, IonText, useIonRouter } from '@ionic/react';
import { useParams } from 'react-router';
import { home, car, map, informationCircle, search, location, locationOutline, storefront, pricetag, basket, menu } from 'ionicons/icons';
import CardsCarousel from '../components/Carousels/CardsCarousel'
import './Page.css';
import TopToolbar from '../components/Common/TopToolbar';
import cookie from 'js-cookie'
import { MY_LOCATION, MY_LOCATION_PLACE, MY_LOCATION_PLACE_FULLNAME } from '../helpers/constants';
import { useState } from 'react';
import { TemporaryLocation } from '../components/Modals/TemporaryLocation';
import useIsInViewport from 'use-is-in-viewport'
import { home_sliders } from '../config/home_page';
import DealsCarousel from '../components/Carousels/DealsCarousel';
import BusinessesCarousel from '../components/Carousels/BusinessesCarousel';
import { useDispatch } from 'react-redux';
import { updateModalStatus } from '../store/actions';
import Tabs from '../components/Tabs/Tabs';

const Page = () => {

    const router = useIonRouter()

    const redir = (path) => {
		router.push(path)
    }

    const dispatch = useDispatch()

    const [ showLocationModal, setShowLocationModal ] = useState(false)
  
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
                    backgroundImage: 'url(https://res.cloudinary.com/timj111/image/upload/v1633363545/states/lewfg8orxl2hy9rbe69n.jpg)',
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
                    disableBorder={true}
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
