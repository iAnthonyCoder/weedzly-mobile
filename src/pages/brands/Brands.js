import { IonCol, IonContent, IonGrid, IonHeader, IonInfiniteScroll, IonInfiniteScrollContent, IonLoading, IonPage, IonProgressBar, IonRow, IonSpinner, IonTitle } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import TopToolbar from '../../components/Common/TopToolbar'
import queryString from 'query-string'
import { brandService } from '../../services/brand.service'
import BrandCard from '../../components/Cards/Brand'
import useInfiniteScroll from '../../hooks/useInfiniteScroll'
import sorting_settings from '../../config/sorting_settings'
import Tabs from '../../components/Tabs/Tabs'

const Brands = () => {

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
		service: brandService.getPaginated,
		// defaultParams: {
		// 	filterfield:['type'],
		// 	filtertype:['eq'],
		// 	filtervalue: tab === 'deliveries' ? ['DELIVERY'] : ['DISPENSARY']
		// },
		sortingOptions: sorting_settings.brandsPage
	})

    return (
        <IonPage>
            <IonHeader>
                <TopToolbar
                    title={'Brands'}
                />
            </IonHeader>
            <IonLoading
                cssClass='my-custom-class'
                isOpen={loading}
                message={'Please wait...'}
                duration={5000}
            />
            <IonContent>
                <section className='full-width ion-padding-top ion-padding-bottom'>
                    <IonTitle>All brands</IonTitle>
                    <div className='ion-padding-start ion-padding-end'>{sort()}</div>
                    {
			            items.length > 0 && (
                            <IonGrid>
                                <IonRow>
                                {
                                    items.map( item => 
                                        <IonCol size="6" size-md="4">
                                                <BrandCard item={item}  />
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
                                        <h1></h1>
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
            <Tabs />
        </IonPage>
    )
}

export default Brands