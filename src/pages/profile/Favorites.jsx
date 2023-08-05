import { IonActionSheet, IonAvatar, IonButton, IonChip, IonIcon, IonItem, IonLabel, IonList, IonRouterLink, IonSpinner, IonText, useIonRouter } from '@ionic/react';
import { arrowDown, chevronDown, star } from 'ionicons/icons';
import { useState } from 'react'
import { useSelector } from 'react-redux';
import FavoriteButton from '../../components/Common/FavoriteButton';
import sorting_settings from '../../config/sorting_settings';
import { MY_LOCATION } from '../../helpers/constants';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { favoriteService } from '../../services/favorite.service';
import * as turf from "@turf/turf";

const Favorites = () => {

    const favorites = useSelector(state => state.favorites)
    const [ showActionSheet, setShowActionSheet ] = useState(false)
    const [ ScopedModel, setScopedModel ] = useState('products')
   

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
		service: favoriteService.getAllByCollection,
        mainParam: ScopedModel,
		// defaultParams: {
		// 	filterfield:['type'],
		// 	filtertype:['eq'],
		// 	filtervalue: tab === 'deliveries' ? ['DELIVERY'] : ['DISPENSARY']
		// },
		sortingOptions: {
            label: 'Sort by',
            icon: 'bx bx-sort',
            opts: [
                {
                    label:"Name A-Z", 
                    sortField:"createdAt", 
                    sortOrder:"desc", 
                    selected:true,
                    id:1
                }
            ]
        }
	})


    return (
        <section>
            <div 
                // style={{marginLeft:'.5rem', marginRight:'.5rem'}}
            >
                <IonChip onClick={()=>setShowActionSheet(true)} style={{textTransform: 'capitalize', marginTop:'0.5rem'}}>
                    {ScopedModel} <IonIcon icon={chevronDown}></IonIcon>
                </IonChip>
            </div>
            <IonActionSheet
                isOpen={showActionSheet}
                onDidDismiss={() => setShowActionSheet(false)}
                cssClass='my-custom-class'
                header='My Favorites'
                buttons={
                    [
                        {
                            text: 'Products',
                            handler: () => {
                                setScopedModel('products');
                            }
                        },{
                            text: 'Brands',
                            handler: () => {
                                setScopedModel('brands');
                            }
                        },{
                            text: 'Strains',
                            handler: () => {
                                setScopedModel('strains');
                            }
                        },{
                            text: 'Dispensaries & Deliveries',
                            handler: () => {
                                setScopedModel('dispensaries');
                            }
                        },{
                            text: 'Deals',
                            handler: () => {
                                setScopedModel('deals');
                            }
                        }
                    ]
                }
            >
            </IonActionSheet>
    
            <div>
                {
                    loading ? (
                        <div style={{display:'flex', justifyContent:'center', minWidth:'100%', marginTop:'2rem', marginBottom:'2rem'}}>
                            <IonSpinner name="crescent" />
                        </div>
                    ) : (
                        items.length > 0 ? (
                            <IonList>
                                {
                                    items.map((x, i) => cards(x, i, ScopedModel))
                                }
                            </IonList>
                        ) : (
                            noData(ScopedModel)
                        )
                    )
                }
            </div>
        </section>
        
    )
}

export default Favorites


