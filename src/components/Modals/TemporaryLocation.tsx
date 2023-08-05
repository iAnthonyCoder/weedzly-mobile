// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { IonModal, IonButton, IonContent, IonLoading, IonHeader, IonToolbar, IonTitle, IonButtons, IonItem, IonLabel, IonInput, IonList, IonIcon, IonProgressBar, IonSearchbar, IonFooter } from '@ionic/react';
import { mapOutline, bookmarkOutline } from 'ionicons/icons';
import './TemporaryLocation.css'
import { static_img_url_creator } from '../../helpers/static_img_url_creator';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { useDebounce } from 'use-debounce'
import queryString from 'query-string'
import { mapboxService } from '../../services/mapbox.service';
import * as turf from "@turf/turf";
import _ from 'lodash'
import { BACKGROUND_STATE, BRANDS_IN_SUBZONE, DELIVERY_IN_SUBZONE, DISPENSARY_IN_SUBZONE, MY_LOCATION, MY_LOCATION_PLACE, MY_LOCATION_PLACE_FULLNAME, MY_LOCATION_PLACE_NAME } from '../../helpers/constants';
import { locateOutline } from 'ionicons/icons';
import { stateService } from '../../services/state.service';
import { cityService } from '../../services/city.service';
import FullSpinner from '../Common/FullSpinner';
import { useDispatch, useSelector } from 'react-redux';
import { updateModalStatus } from '../../store/actions';
import { sponsor_subzoneService } from '../../services/sponsor_subzone.service';
declare type Units = "miles"

interface LocationProps {
	showModal: boolean,
	setShowModal: Function,
}

