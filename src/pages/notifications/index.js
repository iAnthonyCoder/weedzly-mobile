import { IonAvatar, IonButton, IonContent, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel, IonList, IonPage, IonPopover, IonSkeletonText, IonThumbnail, useIonRouter } from '@ionic/react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TopToolbar from '../../components/Common/TopToolbar'
import useInfiniteScroll from '../../hooks/useInfiniteScroll'
import { notificationService } from '../../services/notification.service'
import { getNotifications } from '../../store/actions'
import { ellipsisHorizontal, ellipsisVertical } from 'ionicons/icons';
import './Notifications.css'

const Notifications = () => {

    const { notifications } = useSelector(state => state)

    const [ actionsLoading, setActionsLoading ] = useState(false)

    const [ isInfiniteDisabled, setIsInfiniteDisabled ] = useState(false)

    const dispatch = useDispatch()

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

    const _updateNotifications = async (e) => {
        try {

            
            
            let _notifications = await notificationService.get('?size=10&from='+notifications.totalData.length)
            
            const notificationsList = notifications.totalData && notifications.totalData.length > 0 ? notifications.totalData.concat(_notifications.totalData) : _notifications.totalData

            _notifications.totalData = notificationsList
  
            let hasMore = null

          
            if(_notifications.totalCount.length > 0){

              
                hasMore = notifications.totalData.concat(_notifications.totalData).length <= _notifications.totalCount[0].count
            }
        
            dispatch(getNotifications({..._notifications, hasMore, fetched: true}))
            setActionsLoading(false)
            if(e){
                e && e.target.complete();
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
     
        if(!notifications.fetched){
            setActionsLoading(true)
            _updateNotifications()
        }
        
    }, [])

    return (
        <IonPage>
            <IonHeader>
                <TopToolbar 
                    title={'Notifications'}
                    disableNotifications={true}
                    enableBackButton={true}
                    disableSearch={true}
                    disableCart={true}
                />
            </IonHeader>
            <IonContent>
                <IonList>
                {
                    actionsLoading ? (
                        <>
                            <IonItem>
                                <IonThumbnail slot="start">
                                  <IonSkeletonText></IonSkeletonText>
                                </IonThumbnail>
                                <IonLabel>
                                    <h3>
                                        <IonSkeletonText animated style={{width: '80%'}}></IonSkeletonText>
                                    </h3>
                                    <p>
                                        <IonSkeletonText animated style={{width: '60%'}}></IonSkeletonText>
                                    </p>
                                    <p>
                                        <IonSkeletonText animated style={{width: '30%'}}></IonSkeletonText>
                                    </p>
                                </IonLabel>
                            </IonItem>
                            <IonItem>
                                <IonThumbnail slot="start">
                                  <IonSkeletonText></IonSkeletonText>
                                </IonThumbnail>
                                <IonLabel>
                                    <h3>
                                        <IonSkeletonText animated style={{width: '80%'}}></IonSkeletonText>
                                    </h3>
                                    <p>
                                        <IonSkeletonText animated style={{width: '60%'}}></IonSkeletonText>
                                    </p>
                                    <p>
                                        <IonSkeletonText animated style={{width: '30%'}}></IonSkeletonText>
                                    </p>
                                </IonLabel>
                            </IonItem>
                            <IonItem>
                                <IonThumbnail slot="start">
                                  <IonSkeletonText></IonSkeletonText>
                                </IonThumbnail>
                                <IonLabel>
                                    <h3>
                                        <IonSkeletonText animated style={{width: '80%'}}></IonSkeletonText>
                                    </h3>
                                    <p>
                                        <IonSkeletonText animated style={{width: '60%'}}></IonSkeletonText>
                                    </p>
                                    <p>
                                        <IonSkeletonText animated style={{width: '30%'}}></IonSkeletonText>
                                    </p>
                                </IonLabel>
                            </IonItem>
                        </>
                    ) : (
                        notifications.totalData.length > 0 ? (
                            notifications.totalData.map((x, i) => <NotificationItem markAsReaded={markAsReaded} key={i} item={x} />)
                            
                        ) : (
                            <h1>no data</h1>
                        )
                    )
                } 
                </IonList>

                <IonInfiniteScroll
                    onIonInfinite={(e)=>loadData(e)}
                    threshold="100px"
                    disabled={!notifications.hasMore}
                >
                    <IonInfiniteScrollContent
                        loadingSpinner="bubbles"
                        loadingText="Loading more data..."
                    ></IonInfiniteScrollContent>
                </IonInfiniteScroll>
            </IonContent>
        </IonPage>
    )
}

export default Notifications


const NotificationItem = (props) => {


    const router = useIonRouter()

    const [showPopover, setShowPopover] = useState({
        open: false,
        event: undefined,
    });

    const [ state, setState ] = useState({})

    useEffect(() => {
        let data = {
            href: '',
            as: '',
            picture: '',
            text: '',
            icon: '',
            createdAt: props.item.createdAt
        }
        
        switch ( props.item.type.toLowerCase()) {
            
            case 'pointstransaction':
                data.link = `/businesses/profile/${props.item.pointstransaction.dispensary.slug}`
                data.picture = props.item.transmitter.type === 'ADMIN' 
                    ? 'assets/images/logo.png'
                    : props.item.transmitter.picture 
                        ? props.item.transmitter.picture
                        : 'assets/images/user.png'
                data.text = ()=><>
                    {
                        props.item.transmitter.type === 'ADMIN' 
                            ? <><span className='text-bold'>Your </span> receipt upload has been approved. <strong>+{props.item.pointstransaction.amount} nugs </strong>- Get rewards at <strong>{props.item.pointstransaction.dispensary.name}</strong></>
                            : <><strong>@{props.item.transmitter.nickname}</strong> sent you <strong>{props.item.pointstransaction.amount} nugs </strong>that can be used to <strong>get rewards</strong> at <strong>{props.item.pointstransaction.dispensary.name}</strong></> 
                    }
                    
                </>
                data.icon = '/static/icons/hoolding-leaf.svg'
                break;
        
            default:
                break;
        }


        setState(data)
    }, [props.item])
        

    if(_.isEmpty(state)) return ''
    return(
        <IonItem style={{alignItems: 'flex-start'}} color={props.item.readed ? '' : 'light'} lines='full' onClick={()=>{
            props.markAsReaded(props.item._id)
            router.push(state.link)
        }}>
                <IonAvatar style={{marginTop:'10px'}} slot="start">
                    <img src={state.picture}></img>
                </IonAvatar>
                <div>
                    <p>
                        {state.text()}
                    </p>
                    <p>
                        {moment(state.createdAt).fromNow()}
                    </p>
                    <p>
                        <span className={`${!props.item.readed ? 'active' : ''} readed-badge`}></span>
                    </p>
                </div>
                <IonButton 
                    style={{marginTop:'10px'}}
                    fill='clear' 
                    color='dark'
                    onClick={(e)=>{
                        e.stopPropagation()
                        setShowPopover({open: true, event: e.nativeEvent})
                    }}
                >
                    <IonIcon 
                        icon={ellipsisHorizontal}
                    />
                </IonButton>
                <IonPopover
                    isOpen={showPopover.open}
                    event={showPopover.event}
                    onDidDismiss={e => setShowPopover({open: false, event: undefined})}
                >
                    <IonContent>
                        <IonList style={{paddingTop:'0px', paddingBottom:'0px'}}>
                            <IonItem lines='none' onClick={(e)=>{
                                e.stopPropagation()
                                setShowPopover({open: false, event: e.nativeEvent})
                                props.markAsReaded(props.item._id)
                            }} button={true} detail={false}>
                              
                                <IonLabel>Mark as readed</IonLabel>
                            </IonItem>
                            {/* <IonItem lines='none' onClick={()=>{
                                setShowPopover({open: false, event: undefined})
                                setShowAlert(true)
                            }} button={true} detail={false}>
                                
                                <IonLabel>Delete</IonLabel>
                            </IonItem> */}
                        </IonList>
                    </IonContent>
                </IonPopover>
        </IonItem>
    )
    
}