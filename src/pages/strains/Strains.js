import { IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonLabel, IonLoading, IonPage, IonRow, IonSpinner, IonTitle } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import TopToolbar from '../../components/Common/TopToolbar'
import { strainService } from '../../services/strain.service'
import queryString from 'query-string'
import './Strains.css'
import StrainCard from '../../components/Cards/Strain'
import FeelingModal from '../../components/Modals/FeelingModal'
import filtering_settings from '../../config/filtering_settings'
import { arrowDown, chevronDown } from 'ionicons/icons'
import FilterModal from '../../components/Modals/FilterModal'
import useInfiniteScroll from '../../hooks/useInfiniteScroll'
import sorting_settings from '../../config/sorting_settings'
import Tabs from '../../components/Tabs/Tabs'

const Strains = () => {

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
		service: strainService.getPaginated,
		// defaultParams: {
		// 	filterfield:['type'],
		// 	filtertype:['eq'],
		// 	filtervalue: tab === 'deliveries' ? ['DELIVERY'] : ['DISPENSARY']
		// },
		sortingOptions: sorting_settings.strainsPage
	})

    
    const [ typeModalOpened, setTypeModalOpened ] = useState(false)
    const [ effectsModalOpened, setEffectsModalOpened ] = useState(false)
    const [ flavorsModalOpened, setFlavorsModalOpened ] = useState(false)

    return (
        <IonPage>
            <IonHeader>
                <TopToolbar
                    title={'Strains'}
                    preselectedSearchTab={'strains'}
                />
            </IonHeader>
            {/* <IonLoading
                cssClass='my-custom-class'
                isOpen={loading}
                message={'Please wait...'}
                duration={5000}
            /> */}
            <FilterModal 
                showModal={typeModalOpened}
                setShowModal={setTypeModalOpened}
                title={'Type'}
                filterer={filterer}
                settings={filtering_settings.strainsPage.static[0]}
                filterString={filterString}
            />

            <FilterModal 
                showModal={effectsModalOpened}
                setShowModal={setEffectsModalOpened}
                settings={filtering_settings.strainsPage.static[1]}
                title={'Effects'}
                filterer={filterer}
                filterString={filterString}
            />

            <FilterModal 
                showModal={flavorsModalOpened}
                setShowModal={setFlavorsModalOpened}
                settings={filtering_settings.strainsPage.static[2]}
                title={'Flavors'}
                filterer={filterer}
                filterString={filterString}
            />
            
            <IonContent>
                <section className='ion-padding-top'>
                    <IonChip 
                        outline={filterString.split(`&filterfield[]=${filtering_settings.strainsPage.static[0].field}&filtertype[]=${filtering_settings.strainsPage.static[0].type}`).length - 1 > 0 ? false : true}
						color='primary' 
                        onClick={()=>setTypeModalOpened(true)}
					>
						<IonLabel>
						    Type {filterString.split(`&filterfield[]=${filtering_settings.strainsPage.static[0].field}&filtertype[]=${filtering_settings.strainsPage.static[0].type}`).length - 1 > 0 && ` (${filterString.split(`&filterfield[]=${filtering_settings.strainsPage.static[0].field}&filtertype[]=${filtering_settings.strainsPage.static[0].type}`).length - 1})`}
						</IonLabel>	
                        <IonIcon icon={chevronDown} />
					</IonChip>
                    <IonChip 
                        outline={filterString.split(`&filterfield[]=${filtering_settings.strainsPage.static[1].field}&filtertype[]=${filtering_settings.strainsPage.static[1].type}`).length - 1 > 0 ? false : true}
						color='primary' 
                        onClick={()=>setEffectsModalOpened(true)}
					>
						<IonLabel>
						    Effects {filterString.split(`&filterfield[]=${filtering_settings.strainsPage.static[1].field}&filtertype[]=${filtering_settings.strainsPage.static[1].type}`).length - 1 > 0 && ` (${filterString.split(`&filterfield[]=${filtering_settings.strainsPage.static[1].field}&filtertype[]=${filtering_settings.strainsPage.static[1].type}`).length - 1})`}
						</IonLabel>	
                        <IonIcon icon={chevronDown} />
					</IonChip>
                    <IonChip 
                        outline={filterString.split(`&filterfield[]=${filtering_settings.strainsPage.static[2].field}&filtertype[]=${filtering_settings.strainsPage.static[2].type}`).length - 1 > 0 ? false : true}
						color='primary' 
                        onClick={()=>setFlavorsModalOpened(true)}
					>
						<IonLabel>
						    Flavors {filterString.split(`&filterfield[]=${filtering_settings.strainsPage.static[2].field}&filtertype[]=${filtering_settings.strainsPage.static[2].type}`).length - 1 > 0 && ` (${filterString.split(`&filterfield[]=${filtering_settings.strainsPage.static[2].field}&filtertype[]=${filtering_settings.strainsPage.static[2].type}`).length - 1})`}
						</IonLabel>	
                        <IonIcon icon={chevronDown} />
					</IonChip>
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
                                            <StrainCard item={item}  />
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
                                            <h4>No results found</h4>
                                            <small>Try adjusting your filters</small>
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
            <Tabs/>
        </IonPage>
    )
}

export default Strains