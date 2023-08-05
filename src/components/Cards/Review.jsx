import { IonAlert, IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonContent, IonFooter, IonIcon, IonItem, IonLabel, IonList, IonLoading, IonPopover, IonText } from '@ionic/react'
import { ellipsisHorizontal, ellipsisVertical, pencil, thumbsUp, trash } from 'ionicons/icons';
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import StarRatings from 'react-star-ratings';
import { reviewService } from '../../services/review.service';
import _ from 'lodash'

const ReviewCard = (props) => {

    const [showPopover, setShowPopover] = useState({
        open: false,
        event: undefined,
    });

    const user = useSelector(state => state.user)

    const [ helpfulForMe, setHelpfulForMe ] = useState(false)
    const [ helpful, setHelpful ] = useState(false)

    const sendHelpful = () => {
        if(_.isEmpty(user)) {
            props.setShowToast({
                open: true,
                type:'warning',
                message: 'You need to be logged in'
            })
        } else {
            reviewService.addHelpful(props.item._id)
            .then(res=>{
                setHelpfulForMe(res.helpful)
                setHelpful(res.newCount)
            })
            .catch(err=>
                props.setShowToast({
                    open: true,
                    type:'warning',
                    message: 'Error sending request'
                })
            )
        }
        
    }


    useEffect(() => {
        setHelpful(props.item.helpfulCount)
        setHelpfulForMe(props.item.helpfulForMe)
    }, [props.item])

    const [ showAlert, setShowAlert ] = useState(false)
    const [ actionsLoading, setActionsLoading ] = useState(false)


    const removeReview = () => {    
        setActionsLoading(true)
        reviewService.remove(props.item._id)
        .then(res=>{
            props.setShowToast({
                open: true,
                type:'success',
                message: 'Review deleted!'
            }) 
            
            setActionsLoading(false)
            props.setData(props.data.filter(x => x._id != props.item._id))
            props.getGraph()
        })
        .catch(err=> {
            props.setShowToast({
                open: true,
                type:'error',
                message: err.message
            }) 
            setActionsLoading(false)
        })
    }
      

    return  (
        <IonCard className='ion-no-padding ion-no-margin'>
            <IonCardHeader className='ion-no-padding ion-no-margin'>
                <IonItem>
                 
                    <IonAvatar slot='start'>
                        <img src={props.picture ? props.picture : props.item.user.picture ? props.item.user.picture : '/assets/images/user.png'}  />
                    </IonAvatar>
                    <ion-label>
                        <h2>{props.name ? props.name : props.item.author}</h2>
                        <h3>{moment(props.item.createdAt).fromNow()}</h3>
                        <StarRatings
                            starRatedColor="rgb(255, 215, 0)"
                            starEmptyColor='#dadada'
                            starDimension="16px"
                            starSpacing="0px"
                            numberOfStars={5}
                            name='rating'
                            rating={props.item.rating}
                        />
                    </ion-label>
                    {
                        props.item.own ? <IonButtons slot="end">
                            <IonButton onClick={(e)=>setShowPopover({open: true, event: e.nativeEvent})}>
                                <IonIcon slot="icon-only" ios={ellipsisHorizontal} md={ellipsisVertical}></IonIcon>
                            </IonButton>
                            <IonPopover
                                isOpen={showPopover.open}
                                event={showPopover.event}
                                onDidDismiss={e => setShowPopover({open: false, event: undefined})}
                            >
                                <IonContent>
                                    <IonList>
                                        <IonItem onClick={()=>{
                                            setShowPopover({open: false, event: undefined})
                                            props.setForEdit(props.item)
                                            props.setShowReviewModal(true)
                                        }} button={true} detail={false}>
                                            <IonIcon style={{fontSize:'20px'}} icon={pencil}></IonIcon>&nbsp;&nbsp;
                                            <IonLabel>Edit</IonLabel>
                                        </IonItem>
                                        <IonItem lines='none' onClick={()=>{
                                            setShowPopover({open: false, event: undefined})
                                            setShowAlert(true)
                                        }} button={true} detail={false}>
                                            <IonIcon style={{fontSize:'20px'}} icon={trash}></IonIcon>&nbsp;&nbsp;
                                            <IonLabel>Delete</IonLabel>
                                        </IonItem>
                                    </IonList>
                                </IonContent>
                            </IonPopover>
                        </IonButtons> : ''
                    }
                </IonItem>
            </IonCardHeader>
            <IonCardContent className='ion-margin-top'>
                <IonText style={{fontWeight:'700', fontSize:'18px'}}>
                    {props.item.title}
                </IonText>
                <br/>
                <IonText className='ion-margin-top'>
                    {props.item.body}
                </IonText>
            </IonCardContent>
            <IonFooter>
                <IonButtons className='ion-padding'>
                    <IonButton onClick={()=>sendHelpful()} color={helpfulForMe ? 'primary' : ''} style={{padding:'0', margin:'0', display:'flex', alignItems:'center'}}>
                        <IonIcon style={{fontSize:'16px'}} icon={thumbsUp}></IonIcon>&nbsp;
                        Helpful
                    </IonButton>
                </IonButtons>
            </IonFooter>
            <IonAlert
                isOpen={showAlert}
                onDidDismiss={() => setShowAlert(false)}
                cssClass='my-custom-class'
                header={'Delete this review?'}
                message={props.item.title}
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'secondary',
                        id: 'cancel-button',
                        
                    },
                    {
                        text: 'Okay',
                        id: 'confirm-button',
                        handler: () => {
                            removeReview()
                        }
                    }
                ]}
            />
            <IonLoading
                cssClass='my-custom-class'
                isOpen={actionsLoading}
                // onDidDismiss={() => setActionsLoading(false)}
                message={'Please wait...'}
                // duration={5000}
            />
        </IonCard>
    )
}

export default ReviewCard