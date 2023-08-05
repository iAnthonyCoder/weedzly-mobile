import { IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonLabel, IonPage, IonRow, IonSegment, IonSegmentButton, IonSlide, IonSlides, IonSpinner, IonText, IonTitle, IonToolbar } from '@ionic/react'
import React, { useState, useEffect, useRef } from 'react'
import TopToolbar from '../../components/Common/TopToolbar'
import _ from 'lodash'
import queryString from 'query-string'
import { dealService } from '../../services/deal.service'
import moment from 'moment'
import DealCard from '../../components/Cards/Deal'
import { deal_target, product_type_deals } from '../../config/static_filters'
import useInfiniteScroll from '../../hooks/useInfiniteScroll'
import sorting_settings from '../../config/sorting_settings'
import filtering_settings from '../../config/filtering_settings'
import { chevronDown, locationSharp } from 'ionicons/icons'
import FilterModal from '../../components/Modals/FilterModal'
import FilterDaysModal from '../../components/Modals/FilterDaysModal'
import { TemporaryLocation } from '../../components/Modals/TemporaryLocation'
import Tabs from '../../components/Tabs/Tabs'


const _categories = [
    {
        label:'OVERVIEW',
        value:'overview',
        default:true
    },
    {
        label:'AVAILABLE TODAY',
        value:'today'
    },
    {
        label:'DAILY',
        value:'daily'
    }
]

