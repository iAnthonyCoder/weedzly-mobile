import { IonAvatar, IonCard, IonCardTitle, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonPage, IonSegment, IonSegmentButton, IonSkeletonText, IonSlides, IonText, IonThumbnail, IonToolbar } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import TopToolbar from '../../../../components/Common/TopToolbar'
import { productService } from '../../../../services/product.service'
import queryString from 'query-string'
import _ from 'lodash'
import { star } from 'ionicons/icons'
import Reviews from '../../../../components/Sections/Reviews'
import BrandProductSellers from './Sellers'
import FullSpinner from '../../../../components/Common/FullSpinner'

const BrandProduct = (props) => {

    const [ item, setItem ] = useState({})
    const [ actionsLoading, setActionsLoading ] = useState(true)
    const [ selectedSegment, setSelectedSegment ] = useState('info')
    let locationC = localStorage.getItem('myLocation')

    const getProduct = async () => {

        try {

            setActionsLoading(true)
            let params = {
                product: props.match.params.product_slug,
                brand: props.match.params.brand_slug,
                latitude: JSON.parse(locationC).latitude,
                longitude: JSON.parse(locationC).longitude,
                boundingRadius: JSON.parse(locationC).boundingRadius
            }
            const response = await productService.getBySlugAndBrand(queryString.stringify(params))
            setItem(response)
            setActionsLoading(false)

        } catch (er) {

           
            console.log(er);

        }

    }

    useEffect(() => {
        getProduct()
    }, [])


    const [ initialHeight, setInitialHeight ] = useState(false)

    const [ height, setHeight ] = useState(0)

    useEffect(() => {
        setTimeout(() => {
            let box = document.getElementById('el');
        if(box){
            let width = box.offsetWidth;
            let height = box.offsetHeight;
           
           setInitialHeight(height)
        }
        }, 1);
    }, [item])
    
    
    return (
        <IonPage>
            <IonHeader>
                <TopToolbar 
                    title={ actionsLoading ? 'Loading...' : item.name }
                    enableFavoriteButton={true}
                    enableBackButton={true}
                    disableSearch={true}
                    disableCart={true}
                    disableNotifications={true}
                    favoriteParams={!actionsLoading ? {
			        	collection: 'products',
			        	_id: item._id
                    } : false}
                />
                <IonToolbar>
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
                                <IonToolbar>
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
                                </IonToolbar>
                                <IonToolbar>
                                    <div style={{display:'flex', width:'100%', paddingLeft:'8px', paddingRight:'8px'}}>
                                        <div style={{display: 'flex',width:'100%', flexDirection:'column', paddingLeft:'8px', paddingRight:'8px'}}>
                                            <IonSkeletonText animated style={{width:'100%', height:'20px'}}></IonSkeletonText>
                                        </div>
                                        <div style={{display: 'flex',width:'100%', flexDirection:'column', paddingLeft:'8px', paddingRight:'8px'}}>
                                            <IonSkeletonText animated style={{width:'100%', height:'20px'}}></IonSkeletonText>
                                        </div>
                                        <div style={{display: 'flex',width:'100%', flexDirection:'column', paddingLeft:'8px', paddingRight:'8px'}}>
                                            <IonSkeletonText animated style={{width:'100%', height:'20px'}}></IonSkeletonText>
                                        </div>
                                    </div>
                                </IonToolbar>
                            </div>
                        ) : (
                            <div>
                                <div id='el' style={{display:'flex', overflow:'hidden', flexDirection:'column', marginTop: height}}>
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
                                        <h4 style={{marginBottom:'8px'}}>{item.name}</h4>
                                        <span>By <IonText color='primary'>{item.brand.name}</IonText></span>
                                    </div>
                                </IonItem>
                                <IonToolbar>
                                    <div style={{display:'flex', width:'100%'}}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems:'center',
                                            width: '100%',
                                            borderRight:'1px solid #cccccc'
                                        }}>
                                            <div style={{display: 'flex',width:'100%', flexDirection:'column'}}>
                                                <div style={{display: 'flex',width:'100%', justifyContent: 'center'}}>
                                                    <h5 style={{marginTop:'0', marginBottom:'0', marginRight:'4px'}}>{item.avgRating ? item.avgRating.toFixed(1) : 0}</h5>
                                                    <IonIcon icon={star}></IonIcon>
                                                </div>
                                                <div style={{display: 'flex',width:'100%', justifyContent: 'center'}}>
                                                    <span>
                                                        {item.reviewsAmt} review{item.reviewsAmt > 1 && 's'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div style={{
                                            display: 'flex',
                                            alignItems:'center',
                                            width: '100%',
                                            borderRight:'1px solid #cccccc'
                                        }}>
                                            <div style={{display: 'flex',width:'100%', flexDirection:'column'}}>
                                                <div style={{display: 'flex',width:'100%', justifyContent: 'center'}}>
                                                    <h5 style={{marginTop:'0', marginBottom:'0'}}>{item.category.name}</h5>
                                                </div>
                                                <div style={{display: 'flex',width:'100%', justifyContent: 'center'}}>
                                                    <span>
                                                        Category
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div style={{
                                            display: 'flex',
                                            alignItems:'center',
                                            width: '100%',
                                        }}>
                                            <div style={{display: 'flex',width:'100%', flexDirection:'column'}}>
                                                <div style={{display: 'flex',width:'100%', justifyContent: 'center'}}>
                                                    <h5 style={{marginTop:'0', marginBottom:'0'}}>Thing</h5>
                                                </div>
                                                <div style={{display: 'flex',width:'100%', justifyContent: 'center'}}>
                                                    <span>
                                                        Thing
                                                    </span>
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>
                                </IonToolbar>
                                </div>
                                <IonToolbar style={{marginTop:'8px'}}>
                                    <IonSegment scrollable={true} value={selectedSegment}>
        	                            <IonSegmentButton onClick={()=>setSelectedSegment('info')} value="info">
        	                                <IonLabel>Info</IonLabel>
        	                            </IonSegmentButton>
        	                            <IonSegmentButton onClick={()=>setSelectedSegment('sellers')} value="sellers">
        	                                <IonLabel>Sellers</IonLabel>
        	                            </IonSegmentButton>
                                        <IonSegmentButton onClick={()=>setSelectedSegment('reviews')} value="reviews">
        	                                <IonLabel>Reviews</IonLabel>
        	                            </IonSegmentButton>
        	                        </IonSegment>
                                </IonToolbar>
                            </div>
                        )
                    }
                </IonToolbar>
            </IonHeader>
            <IonContent color='light' scrollEvents={true}   onIonScroll={(e) => {
                console.log(e.detail.scrollTop)
                console.log(height)
                console.log(initialHeight)
                if(e.detail.scrollTop > initialHeight){
                    setHeight((initialHeight*-1)+8)
                } else {
                    setHeight(e.detail.scrollTop*-1)
                }

            }}>
            {
                actionsLoading ? (
                    <FullSpinner />
                ) : (
                    (selectedSegment === 'info') ? (
                        <IonCard style={{padding:'16px'}}>
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
                            {
                                item.description && item.description.length > 0 && <>
                                    <IonCardTitle>Description</IonCardTitle><br/>
                                    <IonText style={{lineHeight: '1.4rem'}}>
                                        {item.description}
                                    </IonText>
                                </>
                            }
                        </IonCard>
                    ) : (selectedSegment === 'sellers') ? (
                        <BrandProductSellers 
                            productId={item._id}
                            product_slug={item.slug}
                        />
                    ) : (selectedSegment === 'reviews') ? (
                        !_.isEmpty(item) && <Reviews 
                            item={item}
                            for={'product'}
                            model={'Product'}
                            brand={item.brand.slug}
                        />
                    ) : (
                        <h1>sellers</h1>
                    )
                )
            }
            </IonContent>
        </IonPage>
    )
}

export default BrandProduct