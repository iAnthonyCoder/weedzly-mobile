import { IonAvatar, IonButton, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonLabel, IonPage, IonSegment, IonSegmentButton, IonSpinner, IonText, IonTitle, IonToolbar } from '@ionic/react'
import { heart, share, star } from 'ionicons/icons';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import FavoriteButton from '../../../components/Common/FavoriteButton';
import TopToolbar from '../../../components/Common/TopToolbar'
import ProductsList from '../../../components/List/Products';
import { brandService } from '../../../services/brand.service'
import FindBrandRetailers from './Find';
import './Page.css';
import BrandProductsList from './Products';
import BrandReviews from './Reviews';

const Brand = (props) => {

    const [ actionsLoading, setActionsLoading ] = useState(false)
    const [ entity, setEntity ] = useState({})
    const [ tab, setTab ] = useState('products')

    const getData = async (slug) => {

        try {
            setActionsLoading(true)
            const res = await brandService.getBySlug(slug)
            setEntity(res)
            setActionsLoading(false)
        } catch (er) {
            console.log(er);
            setActionsLoading(false)
        }
        console.log(slug);
    }

    useEffect(() => {
        getData(props.match.params.slug)
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
    }, [entity])
    



    return (
        <IonPage>
            <IonHeader>
                <TopToolbar 
                    enableBackButton={true}
                    disableSearch={true}
                    disableNotifications={true}
                    disableCart={true}
                    title={entity.name}
                    enableFavoriteButton={true}
                    favoriteParams={!actionsLoading && entity._id ? {
			        	collection: 'brands',
			        	_id: entity._id
                    } : false}
                />
                <IonToolbar>
                    {
                        actionsLoading ? (
                            <div className='ion-margin-top ion-margin-bottom' style={{display:'flex', justifyContent:'center'}}>
                                <IonSpinner name="crescent" />
                            </div>
                        ) : (
                            <section className='full-width ion-padding-start ion-padding-end' style={{borderBottom:'1px solid #e7e7e7'}}>
                                <div className='ion-padding-top ion-padding-bottom' id='el' style={{display:'flex', overflow:'hidden', flexDirection:'column', marginTop: height}}>
                                    <div style={{display:'flex'}}>
                                        <IonAvatar>
                                            <img src={entity.logo}></img>
                                        </IonAvatar>
                                        <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                                            <h4 style={{marginLeft:'20px'}} className='ion-no-margin ion-no-padding'>{entity.name}</h4>
                                            <IonText className='ion-no-margin ion-no-padding' style={{marginLeft:'20px'}}>Brand</IonText>
                                        </div>
                                    </div> <br/>
                                    <IonText className={'ellipsed'} style={{fontSize:'14px', lineHeight:'24px'}}>
                                        {entity.description}
                                    </IonText>

                                </div>  

                                {/* <IonButton expand='full'>
                                    View Full Product List
                                </IonButton> */}
                                {/* <div className='ion-margin-bottom ion-padding-bottom' style={{width:'100%', borderBottom:'1px solid #e7e7e7'}}></div>

                                    <IonText style={{fontSize:'18px'}}><strong>Closest dispensaries carrying {entity.name}</strong></IonText>
                            

                                <div className='ion-padding' style={{border:'1px solid #e7e7e7', borderRadius:'5px', backgroundColor:'white'}}>
                                    <IonText>There are no {entity.name} products for sale on Weedzly near you</IonText>
                                </div> */}
                                <IonSegment onIonChange={e => setTab(e.detail.value === undefined ? '' : e.detail.value)} value={tab}>
                                    <IonSegmentButton value={'products'}>
                                        <IonLabel>
                                            Products
                                        </IonLabel>
                                    </IonSegmentButton>
                                    <IonSegmentButton value={'reviews'}>
                                        <IonLabel>
                                            Reviews
                                        </IonLabel>
                                    </IonSegmentButton>
                                    <IonSegmentButton value={'find'}>
                                        <IonLabel>
                                            Find
                                        </IonLabel>
                                    </IonSegmentButton>
                                </IonSegment>

                            </section>
                        )
                    }
                </IonToolbar>
            </IonHeader>
            <IonContent scrollEvents={true}  onIonScroll={(e) => {
                if(e.detail.scrollTop > initialHeight){
                    setHeight((initialHeight*-1)+8)
                } else {
                    setHeight(e.detail.scrollTop*-1)
                }
                
            }}>
                {
                    tab === 'products' ? (
                        <BrandProductsList entity={entity} />
                    ) : tab === 'reviews' ? (
                        <BrandReviews entity={entity} />
                    ) : tab === 'find' ? (
                        <FindBrandRetailers entity={entity} />
                    ) : ''
                }
            </IonContent>
        </IonPage>
    )
}

export default Brand