export default function Deals () {

    const [ selectedCategory, setSelectedCategory ] = useState(_categories.find(x => x.default))
    const [ days, setDays ] = useState([])
    
    const [ 
		items, 
		pageInfo, 
		loading, 
		resetingList,
		getItems,
		loadMore,
		sort,
		filterer,
		filterString,
        setDefaultParams
	] = useInfiniteScroll({
		service: selectedCategory.value === 'overview' ? dealService.getAll : dealService.getNear,
		// defaultParams: queryString.parse(window.location.search, {arrayFormat:'bracket'}),
        includeLocation: true,
		sortingOptions: sorting_settings.dealsPage
	})

    useEffect(() => {
        filterer(window.location.search.replace('?', '&'))
    }, [])
    

    useEffect(() => {
        let _days = []
        let i
        for(i = 0; i < 7; i++){  
            _days.push({
                day: moment().add(i, 'days').format('dddd').toLowerCase(),
                date: moment().add(i, 'days').format('YYYY-MM-D'), 
                current: moment().add(i, 'days').format('YYYY-MM-D') === moment().format('YYYY-MM-D'),
            })
        }
        setDays(_days)
    }, [])

    const handleSelectedDay = (x) => {
        setDays(days.map(y => {
            if(y.date === x.date){
                y.current = true
            } else {
                y.current = false
            }
            return y
        }))
    }

    const isFirstRun = useRef(true);

    // useEffect(() => {
    //     if(days.length === 0){
    //         return
    //     }
    //     if (isFirstRun.current) {
    //         isFirstRun.current = false;
    //         return;
    //     }
    //     getData(null, true)
    // }, [days])


    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        if(selectedCategory.value === 'today'){
            setDefaultParams({
                day: moment().format('dddd').toLowerCase(),
                date: moment().format('YYYY-MM-D'), 
            })
        }
        if(selectedCategory.value === 'daily'){
            setDefaultParams({
                day: days.find(x => x.current).day.toLowerCase(),
                date: days.find(x => x.current).date
            })
        }
        if(selectedCategory.value === 'overview'){
            setDefaultParams({})
        }
    }, [selectedCategory, days]);
    


    const [ targetAudienceModalOpened, setTargetAudienceModalOpened ] = useState(false)
    const [ productTypesModalOpened, setProductTypesModalOpened ] = useState(false)
    const [ daysModalOpened, setDaysModalOpened ] = useState(false)
    const [ showLocationModal, setShowLocationModal ] = useState(false)

    let location = localStorage.getItem('myLocationPlace')
    let locationC = localStorage.getItem('myLocation')

    return (
        <IonPage>
            {
				showLocationModal && <TemporaryLocation 
                    showModal={showLocationModal} 
                    setShowModal={
                        (val)=>{
                            setTimeout(() => {
                                setShowLocationModal(val)
                            }, 200);
                        }
                    }  
                />
			}
            <IonHeader>
                <TopToolbar 
					title={'Deals Near You'} 
				/>
                <IonToolbar>
                    <IonSegment scrollable value={selectedCategory.value}>
                        {
                            _categories.map(x => <IonSegmentButton onClick={()=>setSelectedCategory(x)} value={x.value} >
        	                        <IonLabel>{x.label}</IonLabel>
        	                    </IonSegmentButton>
                            )
                        }
                    </IonSegment>
                </IonToolbar>
            </IonHeader> 
            <IonContent>
                {/* {
                    selectedCategory.value === 'daily' && <div style={{padding:'5px'}}>
                        {
                            days.map((x, i) => <IonChip onClick={()=>handleSelectedDay(x)} color={x.current === true  ? 'primary' : ''} >
                                <IonLabel style={{textTransform:'capitalize'}}>{x.day}</IonLabel>
                            </IonChip>)
                        }
                    </div>
                } */}
                <section style={{width:'100%', display:'flex',overflowX: 'auto', whiteSpace: 'nowrap'}}>
                    {
					  	location && <div><IonChip color='tertiary' onClick={()=>setShowLocationModal(true)}>
							<IonIcon icon={locationSharp} />
							<IonLabel>
								{JSON.parse(location).place} • {JSON.parse(String(locationC)).boundingRadius/1609.34}mi
							</IonLabel>
						</IonChip></div>
					}
                    <div><IonChip 
                        outline={filterString.split(`&filterfield[]=${filtering_settings.dealsPage.static[0].field}&filtertype[]=${filtering_settings.dealsPage.static[0].type}`).length - 1 > 0 ? false : true}
						color='primary' 
                        onClick={()=>setTargetAudienceModalOpened(true)}
					>
						<IonLabel>
						    Target Audiences {filterString.split(`&filterfield[]=${filtering_settings.dealsPage.static[0].field}&filtertype[]=${filtering_settings.dealsPage.static[0].type}`).length - 1 > 0 && ` (${filterString.split(`&filterfield[]=${filtering_settings.dealsPage.static[0].field}&filtertype[]=${filtering_settings.dealsPage.static[0].type}`).length - 1})`}
						</IonLabel>	
                        <IonIcon icon={chevronDown} />
					</IonChip></div>
                    <FilterModal 
                        showModal={targetAudienceModalOpened}
                        setShowModal={setTargetAudienceModalOpened}
                        title={'Target audiences'}
                        filterer={filterer}
                        settings={filtering_settings.dealsPage.static[0]}
                        filterString={filterString}
                    />
                     <div><IonChip 
                        outline={filterString.split(`&filterfield[]=${filtering_settings.dealsPage.static[1].field}&filtertype[]=${filtering_settings.dealsPage.static[1].type}`).length - 1 > 0 ? false : true}
						color='primary' 
                        onClick={()=>setProductTypesModalOpened(true)}
					>
						<IonLabel>
						    Product Types {filterString.split(`&filterfield[]=${filtering_settings.dealsPage.static[1].field}&filtertype[]=${filtering_settings.dealsPage.static[1].type}`).length - 1 > 0 && ` (${filterString.split(`&filterfield[]=${filtering_settings.dealsPage.static[1].field}&filtertype[]=${filtering_settings.dealsPage.static[1].type}`).length - 1})`}
						</IonLabel>	
                        <IonIcon icon={chevronDown} />
					</IonChip></div>
                    <FilterModal 
                        showModal={productTypesModalOpened}
                        setShowModal={setProductTypesModalOpened}
                        title={'Target audiences'}
                        filterer={filterer}
                        settings={filtering_settings.dealsPage.static[1]}
                        filterString={filterString}
                    />
                    {
                        selectedCategory.value === 'daily' && (
                            <>
                                <IonChip 
                                    outline={false}
					            	color='primary' 
                                    onClick={()=>setDaysModalOpened(true)}
					            >
					            	<IonLabel style={{textTransform:'capitalize'}}>
                                        {days.length > 0 && days.find(x => x.current).day}
					            	</IonLabel>	
                                    <IonIcon icon={chevronDown} />
					            </IonChip>
                                <FilterDaysModal 
                                    showModal={daysModalOpened}
                                    setShowModal={setDaysModalOpened}
                                    title={'Days'}
                                    handleSelectedDay={handleSelectedDay}
                                    settings={days}
                                />
                            </>
                        )
                    }
                </section>
                <section className='full-width '>
                    {/* {
                        deal_target.map(x => <IonChip
                            color='primary'
                            outline='true'
                            onClick={()=>filterer(`&filterfield[]=target_audience&filtertype[]=eq&filtervalue[]=${x.value}`)}
                        >
                            <IonLabel>{x.label}</IonLabel>
                        </IonChip>)
                    }
                    <br /><br /> */}

                    {/* <IonSlides style={{paddingLeft:'15px', paddingRight:'15px'}} pager={true} options={slideOpts}>
                        {
                            product_type_deals.map(x => <IonSlide
                                onClick={()=>filterer(`&filterfield[]=target_audience&filtertype[]=eq&filtervalue[]=${x.value}`)}
                            >
                                <div style={{display:'flex', flexDirection:'column'}}>
                                    <img src={x.img} style={{borderRadius:'100%'}}></img>
                                    <p style={{fontSize:'14px'}}>{x.label}</p>
                                </div>
                            </IonSlide>)
                        }
                    </IonSlides> */}
                    
                    {/* <IonText>
                        <h2 className='ion-margin-start ion-margin-end'>Deals Near You</h2>
                    </IonText> */}
                    {
                        loading && <div className='ion-margin-top ion-margin-bottom' style={{display:'flex', justifyContent:'center'}}>
                            <IonSpinner name="crescent" />
                        </div>
                    }
                    {
			            items.length > 0 && (
                            <>
                                <div className='ion-padding-start ion-padding-end'>
					            	{sort()}			
                                </div>
                                <IonGrid>
                                    <IonRow>
                                    {
                                        items.map( item => 
                                            <IonCol size="6" size-md="4">
                                                <DealCard 
                                                    showDays={true} 
                                                    item={item} 
                                                    businessSlug={item.dispensary.slug}
                                                />
                                            </IonCol>
                                        )
                                    }
                                    </IonRow>
                                </IonGrid>
                                {
					                loadMore()
				                }
                            </>
                        )
                    }
                    {
                        !loading && !items.length > 0 && (
                            <div className='ion-margin-top ion-margin-bottom ion-padding-top ion-padding-bottom' style={{display:'flex', flexDirection:'column', justifyContent:'center', width:'100%', alignItems:'center'}}>
                                <img style={{width:'30%'}} src={'assets/images/no-data.png'}></img>
                                <h4>No results found</h4>
                                <small>Try adjusting your filters</small>
                            </div>
                        )
                    }
                </section>
                {/* {
					data.length > 0 &&  <IonInfiniteScroll
						onIonInfinite={getData}
						threshold="100px"
						disabled={isInfiniteDisabled}
					>
						<IonInfiniteScrollContent
							  loadingSpinner="crescent"
						></IonInfiniteScrollContent>
					</IonInfiniteScroll>
				} */}
            </IonContent> 
            <Tabs/> 
        </IonPage>
    )

}