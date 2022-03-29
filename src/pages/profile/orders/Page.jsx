import { IonButton, IonCol, IonContent, IonGrid, IonHeader, IonInfiniteScroll, IonInfiniteScrollContent, IonLoading, IonPage, IonProgressBar, IonRow, IonSpinner, IonTitle, IonToast, useIonRouter } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import TopToolbar from '../../../components/Common/TopToolbar'
import useInfiniteScroll from '../../../hooks/useInfiniteScroll'
import sorting_settings from '../../../config/sorting_settings'
import { orderService } from '../../../services/order.service'
import OrderCard from '../../../components/Cards/Order'
import ReceiptModal from '../../../components/Modals/Receipt'
import _ from 'lodash'
import FullSpinner from '../../../components/Common/FullSpinner'

const ProfileOrders = () => {

    const [ 
		items, 
		pageInfo, 
		loading, 
		resetingList,
		getItems,
		loadMore,
		sort,
		filterer,
		filterString
	] = useInfiniteScroll({
		service: orderService.getPaginated,
		// defaultParams: {
		// 	filterfield:['type'],
		// 	filtertype:['eq'],
		// 	filtervalue: tab === 'deliveries' ? ['DELIVERY'] : ['DISPENSARY']
		// },
		sortingOptions: sorting_settings.ordersPage
	})

    const router = useIonRouter()

    const [ showReceiptModal, setShowReceiptModal ] = useState(false)
    const [ scopedDispensary, setScopedDispensary ] = useState({})

    const [ showToast, setShowToast ] = useState({
        open: false
    })

    if(loading) return <FullSpinner />

    return (
        <IonContent>
            {
                showReceiptModal && !_.isEmpty(scopedDispensary) && <ReceiptModal 
                    showModal={showReceiptModal}
                    setShowModal={(val)=>setShowReceiptModal(val)}
                    scopedDispensary={scopedDispensary}
                    setShowToast={setShowToast}
                />
            }
            <IonToast
                isOpen={showToast.open}
                message={showToast.message}
                // icon={informationCircle}
                position="bottom"
                color={showToast.type}
                translucent={true}
                duration={3000}
                buttons={[
                    {
                      text: 'Hide',
                      role: 'cancel',
                    }
                ]}
            />
            <section className='full-width ion-padding-top ion-padding-bottom'>
                <IonTitle>My orders</IonTitle>
                <div className='ion-padding-start ion-padding-end'>{sort()}</div>
                {
		            items.length > 0 && (
                        <IonGrid>
                            <IonRow>
                            {
                                items.map( item => 
                                    <IonCol size="12" size-md="12">
                                        <OrderCard item={item} setShowReceiptModal={setShowReceiptModal} setScopedDispensary={setScopedDispensary} /> 
                                    </IonCol>
                                )
                            }
                            </IonRow>
                        </IonGrid>
                    )
                }
                {
                    (loading && items.length === 0) ? (
                        <div style={{display:'flex', justifyContent:'center', minWidth:'100%', marginTop:'2rem', marginBottom:'2rem'}}>
                            <IonSpinner name="crescent" />
                        </div>
                    ) : (
                        <>
                            {
                                !loading && items.length === 0 && (
                                    <section style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center', marginTop:'2rem'}}>
                                        <img style={{width:'30%'}} src={'assets/images/order-status.png'}></img>
                                        <h1>No Results</h1>
                                        <span>You haven't made any orders.</span><br/>
                                        <IonButton onClick={()=>router.push('/products')} color='primary'>ORDER NOW</IonButton>
                                    </section>
                                )
                            }
                            {
				                loadMore()
			                }
                        </>
                    )
                }
            </section>
        </IonContent>
    )
}

export default ProfileOrders