import { IonApp, IonBadge, IonIcon, IonLabel, IonLoading, IonRouterOutlet, IonSkeletonText, IonSplitPane, IonTabBar, IonTabButton, IonTabs, IonToast, setupIonicReact, useIonRouter } from '@ionic/react';
import { home, car, map, informationCircle, starOutline, homeOutline, mapOutline, storefrontOutline, pricetagOutline, basketOutline, menuOutline, pricetag, storefront, basket, menu } from 'ionicons/icons';
import React, { useState, useEffect } from 'react';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Page from './pages/Page';
import Tabs from './components/Tabs/Tabs'
import { Storage } from '@capacitor/storage';
import _ from 'lodash';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { mapboxService } from './services/mapbox.service';
import { BACKGROUND_STATE, BRANDS_IN_SUBZONE, DELIVERY_IN_SUBZONE, DISPENSARY_IN_SUBZONE, MY_LOCATION, MY_LOCATION_PLACE, MY_LOCATION_PLACE_FULLNAME, MY_LOCATION_PLACE_NAME } from './helpers/constants';
import { stateService } from './services/state.service';
import { cityService } from './services/city.service';
import { sponsor_subzoneService } from './services/sponsor_subzone.service'
import BusinessProfile from './pages/businesses/business/Overview';
import Map from './pages/map/index';
import { MenuModal } from './components/Modals/MenuModal';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import { Router } from 'workbox-routing';
import { TemporaryLocation } from './components/Modals/TemporaryLocation';
import Search from './pages/search/Index';
import Notifications from './pages/notifications';
import { useDispatch, useSelector } from 'react-redux';
import { checkUserLogin, getFavorites } from './store/actions';
import Account from './pages/account';
import Deals from './pages/deals/Deals'
import Products from './pages/products/Categorize'
import Brands from './pages/brands/Brands';
import Library from './pages/library/Library';
import Strains from './pages/strains/Strains'
import Strain from './pages/strains/strain/Strain'
import ProductList from './pages/products/List';
import Businesses from './pages/businesses';
import Brand from './pages/brands/brand';
import Glossary from './pages/glossary/Glossary'
import Article from './pages/library/Article';
import BusinessCard from './components/Cards/Business';
import Profile from './pages/profile/Page';
import { favoriteService } from './services/favorite.service';
import DealPage from './pages/businesses/business/Deal';
import BrandProduct from './pages/brands/brand/product/Page';
import BusinessProduct from './pages/businesses/business/products/Page';
import Cart from './pages/cart/Page';
import useCart from './hooks/useCart';
import Checkout from './pages/checkout/Page';
import Order from './pages/profile/orders/Order';
import ReceiptModal from './components/Modals/Receipt';
import ModalsController from './components/ModalsController';
import DataGetter from './dataGetter';
import OrderNoAccount from './pages/orders/Order';
import AppMenu from './pages/menu/Page';
import { Toast } from "@capacitor/toast";
import { userService } from './services/user.service';
import { accountService } from './services';
import { useHistory } from 'react-router'
import moment from 'moment';
import StateList from './pages/businesses/StateList';
import StateListWrapper from './pages/businesses/StateList';
import CityListWrapper from './pages/businesses/CityList';


interface LocationError {
	showError: boolean;
	message?: string;
}

interface Location {
	longitude: number,
	latitude: number,
	boundingRadius: number
}

setupIonicReact();

