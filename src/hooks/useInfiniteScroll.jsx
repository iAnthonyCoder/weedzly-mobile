import React, { useEffect, useRef, useState } from 'react'
import cookie from 'js-cookie'
import queryString from 'query-string'
import { 
	IonInfiniteScroll, 
  	IonInfiniteScrollContent,
} from '@ionic/react';
import sorting_settings from '../config/sorting_settings';
import Sorter from '../components/Common/Sorter';

const useInfiniteScroll = (props) => {

    const pageInfoInitialState = {
        count: '',
        currentPage: '',
        currentLength: 0,
        pageSize: 24,
        from: 0,
        to: '',
    }

    const [ loading, setLoading ] = useState(true)
    const [ resetingList, setResetingList ] = useState(false)
    const [ isInfiniteDisabled, setInfiniteDisabled] = useState(false);
    const [ items, setItems ] = useState([])
    const [ pageInfo, setPageInfo ] = useState(pageInfoInitialState)
    const [ sortingParams, setSortingParams ] = useState(props.sortingOptions)
    const [ defaultParams, setDefaultParams ] = useState(props.defaultParams)
    const [ filterString, setFilterString ] = useState('')

    const getSortParams = () => {
        if(sortingParams){
            let selected = sortingParams.opts.find(x => x.selected)
            return {
                sortField: selected.sortField,
                sortOrder: selected.sortOrder
            }
        } else {
            return {}
        }
        
    }

    const getItems = async (ev) => {
        try {
            if(!ev){
                setResetingList(true)
            }
            setLoading(true)
            let locationC = await localStorage.getItem('myLocation')
            let location = {
                latitude: JSON.parse(locationC).latitude,
                longitude: JSON.parse(locationC).longitude,
                boundingRadius: JSON.parse(locationC).boundingRadius
            }
            let pageOptions = {
                size: pageInfo.size,
                from: ev ? pageInfo.from + pageInfo.currentLength : 0,
                ...getSortParams()
            }
            let params = {
                ...props.includeLocation && location,
                ...defaultParams,
                ...pageOptions, 
            }
            let res
            if(props.mainParam){
                res = await props.service(props.mainParam, `?${queryString.stringify(params, {arrayFormat:'bracket', skipEmptyString: true})}${filterString}`)
            } else {
                res = await props.service(`?${queryString.stringify(params, {arrayFormat:'bracket', skipEmptyString: true})}${filterString}`)
            }
            let newPageInfo = {
                from: res.from,
                to: res.from + res.totalData.length,
                totalCount: res.totalCount.length > 0 ? res.totalCount[0]['count'] : 0,
                currentLength: res.totalData.length,
            }
            if(!ev){
                setItems([...res.totalData])
            } else {
                setItems([...items, ...res.totalData])
            }
            setPageInfo(newPageInfo)
            if(newPageInfo.from + res.totalData.length >= newPageInfo.totalCount){
                setInfiniteDisabled(true);
            } else {
                setInfiniteDisabled(false);
            }
            ev && ev.target.complete();
            setLoading(false)
            setResetingList(false)
        } catch (er) {
            console.log(er);
            setLoading(false)
        }
    }

    const isFirstRun = useRef(true);

    useEffect(() => {
   
        if(props.startWithUrlFilter){
            // if (isFirstRun.current) {
            //     isFirstRun.current = false;
            //     return;
            // }
            setItems([])
            getItems()
        } else {
            setItems([])
            getItems()
        }
    }, [sortingParams, filterString, defaultParams, props.mainParam])

    const loadMore = () => (
        items && items.length > 0 &&  <IonInfiniteScroll
            onIonInfinite={e => getItems(e)}
            threshold="100px"
            disabled={isInfiniteDisabled}
        >
            <IonInfiniteScrollContent
                  loadingSpinner="crescent"
            ></IonInfiniteScrollContent>
        </IonInfiniteScroll>
    )

    const sort = () => (
        items.length > 0 && sortingParams && sortingParams.opts && sortingParams.opts.length > 0 && <Sorter 
			count={pageInfo.totalCount}
            sortingParams={sortingParams}
            setSortingParams={setSortingParams}
		/>
    )

    const filterer = (value, multi, valueToRemove) => {
        if(value === null){
            setFilterString('')
        } else if (filterString.includes(value)){
            setFilterString(filterString.replace(value, ''))
        } else if (multi){
            setFilterString(filterString + value)
        } else {
            let matchParam = value.substring(0, value.indexOf('filtervalue[]=')+'filtervalue[]='.length)
            let newParam = ''
            if(valueToRemove && value){
                newParam = filterString.replace(valueToRemove, '').concat(value)
            } else if(filterString.includes(matchParam)){
                let t1 = filterString.substring(0, filterString.indexOf(matchParam))
                let t2 = filterString.substring(filterString.indexOf(matchParam) + matchParam.length, filterString.length)
                let t3
                if(t2.includes('&')){
                    t3 = t2.substring(t2.indexOf('&'), t2.length)
                } else {
                    t3 = ''
                }
                newParam = t1 + value + t3
                
            } else {
                newParam = filterString + value
            }
            setFilterString(newParam)
        }
    }

    return [
        items,
        pageInfo,
        loading,
        resetingList,
        getItems,
        loadMore,
        sort,
        filterer,
        filterString,
        setDefaultParams,
        setItems
    ]
}

export default useInfiniteScroll