const cards = (x, i, ScopedModel) => {

    const getNearest = (x) => {
        console.log(x);
        let a = x.retailers && x.retailers.length > 0 && x.retailers.map(x => {
            x.distance = turf.distance(
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Point",
                        "coordinates": [x.location.coordinates[0], x.location.coordinates[1] ]
                    }
                },
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Point",
                        "coordinates": [JSON.parse(localStorage.getItem(MY_LOCATION)).longitude, JSON.parse(localStorage.getItem(MY_LOCATION)).latitude]
    
                    }
                }, 
                { units: 'miles' }
            )
            return x
        }).sort(function(a, b) {
              return a.distance - b.distance;
            })
           
        return a[0]
    }

    const router = useIonRouter()
    switch (ScopedModel) {
        case 'products':
            return (
                <IonItem key={i} onClick={()=>router.push(`/brandproduct/${x.brand.slug}/${x.slug}`)}>
                    <IonAvatar slot="start">
                        <img src={x.picture && x.picture.length > 0 ? x.picture[0] : 'assets/images/default-pic.png'} />
                    </IonAvatar>
                    <IonLabel>
                        <h2>{x.name}</h2>
                        <h3>{x.category ? x.category.name : ''}</h3>
                        {/* <p>I've got enough on my plate as it is, and I...</p> */}
                    </IonLabel>
                    <FavoriteButton 
                        collection = 'products'
                        _id = {x._id}
                        slot={'end'}
                    />
                </IonItem>
            )
            break;

        case 'brands':
            return (
            
                    <IonItem key={i} onClick={()=>router.push(`/brands/${x.slug}`)}>
                        <IonAvatar slot="start">
                            <img src={x.logo} />
                        </IonAvatar>
                        <IonLabel>
                            <h2>{x.name}</h2>
                            <h3>Cannabis Brand</h3>
                            {/* <p>I've got enough on my plate as it is, and I...</p> */}
                        </IonLabel>
                        <FavoriteButton 
                            collection = 'brands'
                            _id = {x._id}
                            slot={'end'}
                        />
                    </IonItem>
               
            )
            break;

        case 'strains':
            return (
                <IonItem key={i} onClick={()=>router.push(`/strains/${x.slug}`)}>
                    <IonAvatar slot="start">
                        <img src={x.picture} />
                    </IonAvatar>
                    <IonLabel>
                        <h2>{x.name}</h2>
                        <h3>{x.type}</h3>
                        {/* <p>I've got enough on my plate as it is, and I...</p> */}
                    </IonLabel>
                    <FavoriteButton 
                        collection = 'strains'
                        _id = {x._id}
                        slot={'end'}
                    />
                </IonItem>
            )
            break;

        case 'dispensaries':
            return (
                <IonItem key={i} onClick={()=>router.push(`/businesses/profile/${x.slug}`)}>
                    <IonAvatar slot="start">
                        <img src={x.logo} />
                    </IonAvatar>
                    <IonLabel>
                        <h2>{x.name}</h2>
                        <h3 style={{textTransform:'capitalize'}}>{x.type ? x.type.toLowerCase() : ''}</h3>
                        {/* <p>I've got enough on my plate as it is, and I...</p> */}
                    </IonLabel>
                    <FavoriteButton 
                        collection = 'dispensaries'
                        _id = {x._id}
                        slot={'end'}
                    />
                </IonItem>
            )
            break;

        case 'deals':
            return (
                <IonItem key={i} onClick={()=>x.retailers ? router.push(`/businesses/profile/${getNearest(x).dispensary}`) : ''}>
                    <IonAvatar slot="start">
                        <img src={'/assets/images/deal_stock_new.png'} />
                    </IonAvatar> 
                    <IonLabel>
                        <h2>{x.name}</h2>
                        <small>
                            
                        {x.retailers && getNearest(x) && getNearest(x).distance && getNearest(x).distance.toFixed(2)} miles away
                        </small>
                        {/* <p>I've got enough on my plate as it is, and I...</p> */}
                    </IonLabel>
                    <FavoriteButton 
                        collection = 'deals'
                        _id = {x._id}
                        slot={'end'}
                    />
                </IonItem>
            )
            break;
    
        default:
            break;
    }
}

const noData = (ScopedModel) => {


    switch (ScopedModel) {
        case 'products':
            return (
                <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center', marginTop:'1rem'}}>
                    <img style={{width:'40%'}} src={'assets/images/spliff.png'} />
                    <IonText color='dark' style={{textAlign:'center'}}>
                        <h2>No Results</h2>
                        <p>You haven’t added any product to favorites.</p>
                    </IonText>
                </div>
            )
            break;

        case 'brands':
            return (
                <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center', marginTop:'1rem'}}>
                    <img style={{width:'40%'}} src={'assets/images/brand.png'} />
                    <IonText color='dark' style={{textAlign:'center'}}>
                        <h2>No Results</h2>
                        <p>You haven’t added any brand to favorites.</p>
                    </IonText>
                </div>
            )
            break;

        case 'strains':
            return (
                <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center', marginTop:'1rem'}}>
                    <img style={{width:'40%'}} src={'assets/images/reviewsstrain.png'} />
                    <IonText color='dark' style={{textAlign:'center'}}>
                        <h2>No Results</h2>
                        <p>You haven’t added any strain to favorites.</p>
                    </IonText>
                </div>
            )
            break;

        case 'dispensaries':
            return (
                <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center', marginTop:'1rem'}}>
                    <img style={{width:'40%'}} src={'assets/images/reviewsdispensary.png'} />
                    <IonText color='dark' style={{textAlign:'center'}}>
                        <h2>No Results</h2>
                        <p>You haven’t added any dispensary or delivery to favorites.</p>
                    </IonText>
                </div>
            )
            break;

        case 'deals':
            return (
                <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center', marginTop:'1rem'}}>
                    <img style={{width:'40%'}} src={'assets/images/no-data.png'} />
                    <IonText color='dark' style={{textAlign:'center'}}>
                        <h2>No Results</h2>
                        <p>You haven’t added any deal to favorites.</p>
                    </IonText>
                </div>
            )
            break;
    
        default:
            break;
    }
}