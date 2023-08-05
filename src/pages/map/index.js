import React, { useState, useEffect, useRef } from 'react'
import MainMap from '../../components/Map/MainMap'
import { MY_LOCATION } from '../../helpers/constants'
import { createGesture, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonMenuButton, IonModal, IonProgressBar, IonSlide, IonSlides, IonTitle, IonToolbar, IonList, IonButton, IonPage, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react'
import { dispensaryService } from '../../services'
import { getDayAndTime } from '../../helpers/time'
import queryString from 'query-string'
import { useDebounce } from 'use-debounce';
import RetailerMapCard from '../../components/Cards/RetailerMap'
import CardsCarousel from '../../components/Carousels/CardsCarousel'
import './index.css'
import { filter, list, locateOutline, map } from 'ionicons/icons'
import CheckIfOpen from '../../helpers/checkIfOpen'
import moment from 'moment'
import TopToolbar from '../../components/Common/TopToolbar'
import VariousFilterModal from '../../components/Modals/VariousFilterModal'
import filtering_settings from '../../config/filtering_settings'
import Sorter from '../../components/Common/Sorter'
import sorting_settings from '../../config/sorting_settings'
import Tabs from '../../components/Tabs/Tabs'
import FullSpinner from '../../components/Common/FullSpinner'

const Map = () => {

    const [ viewport, setViewport ] = useState({
        longitude: 0,
        latitude: 0,
        zoom: 11,
        start: true
    })

    const [ fetchedViewport, setFetchedViewport ] = useState({
        longitude: 0,
        latitude: 0,
        zoom: 11,
        start: true
    })

    const [ isInfiniteDisabled, setInfiniteDisabled] = useState(false);
    const [ filterString, setFilterString ] = useState('')
    const [ selectedDispensary, setSelectedDispensary ] = useState(false)
    const [ entities, setEntities ] = useState([])
    const [ actionsLoading, setActionsLoading ] = useState(true)
    const [ loadingArea, setLoadingArea ] = useState(false)
    const [ getNew, setGetNew ] = useState(true)
    const [ sortingParams, setSortingParams ] = useState({
        label: 'Sort by',
        icon: 'bx bx-sort',
        opts: [
            {
                id:1,
                label:"Nearest", 
                sortField:"calcDistance", 
                sortOrder:"asc", 
                selected:true
            },
            {
                id:2,
                label:"Furthest", 
                sortField:"calcDistance", 
                sortOrder:"desc", 
            }
        ]
    })

    const getViewport = () => {
        let _viewportFromCookies = JSON.parse(localStorage.getItem(MY_LOCATION))
        setViewport({
            longitude: _viewportFromCookies.longitude,
            latitude: _viewportFromCookies.latitude,
            zoom: 11
        })
        getLocations({
            longitude: _viewportFromCookies.longitude,
            latitude: _viewportFromCookies.latitude,
            zoom: 11
        })
    }

    const [ pageInfo, setPageInfo ] = useState({
        pageSize: 15,
        pageNumber: 1
    })

    const getSortParams = () => {
        let selected = sortingParams.opts.find(x => x.selected)
        return {
            sortField: selected.sortField,
            sortOrder: selected.sortOrder
        }
    }

    const filterer = (value, multi) => {
        if(value === null){
            setFilterString('')
        } else if (filterString.includes(value)){
            setFilterString(filterString.replace(value, ''))
        } else {
            setFilterString(filterString + value)
        }
    }

    const getLocations = async (viewport, disableMove) => {
        setLoadingArea(true)
        setEntities([])
        try {
            setActionsLoading(true)
            setGetNew(true)
            let queryParams = queryString.stringify({
                latitude: viewport.latitude, 
                longitude: viewport.longitude, 
                boundingRadius: viewport.zoom < 10 ? 24000 : viewport.zoom >= 10 && viewport.zoom <= 12 ? 16000 : viewport.zoom > 12 ? 8000 : 6000, 
                size: pageInfo.pageSize, 
                page:pageInfo.pageNumber,
                ...getSortParams()
            }, {
                arrayFormat:'bracket'
            })+(window.location.search.includes('isOpen') ? getDayAndTime() : '')
            const payload = await dispensaryService.getNear('?'+queryParams+filterString)
            setPageInfo({...pageInfo, totalCount: payload.totalCount})
            setEntities(payload.totalData)
            setActionsLoading(false)
            setLoadingArea(false)
            setGetNew(false)
            setFetchedViewport(viewport)
            if(!disableMove){
                if(payload.totalData.length > 0){
                    setViewport({...viewport, latitude:payload.totalData[0].location.coordinates[1], longitude:payload.totalData[0].location.coordinates[0]})
                }
            }
            
            if(payload.totalData.length>0){
                setSelectedDispensary(payload.totalData[0]['slug'])
                handleStarting()
            }
        } catch (er) {
            setActionsLoading(false)
            setLoadingArea(false)
        }
    } 


    const nextPage = async (ev) => {
        try {
            setLoadingArea(true)
            setActionsLoading(true)
           
            let queryParams = queryString.stringify({
                latitude: viewport.latitude, 
                longitude: viewport.longitude, 
                boundingRadius: viewport.zoom < 10 ? 24000 : viewport.zoom >= 10 && viewport.zoom <= 12 ? 16000 : viewport.zoom > 12 ? 8000 : 6000, 
                size: pageInfo.pageSize, 
                page:pageInfo.pageNumber + 1,
                ...getSortParams()
            }, {
                arrayFormat:'bracket'
            })+(window.location.search.includes('isOpen') ? getDayAndTime() : '')
            const payload = await dispensaryService.getNear('?'+queryParams+filterString)
            setEntities([...entities, ...payload.totalData])
            setActionsLoading(false)
            setLoadingArea(false)
            setPageInfo({...pageInfo, pageNumber:pageInfo.pageNumber + 1, totalCount: payload.totalCount})
            ev && ev.target.complete();
            if(((pageInfo.pageNumber) * pageInfo.pageSize) + payload.totalData.length >= payload.totalCount){
                setInfiniteDisabled(true);
            } else {
                setInfiniteDisabled(false);
            }
        } catch (er) {
            setActionsLoading(false)
            setLoadingArea(false)
        }
    }
    

    const [ debouncedViewPort ] = useDebounce(viewport, 1000);

    // useEffect(() => {
    //     if(!debouncedViewPort.start){
    //         if(debouncedViewPort.updateMap){
    //             getLocations(debouncedViewPort)
    //         }
    //     }
    // }, [debouncedViewPort])

    // useEffect(() => {
    //     getLocations(view)
    // }, [])

    const _updateViewport = (viewport) => {
        // setSliderPositionClass('bottom')
        // console.log(viewport)
        setViewport({...viewport, fetched: true})
    }

    const slideOpts = {
        initialSlide: 0,
        speed: 400,
        slidesPerView: 1.2,
        centeredSlides: true,
        spaceBetween: 10, 
        freeMode: false,
        pagination: ' ',
        
    };

    const [ sliderPosition, setSliderPosition ] = useState(0)

    const [ sliderPositionClass, setSliderPositionClass ] = useState('top')

    const moveSlider = (detail) => {
        let position = detail.currentY - detail.startY 
        setSliderPosition(position)

        // let toTop = detail.currentX < detail.startX ? false : true
        // if(toTop){
        //     setSliderPosition('top')
        // } else {
        //     setSliderPosition('bottom')
        // }
    }

    const stopMoveSlider = (detail) => {
        let el = document.querySelector(`.slider-wrapper`)
        let toTop = detail.currentY < detail.startY ? false : true
        let val = detail.currentY - detail.startY
        
        if(!toTop && (val > 30 || val < -30)){
            setSliderPositionClass('top')
            el.style.transform = "";
        } else if(toTop && (val > 30 || val < -30)) {
            setSliderPositionClass('bottom')
            el.style.transform = "";
        }
        el.style.transform = "";
    }

    useEffect(() => {
        if(entities.length>0){
            setTimeout(() => {
                if(entities.length > 0){
                    const detailsSelector = document.querySelector(`.gestureCatcher`)
                    if (detailsSelector) {
                        const gesture = createGesture({
                          el: detailsSelector,
                          gestureName: 'pull-up',
                          gesturePriority: 100,
                          direction:'y',
                          threshold: 0,
                          onMove: (detail) => { moveSlider(detail) },
                          onEnd: (detail) => { stopMoveSlider(detail) }
                        });
                        gesture.enable(true);
                    }
                }
            }, 2000);
        }
    }, [entities])
    
    useEffect(() => {
        getViewport()
    }, [filterString, sortingParams])

    const [ currentItem, setCurrentItem ] = useState(null)

    const [ showModal, setShowModal ] = useState(false)

    const updateActiveSlide = (index, includeViewport) => {
        if(entities.length > 0){
            setSelectedDispensary(entities[index].slug)
            setSliderPositionClass('top')
            if(includeViewport){
                _updateViewport({
                    ...viewport,
                    latitude: entities[index].location.coordinates[1],
                    longitude: entities[index].location.coordinates[0], 
                    updateMap: false
                })
            
            }
        }
    }

    const slidesRef = useRef();
    const handleStarting = () => slidesRef.current?.slideTo(0);
    
    const _slideTo = (slug) => {
        entities.map((x, i) => {
            if(x.slug === slug){
                slidesRef.current?.slideTo(i);
            }
        })
    };

    const [ showFilterModal, setShowFilterModal ] = useState(false)
    
    

    return (
        <IonPage>
        
            {
                actionsLoading && <IonProgressBar type="indeterminate"></IonProgressBar>
            }
            {/* <Gestures /> */}
            <IonHeader>
                <TopToolbar 
                    title='Map'
                />
            </IonHeader>
           
            <VariousFilterModal 
                showModal={showFilterModal}
                setShowModal={setShowFilterModal}
                title={'Map filters'}
                filterer={filterer}
                settings={filtering_settings.mainMap.static}
                filterString={filterString}
            />
            <IonContent style={{display:showModal?'flex':'none'}}>
      
                <section>
                    {
                        entities.length > 0 && sortingParams && sortingParams.opts && sortingParams.opts.length > 0 && <Sorter 
		            	    count={pageInfo.totalCount}
                            sortingParams={sortingParams}
                            setSortingParams={setSortingParams}
		                />
                    }
                </section>

                <IonList>
                {
                    getNew ? (
                        <FullSpinner />
                    ) : entities.length > 0 ? ( 
                        entities.map((x, i) => <IonItem>
                            <div key={i} id={i} className='retailer-card-map' style={{width:'100%'}}>
                                <h5>{x.name}</h5>
                                <div style={{width:'100%', display:'flex', justifyContent:'space-between'}}>
                                    <div style={{display:'flex', flexDirection:'column'}}>
                                        <small style={{textTransform:'capitalize', marginBottom:'.5rem'}}>{x.type.toLowerCase()} •  
                                            {
				                                x.isMedical && x.isRecreational 
				                                ? ' Med & Rec' 
				                                : (x.isMedical)
				                                ? ' Medical'
				                                : (x.isRecreational)
				                                ? ' Recreational'
				                                : ''
			                                }
                                        </small>
                                        <small style={{marginBottom:'.5rem'}} >
                                            {x.city.name}, {x.city.state.name}
                                        </small>
                                        <small style={{marginBottom:'.5rem'}}>
                                            <i className='bx bx-time'></i>
                                            <strong style={ CheckIfOpen(x.hoursofoperation, x.TZ).isOpen === true ? {color:'#1885ff'} : {color:'#e35889'} }>
                                            {
                                                CheckIfOpen(x.hoursofoperation, x.TZ).isOpen === true 
                                                    ? 'Open '
                                                    : 'Closed '
                                            }
                                            </strong>
                                            {
                                                CheckIfOpen(x.hoursofoperation, x.TZ).isOpen && <>until {moment(Math.floor(CheckIfOpen(x.hoursofoperation, x.TZ).closes_at/60) + ':' + (CheckIfOpen(x.hoursofoperation, x.TZ).isOpen%60 < 10 ? (CheckIfOpen(x.hoursofoperation, x.TZ).closes_at%60).toString()+'0' : CheckIfOpen(x.hoursofoperation, x.TZ).isOpen%60), 'HH:mm').format('h:mm A')}</>
                                            }
                                        </small>
                                    </div>
                                    <div><img src={x.logo} style={{height:'50px', borderRadius:'100%'}} /></div>
                                </div>
                                <br/>
                                <div>
                                    <IonButton color='primary' >View Profile</IonButton>
                                </div>
                            </div>
                        </IonItem>)
                    ) : (
                        <div className='ion-margin-top ion-margin-bottom ion-padding-top ion-padding-bottom' style={{display:'flex', flexDirection:'column', justifyContent:'center', width:'100%', alignItems:'center'}}>
                            <img style={{width:'30%'}} src={'assets/images/no-data.png'}></img>
                            <h4>No results found</h4>
                            <small>Try adjusting your filters</small>
                        </div>
                    )
                }
                </IonList>
                {
                    entities && entities.length > 0 &&  <IonInfiniteScroll
                        onIonInfinite={e => nextPage(e)}
                        threshold="100px"
                        disabled={isInfiniteDisabled}
                    >
                        <IonInfiniteScrollContent
                              loadingSpinner="crescent"
                        ></IonInfiniteScrollContent>
                    </IonInfiniteScroll>
                }
                <br />
                <br />
                <br />
            </IonContent>
            
            <MainMap
                active={showModal}
                _updateViewport = { _updateViewport }
                viewport = { viewport }
                entities= { entities }
                selectedDispensary = { selectedDispensary }
                setSelectedDispensary = { setSelectedDispensary }
                _slideTo={ _slideTo }
            />
            {
                (!showModal && ((viewport.longitude != fetchedViewport.longitude) && (viewport.latitude != fetchedViewport.latitude))) && <IonFab vertical='top' style={{left:'50%', transform:'translateX(-50%)', marginTop:'50px', zIndex:'2000'}}>
                    <IonButton disabled={loadingArea} onClick={()=>{
                        handleStarting();
                        getLocations(viewport, true)
                    }}>
                        {
                            loadingArea ? 'Loading...' : 'Scan this area'
                        }
                    </IonButton>
                </IonFab>
            }
            {
                !showModal && <IonFab vertical="bottom" style={{bottom: sliderPositionClass === 'bottom' ? '80px' : '330px'}} horizontal="end">
                    <IonFabButton onClick={()=>setShowFilterModal(true)}>
                        <IonIcon icon={filter} />
                    </IonFabButton>
                </IonFab>
            }
            {
                !showModal && <IonFab vertical="bottom" style={{bottom: sliderPositionClass === 'bottom' ? '80px' : '190px'}} horizontal="end">
                    <IonFabButton onClick={()=>setShowModal(showModal ? false : true)}>
                        <IonIcon icon={showModal ? map : list} />
                    </IonFabButton>
                </IonFab>
            }
            
            {
                !showModal && <IonFab vertical="bottom" style={{bottom: sliderPositionClass === 'bottom' ? '150px' : '260px'}} horizontal="end">
                    <IonFabButton>
                        <IonIcon icon={locateOutline} />
                    </IonFabButton>
                </IonFab>
            }


            {
                showModal && <IonFab vertical="bottom" style={{bottom: sliderPositionClass === 'bottom' ? '0px' : '80px'}} horizontal="end">
                    <IonFabButton onClick={()=>setShowModal(showModal ? false : true)}>
                        <IonIcon icon={showModal ? map : list} />
                    </IonFabButton>
                </IonFab>
            }

            {
                showModal && <IonFab vertical="bottom" style={{bottom: sliderPositionClass === 'bottom' ? '80px' : '160px'}} horizontal="end">
                    <IonFabButton onClick={()=>setShowFilterModal(true)}>
                        <IonIcon icon={filter} />
                    </IonFabButton>
                </IonFab>
            }

            { entities && entities.length > 0 && <IonContent className={`slider-wrapper ${sliderPositionClass}`}
                style={{transform:'translateY('+sliderPosition+'px)', display:!showModal?'flex':'none'}}
             >
                <IonSlides 
                    ref={slidesRef}
                    slideNex
                    options={slideOpts}
                    onIonSlideReachEnd={(e) => {
                        if(!actionsLoading){
                            nextPage()
                        }
                    }}
                    onIonSlideDidChange={(e) => updateActiveSlide(e.target.swiper.activeIndex, false)}
                    // onIonSlidesDidLoad={(e) => {console.log(e)}}
                >
                    {
                        entities.map((entity, i) => <IonSlide 
                            key={i}
                        >
                            <RetailerMapCard entity={entity} sliderPositionClass={sliderPositionClass} setSliderPositionClass={setSliderPositionClass} className='dispensary-card' />
                        </IonSlide>)
                    }
                </IonSlides>
                
            </IonContent>}
            <Tabs style={{zIndex:'201'}} />
        </IonPage>
    )
}

export default Map