export const TemporaryLocation: React.FC<LocationProps> = (props) => {

    const [ error, setError ] = useState({showError: false})
    const childRef = useRef();
    const location = localStorage.getItem('myLocation')
    const locationPlace = localStorage.getItem('myLocationPlace')
    const fullLocationDetails = localStorage.getItem(MY_LOCATION_PLACE_FULLNAME)
    const [ actionsLoading, setActionsLoading ] = useState(false)
    const [ selectedPlace, setSelectedPlace ] = useState({})
    const [ searched, setSearched ] = useState(false)
    const radiusInput = useRef()
    const searchInput = useRef()
    const [ search, setSearch ] = useState(fullLocationDetails)
    const [ place, setPlace ] = useState({})
    const [ radius, setRadius ] = useState(Math.round(location ? (parseInt(JSON.parse(location).boundingRadius, 10))/1609.34 : 50))
    const [ searchEnabled, setSearchEnabled ] = useState(false)
    const [ results, setResults ] = useState([])
    const [ polygon, setPolygon ] = useState({})
    const [ notFound, setNotFound ] = useState(false)

    const { modals } = useSelector(state => state)

    const fetchSearch = async (value: any) => {
        try {
            setSearched(true)
            setActionsLoading(true)
            let result = await mapboxService.geocoding(value, ['address', 'place', 'region', 'postcode'])
            if(result.features.length > 0 ){
                setNotFound(false)
            } else {
                setNotFound(true)
            }
            setResults(result.features)
            setActionsLoading(false)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if(!_.isEmpty(selectedPlace)){
            setResults({})
            setSearch(selectedPlace.place_name)
            setPlace({
                longitude: selectedPlace.center[0],
                latitude: selectedPlace.center[1],
            })
        }
    }, [selectedPlace])

    useEffect(() => {
        if((search != fullLocationDetails) && (search != selectedPlace.place_name)){
            fetchSearch(search)
        }
    }, [search])

    // useEffect(() => {
    //     debouncedSearchTerm && debouncedSearchTerm.length > 0 && searchEnabled && fetchSearch(debouncedSearchTerm)
    // }, [debouncedSearchTerm])

    useEffect(() => {
        if(locationPlace){
            // setSearch(JSON.parse(String(locationPlace)).place_name)
            setPlace({
                longitude: JSON.parse(String(locationPlace)).center[0],
                latitude: JSON.parse(String(locationPlace)).center[1],
            })
        }
    }, [props])

    useEffect(() => {
        if(!_.isEmpty(place)){
            createGeoJSONCircle(place.longitude, place.latitude)
        }
    }, [place, radius])

   

    const createGeoJSONCircle = (longitude: any, latitude: any) => {
        let _center = turf.point([longitude, latitude]);
        let _radius = 50;
        let _options = {
            steps: 80,
            units: 'miles'
        };
   
        let _circle = turf.circle(_center, _radius, _options);
        setPolygon(_circle.geometry)
    }

    const getLocation = async () => {
    
		setActionsLoading(true)
		try {
			const position = await Geolocation.getCurrentPosition();
			let res = await mapboxService.reverseGeocoding(position.coords.longitude, position.coords.latitude, 'types=address%2Cplace%2Cregion%2Cpostcode')
            if(res.features && res.features.length > 0){
                
              
                setSelectedPlace(res.features[0])
            }
			setError({showError: false, message: undefined})
			setActionsLoading(false)
			
		} catch (e) {
            console.log(e);
			const message = e.message.length > 0 ? e.message : 'Cannot get user location'
			setError({showError: true, message: message})
			setActionsLoading(false)
		}
	}

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
    

    const applyLocation = async () => {
        setActionsLoading(true)
        return mapboxService.reverseGeocoding(selectedPlace.center[0], selectedPlace.center[1], 'types=address%2Cplace%2Cregion%2Cpostcode')
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
        await localStorage.setItem(MY_LOCATION_PLACE_NAME, locationPlaceName, { path: '/' });
        await localStorage.setItem(MY_LOCATION_PLACE_FULLNAME, res.features[0].place_name, { path: '/' });
        await localStorage.setItem(MY_LOCATION, JSON.stringify({
            longitude: selectedPlace.center[0], 
            latitude: selectedPlace.center[1],
            zoom:8,
            boundingRadius:80467,
            type: 'AUTO'
        }), { path: '/' })
        await localStorage.setItem(MY_LOCATION_PLACE, JSON.stringify(myLocationPlace), { path: '/' });
        await getBusinessSubzone() 
        window.location.reload()
    })  
    }
    
    const [ activeModal, setActiveModal ] = useState(false)
    const dispatch = useDispatch()

    return (
        <>
       
        
        <IonModal 
            isOpen={modals.location} 
            // swipeToClose={true}
            showBackdrop={true}
            // handle={true}
            onDidDismiss={() => setActiveModal(false)}
        >
            <IonHeader>
                    <IonToolbar style={{borderBottom:'1px solid rgb(244 244 244)'}}>
                        <IonTitle>Location settings</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={()=>dispatch(updateModalStatus({location:false}))}>Close</IonButton>
                        </IonButtons> 
                    </IonToolbar>
                    <IonToolbar>
                        <IonSearchbar 
                            value={search}
                            debounce={'1000'}
                            onIonChange={(e)=>e.target.value.length > 5 ? setSearch(e.target.value) : ''}
                            type='search'
                            placeholder='Search location'
                        /> 
                        {
                        results.length > 0 ? 
                            <IonList style={{paddingBottom:'0'}}>
                                {
                                    results.map((x: object, i: number) => <IonItem lines={`${i+1 === results.length ? 'none' : 'inset'}`} onClick={()=>setSelectedPlace(x)}>
                                        <IonIcon slot="start" icon={locateOutline} />
                                        <IonLabel>
                                            <h2>{x.place_name}</h2>
                                        </IonLabel>
                                    </IonItem>)
                                }
                            </IonList> : (!results.length > 0 && !actionsLoading && notFound) && (
                                searched && <h4 style={{textAlign:'center'}}>No results found</h4>
                            )
                        
                    }
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    {
                        actionsLoading ? (
                            <FullSpinner />
                        ) : (<>
                            <div className='ion-padding-start ion-padding-end'>

                            <br />
                            {/* <IonItem>
                                <IonLabel position="stacked">Radius</IonLabel>
                                <IonInput value={''}> </IonInput>
                            </IonItem>
                            <br /> */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                            }}>
                                <img 
                                    style={{borderRadius:'5px', margin:'0 auto'}}
                                    src={static_img_url_creator(polygon)}
                                    className='w-100 rounded'
                                />
                                <div style={{display:'flex', justifyContent:'center', marginTop:'1rem'}}>
                                    <IonButton color='secondary' onClick={() => getLocation()}>Detect my location</IonButton>
                                </div>
                            </div>
                            </div>
                            </>
                        )
                    }
                    
                        
                    
                </IonContent>
                <IonFooter>
                    <section>
                        <IonButton color='primary' expand='block' disabled={_.isEmpty(selectedPlace) || actionsLoading} onClick={() => applyLocation()}>Apply</IonButton>
                    </section>
                </IonFooter>
        </IonModal>
        </>
    );
};