import React, { useState, useEffect, useRef } from 'react';
import MapGL, {
    Layer,
    Source,
    WebMercatorViewport,
    Marker,
    FlyToInterpolator
} from 'react-map-gl';
import cookie from 'js-cookie'
import _ from 'lodash';
import { easeCubic } from 'd3-ease';
import moment from 'moment';
import { mapboxService } from '../../services/mapbox.service';
import { MY_LOCATION } from '../../helpers/constants';


const RouteMap = (props) => {

   
    const [ userLocation, setUserLocation ] = useState({})
    const [ viewport, setViewport ] = useState({
        longitude: props.selectedDeal.dispensary.location.coordinates[0],
        latitude: props.selectedDeal.dispensary.location.coordinates[1],
        zoom: 12,
    })
    const [ route, setRoute ] = useState({})
    const [ loading, setLoading ] = useState(true)

    const getRoute = async () => {
        try {
            const dir = await mapboxService.getDirections(userLocation.longitude, userLocation.latitude, props.selectedDeal.dispensary.location.coordinates[0], props.selectedDeal.dispensary.location.coordinates[1])
            if(dir.code==='Ok'){
                setRoute(dir.routes[0])
            }
        } catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        if(!_.isEmpty(userLocation)){
            getRoute()
        }
    }, [userLocation, props])

    const applyToArray = (func, array) => func.apply(Math, array)

    useEffect(() => {
        if(!_.isEmpty(route)) {
            moveMap()
        }
    }, [route])

    useEffect(() => {
        if(_.isEmpty(userLocation) && localStorage.getItem(MY_LOCATION)){
            setUserLocation(JSON.parse(localStorage.getItem(MY_LOCATION)))
        } else {
            moveMap(props.currentContextQuery.bbox)
        }
    }, [])

    const moveMap = (points = [
        userLocation.longitude,
        userLocation.latitude,
        props.selectedDeal.dispensary.location.coordinates[0],
        props.selectedDeal.dispensary.location.coordinates[1]
    ]) => {
        setLoading(true)
        const vp = new WebMercatorViewport({ width: 400, height: 450 });
        const pointsLong = [parseFloat(points[0]), parseFloat(points[2])]
        const pointsLat = [parseFloat(points[1]), parseFloat(points[3])]
        const cornersLongLat = [
          [applyToArray(Math.min, pointsLong), applyToArray(Math.min, pointsLat)],
          [applyToArray(Math.max, pointsLong), applyToArray(Math.max, pointsLat)]
        ]
        const {longitude, latitude, zoom} = vp.fitBounds(cornersLongLat, {offset: [0, -100]});
        setViewport({
            ...viewport,
            longitude,
            latitude,
            zoom,
            transitionDuration: 2000,
            transitionInterpolator: new FlyToInterpolator(),
            transitionEasing: easeCubic
        });
        setLoading(false)
    }

    const getClickPosition = (data) => {
        setUserLocation({longitude: data.lngLat[0], latitude:data.lngLat[1]})
    }

    const _updateViewport = (newViewport) => {
        setViewport(newViewport)
    }

    const mapContainer = useRef()
    
    return (
        <div className={`routes-info `} style={{height:'95%'}} ref={mapContainer}>
            <div style={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center', paddingTop:'.5rem', paddingBottom:'.5rem'}}>
                        <div style={{display:'flex', alignItems:'center', justifyContent:'center', margin:'0 .5rem'}}>
                            <img src={'assets/icons/userLocator.png'} width={24} height={24} style={{margin:'0 0.5rem'}}/>
                            My location
                        </div>
                        <div style={{display:'flex', alignItems:'center', justifyContent:'center', margin:'0 .5rem'}}>
                            <img src={'assets/icons/deal-marker.png'} width={18} height={24} style={{margin:'0 0.5rem'}}/>
                            Destination
                        </div>
                    </div>
            <MapGL
                {...viewport}
                width="100%"
                height='100%'
                mapStyle="mapbox://styles/weedzly/ckjt2uh4q569819pjjbxz6tvd"
                onViewportChange={_updateViewport}
                mapboxApiAccessToken={process.env.REACT_APP_PUBLIC_MAPBOX_ACCESS_TOKEN}
                onClick={getClickPosition}
            >
                <>
                    <Marker 
                        key={props.selectedDeal._id} 
                        longitude={props.selectedDeal.dispensary.location.coordinates[0]} 
                        latitude={props.selectedDeal.dispensary.location.coordinates[1]} 
                        style={{
                            width:'32px',
                            height:'32px'
                        }}
                    >
                      <img src={'assets/icons/deal-marker.png'}   width={32} style={{transform:'translateX(-46%) translateY(-100%)'}} />
                    </Marker>
                    {
                        !_.isEmpty(userLocation) && <Marker 
                            key={'a'} 
                            longitude={userLocation.longitude} 
                            latitude={userLocation.latitude} 
                            style={{
                                width:'32px',
                                height:'32px'
                            }}
                        >
                          <img src={'assets/icons/userLocator.png'}  width={32} style={{transform:'translateX(-50%) translateY(-50%)'}} />
                        </Marker>
                    }
                    {
                        (!_.isEmpty(route)) && (
                            <Source 
                                id='polylineLayer' 
                                type='geojson' 
                                data={{
                                    'type': 'Feature',
                                    'properties': {},
                                    'geometry': route.geometry
                                }}
                            >
                                <Layer
                                    id='lineLayer'
                                    type='line'
                                    source='my-data'
                                    layout={{
                                        'line-join': 'round',
                                        'line-cap': 'round',
                                    }}
                                    paint={{
                                        'line-color': 'rgba(3, 170, 238, 0.5)',
                                        'line-width': 5,
                                    }}
                                />
                            </Source>
                        )
                    }
                </>
            </MapGL>
        </div>
    )
}

export default RouteMap;