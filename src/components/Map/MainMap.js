import * as React from 'react';
import {Component} from 'react';
import MapGL, {
    Popup,
    NavigationControl,
    FullscreenControl,
    ScaleControl,
    GeolocateControl,
    FlyToInterpolator
} from 'react-map-gl';
import Pins from './Pins';
import mapboxgl from "mapbox-gl"; 

mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;


const geolocateStyle = {
    position: 'absolute',
    bottom: 10,
    right: 0,
    padding: '10px'
};

const logoStyle = {
    position: 'absolute',
    bottom: "5px",
    right: "50%",
    padding: '5px',
    zIndex:"3",
    backgroundColor:"#00000014",
    transform: "translateX(50%)"
}

const fullscreenControlStyle = {
    position: 'absolute',
    bottom: 46,
    right: 0,
    padding: '10px'
};

const navStyle = {
    position: 'absolute',
    bottom: 82,
    right: 0,
    padding: '10px'
};

const scaleControlStyle = {
    position: 'absolute',
    bottom: 30,
    left: 0,
    padding: '10px'
};

class MainMap extends Component {

    constructor(props) {
        super(props);
        this.state = {
            popupInfo: null,
            size:50,
            mobile:false,
            mobileCard: null
        };
    }
    
    _onClickMarker = entity => {
        
        this.setState({popupInfo: entity});
    };

    _showDispensaryOnNavbar = (slug) => {
        if(!this.state.mobile){
            this.props.setSidebarMode('dispensary');
        }
        
        this.props.setSelectedDispensary(slug);
    }

    onResize = () => {

        if(document.documentElement.clientWidth >767){
            if(this.state.mobile){
                this.setState({mobile:false})
            }
        } else {
            if(!this.state.mobile){
                this.setState({mobile:true})
            }
        }
    }

    componentDidMount() {
        this.onResize()
        window.addEventListener('resize', this.onResize, false);
    }

    componentWillUnmount() {
        // you need to unbind the same listener that was binded.
        window.removeEventListener('resize', this.onResize, false);
    }

    _renderPopup() {
        const {popupInfo} = this.state;
      
        return (
            <>
         
            {
                popupInfo && (
                    <div style={{zIndex:500000}}>
                        <Popup
                          tipSize={8}
                        //   offsetLeft={30}
                        //   offsetTop={-50}
                        //   anchor="left"
                            anchor="top"
                          longitude={popupInfo.location.coordinates[0]}
                          latitude={popupInfo.location.coordinates[1]}
                          closeOnClick={false}
                          closeButton={false}
                          onClose={() => this.setState({popupInfo: null})}
                        >     
                            {/* <RetailerCard 
                                noPadding={true}
                                style={{zIndex:'6 !important'}}
                                dispensary={popupInfo} 
                                showButton={false} 
                                popup={true} 
                            /> */}
                        </Popup> 
                    </div>
                )
            }
            </>
        );
    }

    onMouseLeaving = e => {
      this.setState({popupInfo: null});
    }

    render(){

        const {viewport} = this.props;  
    
        return(
            <MapGL
                {...viewport}
                
                width="100%"
                height="100%"
                style={{display:!this.props.active ? 'flex' : 'none'}}
                mapStyle="mapbox://styles/weedzly/ckjt2uh4q569819pjjbxz6tvd"
                onViewportChange={(e) => this.props._updateViewport({...e, updateMap: true})}
                mapboxApiAccessToken={process.env.REACT_APP_PUBLIC_MAPBOX_ACCESS_TOKEN}
            >
           
                {
                    this.props.entities && <Pins 
                        data={this.props.entities} 
                        viewport={viewport}
                        _updateViewport={this.props._updateViewport}
                        onClick={this._onClickMarker} 
                        onMouseLeaving={this.onMouseLeaving}
                        _showDispensaryOnNavbar={this._showDispensaryOnNavbar}
                        selectedDispensary={this.props.selectedDispensary}
                        _slideTo={this.props._slideTo}
                    /> 
                } 
                  
                {/* <GeolocateControl
                    style={geolocateStyle}
                    positionOptions={{enableHighAccuracy: true}}
                    trackUserLocation={true}
                    auto={this.props.enableHighAccuracy}
                /> */}
                
                {/* <div style={fullscreenControlStyle}>
                    <FullscreenControl />
                </div>
    
                <div style={navStyle}>
                    <NavigationControl />
                </div>
    
                <div style={scaleControlStyle}>
                    <ScaleControl />
                </div> */}
                
            </MapGL>
        )
    }
}

export default MainMap