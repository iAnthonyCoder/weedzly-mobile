import { IonActionSheet, IonAvatar, IonBadge, IonButton, IonCard, IonChip, IonIcon, IonItem, IonLabel, IonList, IonSpinner, IonText, useIonRouter, useIonToast } from '@ionic/react'
import { cartOutline, chevronDown, location, locationSharp } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import FullSpinner from '../../../../components/Common/FullSpinner'
import sorting_settings from '../../../../config/sorting_settings'
import useInfiniteScroll from '../../../../hooks/useInfiniteScroll'
import { productService } from '../../../../services/product.service'
import * as turf from "@turf/turf";
import cookie from 'js-cookie'
import { MY_LOCATION } from '../../../../helpers/constants'
import CheckIfOpen from '../../../../helpers/checkIfOpen'
import { Router } from 'workbox-routing'

const BrandProductSellers = (props) => {

    const [ showActionSheet, setShowActionSheet ] = useState(false)
    const [ ScopedModel, setScopedModel ] = useState(null)
    const [ actionsLoading, setActionsLoading ] = useState(true)
    const [ data, setData ] = useState(null)

    const getData = async (productId) => {

        try {

            setActionsLoading(true)
            const response = await productService.getRetailers(productId)
            setData(response)
            setActionsLoading(false)

        } catch (er) {

            console.log(er);

        }

    }

    const router = useIonRouter()
    const handleAddToCart = ({product, dispensary}) => {
        
        const productToCart = {
            product,
            quantity:result.value,
            dispensary,
            reward: false
        }
        add(productToCart)
        
    }

    useEffect(() => {
        getData(props.productId)
    }, [])

    useEffect(() => {
        if(data && data.totalData && data.totalData.length > 0){
            setScopedModel(data.totalData[0].id)
        }
    }, [data])


    if(actionsLoading) return <>
        <div style={{display:'flex', justifyContent:'center', minWidth:'100%', marginTop:'2rem', marginBottom:'2rem'}}>
            <IonSpinner name="crescent" />
        </div>
    </>

    return (
        <>
            <section>
                {
                    ScopedModel && <>
                                <div>
                            <IonChip onClick={()=>setShowActionSheet(true)} style={{textTransform: 'capitalize', marginTop:'0.5rem'}}>
                                {data.totalData.find(x=> x.id === ScopedModel).weight}{data.totalData.find(x=> x.id === ScopedModel).unit} <IonIcon icon={chevronDown}></IonIcon>
                            </IonChip>
                        </div>
                        <IonActionSheet
                            isOpen={showActionSheet}
                            onDidDismiss={() => setShowActionSheet(false)}
                            cssClass='my-custom-class'
                            header='Available'
                            buttons={
                                data.totalData.map((x) => ({
                                    text: `${x.weight}${x.unit}`,
                                    handler: () => {
                                        setScopedModel(x.id);
                                    }
                                }))
                            }
                        />
                    </>
                }
            </section>
            <div>
                {
                    data.totalData.length > 0 ? (
                        data.totalData.find(y => y.id === ScopedModel)['dispensaries'].map((z, i) => <IonCard key={i}>
                            <IonItem lines={'full'} style={{alignItems: 'flex-start', paddingTop:'8px'}}>
                                <IonAvatar slot='start'>
                                    <img src={z.logo} /> 
                                </IonAvatar>
                                <div>
                                    <IonLabel style={{marginTop:'8px', marginBottom:'8px'}}>
                                        <strong>{z.name}</strong><br/>
                                        <div style={{display:'flex', alignItems:'center', marginTop:'5px'}}>
                                            <IonIcon color='primary' icon={locationSharp}></IonIcon>
                                            <small>
                                                {
                                                    turf.distance(
                                                        {
                                                            "type": "Feature",
                                                            "properties": {},
                                                            "geometry": {
                                                                "type": "Point",
                                                                "coordinates": [z.location.coordinates[0], z.location.coordinates[1] ]
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
                                                }mi away
                                            </small>
                                        </div>
                                        {
                                            z.isDeliveryServiceAvailable && _.isNumber(z.deliveryTax) && z.deliveryTax > 0 && <small className='d-flex align-items-center pt-1'>
                                                {/* <SVG
                                                    height={20}
                                                    width={20}
                                                    src={toAbsoluteUrl("/static/icons/delivery.svg")}
                                                    style={{fill:'#5d5d5d'}}
                                                />&nbsp; */}
                                                <b>&nbsp;Delivery Fee ${z.deliveryTax}</b>&nbsp;
                                                {
                                                    z.deliveryMinPurchase && <>|&nbsp;Min. Order<b>&nbsp;${z.deliveryMinPurchase}</b></>
                                                    
                                                }
                                            </small>
                                        }
                                        <div style={{marginTop:'5px'}}>
                                            {
                                                z.isOnlineOrderingEnabled && <IonBadge style={{marginRight:'4px'}}>Online Ordering</IonBadge>
                                            }
                                            {
                                                (CheckIfOpen(z.hoursofoperation, z.TZ).isOpen) ? (
                                                    <IonBadge color='success'>Open now</IonBadge>
                                                ) : (
                                                    <>
                                                        <IonBadge color='danger'>Closed now</IonBadge>
                                                    </>
                                                )
                                            }
                                        </div>
                                    </IonLabel>
                                </div>
                            </IonItem>
                            {console.log(z)}
                            <div lines='none' style={{display:'flex', flexDirection:'column', padding:'16px'}}>
                                {/* <IonText color='dark'><h1 style={{paddingLeft:'0px', paddingRight:'0px', marginTop:'0px'}}>${z.price}</h1></IonText> */}
                                <IonButton onClick={()=>router.push(`/businesses/${z.slug}/products/${props.product_slug}#${z.variantId}`)} expand='full' style={{width:'100%'}}>
                                    <IonIcon icon={cartOutline}></IonIcon>&nbsp; Get for ${z.price}
                                </IonButton>
                            </div>
                        </IonCard>)
                    ) : (
                        <IonCard>
                            <div className='ion-margin-top ion-margin-bottom ion-padding-top ion-padding-bottom' style={{display:'flex', flexDirection:'column', justifyContent:'center', width:'100%', alignItems:'center'}}>
                                <img style={{width:'30%'}} src={'assets/images/no-data.png'}></img>
                                <h3>No sellers found near you</h3>
                                <p>Try again later</p>
                            </div>
                        </IonCard>
                    )
                    
                }
            </div>
        </>
    )
}

export default BrandProductSellers