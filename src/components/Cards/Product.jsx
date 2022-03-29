import { IonBadge, IonButton, IonCard, IonCardContent, IonIcon, IonImg, IonText, useIonRouter } from '@ionic/react'
import { star } from 'ionicons/icons'
import _ from 'lodash'
import React, { useState, useEffect } from 'react'
import { MY_LOCATION } from '../../helpers/constants';
import WeightSanitizer from '../../helpers/WeightSanitizer';
import cookie from 'js-cookie'
import ImageUrlFormatter from '../../helpers/ImageUrlFormatter';

const ProductCard = (props) => {

    const [ variants, setVariants ] = useState([])
    const [ selectedVariant, setSelectedVariant ] = useState()
    const [ product, setProduct ] = useState({})

    useEffect(() => {
        // setProduct(Object.assign({}, {...product}, {picture: null}))
        setVariants(props.item.nearestRetailer ? props.item.nearestRetailer.variants : [])
        setSelectedVariant((props.item.nearestRetailer ? props.item.nearestRetailer.variants : []).sort((a, b) => a.price > b.price ? 1 : -1).filter(x => x.price)[0])
        setProduct(props.item)
    }, [props])

    const router = useIonRouter()

    return (
        
        <IonCard className='ion-no-margin' onClick={()=>router.push(props.business_slug ? `/businesses/${props.business_slug}/products/${props.item.slug}` : `/brands/${props.item.brand.slug}/products/${props.item.slug}`)} style={{height:'100%'}}>
            <IonImg 
                style={{
                    objectFit: 'cover'
                }} 
                src={props.item.picture.length > 0 ? ImageUrlFormatter(props.item.picture[0], 'full', 200, 200, false, false) : '/assets/images/default-pic.png'} 
            />
            <IonBadge style={{left:'8px', top:'8px', position:'absolute'}}>{props.item.category.name}</IonBadge>
            <IonCardContent>
                <IonText>
                    {
                        (props.item.genetics || (props.item.nearestRetailer && props.item.nearestRetailer.isMedical)) ? (
                            <small className="category-link-card text-muted capitalize">
                                {
                                    props.item.genetics && _.capitalize(props.item.genetics.toLowerCase())
                                }
                                {
                                    props.item.genetics && props.item.nearestRetailer && props.item.nearestRetailer.isMedical && ' | '
                                }
                                {
                                    props.item.nearestRetailer && props.item.nearestRetailer.isMedical ? (<><span className='striking-text'>Medical Only</span></>) : ''
                                }
                            </small> 
                            
                            
                        ) : (<small className="category-link-card text-muted capitalize text-light">-</small>)
                    }
                    {
                        <h4 style={{color:'black'}}>{props.item.name}</h4>
                    }
                    {
                        <p style={{fontSize:'12px'}}>
                            by <IonText color='primary'><strong>{props.item.brand.name}</strong></IonText>
                        </p>
                    }
                    {
                        props.item.avgRating > 0 && <div className='d-flex align-items-center'>
                            <IonIcon icon={star}></IonIcon>
                            <small>{props.item.avgRating.toFixed(1)}</small> &nbsp;
                            <small>({props.item.reviewsAmt || 0} review{props.item.reviewsAmt > 1 ? 's' : ''})</small>&nbsp;
                        </div> 
                    }
                    {
                        variants.length > 0 && !_.isEmpty(selectedVariant) && ( 
                            <span className='mt-1' style={{fontSize:'18px', color:'black'}}>
                                <strong>${selectedVariant.price}</strong> <small><WeightSanitizer _weight={selectedVariant.weight} type={selectedVariant.type} unit={selectedVariant.unit} eachDetails={true} /></small>
                            </span>
                        )
                    }
                    {/* {
                    !props.hideButtons && <div className='card-buttons pb-3 pl-3 pr-3'>
                        {
                            variants.length > 0 ? ( 
                                ''
                            ) : (!localStorage.getItem(MY_LOCATION)) ? (
                                <button className="btn btn-light cart-action btn-block">
                                    Set location
                                </button>
                            ) : (window.location.pathname === '' || window.location.pathname === '/') ? (
                                <button onClick={()=>router.push('/brands/[brand]', '/brands/'+props.item.brand.slug, {shallow:true})} style={{fontSize:'11px'}} className="btn btn-light btn-sm btn-block">
                                    See more by {props.item.brand.name.length > 12 ? 'this brand' : props.item.brand.name}
                                </button>
                            ) : ''
                        }

                        {
                            (props.item.dispensary && (props.item.dispensary.isDeliveryServiceAvailable || props.item.dispensary.isPickupServiceAvailable)) ? <>
                                <IonButton 
                                    expand='block'
                                    style={{fontSize:'13px'}} 
                                    onClick={()=>openAddToCart()} 
                                    className=' btn btn-small btn-outline-purple btn-block '
                                >
                                    <i className='bx bxs-cart-alt' />
                                    Add to cart
                                </IonButton>

                            </> : ''
                        }
                    </div>
                } */}
                </IonText>
            </IonCardContent>
        </IonCard>
        
    )
}

export default ProductCard