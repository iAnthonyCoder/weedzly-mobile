import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { notificationService } from "./services/notification.service"
import { addEmbeededNotification, changeMustNavigateTo, getFavorites, getNotifications } from "./store/actions"
import useCart from './hooks/useCart'
import { favoriteService } from "./services/favorite.service"
import { PushNotificationSchema, PushNotifications, Token, ActionPerformed } from '@capacitor/push-notifications';
import { accountService } from "./services"
import { useIonRouter } from "@ionic/react"

const DataGetter = () => {

	const [ get ] = useCart()
    const { user, notifications } = useSelector(state => state)
    const fetched_cart = useSelector(state => state.fetched_cart)

    const dispatch = useDispatch()

    const fetchFavorites = async () => {
        try {
            dispatch(getFavorites(await favoriteService.getAll()))
        } catch (err){
            console.log(err)
        }
    }


    const updateANotification = (list) => {
      
        let _notifications = notifications
        _notifications.totalData = list
        dispatch(getNotifications({..._notifications}))
    }

    const loadData = (e) => {

        _updateNotifications(e)

    }
    

    const markAsReaded = async (id) => {
        try {
            await notificationService.update(id, {readed: true})
            updateANotification(notifications.totalData.map(x => {
                if(x._id === id) x.readed=true
                return x
            }))
        } catch (err) {
            console.log(err)
        }
    }
    
    

    const _getNotifications = async (reset) => {
        try {
            let _notifications = await notificationService.get(reset ? '?sortField=createdAt&sortOrder=desc&size=10&from=0' : `?sortField=createdAt&sortOrder=desc&size=10&from=${notifications.totalData.length}`)
            const notificationsList = notifications.totalData && notifications.totalData.length > 0 ? notifications.totalData.concat(_notifications.totalData) : _notifications.totalData
            _notifications.totalData = notificationsList
            let hasMore = null
            if(_notifications.totalCount.length > 0){
                hasMore = notifications.totalData.concat(_notifications.totalData).length <= _notifications.totalCount[0].count
            }
            dispatch(getNotifications({..._notifications, hasMore, fetched: true}))
        } catch (er) {
            console.log(er);
        }
    }

    useEffect(() => {
        if(user && user._id){   
            _getNotifications()
        }
    }, [user])

    useEffect(() => {
		!fetched_cart && user && user._id && get()
	}, [user])

    useEffect(() => {
		user && user._id && fetchFavorites()
        user && user._id && notificationsInitialize()
	}, [user])

    const nullEntry = []
    const [_notifications, _setnotifications] = useState(nullEntry);


	const notificationsInitialize = () => {
        PushNotifications.checkPermissions().then((res) => {
            if (res.receive !== 'granted') {
            
                PushNotifications.requestPermissions().then((res) => {
                    if (res.receive === 'denied') {
                    //   showToast('Push Notification permission denied');
                    }
                    else {
                    //   showToast('Push Notification permission granted');
                        register();
                    }
                });
            } else {
            
            	register();
            }
        });
    }

	const register = () => {

        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();

        // On success, we should be able to receive notifications
        PushNotifications.addListener('registration',
            async (token) => {
				await accountService.updateOwn({
					mobileNotificationId: token.value
				})
            }
        );

        // Some issue with our setup and push will not work
        PushNotifications.addListener('registrationError',
            (error) => {
                alert('Error on registration: ' + JSON.stringify(error));
            }
        );

        // Show us the notification payload if the app is open on our device
        PushNotifications.addListener('pushNotificationReceived',
            async (notification) => {
                await _getNotifications(true)
                dispatch(addEmbeededNotification(notification))
            }
        );

        // Method called when tapping on a notification
        PushNotifications.addListener('pushNotificationActionPerformed',
            async (notification) => {
                await markAsReaded(notification.notification.data.notificationId)
                await _getNotifications(true)
                if(notification.notification.data.type === 'ORDER'){

                    dispatch(changeMustNavigateTo(`/profile/orders/${notification.notification.data._id}`))
                }
                if(notification.notification.data.type === 'POINTSTRANSACTION'){
                    
                    dispatch(changeMustNavigateTo(`/businesses/profile/${notification.notification.data.dispensarySlug}#rewards`))
                }
            }
            // (notification) => {
            //     _setnotifications(_notifications => [..._notifications, { id: notification.notification.data.id, title: notification.notification.data.title, body: notification.notification.data.body, type: 'action' }])
            // }
        );
    }
    

    return (<></>)
}

export default DataGetter