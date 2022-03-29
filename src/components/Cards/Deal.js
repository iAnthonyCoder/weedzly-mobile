import { IonBadge, IonCard, IonCardContent, IonCardHeader, IonItemDivider, IonLabel, useIonRouter } from '@ionic/react'
import React, { useState } from 'react'
import * as turf from "@turf/turf";
import './Deal.css'
import { MY_LOCATION } from '../../helpers/constants';
import cookie from 'js-cookie'
import { dealsCategories, dealsTagetAudiences } from '../../helpers/dealsFeatures';

const DealCard = ({item, showDays, hideDispensaryName, businessSlug}) => {

    function isOdd(num) { return num % 2;}

    const router = useIonRouter()

    const redir = (path) => {
		router.push(path)
    }

    const { latitude, longitude } = JSON.parse(localStorage.getItem(MY_LOCATION))

    return (
        <IonCard onClick={()=>redir(`/businesses/${businessSlug}/deals/${item.slug}`)} className={'ion-no-margin'} style={{height:'100%'}}>
            <IonCardContent className='ion-no-padding' style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                <div>
                    {
                        showDays && item.isDaily && <div className='bottom-bordered'>
                            <div className='ion-padding-start ion-padding-end' style={{display:'flex', alignItems:'center', paddingTop:'8px', paddingBottom:'8px'}}>
                                <small style={{marginRight:'0.2rem'}}>Available on:</small>{
                                    item.days.length > 2 ? (
                                        item.days.map((x, i)=> <small className='text-bold text-dark'>{x.substr(0, 2)}{i+1 === item.days.length ? '' : <span style={{marginRight:'3px'}}>,</span>}</small>)
                                    ) : (
                                        item.days.map((x) => <IonBadge color='primary'><small>{x}</small></IonBadge>)
                                    )
                                }
                            </div>
                        </div>
                    }
                    <div className='ion-margin-start ion-margin-end ion-margin-top'>
                        <h2 style={{textAlign:'center'}}><strong>{item.name}</strong></h2>
                        {/* <IonBadge color='success'></IonBadge> */}
                    </div>
                    {
                        item.categories && Array.isArray(item.categories) && item.categories.length > 0 && <div style={{textAlign:'center', marginTop:'0.5rem', marginBottom:'0.5rem'}}>
                            {
                                item.categories.slice(0, 5).map( (x, i) => <>{i > 1 && isOdd(i) ? <br></br> : ''}<IonBadge style={{marginLeft:'1px', marginRight:'1px'}} color='secondary'>
                                    {x.name}
                                </IonBadge></>)
                            }
                            {
                                item.categories.length > 5 && (
                                    <> 
                                        <IonBadge style={{marginLeft:'1px', marginRight:'1px'}} color='secondary'>+ {item.categories.length - 5} more</IonBadge>
                                    </>  
                                )
                            }
                        </div>
                    }
                    {
                        ((!item.brands && !item.genetics && !item.categories) || (item.genetics && !item.genetics.length>0) && (item.brands &&!item.brands.length>0) && (item.categories && !item.categories.length>0)) && (
                            <div style={{display:'flex', justifyContent:'center', marginTop:'0.5rem', marginBottom:'0.5rem'}}>
                                <IonBadge color='secondary'>
                                    All items in-store
                                </IonBadge>
                            </div>
                        )
                    }

                    {
                        (item.isMedical || item.isRecreational) && <div style={{display:'flex', width:'100%', justifyContent:'center', marginBottom:'0.5rem'}}>
                            <IonBadge color='medium'>
                                {
                                    (item.isMedical && item.isRecreational) ? 'Med & Rec' : item.isMedical ? 'Med' : 'Rec'
                                }
                            </IonBadge>
                        </div>
                    }
                    <div className="products-image mt-1 d-flex justify-content-center">
                        {
                            <div style={{maxWidth:'40%', borderRadius:'100%', height:'auto', margin:'.5rem auto'}}>
                                <img
                                        src={
                                                (item.target_audience && Array.isArray(item.target_audience) && item.target_audience.filter(x => x!='ALL').filter(x => x!='EVERYONE').length > 0) ? (
                                                    dealsTagetAudiences.find(x => x.value === item.target_audience[0]).icon
                                                ) :
                                                
                                                Array.isArray(item.productTypes) && item.productTypes.length > 0 ? (
                                                    dealsCategories.find(x => x.value===item.productTypes[0]) ? dealsCategories.find(x => x.value===item.productTypes[0])['image'] : 'assets/images/deal_stock_new.png'
                                                ) : (
                                                    'assets/images/deal_stock_new.png'
                                                )
                                                
                                        }
                                        style={{height:'auto'}}
                                        alt={item.name + " picture"}
                                        height={512}
                                        width={512}
                                        stockImage={'assets/images/deal_stock_new.png'}
                                />
                            </div>
                        }                   
                    </div>

                    <div>
                        {
                            item.target_audience && Array.isArray(item.target_audience) && item.target_audience.filter(x => x!='ALL').length > 0 ? <div className='mt-1 pl-2 pr-2'><small className='text-muted'><center><b>{
                                'For '+item.target_audience.filter(x => x!='ALL'|| x.length>3).filter(x=>x).map((x, i) => {

                                        return (

                                            ' '+dealsTagetAudiences.find(y => y.value === x).label
                                        )
                                        
                                })


                            }</b></center></small><br /></div> : (
                                <div className='mt-1 pl-2 pr-2'><small className='text-muted'><center><b>For Everyone</b></center></small><br /></div>
                            )
                        }
                    </div>

                </div>
                {
                    hideDispensaryName ? ('') : (
                        <div className='top-bordered'>
                            {/* <Link href={`/[business]/[slug]`} as={`/${dispensaryTypeChecker(item.dispensary.type)}/${item.dispensary.slug}`}> */}
                                <span className=' mb-0 text-dark'>
                                    <center style={{paddingTop:'0.5rem', paddingBottom:'0.5rem'}}>
                                        <b><span style={{fontSize:'13px'}}>{item.dispensary.name}</span></b>
                                        <br />
                                        <small>{
                                            turf.distance(
                                                {
                                                    "type": "Feature",
                                                    "properties": {},
                                                    "geometry": {
                                                        "type": "Point",
                                                        "coordinates": [item.dispensary.location.coordinates[0], item.dispensary.location.coordinates[1] ]
                                                    }
                                                },
                                                {
                                                    "type": "Feature",
                                                    "properties": {},
                                                    "geometry": {
                                                        "type": "Point",
                                                        "coordinates": [JSON.parse(localStorage.getItem(MY_LOCATION)).longitude, JSON.parse(localStorage.getItem(MY_LOCATION)).latitude]
                                                        
                                                    }
                                                }, 
                                                { units: 'miles' }).toFixed(1)+' '
                                        }mi away</small>
                                    </center>
                                </span>
                            {/* </Link> */}
                        </div>
                       
                    )
                        
                }
            </IonCardContent>
        </IonCard>
    )
}

export default DealCard