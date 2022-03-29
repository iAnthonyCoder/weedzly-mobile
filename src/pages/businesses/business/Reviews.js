import { IonContent } from '@ionic/react'
import _ from 'lodash'
import React from 'react'
import Reviews from '../../../components/Sections/Reviews'

const DispensaryReviews = (props) => {



    return (
        <IonContent>
            {
                !_.isEmpty(props.entity) && <Reviews 
                    item={props.entity}
                    for={'dispensary'}
                    model={'Dispensary'}
                />
            }
        </IonContent>
    )
}

export default DispensaryReviews