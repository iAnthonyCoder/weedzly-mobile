import { IonActionSheet, IonChip, IonCol, IonContent, IonGrid, IonIcon, IonList, IonPage, IonSpinner, IonText, IonToast, useIonRouter } from '@ionic/react'
import { chevronDown } from 'ionicons/icons'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import ReviewCard from '../../components/Cards/Review'
import ReviewModal from '../../components/Modals/ReviewModal'
import sorting_settings from '../../config/sorting_settings'
import useInfiniteScroll from '../../hooks/useInfiniteScroll'
import { reviewService } from '../../services/review.service'


const ProfileReviewsContainer = () => {

    const [ showActionSheet, setShowActionSheet ] = useState(false)
    const [ scopedModel, setScopedModel ] = useState('product')
    const [ actionsLoading, setActionsLoading ] = useState(false)

    useEffect(() => {
        setActionsLoading(true)
        setTimeout(() => {
            setActionsLoading(false)
        }, 100);
    }, [scopedModel])
    

    return (
        <IonPage>
            <section>
                <div>
                    <IonChip onClick={()=>setShowActionSheet(true)} style={{textTransform: 'capitalize', marginTop:'0.5rem'}}>
                        {scopedModel} <IonIcon icon={chevronDown}></IonIcon>
                    </IonChip>
                </div>
            </section>
            <IonActionSheet
                isOpen={showActionSheet}
                onDidDismiss={() => setShowActionSheet(false)}
                cssClass='my-custom-class'
                header='My Reviews'
                buttons={
                    [
                        {
                            text: 'Products',
                            handler: () => {
                                setScopedModel('product');
                            }
                        },{
                            text: 'Brands',
                            handler: () => {
                                setScopedModel('brand');
                            }
                        },{
                            text: 'Strains',
                            handler: () => {
                                setScopedModel('strain');
                            }
                        },{
                            text: 'Dispensaries & Deliveries',
                            handler: () => {
                                setScopedModel('dispensary');
                            }
                        }
                    ]
                }
            >
            </IonActionSheet>
            {
                !actionsLoading && <ProfileReviews scopedModel={scopedModel} />
            }
        </IonPage>
    )
}

export default ProfileReviewsContainer

const ProfileReviews = (props) => {

    const user = useSelector(state => state.user)

    const [ forEdit, setForEdit ] = useState({})
    const [ data, setData ] = useState({})
    const [ showReviewModal, setShowReviewModal ] = useState(false)
    const [ scopedDeal, setScopedDeal ] = useState({})
    const [ showToast, setShowToast ] = useState({
        open: false
    })

    const [ 
		items, 
		pageInfo, 
		loading, 
		resetingList,
		getItems,
		loadMore,
		sort,
		filterer,
		filterString,
        setDefaultParams,
        setItems
	] = useInfiniteScroll({
		service: reviewService.getPaginated,
		defaultParams: {
			filterfield: ['user', 'for'],
            filtertype: ['eq', 'eq'],
            filtervalue: [user._id, props.scopedModel],
            for: props.scopedModel,
            model: 'user'
		},
		sortingOptions: sorting_settings.profileReviewsPage,
	})

    return (
        <IonContent>

            {
                showReviewModal && <ReviewModal 
                    showModal={showReviewModal}
                    setShowModal={()=>{
                        setShowReviewModal(false)
                        setForEdit({})
                    }}
                    item={forEdit}
                    for={props.scopedModel}
                    setShowToast={setShowToast}
                    data={items}
                    setData={setItems}
                    setForEdit={setForEdit}
                    forEdit={forEdit}
                />
            }
            <IonToast
                isOpen={showToast.open}
                message={showToast.message}
                // icon={informationCircle}
                position="bottom"
                color={showToast.type}
                translucent={true}
                duration={3000}
                buttons={[
                    {
                      text: 'Hide',
                      role: 'cancel',
                    }
                ]}
            />
            <section>
                {
                    loading ? (
                        <div style={{display:'flex', justifyContent:'center', minWidth:'100%', marginTop:'2rem', marginBottom:'2rem'}}>
                            <IonSpinner name="crescent" />
                        </div>
                    ) : (
                        items.length > 0 ? (
                            <IonGrid>
                                {
                                    items.map((item, i) => 
                                        <IonCol size="12" size-lg="4">
                                            <ReviewCard 
                                                key={i}
                                                item={item}
                                                showTargetInfo={true}
                                                name={item && item[props.scopedModel] ? item[props.scopedModel].name : user.name}
                                                picture={item && item[props.scopedModel] ? (item[props.scopedModel].logo ? item[props.scopedModel].logo  : item[props.scopedModel].picture) : user.picture}
                                                setShowToast={setShowToast}
                                                setData={setItems}
                                                data={items}
                                                // getGraph={()=>console.log('first')}
                                                setForEdit={setForEdit}
                                                setShowReviewModal={setShowReviewModal}
                                            />
                                        </IonCol>
                                    )
                                }
                            </IonGrid>
                        ) : (
                            <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center', marginTop:'1rem'}}>
                                <img style={{width:'40%'}} src={'/assets/images/no_reviews.png'} />
                                <IonText color='dark' style={{textAlign:'center'}}>
                                    <h2>No Results</h2>
                                    <p>You haven't left any reviews yet.</p>
                                </IonText>
                            </div>
                        )
                    )
                }
            </section>
        </IonContent>
    )
}