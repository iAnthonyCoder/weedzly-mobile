import { IonActionSheet, IonChip, IonCol, IonContent, IonGrid, IonIcon, IonLabel, IonRow, IonSkeletonText, IonSlide, IonSlides, IonSpinner } from '@ionic/react'
import { caretForwardCircle, chevronDown, close, heart, pin, share, trash } from 'ionicons/icons';
import moment from 'moment';
import React, { useState, useEffect } from 'react'
import { dealService } from '../../../services/deal.service';
import queryString from 'query-string'
import DealCard from '../../../components/Cards/Deal';
import useInfiniteScroll from '../../../hooks/useInfiniteScroll';
import sorting_settings from '../../../config/sorting_settings';

const Deals = (props) => {

    const [showActionSheet, setShowActionSheet] = useState(false);
    const [actionsLoading, setActionsLoading] = useState(false);
    let orderedDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
    const [ day, setDay ] = useState(moment().format('dddd').toUpperCase())
    const [ dailyDeals, setDailyDeals ] = useState([])


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
		service: dealService.getByDispensary,
		defaultParams: {
            filterfield: ['isDaily'],
            filtertype: ['eq'],
            filtervalue: ['false']
        },
        mainParam:props.entity.slug,
		sortingOptions: sorting_settings.dealsPage
	})


    const getDailyDeals = async () => {

        try {
            setActionsLoading(true)
            const res = await dealService.getByDispensary(props.entity.slug, '?'+queryString.stringify(
                {
                    filterfield: ['isDaily'],
                    filtertype: ['eq'],
                    filtervalue: ['true'],
                    page:1, 
                    size:20
                },{
                    arrayFormat:'bracket'
                }
            ))
            setDailyDeals(res.totalData)
            setActionsLoading(false)
        } catch (er) {
            console.log(er)
        }

    }


    useEffect(() => {
        getDailyDeals()
    }, []);

    const slideOpts = {
        initialSlide: 0,
        speed: 400,
       
        // centeredSlides: true,
      
        freeMode: false,
        pagination: ' ',
        breakpoints: {
			0: {
				
				slidesPerView: 1.6,
				spaceBetween: 16,
      	  	},
                640: {
				
				slidesPerView: 3.2,
				spaceBetween: 16,
			}
      	}
        
    };
    

    return (
        <IonContent>
            <IonActionSheet
                isOpen={showActionSheet}
                onDidDismiss={() => setShowActionSheet(false)}
                cssClass='my-custom-class'
                buttons={
                    orderedDays.map(x => ({
                        text: x,
                        handler: () => {
                            setDay(x);
                        }
                    }))
                }
            >
            </IonActionSheet>
            
                    {
                        actionsLoading || dailyDeals.length > 0 && (
                            <section style={{marginTop:'1rem', marginBottom:'1rem', paddingBottom:'2rem', borderBottom:'1px solid #cccccc'}}>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                    <h4 className='ion-no-padding ion-no-margin'>Daily Deals</h4>
                    <IonChip onClick={()=>setShowActionSheet(true)}>
                        <IonLabel>{day}</IonLabel>
                        <IonIcon icon={chevronDown} />
                    </IonChip>
                </div>
                <div>{
                                actionsLoading ? (
                                    <div style={{display:'flex'}}>
                                        <IonSkeletonText animated style={{ width: '70%', height:'200px'}} />
                                        <IonSkeletonText animated style={{ width: '70%', height:'200px', marginLeft:'16px'}} />
                                    </div>
                                ) : (
                                    <>
                                        {
                                            dailyDeals && dailyDeals.length > 0 && dailyDeals.filter(x => x.days.includes(day)).length > 0 && <IonSlides style={{paddingTop:'.5rem', paddingBottom:'.5rem'}} pager={true} options={slideOpts}>
                                            {
                                                dailyDeals.filter(x => x.days.includes(day)).map(x => <IonSlide>
                                                    <DealCard item={x} hideDispensaryName={true} />
                                                </IonSlide>)
                                            }
                                            </IonSlides>
                                        }
                                    </>
                                )}
                                </div>
                
                </section>
                        )
                    }
                
            <section className='full-width'>
                <h4 style={{paddingLeft:'10px', paddingRight:'10px'}}>Deals</h4>
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
                                                hideDispensaryName={true}
                                                showDays={true} 
                                                item={item} 
                                                businessSlug={props.entity.slug}
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
        </IonContent>
    )
}

export default Deals