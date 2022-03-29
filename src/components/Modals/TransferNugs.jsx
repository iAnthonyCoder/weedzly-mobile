import { IonModal } from '@ionic/react'
import React from 'react'

const TransferNugs = (props) => {


    return (
        <IonModal
            isOpen={true} 
            swipeToClose={true}
            onDidDismiss={() => props.setShowModal(false)}
        >
            <h1>asd</h1>
        </IonModal>
    )
}

export default TransferNugs