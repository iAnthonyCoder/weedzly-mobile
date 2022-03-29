import { IonSpinner } from '@ionic/react'
import React from 'react'

const FullSpinner = () => {

    return (
        <div style={{display:'flex', justifyContent:'center', minWidth:'100%', marginTop:'2rem', marginBottom:'2rem'}}>
            <IonSpinner name="crescent" />
        </div>
    )
}

export default FullSpinner