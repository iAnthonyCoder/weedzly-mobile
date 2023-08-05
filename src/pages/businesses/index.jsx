import { 
	IonContent, 
	IonHeader,  
	IonGrid, 
	IonPage, 
	IonToolbar, 
	IonSpinner,
	IonButton,
	IonIcon,
	IonLabel,
	IonSegment,
	IonSegmentButton,
	IonChip,
	useIonRouter,
} from '@ionic/react';
import React, { useState, useEffect, useRef } from 'react'
import './index.css';
import { dispensaryService } from '../../services';
import { filterOutline, heart, locationOutline, locationSharp } from 'ionicons/icons';
import { TemporaryLocation } from '../../components/Modals/TemporaryLocation';
import TopToolbar from '../../components/Common/TopToolbar';
import BusinessCard from '../../components/Cards/Business';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import Sorter from '../../components/Common/Sorter';
import sorting_settings from '../../config/sorting_settings';
import filtering_settings from '../../config/filtering_settings'
import Tabs from '../../components/Tabs/Tabs';

const Businesses = (props) => {

	const [ tab, setTab ] = useState(window.location.hash.replace('#',''))

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
			filterfield:['type'],
			filtertype:['eq'],
			filtervalue: tab === 'deliveries' ? ['DELIVERY'] : ['DISPENSARY'], 
			geotype: tab === 'deliveries' ? 'intersect' : 'near', 
		},
		includeLocation: true,
		sortingOptions: sorting_settings.businessesPage
	})

	const isFirstRun = useRef(true);

	useEffect(() => {
		if (isFirstRun.current) {
			isFirstRun.current = false;
			return;
		}
		setDefaultParams({
			filterfield:['type'],
			filtertype:['eq'],
			filtervalue: tab === 'deliveries' ? ['DELIVERY'] : ['DISPENSARY'], 
			geotype: tab === 'deliveries' ? 'intersect' : 'near', 
		})
	}, [tab]);

	const router = useIonRouter()


	useEffect(() => {
		if(!window.location.hash.length > 0){
			setTab('dispensaries')
		} else if (tab != window.location.hash){
			setTab(window.location.hash.replace('#', ''))
		}
	}, [window.location])
	
	
	
	

	let location = localStorage.getItem('myLocationPlace')
	let locationC = localStorage.getItem('myLocation')
	const [ showLocationModal, setShowLocationModal ] = useState(false)

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
					title={'Businesses'} 
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

			  	<section style={{width:'100%', display:'flex',overflowX: 'auto', whiteSpace: 'nowrap'}}>
					{
					  	location && <div><IonChip color='tertiary' onClick={()=>setShowLocationModal(true)}>
							<IonIcon icon={locationSharp} />
							<IonLabel>
								{JSON.parse(location).place} • {JSON.parse(String(locationC)).boundingRadius/1609.34}mi
							</IonLabel>
						</IonChip></div>
					}
					{
						filtering_settings.businessesPage.options.map((x, i)=><div><IonChip 
							color='primary' 
							outline={filterString.includes(x.value) ? false : true}
							onClick={()=>filterer(x.value, filtering_settings.businessesPage.multi)}
						>
							<IonLabel>
								{x.label}
							</IonLabel>	
						</IonChip></div>)
					}
				</section>

				{
					!resetingList && !loading && items && items.length === 0 ? (
						<div style={{display:'flex', justifyContent:'space-between', flexDirection:'column', height:'100%'}}>
							<div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', height:'100%'}}>
								<img src={'assets/svg/cannabis-store.png'} style={{width:'40%'}}></img>
								<h3>No Dispensaries Within {(JSON.parse(locationC).boundingRadius/1609).toFixed(0)} Miles</h3>
								<IonButton expand="full" shape="round">Go to home</IonButton>
							</div>
							<div style={{height:'100px'}}></div>
						</div>
					) : (
						<IonGrid>
							{
								(resetingList) ? (
									<div style={{display:'flex', justifyContent:'center', minWidth:'100%', marginTop:'2rem', marginBottom:'2rem'}}>
										<IonSpinner name="crescent" />
									</div>
								) : (
									items && items.length > 0 && (
										<>
											<div style={{marginLeft:'4px', marginRight:'4px'}}>
												{sort()}
											</div>
											<div className='card-list' style={{marginTop:'20px'}}>
												{
													items.map((x, i) => 	
														<BusinessCard 
															item={x} 
															key={i} 
														/>
													)
												}
											</div>
										</>
									)
								)
							}
						</IonGrid>
					)
				}
				{
					loadMore()
				}
  	    	</IonContent>
			  <Tabs/>
  	  	</IonPage>
  	);
};

export default Businesses;

