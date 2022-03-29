import { IonAvatar, IonButton, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonLabel, IonPage, IonSegment, IonSegmentButton, IonSpinner, IonText, IonTitle } from '@ionic/react'
import { heart, share, star } from 'ionicons/icons';
import React, { useEffect, useState } from 'react'
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

    return (
        <IonPage>
            <IonHeader>
                <TopToolbar 
                    enableBackButton={true}
                    disableSearch={true}
                    title={entity.name}
                />
            </IonHeader>
            <IonContent>
                {
                    actionsLoading ? (
                        <div className='ion-margin-top ion-margin-bottom' style={{display:'flex', justifyContent:'center'}}>
                            <IonSpinner name="crescent" />
                        </div>
                    ) : (
                        <section className='full-width ion-padding-top ion-padding-start ion-padding-end' style={{backgroundColor:'rgba(0,0,0,0.015)', borderBottom:'1px solid #e7e7e7'}}>
                            <div className='ion-padding-bottom ion-padding-top' style={{display:'flex', flexDirection:'column'}}>
                                <div style={{display:'flex'}}>
                                    <IonAvatar>
                                        <img src={entity.logo}></img>
                                    </IonAvatar>
                                    <div style={{display:'flex', flexDirection:'column'}}>
                                        <h4 style={{marginLeft:'20px'}} className='ion-no-margin ion-no-padding'>{entity.name}</h4>
                                        <IonText className='ion-no-margin ion-no-padding' style={{marginLeft:'20px'}}>Brand</IonText>
                                    </div>
                                </div> <br/>
                                <IonText className={'ellipsed'} style={{fontSize:'14px', lineHeight:'24px'}}>
                                    {entity.description}
                                </IonText>
                                
                                <FavoriteButton 
                                    collection={'brands'}
                                    _id={entity._id}
                                />
                              
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