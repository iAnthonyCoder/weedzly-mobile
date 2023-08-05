import React, { useState, useEffect, useRef } from 'react'
import MainMap from '../../components/Map/MainMap'
import { MY_LOCATION } from '../../helpers/constants'
import { createGesture, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonMenuButton, IonModal, IonProgressBar, IonSlide, IonSlides, IonTitle, IonToolbar, IonList, IonButton, IonPage, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react'
import { dispensaryService } from '../../services'
import { getDayAndTime } from '../../helpers/time'
import queryString from 'query-string'
import { useDebounce } from 'use-debounce';
import RetailerMapCard from '../../components/Cards/RetailerMap'
import CardsCarousel from '../../components/Carousels/CardsCarousel'
import './index.css'
import { filter, list, locateOutline, map } from 'ionicons/icons'
import CheckIfOpen from '../../helpers/checkIfOpen'
import moment from 'moment'
import TopToolbar from '../../components/Common/TopToolbar'
import VariousFilterModal from '../../components/Modals/VariousFilterModal'
import filtering_settings from '../../config/filtering_settings'
import Sorter from '../../components/Common/Sorter'
import sorting_settings from '../../config/sorting_settings'
import Tabs from '../../components/Tabs/Tabs'
import FullSpinner from '../../components/Common/FullSpinner'
import mapboxgl from 'mapbox-gl';
import { REACT_APP_PUBLIC_MAPBOX_ACCESS_TOKEN } from '../../config/tokens'



const Map = () => {

    mapboxgl.accessToken = REACT_APP_PUBLIC_MAPBOX_ACCESS_TOKEN;
    mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;
    const mapContainer = useRef(null);

    const map = useRef(null);

    const [ fetchedViewport, setFetchedViewport ] = useState({
        longitude: 0,
        latitude: 0,
        zoom: 11,
        start: true
    })


    useEffect(() => {
        let _viewportFromCookies = JSON.parse(localStorage.getItem(MY_LOCATION))
        if (map.current) return;
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [_viewportFromCookies.longitude, _viewportFromCookies.latitude],
            zoom: 12,
        });
    }, [])
    
    

    return (
        <IonPage>
        
           
            <IonHeader>
                <TopToolbar 
                    title='Map'
                />
            </IonHeader>
            <IonContent>
            <div>
<div ref={mapContainer} style={{height:'400px'}} />
</div>
            </IonContent>
           
        </IonPage>
    )
}

export default Map