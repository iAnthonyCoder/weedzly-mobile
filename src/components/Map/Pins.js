import _ from 'lodash';
import {Component} from 'react';
import {Marker} from 'react-map-gl';

export default class Pins extends Component {

    state={
        scopedDispensary:'',
        mouseHover: false,
        mouseIsInside: false
    }

    waitForShow = (entity) => {
        setTimeout(() => {
            if(this.state.mouseIsInside === entity._id){
                this.props.onClick(entity);
                this.setState({scopedDispensary:entity._id})
            }
        }, 375);
    }

    debouncedHover = (entity) => {
        this.setState({mouseIsInside:entity._id})
        this.waitForShow(entity)
    };

    mouseLeave = () => {
        this.setState({mouseIsInside: false, scopedDispensary:''})
        this.props.onClick(null);
    }

 


    render() {
        const {data, onClick, onMouseLeaving, _showDispensaryOnNavbar, selectedDispensary, _slideTo, viewport, _updateViewport} = this.props;
        const COLOUR = "#955a9e"
        const innerColur = "green"
        const innerColura = "white"
        const SIZE = 32
        const SIZEW = SIZE - (SIZE/4)
        return data.map((entity, index) => (
            <Marker 
                key={`marker-${index}`} 
                longitude={entity.location.coordinates[0]} 
                latitude={entity.location.coordinates[1]}
                className={`${(entity._id===this.state.scopedDispensary || entity.slug===selectedDispensary) ? 'front' : ''} pointer-events-none`}
                
            >
                <>
                   
                    <svg 
                        id="svg" 
                        xmlns="http://www.w3.org/2000/svg" 

                        height={(!_.isEmpty(selectedDispensary) ? entity.slug===selectedDispensary : entity._id===this.state.scopedDispensary ) ? 100 : (entity.subscription && entity.subscription.plan) ? parseInt(entity.subscription.plan.pinsize, 10): SIZE}
                        width={(!_.isEmpty(selectedDispensary) ? entity.slug===selectedDispensary : entity._id===this.state.scopedDispensary) ? 100 - (100/4) : (entity.subscription && entity.subscription.plan ? parseInt(entity.subscription.plan.pinsize, 10): SIZE)-((entity.subscription && entity.subscription.plan ? parseInt(entity.subscription.plan.pinsize, 10): SIZE)/4)}
                        viewBox="0, 0, 290, 390"
                        stroke="red"
                        stroke-width="5"
                        style={{
                            // cursor: 'pointer',
                            stroke: 'none',
                            transform: `translate(-50%, -100%)`,
                            transition: "height 0.15s, transform 0.15s",
                        }}
                    >
                        <g 
                            id="svgg"
                            style={{
                                cursor: 'pointer'
                            }}
                           
                            onMouseEnter={()=>this.debouncedHover(entity)} 
                            onMouseLeave={this.mouseLeave}
                            onClick={()=>{
                                _showDispensaryOnNavbar(entity.slug);
                                _slideTo(entity.slug);
                                _updateViewport({
                                    ...viewport,
                                    latitude: entity.location.coordinates[1],
                                    longitude: entity.location.coordinates[0], 
                                    updateMap: false
                                })
                            }}
                            className='pointer-events-all'
                            id="Capa_2"
                            
                        >
                        <circle fill='#ffffff' class="st0" cx="158.2" cy="135.1" r="101.8"/>
                        <g transform="translate(-70.032685,410.962830) scale(0.062000,-0.062000)"
                                fill={`${entity.subscription && entity.subscription.plan && entity.subscription.plan.pincolor ? entity.subscription.plan.pincolor : '#3471b0'}`} stroke="white" stroke-width='100'>
                            {
                            (entity.type === 'DELIVERY') ? (
                            
                              
                                <>

                                
                                <path stroke="none" d="M3275 6489 c-847 -89 -1573 -669 -1839 -1469 -130 -391 -150 -742
                                -61 -1082 188 -721 911 -1915 1946 -3214 l179 -225 69 83 c195 239 546 699
                                757 993 645 901 1063 1636 1250 2200 86 262 99 334 98 575 0 218 -12 313 -59
                                500 -188 742 -751 1334 -1480 1555 -273 82 -584 113 -860 84z m530 -509 c305
                                -64 555 -199 775 -420 222 -221 354 -467 421 -780 33 -152 33 -438 0 -590 -67
                                -313 -199 -559 -421 -780 -221 -222 -467 -354 -780 -421 -152 -33 -438 -33
                                -590 0 -313 67 -559 199 -780 421 -222 221 -354 467 -421 780 -33 152 -33 438
                                0 590 67 313 199 559 421 780 246 247 540 392 890 440 107 15 371 4 485 -20z"/>
                                <path stroke="none" d="M3192 4608 l3 -603 328 -3 c305 -2 328 -1 333 15 45 143 142 223 270
                                223 69 0 112 -12 166 -48 44 -29 94 -100 109 -154 l10 -38 89 0 90 0 0 605 0
                                605 -700 0 -700 0 2 -602z m767 366 c32 -84 40 -131 41 -221 l0 -83 48 36 c47
                                37 104 65 155 78 l28 7 -17 -33 c-27 -54 -80 -114 -130 -147 l-47 -31 49 0
                                c28 0 75 -7 105 -16 l54 -17 -45 -20 c-28 -12 -68 -20 -110 -21 l-66 -1 23
                                -34 c13 -19 21 -36 19 -38 -6 -6 -78 26 -98 44 -16 14 -18 14 -23 -1 -16 -51
                                -17 -52 -27 -19 l-9 33 -37 -24 c-41 -26 -82 -41 -82 -30 0 4 12 23 26 42 l27
                                34 -41 -7 c-40 -6 -157 16 -175 34 -14 14 82 41 142 41 l55 0 -45 29 c-24 15
                                -56 41 -70 57 -33 36 -79 103 -79 116 0 20 128 -34 187 -79 l44 -33 -6 47
                                c-11 83 45 313 76 313 4 0 17 -25 28 -56z"/>
                                <path d="M2548 4642 l-137 -167 -1 -238 0 -238 36 3 c33 3 37 7 53 54 27 81
                                91 146 170 173 58 19 150 14 206 -13 64 -29 131 -104 149 -165 12 -43 16 -46
                                49 -49 l37 -3 0 405 0 406 -212 -1 -213 0 -137 -167z m422 -77 l0 -115 -170 0
                                c-93 0 -170 4 -170 9 0 5 6 24 14 42 7 19 26 67 40 107 l28 72 129 0 129 0 0
                                -115z"/>
                                <path d="M2707 4156 c-117 -31 -181 -170 -128 -275 35 -67 115 -121 182 -121
                                32 0 104 31 133 58 152 143 15 391 -187 338z"/>
                                <path d="M4086 4158 c-153 -33 -205 -225 -92 -334 124 -118 320 -48 334 120 5
                                67 -10 114 -50 155 -55 57 -118 76 -192 59z"/>
                              
                                
                                
                                                                    </>
                           


                            ) : entity.type === 'DISPENSARY' ? (
                                <>


<path  d="M3275 6489 c-847 -89 -1573 -669 -1839 -1469 -130 -391 -150 -742
-61 -1082 188 -721 911 -1915 1946 -3214 l179 -225 69 83 c195 239 546 699
757 993 645 901 1063 1636 1250 2200 86 262 99 334 98 575 0 218 -12 313 -59
500 -188 742 -751 1334 -1480 1555 -273 82 -584 113 -860 84z m530 -509 c305
-64 555 -199 775 -420 222 -221 354 -467 421 -780 33 -152 33 -438 0 -590 -67
-313 -199 -559 -421 -780 -221 -222 -467 -354 -780 -421 -152 -33 -438 -33
-590 0 -313 67 -559 199 -780 421 -222 221 -354 467 -421 780 -33 152 -33 438
0 590 67 313 199 559 421 780 246 247 540 392 890 440 107 15 371 4 485 -20z"/>
<path stroke="none" d="M2782 5333 c-23 -35 -152 -260 -152 -268 0 -3 78 -5 174 -5 l175 0
15 53 c8 28 29 96 45 150 l29 97 -133 0 -134 0 -19 -27z"/>
<path stroke="none" d="M3175 5348 c-7 -18 -85 -281 -85 -285 0 -2 81 -3 180 -3 l180 0 0
150 0 150 -135 0 c-99 0 -137 -3 -140 -12z"/>
<path stroke="none" d="M3550 5210 l0 -150 180 0 180 0 -5 23 c-3 12 -23 78 -44 147 l-38
125 -136 3 -137 3 0 -151z"/>
<path stroke="none" d="M3961 5263 c16 -54 37 -122 45 -150 l15 -53 175 0 c96 0 174 2 174 5
0 8 -129 233 -152 268 l-19 27 -134 0 -133 0 29 -97z"/>
<path stroke="none" d="M2580 4888 c0 -35 5 -83 11 -108 37 -160 237 -203 336 -73 26 33 28
45 31 140 l4 103 -191 0 -191 0 0 -62z"/>
<path stroke="none" d="M3070 4863 c0 -103 20 -157 72 -196 92 -70 229 -43 280 57 16 30 23
65 26 134 l4 92 -191 0 -191 0 0 -87z"/>
<path stroke="none" d="M3550 4878 c0 -94 13 -140 53 -185 62 -70 159 -84 239 -34 66 42 88
93 88 204 l0 87 -190 0 -190 0 0 -72z"/>
<path stroke="none" d="M4042 4847 c3 -95 5 -107 31 -140 99 -130 299 -87 336 73 6 25 11 73
11 108 l0 62 -191 0 -191 0 4 -103z"/>
<path stroke="none" d="M2967 4594 c-62 -56 -135 -79 -224 -71 l-63 6 0 -440 c0 -284 4 -447
10 -460 10 -18 27 -19 565 -19 l555 0 2 258 3 257 168 3 167 2 0 -260 0 -260
75 0 c63 0 76 3 85 19 6 13 10 176 10 460 l0 440 -63 -6 c-90 -8 -161 15 -224
72 l-50 44 -27 -28 c-109 -114 -303 -119 -415 -11 l-41 40 -41 -40 c-110 -107
-286 -105 -407 4 l-37 34 -48 -44z m264 -344 c12 -39 21 -97 22 -146 l2 -80
42 32 c41 31 151 79 160 70 14 -13 -66 -118 -118 -156 l-38 -27 52 -6 c29 -3
68 -12 87 -20 l35 -15 -30 -12 c-16 -7 -60 -15 -97 -18 -64 -4 -82 -12 -58
-27 5 -3 15 -15 21 -27 10 -19 9 -20 -17 -14 -15 4 -40 16 -55 27 -35 24 -35
24 -44 -8 l-7 -28 -10 25 c-13 34 -13 34 -45 12 -34 -24 -73 -37 -73 -24 0 5
9 21 21 36 l20 26 -58 1 c-63 0 -129 18 -126 34 2 14 69 33 118 35 l40 1 -30
22 c-56 40 -145 150 -132 163 12 13 140 -47 180 -84 l27 -26 0 75 c0 76 16
153 45 224 16 37 18 38 31 20 8 -11 24 -49 35 -85z"/>







                                    </>
                            ) : entity.type === 'DOCTOR' ? (
                                <>
                                     


<path d="M3275 6489 c-847 -89 -1573 -669 -1839 -1469 -130 -391 -150 -742
-61 -1082 188 -721 911 -1915 1946 -3214 l179 -225 69 83 c195 239 546 699
757 993 645 901 1063 1636 1250 2200 86 262 99 334 98 575 0 218 -12 313 -59
500 -188 742 -751 1334 -1480 1555 -273 82 -584 113 -860 84z m530 -509 c305
-64 555 -199 775 -420 222 -221 354 -467 421 -780 33 -152 33 -438 0 -590 -67
-313 -199 -559 -421 -780 -221 -222 -467 -354 -780 -421 -152 -33 -438 -33
-590 0 -313 67 -559 199 -780 421 -222 221 -354 467 -421 780 -33 152 -33 438
0 590 67 313 199 559 421 780 246 247 540 392 890 440 107 15 371 4 485 -20z"/>
<path d="M3381 5595 c-214 -60 -355 -261 -338 -480 13 -175 129 -331 295 -396
82 -33 242 -33 324 0 118 46 223 151 269 268 33 83 33 243 0 325 -46 118 -153
224 -268 268 -76 29 -207 36 -282 15z"/>
<path d="M3012 4659 c-140 -68 -241 -182 -301 -338 -24 -64 -25 -76 -28 -331
-4 -254 -3 -266 17 -298 40 -64 17 -62 800 -62 760 0 750 -1 795 50 19 21 20
39 23 270 2 198 0 261 -13 315 -38 166 -159 317 -316 395 l-87 42 -30 -22 -31
-23 26 -31 c27 -32 83 -142 83 -163 0 -6 9 -14 20 -18 29 -9 68 -61 76 -100
14 -75 -66 -155 -141 -141 -45 9 -91 48 -105 91 -16 47 2 98 46 133 19 15 34
34 34 42 0 20 -53 111 -77 132 -18 16 -22 16 -81 -8 -132 -53 -278 -57 -415
-10 -40 15 -76 26 -80 26 -12 0 -65 -116 -81 -177 -24 -92 -22 -98 28 -117 54
-21 111 -81 126 -133 6 -21 10 -85 8 -143 l-3 -105 -75 0 c-73 0 -75 1 -75 25
0 23 4 25 48 28 l49 3 -4 89 c-2 70 -7 94 -24 116 -53 72 -128 91 -204 52 -65
-33 -84 -74 -85 -173 l0 -80 47 -3 c47 -3 63 -17 51 -47 -4 -13 -20 -15 -82
-13 l-76 3 -3 105 c-2 59 2 122 8 143 15 51 84 119 136 135 l41 12 16 82 c10
49 32 115 55 161 l38 77 -32 25 c-18 14 -34 25 -36 25 -2 0 -41 -18 -86 -41z
m768 -618 l0 -50 48 -3 47 -3 3 -52 3 -53 -50 0 -50 0 -3 -52 -3 -53 -50 0
-50 0 -3 53 -3 52 -50 0 -49 0 0 55 0 55 50 0 50 0 0 50 0 50 55 0 55 0 0 -49z"/>
<path d="M3877 4372 c-21 -23 -22 -66 -1 -86 36 -37 104 -7 104 46 0 51 -69
78 -103 40z"/>



</>
                            ) : ('')
                        }
                            
                            
                      
                            </g>
                    </g>
                </svg>
                </>
            </Marker>
        ));
    }
}