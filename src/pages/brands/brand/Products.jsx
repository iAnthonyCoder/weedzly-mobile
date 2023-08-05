
import { IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonLabel, IonPage, IonRow, IonSpinner } from '@ionic/react'
import { chevronDown } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import ProductCard from '../../../components/Cards/Product'
import StrainCard from '../../../components/Cards/Strain'
import TopToolbar from '../../../components/Common/TopToolbar'
import FilterBrandModal from '../../../components/Modals/FilterBrandModal'
import FilterModal from '../../../components/Modals/FilterModal'
import filtering_settings from '../../../config/filtering_settings'
import sorting_settings from '../../../config/sorting_settings'
import useInfiniteScroll from '../../../hooks/useInfiniteScroll'
import { productService } from '../../../services/product.service'

const BrandProductsList = () => {


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
        // includeLocation: true,
        sortingOptions: sorting_settings.strainsPage,
        defaultParams: {
			filterfield: ['brand'],
			filtertype: ['eq'],
			filtervalue: ['raw-gardentm'], 
		},
    })

    const [ geneticsModal, setGeneticsModals ] = useState(false)
    const [ productTypesModal, setProductTypesModal ] = useState(false)
    const [ ratingModal, setRatingModal ] = useState(false)
    
    useEffect(() => {
        filterer(window.location.search.replace('?', '&'))
    }, []);
    

    return (
        <>
            <FilterModal 
                showModal={geneticsModal}
                setShowModal={setGeneticsModals}
                title={'Genetics'}
                filterer={filterer}
                settings={filtering_settings.productsPage.static[0]}
                filterString={filterString}
            />
            <FilterModal 
                showModal={productTypesModal}
                setShowModal={setProductTypesModal}
                title={'Categories'}
                filterer={filterer}
                settings={filtering_settings.productsPage.static[1]}
                filterString={filterString}
            />
            <FilterModal 
                showModal={ratingModal}
                setShowModal={setRatingModal}
                title={'Rating'}
                filterer={filterer}
                settings={filtering_settings.productsPage.static[2]}
                filterString={filterString}
            />
            <div>
                <section className='ion-padding-top' style={{width:'100%', display:'flex',overflowX: 'auto', whiteSpace: 'nowrap'}}>
                    <div><IonChip 
                        outline={filterString.split(`&filterfield[]=${filtering_settings.productsPage.static[1].field}&filtertype[]=${filtering_settings.productsPage.static[1].type}`).length - 1 > 0 ? false : true}
                        color='primary' 
                        onClick={()=>setProductTypesModal(true)}
                    >
                        <IonLabel>
                            Categories 
                            {filterString.split(`&filterfield[]=${filtering_settings.productsPage.static[1].field}&filtertype[]=${filtering_settings.productsPage.static[1].type}`).length - 1 > 0 && ` (${filterString.split(`&filterfield[]=${filtering_settings.productsPage.static[1].field}&filtertype[]=${filtering_settings.productsPage.static[1].type}`).length - 1})`} 
                        </IonLabel>	
                        <IonIcon icon={chevronDown} />
                    </IonChip></div>
                    <div><IonChip 
                        outline={filterString.split(`&filterfield[]=${filtering_settings.productsPage.static[0].field}&filtertype[]=${filtering_settings.productsPage.static[0].type}`).length - 1 > 0 ? false : true}
                        color='primary' 
                        onClick={()=>setGeneticsModals(true)}
                    >
                        <IonLabel>
                            Genetics 
                            {filterString.split(`&filterfield[]=${filtering_settings.productsPage.static[0].field}&filtertype[]=${filtering_settings.productsPage.static[0].type}`).length - 1 > 0 && ` (${filterString.split(`&filterfield[]=${filtering_settings.productsPage.static[0].field}&filtertype[]=${filtering_settings.productsPage.static[0].type}`).length - 1})`} 
                        </IonLabel>	
                        <IonIcon icon={chevronDown} />
                    </IonChip></div>
                    <div><IonChip 
                        outline={filterString.split(`&filterfield[]=${filtering_settings.productsPage.static[2].field}&filtertype[]=${filtering_settings.productsPage.static[2].type}`).length - 1 > 0 ? false : true}
                        color='primary' 
                        onClick={()=>setRatingModal(true)}
                    >
                        <IonLabel>
                            Rating 
                            {filterString.split(`&filterfield[]=${filtering_settings.productsPage.static[2].field}&filtertype[]=${filtering_settings.productsPage.static[2].type}`).length - 1 > 0 && ` (${filterString.split(`&filterfield[]=${filtering_settings.productsPage.static[2].field}&filtertype[]=${filtering_settings.productsPage.static[2].type}`).length - 1})`}
                        </IonLabel>	
                        <IonIcon icon={chevronDown} />
                    </IonChip></div>
                </section>
                <section className='full-width' >
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
                                            <ProductCard item={item}  />
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
            </div>
        </>
    )

}

export default BrandProductsList