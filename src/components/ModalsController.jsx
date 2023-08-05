import React, { useEffect, useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getNotifications, updateModalStatus } from '../store/actions'
import LoginModal from './Modals/LoginModal'
import SignupModal from './Modals/SignupModal'
import ReceiptModal from './Modals/Receipt'
import { TemporaryLocation } from './Modals/TemporaryLocation'
import { useIonRouter, useIonToast } from '@ionic/react'
import _ from 'lodash'
import { notificationService } from '../services/notification.service'

const ModalsController = () => {

    const dispatch = useDispatch()
    const modals = useSelector(state => state.modals)
    const { notifications } = useSelector(state => state)
    const embeededNotification = useSelector(state => state.embeededNotification)

    const [present, dismiss] = useIonToast();

    const router = useIonRouter()

    useEffect(() => {
        if(!_.isEmpty(embeededNotification)){
            present({
                translucent:'true',
                position:'top',
                duration: 3000,
                animated: true,
                color:'light',
                buttons: [{ text: 'go', handler: async () => {
                    console.log('1');
                    await notificationService.update(embeededNotification.data.notificationId, {readed: true})
                    console.log('2');
                    let _notifications = notifications
                        _notifications.totalData = notifications.totalData.map(x => {
                            if(x._id === embeededNotification.data.notificationId) x.readed=true
                            return x
                        })
                        dispatch(getNotifications({..._notifications}))
                        console.log('3');
                    router.push(
                    
                        (embeededNotification.data.type === 'ORDER') 
                            ? `/profile/orders/${embeededNotification.data._id}`
                            : `/businesses/profile/${embeededNotification.data.dispensarySlug}#rewards`

                    )
                    console.log('4');
                } }],
                message: `${embeededNotification.body}`
            })
        }
    }, [embeededNotification])
    
    
    return (
        <>
            {
                <LoginModal
                    showModal={modals.login}
                    setShowModal={(value)=>dispatch(updateModalStatus({login:value}))}
                />
            }
            {
                <SignupModal
                    showModal={modals.signup}
                    setShowModal={(value)=>dispatch(updateModalStatus({signup:value}))}
                />
            }
            {
                <TemporaryLocation
                    showModal={modals.location}
                    setShowModal={(value)=>dispatch(updateModalStatus({location:value}))}
                />
            }
        </>
    )
}

export default ModalsController