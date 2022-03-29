import {fetchWrapper} from '../helpers/fetch-wrapper';
const apiUrl = `https://api.mapbox.com`

export const mapboxService = {
    reverseGeocoding,
    getStaticMap,
    geocoding,
    getDirections
};

function reverseGeocoding(longitude, latitude, types) {
    let getMapboxAccessToken = process.env.REACT_APP_PUBLIC_MAPBOX_ACCESS_TOKEN
    return fetchWrapper.get(`${apiUrl}/geocoding/v5/mapbox.places/${longitude},${latitude}.json?${types ? types : ''}&access_token=${getMapboxAccessToken}`);
}

function geocoding(value, types=['place', 'locality', 'address', 'poi'], limit=5) {
    let getMapboxAccessToken = process.env.REACT_APP_PUBLIC_MAPBOX_ACCESS_TOKEN
    return fetchWrapper.get(`${apiUrl}/geocoding/v5/mapbox.places/${value}.json?country=US&types=${encodeURIComponent(types)}&limit=${limit}&access_token=${getMapboxAccessToken}`);
}

function getStaticMap(_longitude, _latitude, zoom=13, width=600, height=240, type) {
    let getMapboxAccessToken = process.env.REACT_APP_PUBLIC_MAPBOX_ACCESS_TOKEN
    return `https://api.mapbox.com/styles/v1/mapbox/light-v10/static/${type==='dispensary' ? 'pin-s-commercial+285A98' : 'pin-s+fff'}(${_longitude},${_latitude})/${_longitude},${_latitude},${zoom},0/${width}x${height}@2x?access_token=${getMapboxAccessToken}&logo=false`;
} 

function getDirections(startLongitude, startLatitude, endLongitude, endLatitude){
    let getMapboxAccessToken = process.env.REACT_APP_PUBLIC_MAPBOX_ACCESS_TOKEN
    return fetchWrapper.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${startLongitude},${startLatitude};${endLongitude},${endLatitude}?geometries=geojson&access_token=${getMapboxAccessToken}`)
}

