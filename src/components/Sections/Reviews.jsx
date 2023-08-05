import { IonButton, IonCol, IonGrid, IonInfiniteScroll, IonInfiniteScrollContent, IonRow, IonSpinner, IonText, IonToast } from '@ionic/react'
import React, { useState, useEffect } from 'react'
import { reviewService } from '../../services/review.service'
import ReviewModal from '../Modals/ReviewModal'
import Review from '../Modals/ReviewModal'
import queryString from 'query-string'
import ReviewGraph from '../Common/ReviewGraph'
import ReviewCard from '../Cards/Review'
import { useDispatch, useSelector } from 'react-redux'
import { updateModalStatus } from '../../store/actions'

const Reviews = (props) => {

    const user = useSelector(state => state.user) 

    const dispatch = useDispatch()

    const no_reviews = () => (<div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}} className='ion-margin-top ion-margin-bottom'>
        <img style={{width:'50%'}} src={'/assets/images/no_reviews.png'}></img>
        <h2 style={{marginTop:'0px'}}>No reviews found</h2>
        <IonText>There are no reviews available</IonText><br/>
        <IonButton onClick={()=>{
            (user._id) ? (
                setShowReviewModal(true)
            ) : ( 
                dispatch(updateModalStatus({login:true}))
            )
        }} >Write a review</IonButton>
    </div>)

    const [ actionsLoading, setActionsLoading ] = useState(true)
    const [ showReviewModal, setShowReviewModal ] = useState(false)
    const [ showToast, setShowToast ] = useState({
        open: false
    })
    const [ graph, setGraph ] = useState(null)
    const [ data, setData ] = useState([])
    const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);

    const getGraph = async () => {
        try {
            let params = {
                slug: props.item.slug, 
                model: props.model
            }
            if(props.brand){
                params.brand = props.brand
            }
          
            let graph = await reviewService.getGraph(`?${queryString.stringify(params)}`)
            setGraph(graph)
        } catch (er) {
            console.log(er);
        }
    }

    const [ pageParams, setPageParams ] = useState({
		size: 24,
		totalCount: 100,
        model: props.model,
        slug: props.item.slug
	})

    const getData = async (ev, reset) => {
        setActionsLoading(true)
        try {

            let pageOptions = {
				size: pageParams.size,
				from: pageParams.from ? pageParams.from + pageParams.size : 0,
                model: props.model,
                slug: props.item.slug
			}
            if(props.brand){
                pageOptions.brand = props.brand
            }

            const res = await reviewService.getPaginated(`?${
                queryString.stringify(pageOptions, {
                    arrayFormat: 'bracket', 
                    skipEmptyString: true
                })
            }`, user.token)

            const allData = [...(!reset ? data : []), ...res.totalData]
 
			setData(allData)

			let newParams = {
				from: res.from,
                size: pageParams.size,
				totalCount: res.totalCount.length > 0 ? res.totalCount[0]['count'] : 0
			}
           
			if(newParams.from + allData.length >= newParams.totalCount){
				setInfiniteDisabled(true);
			}
    
			setPageParams(newParams)
			if(ev){
				ev.target.complete();
			}
			setActionsLoading(false)
        } catch (er) {
            console.log(er)
        }
    }

    useEffect(() => {
        getGraph()
        getData()
    }, [])

    const [ forEdit, setForEdit ] = useState({})

    if(actionsLoading) return <div className='ion-margin-top ion-margin-bottom' style={{display:'flex', justifyContent:'center'}}>
        <IonSpinner name="crescent" />
    </div>

    return (
        <section className='full-width'>

            <h1>Share your experience</h1><br/>
            {
                showReviewModal && <ReviewModal 
                    showModal={showReviewModal}
                    setShowModal={()=>{
                        setShowReviewModal(false)
                        setForEdit({})
                    }}
                    item={props.item}
                    for={props.for}
                    setShowToast={setShowToast}
                    data={data}
                    setData={setData}
                    getGraph={getGraph}
                    setForEdit={setForEdit}
                    forEdit={forEdit}
                />
            }
            {
			    data.length > 0 && (
                    <>
                        <ReviewGraph
                            data={graph}
                            setShowReviewModal={setShowReviewModal}
                        />
                        <IonGrid>
                            <IonRow>
                            {
                                data.map( item => 
                                    <IonCol size="12" size-lg="4">
                                        <ReviewCard 
                                            item={item}
                                            setShowToast={setShowToast}
                                            setData={setData}
                                            data={data}
                                            getGraph={getGraph}
                                            setForEdit={setForEdit}
                                            setShowReviewModal={setShowReviewModal}
                                        />
                                    </IonCol>
                                )
                            }
                            </IonRow>
                        </IonGrid>
                    </>
                )
            }
            {
			    !actionsLoading && data.length === 0 && (
                    no_reviews()
                )
            }
            {
				data.length > 0 &&  <IonInfiniteScroll
					onIonInfinite={getData}
					threshold="100px"
					disabled={isInfiniteDisabled}
				>
					<IonInfiniteScrollContent
						  loadingSpinner="crescent"
					></IonInfiniteScrollContent>
				</IonInfiniteScroll>
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
        </section>
    )
}

export default Reviews