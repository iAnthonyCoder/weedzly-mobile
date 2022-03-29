import { IonContent } from '@ionic/react'
import _ from 'lodash'
import React from 'react'
import Reviews from '../../../components/Sections/Reviews'

const BrandReviews = (props) => {



    return (
        <IonContent>
            {
                !_.isEmpty(props.entity) && <Reviews 
                    item={props.entity}
                    for={'brand'}
                    model={'Brand'}
                />
            }
        </IonContent>
    )
}

export default BrandReviews