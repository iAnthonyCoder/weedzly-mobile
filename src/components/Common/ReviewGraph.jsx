import { IonButton, IonCard, IonCardHeader, IonCardTitle, IonIcon, IonSpinner, IonText } from '@ionic/react'
import { star } from 'ionicons/icons';
import React from 'react'
import StarRatings from 'react-star-ratings';

const ReviewGraph = (props) => {


    const lineGraph = (stars, allRatings, thisRatings) => (
        <div style={{display:'flex', marginTop:'8px'}}>
            <IonText>{stars}</IonText>
            <IonIcon style={{marginLeft:'6px', color:'#dddd44'}} icon={star}/>
            <div className='rating-line' style={{width:'100%', backgroundColor:'#cccccc', marginLeft:'10px', marginRight:'10px', borderRadius:'8px', overflow:'hidden'}}>
                <div className='rating-filler' style={{width:'100%', height:'100%', borderRadius:'8px', backgroundColor:'#8a3ee5', transform: `translateX(-${((100-(thisRatings*100)/allRatings))===100 ? 101 : ((100-(thisRatings*100)/allRatings))}%)`}}></div>
            </div>
            <IonText>{thisRatings}</IonText>
        </div>
    )


    return (
        <IonCard>
            {
                !props.data ? (
                    <div className='ion-margin-top ion-margin-bottom' style={{display:'flex', justifyContent:'center'}}>
                        <IonSpinner name="crescent" />
                    </div>
                ) : (
                    <IonCardHeader style={{display:'flex', flexDirection:'column',}}>
                        <div style={{display:'flex'}}>
                            <h1 style={{fontSize:'48px'}} className='ion-no-margin ion-no-padding'>{props.data.rating.toFixed(1)}</h1>
                            <div style={{display:'flex', flexDirection:'column', marginLeft:'1rem', justifyContent:'center'}}>
                                <StarRatings
                                    starRatedColor="rgb(255, 215, 0)"
                                    starEmptyColor='#dadada'
                                    starDimension="20px"
                                    starSpacing="0px"
                                    numberOfStars={5}
                                    name='rating'
                                    rating={props.data.rating}
                                />
                                <IonText>{props.data.count} reviews</IonText>
                            </div>
                        </div>
                        <div className='line' style={{display:'flex', flexDirection:'column'}}>
                            {lineGraph(5,props.data.count,props.data.star_five)}
                            {lineGraph(4,props.data.count,props.data.star_four)}
                            {lineGraph(3,props.data.count,props.data.star_three)}
                            {lineGraph(2,props.data.count,props.data.star_two)}
                            {lineGraph(1,props.data.count,props.data.star_one)}
                            {/* <IonText>5</IonText>
                            <IonIcon style={{marginLeft:'6px'}} icon={star}/>
                            <div className='rating-line' style={{width:'100%', backgroundColor:'#cccccc', marginLeft:'10px', marginRight:'10px', borderRadius:'8px', overflow:'hidden'}}>
                                <div className='rating-filler' style={{width:'100%', height:'100%', borderRadius:'8px', backgroundColor:'#8a3ee5', transform:'translateX(-10%)'}}></div>
                            </div>
                            <IonText>5</IonText> */}
                        </div>
                        <hr/>
                        <IonButton onClick={()=>props.setShowReviewModal(true)} color='primary'>Write a review</IonButton>
                    </IonCardHeader>
                )
            }
        </IonCard>
    )
}

export default ReviewGraph