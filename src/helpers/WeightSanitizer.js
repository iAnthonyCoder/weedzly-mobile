import React from 'react'

export default function WeightSanitizer ({value, type, unit, _weight, fullWord, eachDetails}) {

    const oz = fullWord ? "ounce" : "oz"


    const weightFormatter = () => {
        switch (unit) {
            case "each":
                return `${eachDetails ? ""+unit+"" : ''}`
                break;

            case "oz":
                if(_weight==0.125)return (<><sup>1</sup>&frasl;<sub>8</sub> {unit}</>)
                if(_weight==0.25)return (<><sup>1</sup>&frasl;<sub>4</sub> {unit}</>)
                if(_weight==0.5)return (<><sup>1</sup>&frasl;<sub>2</sub> {unit}</>)
                else return _weight+unit
                break;

            case "ml":
                return `${eachDetails ? ""+_weight+''+unit+"" : ''}`
                break;

            case "g":
                return `${eachDetails ? ""+_weight+''+unit+"" : ''}`
                break;

            case "mg":
                return `${eachDetails ? ""+_weight+''+unit+"" : ''}`
                break;
        
            default:
                break;
        }
    }   

    return(
        <>
            {weightFormatter()}
        </>
    )

}
