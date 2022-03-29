import { IonCol, IonContent, IonGrid, IonRow, IonSpinner } from '@ionic/react'
import { useState, useEffect } from 'react'
import ProductCard from '../../../components/Cards/Product'
import ProductRewardCard from '../../../components/Cards/ProductReward'
import sorting_settings from '../../../config/sorting_settings'
import useInfiniteScroll from '../../../hooks/useInfiniteScroll'
import { productService } from '../../../services/product.service'


const DispensaryRewards = (props) => {

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
        service: productService.getAll,
        mainParam: props.entity._id,
        sortingOptions: null,
        defaultParams: {
			filterfield: ['isWPointsSalable'],
			filtertype: ['eq'],
			filtervalue: ['true'], 
            size: 12,
            page: 0
		},
    })

    return (
        <IonContent>
            <section className='full-width' style={{marginTop:'10px'}} >
                    {/* <IonTitle className='ion-no-margin'>All Strains</IonTitle> */}
                   
                    <div className='ion-padding-start ion-padding-end'>
						{sort()}			
                    </div>
                    {
			            items.length > 0 && (
                            <IonGrid>
                                <IonRow>
                                {
                                    items.map( item => 
                                        <IonCol size="6" size-md="4">
                                            <ProductRewardCard item={item} brand_slug={item.brand.slug}  business_slug={props.entity.slug} />
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
                                        <div className='ion-margin-top ion-margin-bottom ion-padding-top ion-padding-bottom' style={{display:'flex', flexDirection:'column', justifyContent:'center', width:'100%', alignItems:'center'}}>
                                            <img style={{width:'30%'}} src={'assets/images/no-data.png'}></img>
                                            <h3>No results found</h3>
                                            <p>Try adjusting your filters</p>
                                        </div>
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

export default DispensaryRewards