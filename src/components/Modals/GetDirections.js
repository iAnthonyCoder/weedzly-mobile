// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { IonModal, IonButton, IonContent, IonLoading, IonHeader, IonToolbar, IonTitle, IonButtons, IonItem, IonLabel, IonInput, IonList, IonIcon, useIonModal, IonPage } from '@ionic/react';
import { mapOutline, bookmarkOutline } from 'ionicons/icons';
import './TemporaryLocation.css'
import { static_img_url_creator } from '../../helpers/static_img_url_creator';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { useDebounce } from 'use-debounce'
import queryString from 'query-string'
import cookie from 'js-cookie';
import { mapboxService } from '../../services/mapbox.service';
import * as turf from "@turf/turf";
import _ from 'lodash'
import { BACKGROUND_STATE, MY_LOCATION, MY_LOCATION_PLACE, MY_LOCATION_PLACE_FULLNAME, MY_LOCATION_PLACE_NAME } from '../../helpers/constants';
import { locateOutline } from 'ionicons/icons';
import { stateService } from '../../services/state.service';
import { cityService } from '../../services/city.service';
import RouteMap from '../Map/RouteMap';


export const GetDirectionsModal = (props) => {


    const Modal = (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Directions</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={()=>dismiss()}>Close</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                
                <RouteMap selectedDeal={{dispensary: props.entity}} />
                <div style={{padding:'0.5rem', position:'absolute', bottom:'0', width:'100%', zIndex:'100'}}>
                    <IonButton expand='full' onClick={()=>
                        window.open(`https://www.google.com/maps/dir/?api=1&origin=${JSON.parse(localStorage.getItem(MY_LOCATION)).latitude},${JSON.parse(localStorage.getItem(MY_LOCATION)).longitude}&destination=${props.entity.location.coordinates[1]},${props.entity.location.coordinates[0]}`, '_blank'
                        )} style={{bottom:'0', width:'100%'}}>
                        Google directions
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
       
    );

    const [present, dismiss] = useIonModal(Modal, {
        onDismiss: setTimeout(() => {
            props.setShowModal(false)
        }, 500)
    });

    useEffect(() => {
        props.showModal && present();
    }, [props.showModal])
    
    return false
};