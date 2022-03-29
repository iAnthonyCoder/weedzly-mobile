export default function ImageUrlFormatter(src, type, width=200, height=200, opacity, blur, fill='c_fill,g_auto') {
    let _src = src.replace('http://', 'https://')
    if(type==="full"){
        return _src.substr(0, _src.indexOf("/upload/")+8).concat(`${blur ? 'e_blur:400,' : ''}fl_progressive:steep,${fill},w_${width},h_${height}${opacity ? ',b_black,o_'+opacity : ''}/`).concat( _src.substr(_src.indexOf("/upload/")+8, _src.length))
    } else if (type==="slider") {
        return _src.substr(0, _src.indexOf("/upload/")+8).concat(`fl_progressive:steep,${fill},w_${512},h_${512}/`).concat( _src.substr(_src.indexOf("/upload/")+8, _src.length))
    } else if (type==="low") {
        return _src.substr(0, _src.indexOf("/upload/")+8).concat("e_blur:1000000/w_3,h_3,q_auto:low/").concat( _src.substr(_src.indexOf("/upload/")+8, _src.length))
    } 
}