const App: React.FC = () => {

	const [ loading, setLoading ] = useState<boolean>(false)
	const [ error, setError ] = useState<LocationError>({showError: false})
	const [ location, setLocation ] = useState<Location>({
		longitude: -118.24368,
		latitude: 34.05223,
		boundingRadius: 80467
	})

	




	const locationPlace = localStorage.getItem('myLocationPlace')

	const getLocation = async () => {
		setLoading(true)
		try {
			const position = await Geolocation.getCurrentPosition();
			setLocation({
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
				boundingRadius: 80467
			})
			await reverseGeoFetch(position.coords.longitude, position.coords.latitude)
			setError({showError: false, message: undefined})
			
			
		} catch (e) {
		
			setError({showError: true, message: 'Cannot get user location'})
			setLoading(false)
		}
	}

	const getLocationByIp = async () => {
		let response = await fetch('https://www.iplocate.io/api/lookup/')
		let parsedData = await response.json()
		setLocation({
			latitude: parsedData.latitude,
			longitude: parsedData.longitude,
			boundingRadius: 80467
		})
		// reverseGeoFetch(parsedData.longitude, parsedData.latitude)
		getLocation()
	};

	const getStateId = async (uuid: string) => {
        try {
            let state = await stateService.findByUUID(uuid)
            return state
        } catch {
            return false
        }
    }

	const getCityId = async (uuid: string) => {
        try {
            let state = await cityService.findByUUID(uuid)
            return state
        } catch {
            return false
        }
    }

	const reverseGeoFetch = (long: any, lat: any) => {
        return mapboxService.reverseGeocoding(long, lat, 'types=address%2Cplace%2Cregion%2Cpostcode')
            .then(async res => {

                let myLocationPlace = {
                    place: res.features.find( (x: any) => x.id.includes('place')).text,
                    region: res.features.find( (x: any) => x.id.includes('region')).text,
                    center: res.features.find( (x: any) => x.id.includes('place')).center,
                }
                let state = res.features.find( (x: any) => x.id.includes('region')).text
			
				await localStorage.setItem('REGION', state);
                let zip = res.features.find( (x: any) => x.id.includes('postcode'))
                let city = res.features.find( (x: any) => x.id.includes('place'))
                let secondText = res.features.find( (x: any) => x.id.includes('region')).context[0].short_code
                if(zip){
                    secondText = zip.text.toUpperCase()
                }
                if(city){
                    state = city.text
                }
                let locationPlaceName = state + ', ' + secondText
                await localStorage.setItem(MY_LOCATION_PLACE_NAME, locationPlaceName);
				
                await localStorage.setItem(MY_LOCATION_PLACE_FULLNAME, res.features[0].place_name);
                await localStorage.setItem(MY_LOCATION, JSON.stringify({
                    longitude: long, 
                    latitude: lat,
                    zoom:8,
                    boundingRadius:80467,
                    type: 'AUTO'
                }))
                await localStorage.setItem(MY_LOCATION_PLACE, JSON.stringify(myLocationPlace));
                await getBusinessSubzone()
            })  
    }

	const dispatch = useDispatch()

	
	const getBusinessSubzone = async () => {

		try {
			let loc = JSON.parse(localStorage.getItem(MY_LOCATION_PLACE) || '')
			let location = JSON.parse(localStorage.getItem(MY_LOCATION) || '')
			let {
				longitude,
				latitude
			} = location
			await localStorage.removeItem(BRANDS_IN_SUBZONE)
			await localStorage.removeItem(DISPENSARY_IN_SUBZONE)
			await localStorage.removeItem(DELIVERY_IN_SUBZONE)
			let sponsor_subzone = await sponsor_subzoneService.findByLocation(longitude, latitude)
			if(Object.keys(sponsor_subzone).length > 0){
				if(sponsor_subzone.brand && sponsor_subzone.brand.length > 0){
					await localStorage.setItem(BRANDS_IN_SUBZONE, JSON.stringify(sponsor_subzone.brand));
				} 
				if(sponsor_subzone.dispensary && Object.keys(sponsor_subzone.dispensary).length > 0){
					await localStorage.setItem(DISPENSARY_IN_SUBZONE, JSON.stringify(sponsor_subzone.dispensary));
				} 
				if(sponsor_subzone.delivery && Object.keys(sponsor_subzone.delivery).length > 0){
					await localStorage.setItem(DELIVERY_IN_SUBZONE, JSON.stringify(sponsor_subzone.delivery));
				} 
			
				if(sponsor_subzone.state && Object.keys(sponsor_subzone.state).length > 0){
					await localStorage.setItem(MY_LOCATION_PLACE, JSON.stringify({...loc, state:sponsor_subzone.state}))
					await localStorage.setItem('IS_CANNABIS_LEGAL', JSON.stringify(sponsor_subzone.state.isCannabisLegal))
					await localStorage.setItem('IS_DELIVERY_AVAILABLE', JSON.stringify(sponsor_subzone.state.isDeliveryAvailable))
				}
			}
			await localStorage.setItem('SPONSORED_SCANNED', moment().toString());
			setLoading(false)
			window.location.reload()
			return true

		} catch (er) {
			window.location.reload()
			return false

		}

	}


	useEffect(() => {
		setLoading(true)
		dispatch(checkUserLogin())
		if(!locationPlace){
			getLocationByIp()
		} else if(!localStorage.getItem('SPONSORED_SCANNED') || moment(localStorage.getItem('SPONSORED_SCANNED')).add(1, 'days').diff(moment(), 'days') < 0){
			getBusinessSubzone()
		} else {
			setLoading(false)
		}
	}, [])


	

  	return (
  	  	<IonApp>
			<DataGetter />
			{
				loading ? (
					<IonLoading 
						isOpen={loading}
						message={'Getting location...'}
						onDidDismiss={()=>setLoading(false)}
					/>
				) : (
					<IonReactRouter >
						<IonTabs >
						<IonRouterOutlet id="main">

							<Route path="/businesses" exact={true} component={Businesses} />

							<Route exact path={`/`}>
								<Redirect to={`/home`} />
							</Route>

							<Route path={`/orders/:_id`} component={OrderNoAccount} />
							<Route exact path={`/home`} component={Page} />
							<Route exact path={`/cart`} component={Cart} />
							<Route exact path={`/menu`} component={AppMenu} />
							<Route exact path={`/checkout`} component={Checkout} />
  	  	  			  		<Route exact path={`/businesses#dispensaries`} component={Businesses} />
  	  	  			  		<Route exact path={`/businesses#deliveries`} component={Businesses} />
							<Route path={`/businesses/profile/:slug`} component={BusinessProfile} />

							<Route path={`/businesses/in/:region_ab`} component={StateListWrapper} />
							<Route path={`/businesses/in/:region_ab/:city_slug`} component={CityListWrapper} />


							<Route exact path={`/map`} component={Map} />

							<Route path={`/search`} component={Search} />
							<Route path={`/notifications`} component={Notifications} />
							<Route path={`/account`} component={Account} />
							<Route path={`/deals`} component={Deals} />
							<Route exact={true} path={`/strains`} component={Strains} />
							<Route path={`/strains/:slug`} component={Strain} />

							<Route exact={true} path={`/products`} component={Products} />
							<Route exact={true} path={`/brands`} component={Brands} />
							<Route path={`/brands/:slug`} component={Brand} />
							<Route exact={true} path={`/library`} component={Library} />
							<Route exact={true} path={`/library/:slug`} component={Article} />
							<Route exact={true} path={`/glossary`} component={Glossary} />
							<Route path={`/products/list`} component={ProductList} />
							<Route exact={true} path={`/profile`} component={Profile} />
							<Route path={`/profile/orders/:_id`} component={Order} />

							<Route path={`/brandproduct/:brand_slug/:product_slug`} component={BrandProduct} />
							<Route path={`/businesses/:dispensary_slug/products/:product_slug`} component={BusinessProduct} />
							<Route path={`/businesses/:businessSlug/deals/:dealSlug`} component={DealPage} />
  	  	  			  	</IonRouterOutlet>

        					<IonTabBar slot="bottom" style={{display:'none'}}>
								<IonTabButton tab="Home" href={'/home'}>
									<IonIcon icon={home} />
        					        <IonLabel>Home</IonLabel>
        					        {/* <IonBadge>6</IonBadge> */}
        					    </IonTabButton>
        					    <IonTabButton tab="Dispensaries" href={'/businesses'}>
									<IonIcon icon={storefront} />
        					        <IonLabel>Dispensaries</IonLabel>
        					        {/* <IonBadge>6</IonBadge> */}
        					    </IonTabButton>
        					    <IonTabButton tab="Deals" href={'/deals'}>
									<IonIcon icon={pricetag} />
        					        <IonLabel>Deals</IonLabel>
        					        {/* <IonBadge>6</IonBadge> */}
        					    </IonTabButton>
								<IonTabButton tab="Products" href={'/products'}>
									<IonIcon icon={basket} />
        					        <IonLabel>Products</IonLabel>
        					        {/* <IonBadge>6</IonBadge> */}
        					    </IonTabButton>

								<IonTabButton tab="Menu" href={'/menu'} >

									<IonIcon icon={menu} />
        					        <IonLabel>Menu</IonLabel>
        					        {/* <IonBadge>6</IonBadge> */}

        					    </IonTabButton>

        					</IonTabBar>
        				</IonTabs>
							<ModalsController />
  	  	  			  	  	{/* <Menu /> */}
							{/* <Tabs /> */}
  	  	  			</IonReactRouter>
				)
			}
  	  	</IonApp>
  	);
};

export default App;
