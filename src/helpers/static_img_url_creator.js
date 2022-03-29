export const static_img_url_creator = (geodata, bbox=true) => {
        
    let url = ''
    let token = 'pk.eyJ1IjoiYW50aG9ueTk1MiIsImEiOiJjazl2enJuMWswNHJhM21vNHBpZGF3eXp0In0.zIyPl0plESkg395zI-WVsg'

    if(!geodata || !geodata.coordinates || !geodata.type){
        return undefined
    }

    switch (geodata.type) {
        case 'Point':
            url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-commercial+285A98(${geodata.coordinates[0]},${geodata.coordinates[1]})/${geodata.coordinates[0]},${geodata.coordinates[1]},13,0/400x250@2x?access_token=${token}`
            break;

        case 'Polygon':

            let longitudes = geodata.coordinates[0].map(x => {
                return x[1]
            })

            let latitudes = geodata.coordinates[0].map(x => {
                return x[0]
            })

            let minCenter = [Math.min(...longitudes), Math.min(...latitudes)]
            let maxCenter = [Math.max(...longitudes), Math.max(...latitudes)]

            let center = [ ((minCenter[0]+maxCenter[0])/2), ((minCenter[1]+maxCenter[1])/2)]

            let bbox = [
                minCenter[0], minCenter[1], maxCenter[0], maxCenter[1], 
            ]

           
            let zoom = 9
            let geojson = encodeURIComponent(JSON.stringify(
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": geodata.coordinates
                    }
                }
            ))
          
            let resolution = '450x290'
            if(bbox){
                url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/geojson(${geojson})/auto/${resolution}?access_token=${token}`
            } else {
                url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/geojson(${geojson})/${center[1]},${center[0]},${zoom}/${resolution}?access_token=${token}`
            }
            

            break;
    
        default:
            break;
    }
    return url
}