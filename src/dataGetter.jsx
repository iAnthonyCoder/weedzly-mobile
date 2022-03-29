import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { notificationService } from "./services/notification.service"
import { getFavorites, getNotifications } from "./store/actions"
import useCart from './hooks/useCart'
import { favoriteService } from "./services/favorite.service"

const DataGetter = () => {

	const [ get ] = useCart()
    const { user, notifications } = useSelector(state => state)
    const fetched_cart = useSelector(state => state.fetched_cart)

    const fetchFavorites = async () => {
        try {
            dispatch(getFavorites(await favoriteService.getAll()))
        } catch (err){
            console.log(err)
        }
    }
	

    const dispatch = useDispatch()
    const _getNotifications = async () => {
        try {
            let _notifications = await notificationService.get('?size=10&from='+notifications.totalData.length)
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
	}, [user])
    

    return (<></>)
}

export default DataGetter