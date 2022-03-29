// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { IonModal, IonButton, IonContent, IonRow, IonLoading, IonHeader, IonToolbar, IonTitle, IonButtons, IonItem, IonLabel, IonInput, IonList, IonIcon, IonCol, IonGrid, IonCard, IonCardHeader, IonRippleEffect, useIonRouter, IonText } from '@ionic/react';
import { mapOutline, bookmarkOutline, person, storefront, car, pricetag, rose, flask, map, book, library, bookmark, logIn, personAdd, locate } from 'ionicons/icons';
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
import { useSelector } from 'react-redux';
import './MenuModal.css'


export const MenuModal = (props) => {

    const user = useSelector(state => state.user)

    const router = useIonRouter()

    const redir = (path) => {
		props.setShowModal(false)
		router.push(path)
    }

    const logout = () => {
        
        localStorage.removeItem('user')
        props.setShowModal(false)
        window.location.reload();
    }

    return (
        <IonModal isOpen={props.showModal} swipeToClose={true} cssClass='my-custom-class'>
           
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Menu</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={()=>props.setShowModal(false)}>Close</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonGrid>
                    <IonRow >
                        <IonCol onClick={()=>{props.setShowLocationModal(true); props.setShowModal(false)}} size="12">
                            <IonCard className="ion-activatable ripple-parent" style={{marginInline:'0px', margin:'0px'}}>
                                <IonRippleEffect></IonRippleEffect>
                                <IonCardHeader  style={{paddingBottom:'8px', display:'flex', justifyContent:'space-between'}}>
                                    <h6 style={{marginTop:'0px'}}>Location</h6>
                                    <h6 style={{marginTop:'0px'}} color='primary' >Edit</h6>
                                </IonCardHeader>
                                <div style={{display:'flex', marginBottom:'16px', marginLeft:'16px', marginRight:'16px', alignItems:'center'}}>
                                    <IonIcon icon={locate} style={{fontSize:'24px', marginRight:'8px'}} />
                                    <span>{localStorage.getItem('MY_LOCATION_PLACE_FULLNAME')}</span>
                                </div>
                            </IonCard>
                        </IonCol>
                        {
                            _.isEmpty(user) ? (
                                <>
                                    <IonCol size="4">
                                        <IonCard onClick={()=>redir('/login')} className="ion-activatable ripple-parent" style={{marginInline:'0px', margin:'0px'}}>
                                            <IonRippleEffect></IonRippleEffect>
                                            <IonCardHeader>
                                                <h6 style={{marginTop:'0px'}}>Sign In</h6>
                                            </IonCardHeader>
                                            <div style={{display:'flex', justifyContent:'center', marginBottom:'16px'}}>
                                                <IonIcon icon={logIn} style={{fontSize:'36px'}} />
                                            </div>
                                        </IonCard>
                                    </IonCol>
                                    <IonCol size="4">
                                        <IonCard onClick={()=>redir('/signup')} className="ion-activatable ripple-parent" style={{marginInline:'0px', margin:'0px'}}>
                                            <IonRippleEffect></IonRippleEffect>
                                            <IonCardHeader>
                                                <h6 style={{marginTop:'0px'}}>Sign Up</h6>
                                            </IonCardHeader>
                                            <div style={{display:'flex', justifyContent:'center', marginBottom:'16px'}}>
                                                <IonIcon icon={personAdd} style={{fontSize:'36px'}} />
                                            </div>
                                        </IonCard>
                                    </IonCol>
                                </>
                            ) : (
                                <IonCol size="12">
                                    <IonCard className="ion-activatable ripple-parent" style={{marginInline:'0px', margin:'0px'}}>
                                        <IonRippleEffect></IonRippleEffect>
                                        <IonCardHeader>
                                            <h6 style={{marginTop:'0px', marginBottom:'0px'}}>My Account</h6>
                                        </IonCardHeader>
                                        <div style={{display:'flex', marginBottom:'16px', marginLeft:'16px', marginRight:'16px', alignItems:'center'}}>
                                            <IonIcon icon={person} style={{fontSize:'36px'}} />
                                            <div style={{display:'flex', flexDirection:'column', marginLeft:'10px'}}>
                                                <IonText >@{user.nickname}</IonText>
                                                <IonText >{user.email}</IonText>
                                            </div>
                                        </div>
                                        <IonButtons style={{display:'flex', justifyContent:'end'}} className='ion-padding-start ion-padding-end ion-padding-bottom'>
                                            <IonButton onClick={()=>redir('/profile')} fill='solid' slot='end' color='success'>My Profile</IonButton>&nbsp;&nbsp;
                                            <IonButton onClick={()=>redir('/account')} fill='solid' slot='end' color='primary'>Update</IonButton>&nbsp;&nbsp;
                                            <IonButton fill='solid' slot='end' color='danger' onClick={()=>{
                                                logout()
                                            }}>Logout</IonButton>
                                        </IonButtons>
                                    </IonCard>
                                </IonCol>
                            )
                        }
                        <IonCol size="4">
                            <IonCard onClick={()=>redir('/businesses#dispensaries')} className="ion-activatable ripple-parent" style={{marginInline:'0px', margin:'0px'}}>
                                <IonRippleEffect></IonRippleEffect>
                                <IonCardHeader>
                                    <h6 className='ellipsed-1' style={{marginTop:'0px'}}>Dispensaries</h6>
                                </IonCardHeader>
                                <div style={{display:'flex', justifyContent:'center', marginBottom:'16px'}}>
                                    <IonIcon icon={storefront} style={{fontSize:'36px'}} />
                                </div>
                            </IonCard>
                        </IonCol>
                        <IonCol size="4">
                            <IonCard onClick={()=>redir('/businesses#deliveries')} className="ion-activatable ripple-parent" style={{marginInline:'0px', margin:'0px'}}>
                                <IonRippleEffect></IonRippleEffect>
                                <IonCardHeader>
                                    <h6 className='ellipsed-1' style={{marginTop:'0px'}}>Deliveries</h6>
                                </IonCardHeader>
                                <div style={{display:'flex', justifyContent:'center', marginBottom:'16px'}}>
                                    <IonIcon icon={car} style={{fontSize:'36px'}} />
                                </div>
                            </IonCard>
                        </IonCol>
                        <IonCol size="4">
                            <IonCard onClick={()=>redir('/deals')} className="ion-activatable ripple-parent" style={{marginInline:'0px', margin:'0px'}}>
                                <IonRippleEffect></IonRippleEffect>
                                <IonCardHeader>
                                    <h6 className='ellipsed-1' style={{marginTop:'0px'}}>Deals</h6>
                                </IonCardHeader>
                                <div style={{display:'flex', justifyContent:'center', marginBottom:'16px'}}>
                                    <IonIcon icon={pricetag} style={{fontSize:'36px'}} />
                                </div>
                            </IonCard>
                        </IonCol>
                        <IonCol size="4">
                            <IonCard onClick={()=>redir('/brands')} className="ion-activatable ripple-parent" style={{marginInline:'0px', margin:'0px'}}>
                                <IonRippleEffect></IonRippleEffect>
                                <IonCardHeader>
                                    <h6 className='ellipsed-1' style={{marginTop:'0px'}}>Brands</h6>
                                </IonCardHeader>
                                <div style={{display:'flex', justifyContent:'center', marginBottom:'16px'}}>
                                    <IonIcon icon={bookmark} style={{fontSize:'36px'}} />
                                </div>
                            </IonCard>
                        </IonCol>
                        <IonCol size="4">
                            <IonCard onClick={()=>redir('/products')} className="ion-activatable ripple-parent" style={{marginInline:'0px', margin:'0px'}}>
                                <IonRippleEffect></IonRippleEffect>
                                <IonCardHeader>
                                    <h6 className='ellipsed-1' style={{marginTop:'0px'}}>Products</h6>
                                </IonCardHeader>
                                <div style={{display:'flex', justifyContent:'center', marginBottom:'16px'}}>
                                    <IonIcon icon={rose} style={{fontSize:'36px'}} />
                                </div>
                            </IonCard>
                        </IonCol>
                        <IonCol size="4">
                            <IonCard onClick={()=>redir('/strains')} className="ion-activatable ripple-parent" style={{marginInline:'0px', margin:'0px'}}>
                                <IonRippleEffect></IonRippleEffect>
                                <IonCardHeader>
                                    <h6 className='ellipsed-1' style={{marginTop:'0px'}}>Strains</h6>
                                </IonCardHeader>
                                <div style={{display:'flex', justifyContent:'center', marginBottom:'16px'}}>
                                    <IonIcon icon={flask} style={{fontSize:'36px'}} />
                                </div>
                            </IonCard>
                        </IonCol>
                        <IonCol size="4">
                            <IonCard onClick={()=>redir('/map')} className="ion-activatable ripple-parent" style={{marginInline:'0px', margin:'0px'}}>
                                <IonRippleEffect></IonRippleEffect>
                                <IonCardHeader>
                                    <h6 className='ellipsed-1' style={{marginTop:'0px'}}>Map</h6>
                                </IonCardHeader>
                                <div style={{display:'flex', justifyContent:'center', marginBottom:'16px'}}>
                                    <IonIcon icon={map} style={{fontSize:'36px'}} />
                                </div>
                            </IonCard>
                        </IonCol>
                        <IonCol size="4">
                            <IonCard onClick={()=>redir('/library')} className="ion-activatable ripple-parent" style={{marginInline:'0px', margin:'0px'}}>
                                <IonRippleEffect></IonRippleEffect>
                                <IonCardHeader>
                                    <h6 className='ellipsed-1' style={{marginTop:'0px'}}>Library</h6>
                                </IonCardHeader>
                                <div style={{display:'flex', justifyContent:'center', marginBottom:'16px'}}>
                                    <IonIcon icon={library} style={{fontSize:'36px'}} />
                                </div>
                            </IonCard>
                        </IonCol>
                        <IonCol size="4">
                            <IonCard onClick={()=>redir('/glossary')} className="ion-activatable ripple-parent" style={{marginInline:'0px', margin:'0px'}}>
                                <IonRippleEffect></IonRippleEffect>
                                <IonCardHeader>
                                    <h6 className='ellipsed-1' style={{marginTop:'0px'}}>Glossary</h6>
                                </IonCardHeader>
                                <div style={{display:'flex', justifyContent:'center', marginBottom:'16px'}}>
                                    <IonIcon icon={book} style={{fontSize:'36px'}} />
                                </div>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                    {/* <IonButton expand='full' color='danger'>Logout</IonButton> */}
                </IonGrid>
            </IonContent>
        </IonModal>
    );
};