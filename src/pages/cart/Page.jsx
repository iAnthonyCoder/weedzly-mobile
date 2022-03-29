import { IonAvatar, IonBadge, IonButton, IonChip, IonContent, IonFabButton, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonPage, IonRouterLink, IonSkeletonText, IonSpinner, IonThumbnail, IonToolbar, useIonRouter } from '@ionic/react'
import { addOutline, leaf, removeOutline, trash } from 'ionicons/icons'
import _ from 'lodash'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import TopToolbar from '../../components/Common/TopToolbar'
import dispensaryTypeChecker from '../../helpers/dispensaryTypeChecker'
import WeightSanitizer from '../../helpers/WeightSanitizer'
import useCart from '../../hooks/useCart'

const Cart = () => {

    const products = useSelector(state => state.products)
    const user = useSelector(state => state.user)
    const fetched_cart = useSelector(state => state.fetched_cart)
    const medicalSubtotal = useSelector(state => state.medicalSubtotal)
    const recreationalSubtotal = useSelector(state => state.recreationalSubtotal)
    const dispensary = useSelector(state => state.dispensary)
    const nugsSubtotal = useSelector(state => state.nugsSubtotal)
    const [ get, add, remove, update ] = useCart()
    const [actionsLoading, setActionsLoading] = useState(false)

    const increaseQty = (_id, qty) => {
        if(qty > 0) {
            update(_id, {quantity: qty})
        }
    }

    const decreaseQty = (_id, qty) => {
        if(qty > 0) {
            update(_id, {quantity: qty})
        }
    }

    const totalQuantity = () => {
        var total = 0
        products.map(product => {
            total += parseInt(product.quantity, 10);
        })
        return total
    }

    const handleRemove = async (_id) => {
        if(!actionsLoading){
            setActionsLoading(true)
            await remove(_id)
            setActionsLoading(false)
        }
    }

    const router = useIonRouter()

    return (
        <IonPage>
            <IonHeader>
                <TopToolbar
                    disableNotifications={true}
                    disableCart={true}
                    enableBackButton={true}
                    disableSearch={true}
                    title={`Cart (${totalQuantity()})`}
                />
                {
                    !_.isEmpty(dispensary) && <IonToolbar style={{borderTop:'1px solid #cccccc'}}>
                        <IonItem className="row align-items-center" lines='none'>
                            <IonAvatar slot='start'>
                                <img src={dispensary.logo ? dispensary.logo : '/assets/images/default-pic.png'}></img>
                            </IonAvatar>
                            <IonLabel>
                                <h3><strong>{dispensary.name}</strong></h3>
                                {
                                    dispensary.type!='DELIVERY' ? (
                                        <h3>{dispensary.address} {dispensary.address_line_2} {dispensary.city.name}, {dispensary.addresszip}</h3>
                                    ) : (
                                        <h3>Delivery</h3>
                                    )
                                }

                            </IonLabel>
                        </IonItem>
                    </IonToolbar>
                }
            </IonHeader>
            {
                user && user._id && !fetched_cart ? (
                    <IonContent color='light'>
                        <IonList>
                            <IonItem>
                                <IonThumbnail slot="start">
                                    <IonSkeletonText></IonSkeletonText>
                                </IonThumbnail>
                                <IonLabel>
                                    <h3>
                                        <IonSkeletonText animated style={{width: '80%'}}></IonSkeletonText>
                                    </h3>
                                    <p>
                                        <IonSkeletonText animated style={{width: '60%'}}></IonSkeletonText>
                                    </p>
                                    <p>
                                        <IonSkeletonText animated style={{width: '30%'}}></IonSkeletonText>
                                    </p>
                                </IonLabel>
                            </IonItem>
                            <IonItem>
                                <IonThumbnail slot="start">
                                    <IonSkeletonText></IonSkeletonText>
                                </IonThumbnail>
                                <IonLabel>
                                    <h3>
                                        <IonSkeletonText animated style={{width: '80%'}}></IonSkeletonText>
                                    </h3>
                                    <p>
                                        <IonSkeletonText animated style={{width: '60%'}}></IonSkeletonText>
                                    </p>
                                    <p>
                                        <IonSkeletonText animated style={{width: '30%'}}></IonSkeletonText>
                                    </p>
                                </IonLabel>
                            </IonItem>
                            <IonItem lines='none'>
                                <IonThumbnail slot="start">
                                    <IonSkeletonText></IonSkeletonText>
                                </IonThumbnail>
                                <IonLabel>
                                    <h3>
                                        <IonSkeletonText animated style={{width: '80%'}}></IonSkeletonText>
                                    </h3>
                                    <p>
                                        <IonSkeletonText animated style={{width: '60%'}}></IonSkeletonText>
                                    </p>
                                    <p>
                                        <IonSkeletonText animated style={{width: '30%'}}></IonSkeletonText>
                                    </p>
                                </IonLabel>
                            </IonItem>
                        </IonList>
                    </IonContent>
                ) : (
                    <>
                        {
                            products.length > 0 ? (
                                <IonContent color='light'>
                                    <IonList>
                                        {
                                            products.map((x, i) => <IonItem lines={products.length -1 === i ? 'none' : 'inset'} style={{alignItems: 'flex-start'}} key={i}>
                                                {
                                                    x.available && x.product.isEnabled && x.product.variant.stock ? (
                                                        <>
                                                            <IonThumbnail slot="start">
                                                                <IonImg src={x.product.picture.length > 0 ? x.product.picture[0] : '/assets/images/default-pic.png'}></IonImg>
                                                            </IonThumbnail>
                                                            <div style={{display:'flex', flexDirection:'column', paddingTop:'8px', paddingBottom:'8px'}}>
                                                                <span>
                                                                    {x.product.name}
                                                                </span>
                                                                <div style={{marginTop:'4px', marginBottom:'4px'}}>
                                                                    <span style={{fontSize:'22px', fontWeight:'700'}}>
                                                                    {
                                                                        (x.product.isEnabled && x.product.variant.stock) ? (
                                                                            x.reward ? (
                                                                                <span className="unit-amount">&#127811;{x.product.variant.WPointsValue}</span>
                                                                            ) : (
                                                                                <span className="unit-amount">${x.product.variant.price}</span>
                                                                            )
                                                                            
                                                                        ) : ('')
                                                                    }
                                                                    </span>
                                                                    <small>&nbsp;per <WeightSanitizer _weight={x.product.variant.weight} type={x.product.variant.type} unit={x.product.variant.unit} eachDetails={true} /></small>
                                                                </div>
                                                                <div>
                                                                    <div style={{display:'flex', justifyContent:'space-between'}}>
                                                                        <div>
                                                                            <IonChip color='danger' onClick={()=>increaseQty(x._id, x.quantity-1)}><IonIcon icon={removeOutline} style={{marginLeft:'-5px', marginRight:'-6px'}}></IonIcon></IonChip>
                                                                            <IonChip>&nbsp;<strong>{x.quantity}</strong>&nbsp;</IonChip>
                                                                            <IonChip color='primary' onClick={()=>decreaseQty(x._id, x.quantity+1)}><IonIcon icon={addOutline} style={{marginLeft:'-5px', marginRight:'-6px'}}></IonIcon></IonChip>
                                                                        </div>
                                                                        <IonChip 
                                                                            color='danger'
                                                                            onClick={()=>handleRemove(x._id)}
                                                                        >
                                                                            {
                                                                                actionsLoading && <IonSpinner name="crescent" /> 
                                                                            } Delete
                                                                        </IonChip>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <IonThumbnail slot="start">
                                                                <IonImg src={x.product.picture.length > 0 ? x.product.picture[0] : '/assets/images/default-pic.png'}></IonImg>
                                                            </IonThumbnail>
                                                            <div style={{display:'flex', flexDirection:'column', paddingTop:'8px', paddingBottom:'8px'}}>
                                                                <span>
                                                                    {x.product.name}
                                                                </span>
                                                                <div style={{paddingTop:'10px'}}>
                                                                    <IonBadge color='danger'>Item is not available</IonBadge>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )
                                                }
                                            </IonItem>)
                                        }
                                    </IonList>


                                    <section className="row align-items-center">
                                        <div style={{backgroundColor:'white', padding:'10px', borderRadius:'5px'}}>
                                            <div className="cart-totals">
                                                <h2 style={{marginTop:'10px'}}>Cart Totals</h2>

                                                <ul style={{listStyle:'none', paddingLeft:'0'}}>
                                                    <li style={{display:'flex', justifyContent:'space-between', marginTop:'8px'}}>Subtotal <span>${(medicalSubtotal + recreationalSubtotal).toFixed(2)}</span></li>
                                                    {
                                                        dispensary.taxes && dispensary.taxes.length > 0 ? (
                                                            dispensary.taxes.map( x => <li style={{display:'flex', justifyContent:'space-between', marginTop:'8px'}}><span>{x.label} {x.onlyForMedicalProducts ? '(Only Medical)' : x.areMedicalProductsExempt ? '(Only Recreational)' : ''}</span><span>{x.value}%</span></li>)
                                                        ) : <li>Tax <span>-</span></li>
                                                    }
                                                    <li style={{display:'flex', justifyContent:'space-between', marginTop:'10px', fontSize:'20px'}}><strong>Total</strong> <span style={{color:'#6c3478'}}><strong>
                                                        ${(((medicalSubtotal)+((medicalSubtotal*((dispensary && dispensary.taxes && dispensary.taxes.length > 0 ) ? ((dispensary.taxes.reduce((a, b) => a + (!b.areMedicalProductsExempt ? b['value'] : 0 || 0), 0))*0.01 || 0) : 0)))) + 
                                                        ((recreationalSubtotal)+((recreationalSubtotal*((dispensary && dispensary.taxes && dispensary.taxes.length > 0 ) ? ((dispensary.taxes.reduce((a, b) => a + (!b.onlyForMedicalProducts ? b['value'] : 0 || 0), 0))*0.01 || 0) : 0))))).toFixed(2)}</strong></span></li>

                                                </ul>

                                                {
                                                    nugsSubtotal > 0 && <>

                                                        <ul style={{borderTop:'1px solid #cccccc', listStyle:'none', paddingLeft:'0'}} ><br />
                                                            <li style={{display:'flex', justifyContent:'space-between', marginTop:'8px'}}>Subtotal <span><IonIcon icon={leaf} color='success'></IonIcon>{(nugsSubtotal)}</span></li>
                                                            <li style={{display:'flex', justifyContent:'space-between', marginTop:'8px'}}>Taxes <span>-</span></li>
                                                            <li style={{display:'flex', justifyContent:'space-between', marginTop:'8px', fontSize:'20px'}}><strong>Total</strong> <span style={{color:'#6c3478'}}><strong><IonIcon icon={leaf} color='success'></IonIcon>{(nugsSubtotal)}</strong></span></li>

                                                        </ul>

                                                    </>
                                                }


                                                <div className='d-inline-block links'>
                                                    <IonButton onClick={()=>router.push("/checkout")}>
                                                        Checkout
                                                    </IonButton>
                                                    <IonButton onClick={()=>router.push("/products/list")} color='success'>Continue Shopping</IonButton>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    
                                </IonContent>
                            ) : (
                                <IonContent color='light'>
                                    <section>
                                        <div style={{borderBottom:'1px solid #cccccc'}}>
                                            <h4 style={{fontWeight:'400', marginBottom:'0'}}>Empty</h4>
                                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                                <h4 style={{fontWeight:'900'}}>Subtotal in USD</h4>
                                                <h4 style={{fontWeight:'900'}}>$0</h4>
                                            </div>
                                        </div>
                                        <div style={{display:'flex', alignItems:'center', flexDirection:'column', justifyContent:'space-between'}}>
                                            <h4 style={{color:'rgb(90 90 90)', fontWeight:'300', textAlign:'center'}}>
                                                You don't have any products in your cart
                                            </h4>
                                        </div>
                                        <IonButton expand='block' onClick={()=>router.push('/products/list')}>
                                            Continue Shopping
                                        </IonButton>
                                    </section>
                                </IonContent>
                            )
                        }
                    </>
                )
            }
        </IonPage>
    )
}

export default Cart