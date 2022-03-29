import { IonBadge, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonPage, IonProgressBar, IonSpinner, IonText, IonTextarea, IonTitle, IonToolbar, useIonModal } from '@ionic/react'
import { useFormik } from 'formik'
import React, { useState, useEffect } from 'react'
import TopToolbar from '../Common/TopToolbar'
import * as Yup from 'yup';
import StarRatings from 'react-star-ratings';
import { reviewService } from '../../services/review.service';


const ReviewModal = (props) => {

    const handleDismiss = () => {
        dismiss()
        setTimeout(() => {
            props.setShowModal(false)
        }, 500)
    }

    const [present, dismiss] = useIonModal(Modal, {
        ...props,
        slug: props.slug,
        setShowToast: props.setShowToast,
        onDismiss: handleDismiss
    });

    useEffect(() => {
        props.showModal && present();
    }, [props.showModal])
    
    return false

}

export default ReviewModal

const Modal = (props) => {

    const [ actionsLoading, setActionsLoading ] = useState(false)

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .max(60, 'Max length of title is 60'),
        body: Yup.string()
            .max(5000, 'Body is too long')
            .required(),
        rating: Yup.number()
            .max(5, 'Max is 5')
            .min(1, 'Min is 1')
            .required(),
    });

    let initialValues = {
        title: props.forEdit.title || '',
        body: props.forEdit.body || '',
        rating: props.forEdit.rating || 1,
    }

    const formik = useFormik({
        initialValues,
        validationSchema: validationSchema,
        onSubmit: (values, { setStatus, setSubmitting, resetForm }) => {
            onSubmit(values, {setSubmitting, resetForm})
        },
    });

    function onSubmit(fields, { setStatus, setSubmitting, resetForm }) {
     
        setSubmitting(true)
        setActionsLoading(true)
        if(props.forEdit._id){
            reviewService.update(props.forEdit._id, fields).then( async (res) =>{
                props.setShowToast({
                    open: true,
                    type:'success',
                    message: 'Review sent'
                })
                let addedReview = await reviewService.getById(res._id)
                props.setData(props.data.map(x => {
                    if(x._id === props.forEdit._id){
                        x.title = addedReview.title
                        x.body = addedReview.body
                        x.rating = addedReview.rating
                    }
                    return x
                }))
                props.getGraph()
                resetForm()
            }).catch((er) => {
                props.setShowToast({
                    open: true,
                    type:'danger',
                    message: er.message
                })
            }).finally(()=>{
                setSubmitting(false)
                props.onDismiss()
                setActionsLoading(false)
            })
        } else {
            fields[props.for] = props.item._id
            setActionsLoading(true)
            reviewService.create(fields).then( async (res) =>{
                props.setShowToast({
                    open: true,
                    type:'success',
                    message: 'Review sent'
                })
                let addedReview = await reviewService.getById(res._id)
                props.setData([{...addedReview, own:1}, ...props.data])
                props.getGraph()
                resetForm()
            }).catch((er) => {
                props.setShowToast({
                    open: true,
                    type:'danger',
                    message: er.message
                })
            }).finally(()=>{
                setSubmitting(false)
                props.onDismiss()
                setActionsLoading(false)
            })
        }
    }

    const [ rating, setRating ] = useState(0)

    return (
        <form 
        onSubmit={
            formik.handleSubmit
        } 
        autoComplete={false} 
    >
        <IonPage>
            
            <IonHeader>
                {
                    actionsLoading && <IonProgressBar type="indeterminate"></IonProgressBar>
                }
                <IonToolbar>
                    <IonTitle>Write a review</IonTitle>
                    <IonButtons slot="end">
                        <IonButton fill='clear'>
		    	    		<IonButton onClick={()=>props.onDismiss()}>Close</IonButton>
		    	        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <section className='ion-margin-top'>
                    <div style={{display:'flex'}} className=' ion-margin-bottom'> 
                        <h2 style={{marginTop:'0'}}>{props.item.name}</h2> &nbsp;&nbsp;
                        <div><IonBadge>{props.for}</IonBadge></div>
                    </div>
                    <IonItem className={formik.errors.title && formik.touched.title ? ' is-invalid' : ''}>
                        <IonLabel position="floating">Title</IonLabel>
                        <IonInput 
                            className='error'
                            type='text'
                            name='title'
                            required
                            value={formik.values.title}
                            onIonChange={formik.handleChange}
                            autocomplete="off"
                        ></IonInput>
                    </IonItem>
                    <IonItem className={formik.errors.body && formik.touched.body ? ' is-invalid' : ''}>
                        <IonLabel position="floating">Body</IonLabel>
                        <IonTextarea
                            className='error'
                            name='body'
                            style={{minHeight:'8rem'}}
                            required
                            value={formik.values.body}
                            onIonChange={formik.handleChange}
                            autocomplete="off" 
                        />
                    </IonItem>
                    <IonItem className={formik.errors.body && formik.touched.body ? ' is-invalid' : ''}>
                        <div style={{display:'flex', flexDirection:'column'}} className='ion-padding-top ion-padding-bottom'>
                            <IonText>
                                Set your rating
                            </IonText><br/><br/>
                            <StarRatings
                                starRatedColor="rgb(255, 215, 0)"
                                starEmptyColor='#dadada'
                                starDimension="50px"
                                starSpacing="0px"
                                numberOfStars={5}
                                name='rating'
                                rating={formik.values.rating}
                                changeRating={newValue => {
                                    formik.setFieldValue('rating', newValue)
                                }}
                            />
                        </div>
                    </IonItem>
                </section>
            </IonContent>
            <IonFooter>
                <IonToolbar className='ion-padding-end ion-padding-start'>
                    <IonButton type='submit' fill='solid' color='primary' expand='block'>
                        {
                            formik.isSubmitting ? <IonSpinner name="crescent" /> : 'Submit'
                        }
                    </IonButton>
                </IonToolbar>
            </IonFooter>
            
        </IonPage>
        </form>
           
    )
}