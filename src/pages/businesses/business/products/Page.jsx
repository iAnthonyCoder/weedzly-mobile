import { IonAvatar, IonBadge, IonButton, IonCard, IonCardTitle, IonChip, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonPage, IonSegment, IonSegmentButton, IonSkeletonText, IonSlides, IonText, IonThumbnail, IonToolbar, useIonAlert, useIonRouter } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import TopToolbar from '../../../../components/Common/TopToolbar'
import { productService } from '../../../../services/product.service'
import cookie from 'js-cookie'
import queryString from 'query-string'
import _ from 'lodash'
import { addOutline, leaf, removeOutline, star } from 'ionicons/icons'
import Reviews from '../../../../components/Sections/Reviews'
import FullSpinner from '../../../../components/Common/FullSpinner'
import { dispensaryService } from '../../../../services'
import WeightSanitizer from '../../../../helpers/WeightSanitizer'
import useCart from '../../../../hooks/useCart'
import { useDispatch, useSelector } from 'react-redux'
import { pointstransactionService } from '../../../../services/pointstransaction.service'
import { updateModalStatus } from '../../../../store/actions'

const BusinessProduct = (props) => {

    const [ item, setItem ] = useState({})
    const [ balance, setBalance ] = useState(null)
    const [ actionsLoading, setActionsLoading ] = useState(true)
    const [ selectedVariant, setSelectedVariant ] = useState({})
    const [ selectedSegment, setSelectedSegment ] = useState('info')
    const [ quantity, setQuantity ] = useState(1)
    const [ getCart, add ] = useCart()
    const { user, nugsSubtotal } = useSelector(state => state)
    let locationC = localStorage.getItem('myLocation')
    const [present] = useIonAlert();
    const router = useIonRouter()
    const dispatch = useDispatch()
    const handleAddToCart = async ({reward}) => {

        if(!user._id){
            dispatch(updateModalStatus({login:true}))
        } else {
            const productToCart = {
            
                product:{
                    brand: item.brand,
                    category: item.category,
                    name: item.name,
                    picture: item.picture,
                    slug: item.slug,
                    _id: item._id,
                    variant: item.variants.find(x => x._id === selectedVariant),
                },
                quantity: quantity,
                dispensary: item.dispensary._id,
                reward: reward ? true : false
            }
            
            await add(productToCart)
        }

    }

    const getNugsBalance = async (dispensary_id) => {
        
        if(!_.isEmpty(user)){
            const { balance } = await pointstransactionService.findOne(dispensary_id)
            setBalance(balance)
        }
    }

    const getProduct = async () => {

        try {

            setActionsLoading(true)
            const response = await dispensaryService.getProductBySlug(`${props.match.params.dispensary_slug}/${props.match.params.product_slug}`)
            if(response.variants.length > 0){
                setSelectedVariant(response.variants.find(x => x._id === window.location.hash.replace('#', '')) ? response.variants.find(x => x._id === window.location.hash.replace('#', ''))._id : response.variants[0]['_id'])
                getNugsBalance(response.dispensary._id)
            }
            setItem(response)
            setActionsLoading(false)

        } catch (er) {

            console.log(er);

        }

    }

    const increaseQty = () => {
        let newQty = quantity + 1
        if(newQty > 9) {
            
        } else {
            setQuantity(newQty)
        }
    }

    const decreaseQty = () => {
        let newQty = quantity - 1
        if(newQty < 1) {
            
        } else {
            setQuantity(newQty)
        }
    }

    

    

    useEffect(() => {
        getProduct()
        
    }, [])


    
    

    return (
        <IonPage>
            <IonHeader>
                <TopToolbar 
                    title={ actionsLoading ? 'Loading...' : item.name }
                    enableFavoriteButton={true}
                    enableBackButton={true}
                    disableSearch={true}
                    favoriteParams={!actionsLoading ? {
			        	collection: 'products',
			        	_id: item._id
                    } : false}	
                />
                {
                    item && item.dispensary && !_.isEmpty(item.dispensary) && <IonToolbar style={{borderTop:'1px solid #cccccc'}}>
                        <IonItem className="row align-items-center" lines='none'>
                            <IonAvatar slot='start'>
                                <img src={item.dispensary.logo ? item.dispensary.logo : '/assets/images/default-pic.png'}></img>
                            </IonAvatar>
                            <IonLabel>
                                <h3><strong>{item.dispensary.name}</strong></h3>
                                {
                                    item.dispensary.type!='DELIVERY' ? (
                                        <h3>Dispensary at {item.dispensary.city.name} ({item.dispensary.city.state.name})</h3>
                                    ) : (
                                        <h3>Delivery</h3>
                                    )
                                }

                            </IonLabel>
                        </IonItem>
                    </IonToolbar>
                }
            </IonHeader>
       
            <IonContent>
            <section>
                    {
                        actionsLoading && _.isEmpty(item) ? (
                            <div>
                                <IonItem lines={'none'}>
                                    <IonThumbnail slot="start">
                                        <IonSkeletonText></IonSkeletonText>
                                    </IonThumbnail>
                                    <IonLabel>
                                        <h2>
                                            <IonSkeletonText animated style={{width:'80%', height:'24px'}}></IonSkeletonText>
                                        </h2>
                                        <p>
                                            <IonSkeletonText animated style={{width:'50%'}}></IonSkeletonText>
                                        </p>
                                    </IonLabel>
                                </IonItem>
                                <div>
                                    <br />
                                    <div style={{display:'flex', width:'100%', paddingLeft:'8px', paddingRight:'8px'}}>
                                        <div style={{display: 'flex',width:'100%', flexDirection:'column', paddingLeft:'8px', paddingRight:'8px'}}>
                                            <IonSkeletonText animated style={{width:'100%', height:'20px'}}></IonSkeletonText>
                                            <IonSkeletonText animated style={{width:'100%', height:'12px'}}></IonSkeletonText>
                                        </div>
                                        <div style={{display: 'flex',width:'100%', flexDirection:'column', paddingLeft:'8px', paddingRight:'8px'}}>
                                            <IonSkeletonText animated style={{width:'100%', height:'20px'}}></IonSkeletonText>
                                            <IonSkeletonText animated style={{width:'100%', height:'12px'}}></IonSkeletonText>
                                        </div>
                                        {/* <div style={{display: 'flex',width:'100%', flexDirection:'column', paddingLeft:'8px', paddingRight:'8px'}}>
                                            <IonSkeletonText animated style={{width:'100%', height:'20px'}}></IonSkeletonText>
                                            <IonSkeletonText animated style={{width:'100%', height:'12px'}}></IonSkeletonText>
                                        </div> */}
                                    </div>
                                </div>
                                <div>
                                    <div style={{display:'flex', width:'100%', paddingLeft:'8px', paddingRight:'8px'}}>
                                        <div style={{display: 'flex',width:'100%', flexDirection:'column', paddingLeft:'8px', paddingRight:'8px'}}>
                                            <IonSkeletonText animated style={{width:'100%', height:'20px'}}></IonSkeletonText>
                                        </div>
                                        {/* <div style={{display: 'flex',width:'100%', flexDirection:'column', paddingLeft:'8px', paddingRight:'8px'}}>
                                            <IonSkeletonText animated style={{width:'100%', height:'20px'}}></IonSkeletonText>
                                        </div> */}
                                        <div style={{display: 'flex',width:'100%', flexDirection:'column', paddingLeft:'8px', paddingRight:'8px'}}>
                                            <IonSkeletonText animated style={{width:'100%', height:'20px'}}></IonSkeletonText>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <IonItem style={{alignItems: 'flex-start', marginBottom:'16px'}} lines={'none'}>
                                    <IonAvatar
                                        slot='start'
                                        style={{
                                            width:'100%',
                                            height : '100%',
                                            maxWidth: '72px',
                                            maxHeight: '72px',
                                            marginTop: '16px'
                                        }}
                                    >
                                        <img src={item.picture && item.picture.length > 0 ? item.picture[0] : '/assets/images/default-pic.png'} />
                                    </IonAvatar>
                                    <div>
                                        <IonBadge>{item.category.name}</IonBadge>
                                        <h4 style={{marginBottom:'8px', marginTop:'4px'}}>{item.name}</h4>
                                        <span>By <IonText color='primary'>{item.brand.name}</IonText></span>
                                        {
                                            item.reviewsAmt > 0 && <span style={{display:'flex', marginTop:'8px'}}>{item.avgRating ? item.avgRating.toFixed(1) : 0}&nbsp;<IonIcon icon={star}></IonIcon>&nbsp;({item.reviewsAmt} review{item.reviewsAmt > 1 && 's'})</span>
                                        }
                                    </div>
                                </IonItem>
                                
                                <div>

                                    {
                                        item.variants.filter(x => !x.isWPointsSalable).length > 0 && <div style={{marginBottom:'16px', marginTop:'16px'}}>
                                            
                                            <strong style={{marginLeft:'4px'}}>Available variants:</strong>
                                            <br />
                                            {
                                                item.variants.filter(x => !x.isWPointsSalable).map(x => <IonChip onClick={()=>setSelectedVariant(x._id)} color={x._id === selectedVariant ? 'primary' : ''} style={x._id === selectedVariant ? {height:'48px', border:'2px solid #3880ff'} : {height:'48px'}}>
                                                    <div style={{padding:'8px'}}>
                                                        <IonText color='primary'>
                                                            <span style={{fontSize:'20px'}}><strong>${x.price}</strong></span><br />
                                                        </IonText>
                                                        <span>per <WeightSanitizer _weight={x.weight} type={x.type} unit={x.unit} eachDetails={true}/></span>
                                                    </div>
                                                </IonChip>)
                                            }
                                        </div>
                                    }
                                    
                                    {
                                        item.variants.filter(x => x.isWPointsSalable).length > 0 && <div style={{marginBottom:'16px', marginTop:'16px'}}>
                                            
                                            <strong style={{marginLeft:'4px'}}>Rewards:</strong>
                                            <br />
                                            {
                                                item.variants.filter(x => x.isWPointsSalable).map(x => <IonChip onClick={()=>setSelectedVariant(x._id)} color={x._id === selectedVariant ? 'primary' : ''} style={x._id === selectedVariant ? {height:'48px', border:'2px solid #3880ff'} : {height:'48px'}}>
                                                    <div style={{padding:'8px', display:'flex', flexDirection:'column'}}>
                                                        <IonText color='primary' style={{marginBottom:'4px'}}>
                                                            <span style={{fontSize:'20px'}}><strong><IonIcon icon={leaf}></IonIcon>{x.WPointsValue}</strong> Nugs</span><br />
                                                        </IonText>
                                                        <span style={{float:'left', alignSelf:'flex-end'}}><strong>per <WeightSanitizer _weight={x.weight} type={x.type} unit={x.unit} eachDetails={true}/></strong></span>
                                                    </div>
                                                </IonChip>)
                                            }
                                        </div>
                                    }
 
                                    {
                                        selectedVariant && item.variants.find(x => x._id === selectedVariant).isWPointsSalable && !user._id && (
                                            <div style={{ display:'flex', alignItems:'center', color:'white', marginLeft:'4px', marginRight:'4px', marginBottom:'16px',height:'48px', padding:'8px', borderRadius:'5px', backgroundColor:'rgb(108 52 120)'}}>
                                                <strong style={{color:'#67abff'}} onClick={()=>router.push('/login') }>Login &nbsp;</strong> to check nugs balance
                                            </div>
                                        )
                                    }

{
                                        selectedVariant && item.variants.find(x => x._id === selectedVariant).isWPointsSalable && user._id && (
                                            <div style={{ display:'flex', flexDirection:'column', color:'white', marginLeft:'4px', marginRight:'4px', marginBottom:'16px',minHeight:'48px', padding:'8px', borderRadius:'5px', backgroundColor:'rgb(108 52 120)'}}>
                                                {
                                                    quantity*item.variants.find(x => x._id === selectedVariant).WPointsValue > (balance-nugsSubtotal) ? (
                                                        <span style={{fontSize:'20px', fontWeight:'900'}}>You need {(quantity*item.variants.find(x => x._id === selectedVariant).WPointsValue) - (balance - nugsSubtotal)} Nugs more</span>
                                                    ) : (
                                                        <span style={{fontSize:'20px', fontWeight:'900'}}>Get {quantity}x for {quantity*item.variants.find(x => x._id === selectedVariant).WPointsValue} Nugs</span>
                                                    )
                                                }
                                        
                                                
                                                <span style={{marginTop:'10px'}}>Your balance is <strong>{(balance - nugsSubtotal)}</strong> Nugs</span>
                                            </div>
                                        )
                                    }

                                    <strong style={{marginLeft:'4px'}}>Set amount:</strong>
                                    <div>
                                        <IonChip color='danger' onClick={()=>decreaseQty()}><IonIcon icon={removeOutline} style={{marginLeft:'-5px', marginRight:'-6px'}}></IonIcon></IonChip>
                                        <IonChip>&nbsp;<strong>{quantity}</strong>&nbsp;</IonChip>
                                        <IonChip color='primary' onClick={()=>increaseQty()}><IonIcon icon={addOutline} style={{marginLeft:'-5px', marginRight:'-6px'}}></IonIcon></IonChip>
                                    </div>
                                    <br/>
                                    {
                                        selectedVariant && item.variants.find(x => x._id === selectedVariant).price > 0 && <IonButton onClick={()=>handleAddToCart({reward: false})} size='block'>
                                            Add to cart
                                        </IonButton>
                                    }
                                    {
                                        (!_.isEmpty(user) && selectedVariant && item.variants.find(x => x._id === selectedVariant).WPointsValue && balance - nugsSubtotal >= item.variants.find(x => x._id === selectedVariant).WPointsValue * quantity) 
                                        && <IonButton onClick={()=>handleAddToCart({reward: true})} size='block'>
                                            Claim Reward
                                        </IonButton>
                                    }

                                    

                                    
                                    <br/>
                                    {
                                        item.picture.length > 0 && <IonSlides>
                                            {
                                                item.picture.map(x => <ion-slide>
                                                    <div class="slide">
                                                        <img src={x} />
                                                    </div>
                                                </ion-slide>)
                                            }
                                        </IonSlides>
                                    }
                                    <br/>
                                    {
                                        item.description && item.description.length > 0 && <>
                                            <IonCardTitle>Description</IonCardTitle><br/>
                                            <IonText style={{lineHeight: '1.4rem'}}>
                                                {item.description}
                                            </IonText>
                                        </>
                                    }
                                </div>
                                <section>
                                    {
                                        !_.isEmpty(item) && <Reviews 
                                            item={item}
                                            for={'product'}
                                            model={'Product'}
                                            brand={item.brand.slug}
                                        />
                                    }
                                </section>
                            </div>
                        )
                    }
                </section>
            </IonContent>
        </IonPage>
    )
}

export default BusinessProduct