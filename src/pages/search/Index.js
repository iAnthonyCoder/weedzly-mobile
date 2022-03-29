import { IonAvatar, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonSearchbar, IonSegment, IonSegmentButton, IonThumbnail, IonTitle, IonToolbar, useIonRouter } from '@ionic/react'
import _ from 'lodash'
import { useState, useEffect, useRef } from 'react'
import TopToolbar from '../../components/Common/TopToolbar'
import { searchService } from '../../services/search.service'
import './Index.css'
import queryString from 'query-string'
import { MY_LOCATION } from '../../helpers/constants'
import cookie from 'js-cookie'
import FullSpinner from '../../components/Common/FullSpinner'

const Search = () => {

    const [ isFetching, setIsFetching ] = useState(false)
    const [ fetched, setFetched ] = useState(false)
    const [ result, setResult ] = useState([])
    const [ initialized, setInitialized ] = useState(false)

    const resultParser = (data, type) => {

        if(type==='brands'){
            data.icon=data.logo
            data.link=`/brands/${data.slug}`
            data.strinking = 'Brand'; 
            return data
        }

        if(type==='strains'){
            data.icon=Array.isArray(data.picture) ? data.picture[0] : data.picture
            data.strinking = 'Strain'; 
            data.type = data.genetics; 
            data.link=`/strains/${data.slug}`
            return data
        }

        if(type==='dispensaries'){
            data.link=`/businesses/profile/${data.slug}`
            data.icon=data.logo
            data.strinking = 'Dispensary'; 
            return data
        }

        if(type==='deliveries'){
            data.link=`/businesses/profile/${data.slug}`
            data.icon=data.logo
            data.strinking = 'Delivery'; 
            return data
        }
        

        if(type==='products'){
            data.icon=data.picture[0]
            data.link=`/brands/${data.brand.slug}/products/${data.slug}`
            data.strinking = 'Product'; 
            return data
        }

    }

    const [ segmentValue, setSegmentValue ] = useState('all')

    const getResults = async (query = '') => {
        setIsFetching(true)
        try {
            let location = localStorage.getItem(MY_LOCATION) ? JSON.parse(localStorage.getItem(MY_LOCATION)) : false
            // let res = await searchService.searchAll(query)

            // if(result.length>0){
            //     _result = result.map(x => {
            //         return resultParser(x, segmentValue)
            //     })
            //     setResult(_result)
            // } else {
            //     setResult([])
            // }
            // setResults(res)
            if(segmentValue === 'all'){
                
                let data = await searchService.searchAll(`${query}${location ? '&longitude='+location.longitude+'&latitude='+location.latitude : ''}`)
                let _results = []


                if(data.dispensaries.length===0){
                    delete data.dispensaries
                } else {
                    data.dispensaries = _results.concat(data.dispensaries.map(x => {
                        return resultParser(x, 'dispensaries')
                    }))
                }

                if(data.deliveries.length===0){
                    delete data.deliveries
                } else {
                    data.deliveries = _results.concat(data.deliveries.map(x => {
                        return resultParser(x, 'deliveries')
                    }))
                }


                if(data.products.length===0){
                    delete data.products
                } else {
                    data.products = _results.concat(data.products.map(x => {
                        return resultParser(x, 'products')
                    }))
                }

                if(data.brands.length===0){
                    delete data.brands
                } else {
                    data.brands = _results.concat(data.brands.map(x => {
                        return resultParser(x, 'brands')
                    }))
                }

                if(data.strains.length===0){
                    delete data.strains
                } else {
                    data.strains = _results.concat(data.strains.map(x => {
                        return resultParser(x, 'strains')
                    }))
                }


                let __result = []
                let i
                for(i = 0; i < 3; i++){
                    if(data.dispensaries) __result.push(data.dispensaries[i])
                    if(data.deliveries) __result.push(data.deliveries[i])
                    if(data.products) __result.push(data.products[i])
                    if(data.brands) __result.push(data.brands[i])
                    if(data.strains) __result.push(data.strains[i])
                }


          
                setResult(__result.filter(e => e))
                setFetched(true)
                setIsFetching(false)
                
            } else {
                let result = await searchService.searchAll(`${query}${location ? '&longitude='+location.longitude+'&latitude='+location.latitude : ''}`)
                let _result = []
                if(result.length>0){
                    _result = result.map(x => {
                        return resultParser(x, segmentValue)
                    })
                    setResult(_result)
                } else {
                    setResult([])
                }
                setFetched(true) 
                setIsFetching(false)
            }
        } catch (er) {
            console.log(er)
        }
    }

    const searchInput = useRef()

    const router = useIonRouter()

    const [ search, setSearch ] = useState('')
    const [ results, setResults ] = useState([])

    useEffect(() => {
        if(search.length > 2) {
            setInitialized(true)

            let _params = {
                page: 0,
                search: search,
                size: 3,
                type: 'searchbar'
            }

            if(segmentValue != 'all'){
                _params.collection = segmentValue
            }
            getResults(`?${queryString.stringify(_params)}`)
        }
    }, [search, segmentValue])

    const focusEl = async () => {
        await searchInput.current.setFocus()
        let el = await searchInput.current.getInputElement()
        await el.focus()
    }


    useEffect(() => {
        
        if(router.routeInfo.pushedByRoute){
            let tab = router.routeInfo.pushedByRoute.slice(1)
            if(tab === 'strains'){
                setSegmentValue('strains')
                document.getElementById('segment-strains').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center'
                });
            }
            if(tab === 'brands'){
                setSegmentValue('brands')
                document.getElementById('segment-brands').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center'
                });
            }
            if(tab === 'products'){
                setSegmentValue('products')
                document.getElementById('segment-products').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center'
                });
            }
            if(tab === 'deliveries'){
                setSegmentValue('strains')
                document.getElementById('segment-deliveries').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center'
                });
            }
            if(tab === 'dispensaries'){
                setSegmentValue('strains')
                document.getElementById('segment-dispensaries').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center'
                });
            }
        }
        // focusEl()

    }, [router.routeInfo])

    return (
        <IonPage>
            <IonHeader translucent>
                <TopToolbar 
                    title={'Search '+_.capitalize(segmentValue)}
                    disableSearch={true}
                    enableBackButton={true}
                    disableNotifications={true}
                    disableCart={true}
                    enableFavoriteButton={true}
                />
                <IonToolbar>
                    <IonSearchbar ref={searchInput} debounce='1000' value={search} onIonChange={(e) => setSearch(e.target.value)}></IonSearchbar>
                </IonToolbar>
                {
                    <IonToolbar>
                        <IonSegment onIonChange={e => setSegmentValue(e.detail.value)} scrollable value={segmentValue}>
                            <IonSegmentButton value="all">
                                <IonLabel>All</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton id='segment-products' value="products">
                                <IonLabel>Products</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton id='segment-brands' value="brands">
                                <IonLabel>Brands</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton id='segment-dispensaries' value="dispensaries">
                                <IonLabel>Dispensaries</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton id='segment-deliveries' value="deliveries">
                                <IonLabel>Deliveries</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton id='segment-strains' value="strains">
                                <IonLabel>Strains</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>
                    </IonToolbar>
                }
            </IonHeader>
            
            <IonContent fullscreen overflow-scroll='false' scrollEvents={true} >
                {
                    !initialized ? (
                        <IonList>
                            <IonItem onClick={()=>router.push('/map')}>
                                <IonAvatar slot="start">
                                    <img src={`assets/images/map-find.svg`}></img> 
                                </IonAvatar>
                                <IonLabel>
                                    <h2>{'Dispensaries near you'}</h2>
                                    <h3>{'Take a look at our map'}</h3>
                                </IonLabel>
                            </IonItem>
                            <IonItem onClick={()=>router.push('/library')}>
                                <IonAvatar slot="start">
                                    <img src={`assets/images/books.svg`}></img> 
                                </IonAvatar>
                                <IonLabel>
                                    <h2>{'Learn about cannabis'}</h2>
                                    <h3>{'Visit our knowledge source'}</h3>
                                </IonLabel>
                            </IonItem>
                            <IonItem onClick={()=>router.push('/deals')}>
                                <IonAvatar slot="start">
                                    <img src={`assets/images/sale.svg`}></img> 
                                </IonAvatar>
                                <IonLabel>
                                    <h2>{'Find the best deals'}</h2>
                                    <h3>{'Save money with Weedzly'}</h3>
                                </IonLabel>
                            </IonItem>
                        </IonList>
                    ) : (
                        isFetching ? (
                            <FullSpinner />
                        ) : (
                            result && result.length > 0 ? (
                                <IonList>
                                    {
                                        result.map((x, i) =>{
                                            return (
                                                <IonItem onClick={()=>router.push(x.link)}>
                                                    <IonAvatar slot="start">
                                                        <img  alt={x.name+' picture'} src={`${x.logo ? x.logo : 'assets/images/default-pic.png'}`}></img> 
                                                    </IonAvatar>
                                                    <IonLabel>
                                                        <h2>{x.name}</h2>
                                                        <h3>{x.strinking}</h3>
                                                    </IonLabel>
                                                </IonItem>
                                            )
                                        })
                                    }
                                </IonList>
                            ) : (
                                <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center', paddingTop:'4rem'}}>
                                    <img style={{width:'25%'}} src={'assets/images/no-data.png'}></img>
                                    <h3>No results found</h3>
                                </div>
                            )
                        )
                    )
                }
                
            </IonContent>
        </IonPage>
    )

}

export default Search