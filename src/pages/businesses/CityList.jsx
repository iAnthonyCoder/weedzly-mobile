import { IonContent, IonGrid, IonHeader, IonLabel, IonLoading, IonPage, IonSegment, IonSegmentButton, IonToolbar, useIonRouter } from '@ionic/react'
import React, { useEffect, useRef, useState } from 'react'
import BusinessCard from '../../components/Cards/Business'
import TopToolbar from '../../components/Common/TopToolbar'
import Tabs from '../../components/Tabs/Tabs'
import sorting_settings from '../../config/sorting_settings'
import useInfiniteScroll from '../../hooks/useInfiniteScroll'
import { dispensaryService } from '../../services'
import { cityService } from '../../services/city.service'
import { stateService } from '../../services/state.service'
import './StateList.css'

const CityListWrapper = (props) => {

    const [ tab, setTab ] = useState(window.location.hash.replace('#',''))
    const [ data, setData ] = useState(null)
    const [ loading, setLoading ] = useState(null)

    const getCity = async () => {

        try {
            const city = await cityService.findBySlug(props.match.params.city_slug, props.match.params.region_ab)
            setData(city);
            setLoading(false)
        } catch (er) {
            alert(er.message);
        }

    }

    useEffect(() => {
        setLoading(true)
        getCity()
    }, [])
    
    const router = useIonRouter()


    return (
        <IonPage>
            <IonLoading 
			    isOpen={loading}
			    message={'Getting City...'}
			    onDidDismiss={()=>setLoading(false)}
			/>
            <IonHeader>
				<TopToolbar 
					title={data ? data.name : 'Loading...'} 
                    enableBackButton={true}
				/>
				<IonToolbar>
				    <IonSegment onIonChange={e => setTab(e.detail.value === undefined ? '' : e.detail.value)} value={tab}>
        		      	<IonSegmentButton value="dispensaries">
        		      	  	<IonLabel>Dispensaries</IonLabel>
        		      	</IonSegmentButton>
        		      	<IonSegmentButton value="deliveries">
        		      	  	<IonLabel>Deliveries</IonLabel>
        		      	</IonSegmentButton>
        		    </IonSegment>
				</IonToolbar>
  	    	</IonHeader>
            <IonContent fullscreen overflow-scroll='false'>
                { !loading && data && <CityList 
                    {...props} 
                    tab={tab}
                    data={data}
                    setTab={setTab}
                /> } 
            </IonContent>
            <Tabs/>
        </IonPage>
    )
}

const CityList = (props) => {

    

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
		service: dispensaryService.getAll,
		defaultParams: {
			filterfield:['type', 'city'],
			filtertype:['eq', 'eq'],
			filtervalue: props.tab === 'deliveries' ? ['DELIVERY', props.data._id] : ['DISPENSARY', props.data._id], 
        }
	})

    useEffect(() => {
		if (isFirstRun.current) {
			isFirstRun.current = false;
			return;
		}
		setDefaultParams({
			filterfield:['type', 'city'],
            filtertype:['eq', 'eq'],
            filtervalue: props.tab === 'deliveries' ? ['DELIVERY', props.data._id] : ['DISPENSARY', props.data._id], 
        })
	}, [props.tab]);

    const isFirstRun = useRef(true);

    useEffect(() => {
		if(!window.location.hash.length > 0){
			props.setTab('dispensaries')
		} else if (tab != window.location.hash){
			props.setTab(window.location.hash.replace('#', ''))
		}
	}, [window.location])

    if(loading) return <IonLoading 
        isOpen={loading}
        message={'Getting Cities...'}
        // onDidDismiss={()=>setLoading(false)}
    />
    
    return (
        <>
            <IonGrid>
                {
                    items.length > 0 ? (    
                        <div className='card-list' style={{
                            paddingBottom:'1rem',
                            paddingTop:'1rem'
                        }}>
                            {
                                items.map((x, i) => 
                                    <BusinessCard item={x} hideDistance={true} />
                                )

                            } 
                        </div>
                    ) : (
                        <div className='ion-margin-top ion-margin-bottom ion-padding-top ion-padding-bottom' style={{display:'flex', flexDirection:'column', justifyContent:'center', width:'100%', alignItems:'center'}}>
                            <img style={{width:'30%'}} src={'assets/images/no-data.png'}></img>
                            <h4>No results found</h4>
                            <small>Try adjusting your filters</small>
                        </div>
                    )
                }
            </IonGrid>
        </>
       
    )

}

export default CityListWrapper