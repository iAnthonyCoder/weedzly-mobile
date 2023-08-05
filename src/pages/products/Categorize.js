import { IonButton, IonCard, IonCol, IonContent, IonGrid, IonHeader, IonPage, IonRow, IonSegment, IonSegmentButton, IonText, IonTitle, useIonRouter } from '@ionic/react'
import React from 'react'
import TopToolbar from '../../components/Common/TopToolbar'
import Tabs from '../../components/Tabs/Tabs'

export default function Products (props) {

    const style = {
        position: 'absolute',
        color:'black', 
        bottom:'0', 
        backgroundColor:'white', 
        padding: '4px 6px', 
        borderRadius:'20px', 
        width:'100%', 
        textAlign:'center'
    }

    const router = useIonRouter()



    return (
        <IonPage>
            <IonHeader>
                <TopToolbar 
					title={'Products'} 
				/>
            </IonHeader>   
            <IonContent>
                <h1>Categories</h1>
                <IonGrid>
                    <IonRow>
                        <IonCol size="6" size-md="4">
                            <IonCard onClick={()=>router.push('/products/list?filterfield[]=category&filtertype[]=eq&filtervalue[]=FLOWER')}>
                                <div>
                                    <img style={{objectFit:'cover'}} src={'assets/images/products-page/flower.jpg'}></img>
                                    <IonText>
                                        <h4 style={style}>Flower</h4>
                                    </IonText>
                                </div>
                            </IonCard>
                        </IonCol>
                        <IonCol size="6" size-md="4">
                            <IonCard onClick={()=>router.push('/products/list?filterfield[]=category&filtertype[]=eq&filtervalue[]=VAPES')}>
                                <div>
                                    <img style={{objectFit:'cover'}} src={'assets/images/products-page/vape.jpg'}></img>
                                    <IonText>
                                        <h4 style={style}>Vapes</h4>
                                    </IonText>
                                </div>
                            </IonCard>
                        </IonCol>
                        <IonCol size="6" size-md="4">
                            <IonCard onClick={()=>router.push('/products/list?filterfield[]=category&filtertype[]=eq&filtervalue[]=EDIBLES')}>
                                <div>
                                    <img style={{objectFit:'cover'}} src={'assets/images/products-page/edible.jpg'}></img>
                                    <IonText>
                                        <h4 style={style}>Edibles</h4>
                                    </IonText>
                                </div>
                            </IonCard>
                        </IonCol>
                        <IonCol size="6" size-md="4">
                            <IonCard onClick={()=>router.push('/products/list?filterfield[]=category&filtertype[]=eq&filtervalue[]=TOPICALS')}>
                                <div>
                                    <img style={{objectFit:'cover'}} src={'assets/images/products-page/topical.jpg'}></img>
                                    <IonText>
                                        <h4 style={style}>Topicals</h4>
                                    </IonText>
                                </div>
                            </IonCard>
                        </IonCol>
                        <IonCol size="6" size-md="4">
                            <IonCard onClick={()=>router.push('/products/list?filterfield[]=category&filtertype[]=eq&filtervalue[]=CONCENTRATES')}>
                                <div>
                                    <img style={{objectFit:'cover'}} src={'assets/images/products-page/concentrate.jpg'}></img>
                                    <IonText>
                                        <h4 style={style}>Concentrates</h4>
                                    </IonText>
                                </div>
                            </IonCard>
                        </IonCol>
                        <IonCol size="6" size-md="4">
                            <IonCard onClick={()=>router.push('/products/list?filterfield[]=category&filtertype[]=eq&filtervalue[]=PRE-ROLL')}>
                                <div>
                                    <img style={{objectFit:'cover'}} src={'assets/images/products-page/pre-roll.jpg'}></img>
                                    <IonText>
                                        <h4 style={style}>Pre-rolls</h4>
                                    </IonText>
                                </div>
                            </IonCard>
                        </IonCol>
                        <IonCol size="12" size-md="12">
                            <section>
                                <IonButton onClick={()=>router.push('/products/list')} color='light' expand='block'>
                                    All products
                                </IonButton>
                            </section>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
            <Tabs/>
        </IonPage>
    )

}